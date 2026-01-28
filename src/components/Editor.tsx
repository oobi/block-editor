import { useState, useEffect, createElement, StrictMode, createRoot, useMemo } from '@wordpress/element'
import type { Root } from 'react-dom/client'
import apiFetch from '@wordpress/api-fetch'
import { SlotFillProvider } from '@wordpress/components'
import { parse, serialize, createBlock } from '@wordpress/blocks'
import { ShortcutProvider } from '@wordpress/keyboard-shortcuts'
import { doAction, applyFilters } from "@wordpress/hooks"

import '../store'
import { registerBlocks } from '../lib/blocks'
import BlockEditor from './BlockEditor'
import Header from './Header'
import Sidebar from './Sidebar'
import CodeEditor from './CodeEditor'
import BindInput from '../lib/bind-input'
import EditorSettings from '../interfaces/editor-settings'
import { select, dispatch, useSelect, useDispatch } from '@wordpress/data'
import defaultSettings from '../lib/default-settings'
import KeyboardShortcuts from './KeyboardShortcuts'

// Track React roots for cleanup (React 18 createRoot API)
const editorRoots = new WeakMap<Element, Root>()


export interface EditorProps {
    settings: EditorSettings,
    onChange: (value: string) => void,
    input?: HTMLInputElement|HTMLTextAreaElement,
    value?: string,
}

const Editor = ({ settings, onChange, input, value }: EditorProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [isCodeEditor, setIsCodeEditor] = useState(false)
    const { setBlocks, undo, redo } = useDispatch('block-editor')

    const { blocks, canUndo, canRedo } = useSelect(select => {
        return {
            blocks: select('block-editor').getBlocks(),
            canUndo: select('block-editor').canUndo(),
            canRedo: select('block-editor').canRedo()
        }
    })

    /**
     * Check if a block is an empty paragraph
     */
    const isEmptyParagraph = (block: any) => {
        return block?.name === 'core/paragraph' &&
               (!block.attributes?.content || block.attributes.content === '')
    }

    /**
     * Ensure blocks always have a trailing empty paragraph for easy editing
     */
    const ensureTrailingParagraph = (blockList: any[]) => {
        if (blockList.length === 0) {
            return [createBlock('core/paragraph')]
        }

        const lastBlock = blockList[blockList.length - 1]
        if (!isEmptyParagraph(lastBlock)) {
            return [...blockList, createBlock('core/paragraph')]
        }

        return blockList
    }

    useEffect(() => {
        registerBlocks(settings.disabledCoreBlocks)

        input?.form?.addEventListener('submit', preventSubmit)

        if (settings.fetchHandler) {
            apiFetch.setFetchHandler(settings.fetchHandler)
        }

        /**
         * Cleanup
         */
        return () => {
            input?.form?.removeEventListener('submit', preventSubmit)
        }
    }, [])

    useEffect(() => {
        const parsedBlocks = value ? parse(value) : []
        setBlocks(ensureTrailingParagraph(parsedBlocks))
    }, [value]);

    useEffect(() => {
        // Serialize blocks but remove trailing empty paragraph for storage
        const blocksToSerialize = blocks.length > 0 && isEmptyParagraph(blocks[blocks.length - 1])
            ? blocks.slice(0, -1)
            : blocks
        onChange(serialize(blocksToSerialize))
    }, [blocks])

    /**
     * Handle block changes - ensure trailing empty paragraph (like WordPress does on blur)
     */
    const handleBlocksChange = (newBlocks: any[]) => {
        setBlocks(ensureTrailingParagraph(newBlocks))
    }

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    const toggleCodeEditor = () => {
        setIsCodeEditor(!isCodeEditor)
    }

    /**
     * Handle code editor changes - when exiting code view
     */
    const handleCodeEditorChange = (newBlocks: any[]) => {
        setBlocks(ensureTrailingParagraph(newBlocks))
    }

    return (
        <StrictMode>
            <SlotFillProvider>
                <ShortcutProvider>
                    <div className="block-editor">
                        <KeyboardShortcuts.Register/>
                        <KeyboardShortcuts/>

                        <Header
                            toggleSidebar={toggleSidebar}
                            sidebarOpen={sidebarOpen}
                            toggleCodeEditor={toggleCodeEditor}
                            isCodeEditor={isCodeEditor}
                        />

                        <div
                            className="block-editor__content"
                            style={{height: settings.height}}
                        >
                            {isCodeEditor ? (
                                <CodeEditor
                                    blocks={blocks}
                                    onChange={handleCodeEditorChange}
                                    onExit={() => setIsCodeEditor(false)}
                                />
                            ) : (
                                <BlockEditor
                                    blocks={blocks}
                                    onChange={handleBlocksChange}
                                    undo={undo}
                                    redo={redo}
                                    canUndo={canUndo}
                                    canRedo={canRedo}
                                    settings={settings}
                                />
                            )}

                            {sidebarOpen && <Sidebar/>}
                        </div>
                    </div>
                </ShortcutProvider>
            </SlotFillProvider>
        </StrictMode>
    );
};

const removeEditor = (element: HTMLInputElement | HTMLTextAreaElement) => {
    dispatch('block-editor').setBlocks([])
    dispatch('core/blocks').removeBlockTypes(
        select('core/blocks').getBlockTypes().map(b => b.name)
    )

    const container = element.parentNode?.querySelector('.block-editor-container')
    if (container) {
        const root = editorRoots.get(container)
        if (root) {
            root.unmount()
            editorRoots.delete(container)
        }
        container.remove()
    }
}

const initializeEditor = (element: HTMLInputElement | HTMLTextAreaElement, settings: EditorSettings = {}) => {
    const input = new BindInput(element)

    const container = document.createElement('div')
    container.classList.add('block-editor-container')
    container.classList.add('gutenberg__editor')
    input.getElement().insertAdjacentElement('afterend', container)
    input.getElement().style.display = 'none';

    doAction('blockEditor.beforeInit', container)

    const root = createRoot(container)
    editorRoots.set(container, root)

    root.render(
        <Editor
            settings={applyFilters('blockEditor.settings', {...defaultSettings, ...settings}) as EditorSettings}
            onChange={input.setValue}
            value={input.getValue() || undefined}
            input={input.element}
        />
    )

    doAction('blockEditor.afterInit', container)
}

const preventSubmit = (event: SubmitEvent) => {
    if (event.submitter?.matches('.block-editor-container *')) {
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()
    }
}

export { initializeEditor, removeEditor, Editor }
