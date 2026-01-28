import { createElement, useState, useMemo } from '@wordpress/element'
import { parse, serialize } from '@wordpress/blocks'

interface CodeEditorProps {
    blocks: any[]
    onChange: (blocks: any[]) => void
    onExit: () => void
}

/**
 * Code editor view - shows raw block HTML for direct editing
 */
const CodeEditor = ({ blocks, onChange, onExit }: CodeEditorProps) => {
    // Serialize blocks once on mount - useMemo with empty deps captures initial value
    const initialCode = useMemo(() => {
        const serialized = serialize(blocks)
        console.log('CodeEditor: serializing blocks', blocks, 'result:', serialized)
        return serialized
    }, []) // Empty deps = only run once on mount

    const [code, setCode] = useState(initialCode)

    const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCode(e.target.value)
    }

    const handleExit = () => {
        // Parse the code back to blocks when exiting
        const parsedBlocks = parse(code)
        onChange(parsedBlocks)
        onExit()
    }

    return (
        <div className="block-editor-code-editor">
            <div className="block-editor-code-editor__header">
                <span className="block-editor-code-editor__label">Editing code</span>
                <button
                    className="block-editor-code-editor__exit"
                    onClick={handleExit}
                    type="button"
                >
                    Exit code editor
                </button>
            </div>
            <textarea
                className="block-editor-code-editor__textarea"
                value={code}
                onChange={handleCodeChange}
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
            />
        </div>
    )
}

export default CodeEditor
