import { createElement, useRef, useState, useMemo } from '@wordpress/element'
import {
    BlockEditorProvider,
    BlockInspector,
    BlockCanvas,
    BlockEditorKeyboardShortcuts,
    BlockList,
} from '@wordpress/block-editor'
import { ToolbarButton, Popover } from '@wordpress/components'
import { undo as undoIcon, redo as redoIcon, listView as listViewIcon, plus as plusIcon } from '@wordpress/icons'

import Header from './Header'
import Sidebar from './Sidebar'
import LeftSidebar from './LeftSidebar'
import type { LeftSidebarView } from './LeftSidebar'
import BlockBreadcrumb from './BlockBreadcrumb'
import BottomBlockAppender from './BottomBlockAppender'
import EditorSettings from '../interfaces/editor-settings'
import Block from '../interfaces/block'
import Notices from "./Notices"
import type { DeviceType } from './DevicePreview'
import useResizeCanvas from '../hooks/useResizeCanvas'

import '@wordpress/format-library'

interface BlockEditorProps {
    settings: EditorSettings,
    blocks: Block[],
    onChange: (blocks: Block[]) => void,
    undo?: () => void,
    redo?: () => void,
    canUndo?: boolean,
    canRedo?: boolean,
    deviceType?: DeviceType
}

const BlockEditor = ({ settings, onChange, blocks, undo, redo, canUndo, canRedo, deviceType = 'Desktop' }: BlockEditorProps) => {
    const inputTimeout = useRef<NodeJS.Timeout|null>(null)
    const [leftSidebarView, setLeftSidebarView] = useState<LeftSidebarView | null>(null)
    const canvasStyles = useResizeCanvas(deviceType)

    // Prepare content styles for the iframe
    const contentStyles = useMemo(() => {
        return settings.styles || []
    }, [settings.styles])

    // Get layout settings (contentSize/wideSize) for wide/full alignments
    const rootLayout = useMemo(() => {
        const layoutSettings = settings.__experimentalFeatures?.layout || {}
        return {
            type: 'constrained',
            contentSize: layoutSettings.contentSize || '800px',
            wideSize: layoutSettings.wideSize || '1200px',
        }
    }, [settings.__experimentalFeatures?.layout])

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

    const toggleLeftSidebar = (view: LeftSidebarView) => {
        setLeftSidebarView(current => current === view ? null : view)
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
                    <ToolbarButton
                        icon={plusIcon}
                        onClick={() => toggleLeftSidebar('inserter')}
                        isPressed={leftSidebarView === 'inserter'}
                        label="Toggle block inserter"
                        className="block-editor__inserter-toggle"
                    />
                    <ToolbarButton icon={undoIcon} onClick={undo} disabled={!canUndo} className={'history-button'} />
                    <ToolbarButton icon={redoIcon} onClick={redo} disabled={!canRedo} className={'history-button'} />
                    <ToolbarButton
                        icon={listViewIcon}
                        onClick={() => toggleLeftSidebar('listview')}
                        isPressed={leftSidebarView === 'listview'}
                        aria-expanded={leftSidebarView === 'listview'}
                        label="List view"
                    />
                </Header.Fill>
                <Sidebar.Fill>
                    <BlockInspector />
                </Sidebar.Fill>
                <div className="block-editor__canvas-area">
                    <LeftSidebar
                        activeView={leftSidebarView}
                        onClose={() => setLeftSidebarView(null)}
                    />
                    <div className="block-editor__canvas-wrapper" style={canvasStyles}>
                        <BlockCanvas
                            height="100%"
                            styles={contentStyles}
                        >
                            <BlockList layout={rootLayout} />
                            <BottomBlockAppender />
                        </BlockCanvas>
                    </div>
                </div>
                <div className="block-editor__footer">
                    <BlockBreadcrumb rootLabelText="Document" />
                </div>
            </BlockEditorProvider>
        </div>
    );
};

export default BlockEditor;
