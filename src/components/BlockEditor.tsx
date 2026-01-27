import { createElement, useRef, useState } from '@wordpress/element'
import { useMergeRefs } from '@wordpress/compose'
import {
    BlockEditorProvider,
    BlockInspector,
    BlockList,
    BlockTools,
    Inserter,
    ObserveTyping,
    WritingFlow,
    BlockEditorKeyboardShortcuts,
    __experimentalListView as ListView,
    __unstableUseBlockSelectionClearer as useBlockSelectionClearer,
} from '@wordpress/block-editor'
import { ToolbarButton, Popover } from '@wordpress/components'
import { undo as undoIcon, redo as redoIcon, listView as listViewIcon } from '@wordpress/icons'

import Header from './Header'
import Sidebar from './Sidebar'
import InserterToggle from './InserterToggle'
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
    const contentRef = useRef<HTMLDivElement>(null)
    const [isListViewOpen, setIsListViewOpen] = useState(false)
    
    // This hook clears block selection when clicking outside blocks
    const blockSelectionClearerRef = useBlockSelectionClearer()
    const mergedRef = useMergeRefs([contentRef, blockSelectionClearerRef])

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
                settings={settings}
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
                {isListViewOpen && (
                    <div className="block-editor__list-view-panel">
                        <ListView />
                    </div>
                )}
                <BlockTools __unstableContentRef={contentRef}>
                    <BlockEditorKeyboardShortcuts.Register/>
                    <div 
                        ref={mergedRef}
                        className="editor-styles-wrapper" 
                        style={{ height: '100%', width: '100%' }}
                    >
                        <WritingFlow style={{ height: '100%', width: '100%' }}>
                            <ObserveTyping>
                                <BlockList />
                            </ObserveTyping>
                        </WritingFlow>
                    </div>
                </BlockTools>
                <Popover.Slot/>
            </BlockEditorProvider>
        </div>
    );
};

export default BlockEditor;
