import { createElement, useRef, useState, useMemo } from '@wordpress/element'
import {
    BlockEditorProvider,
    BlockInspector,
    BlockCanvas,
    Inserter,
    BlockEditorKeyboardShortcuts,
    __experimentalListView as ListView,
} from '@wordpress/block-editor'
import { ToolbarButton, Popover } from '@wordpress/components'
import { undo as undoIcon, redo as redoIcon, listView as listViewIcon } from '@wordpress/icons'

import Header from './Header'
import Sidebar from './Sidebar'
import InserterToggle from './InserterToggle'
import BlockBreadcrumb from './BlockBreadcrumb'
import EditorSettings from '../interfaces/editor-settings'
import Block from '../interfaces/block'
import Notices from "./Notices"

import '@wordpress/format-library'

interface BlockEditorProps {
    settings: EditorSettings,
    blocks: Block[],
    onChange: (blocks: Block[]) => void,
    undo?: () => void,
    redo?: () => void,
    canUndo?: boolean,
    canRedo?: boolean
}

const BlockEditor = ({ settings, onChange, blocks, undo, redo, canUndo, canRedo }: BlockEditorProps) => {
    const inputTimeout = useRef<NodeJS.Timeout|null>(null)
    const [isListViewOpen, setIsListViewOpen] = useState(false)

    // Prepare content styles for the iframe
    const contentStyles = useMemo(() => {
        return settings.styles || []
    }, [settings.styles])

    // Prepare editor settings with iframe initialization flag
    const editorSettings = useMemo(() => {
        return {
            ...settings,
            __internalIsInitialized: true,
        }
    }, [settings])

    const handleInput = (blocks: Block[]) => {
        if (inputTimeout.current) {
            clearTimeout(inputTimeout.current)
        }

        inputTimeout.current = setTimeout(() => {
            onChange(blocks)
        }, 500)
    }

    const handleChange = (blocks: Block[]) => {
        if (inputTimeout.current) {
            clearTimeout(inputTimeout.current)
        }

        onChange(blocks)
    }

    return (
        <div className="block-editor__editor wp-embed-responsive">
            <BlockEditorProvider
                value={blocks}
                onInput={handleInput}
                onChange={handleChange}
                settings={editorSettings}
            >
                <Notices/>
                <Header.Fill>
                    <Inserter renderToggle={InserterToggle} />
                    <ToolbarButton icon={undoIcon} onClick={undo} disabled={!canUndo} className={'history-button'} />
                    <ToolbarButton icon={redoIcon} onClick={redo} disabled={!canRedo} className={'history-button'} />
                    <ToolbarButton
                        icon={listViewIcon}
                        onClick={() => setIsListViewOpen(!isListViewOpen)}
                        isPressed={isListViewOpen}
                        aria-expanded={isListViewOpen}
                        label="List view"
                    />
                </Header.Fill>
                <Sidebar.Fill>
                    <BlockInspector />
                </Sidebar.Fill>
                <div className="block-editor__canvas-area">
                    {isListViewOpen && (
                        <div className="block-editor__list-view-panel">
                            <ListView />
                        </div>
                    )}
                    <BlockCanvas
                        height="100%"
                        styles={contentStyles}
                    />
                </div>
                <div className="block-editor__footer">
                    <BlockBreadcrumb rootLabelText="Document" />
                </div>
                <Popover.Slot/>
            </BlockEditorProvider>
        </div>
    );
};

export default BlockEditor;
