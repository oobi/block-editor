import { createElement, useMemo } from '@wordpress/element'
import { useSelect, useDispatch } from '@wordpress/data'
import { store as blockEditorStore } from '@wordpress/block-editor'
import { create, getTextContent } from '@wordpress/rich-text'
import { count as wordCount } from '@wordpress/wordcount'
import { serialize } from '@wordpress/blocks'

interface HeadingItem {
    clientId: string
    level: number
    content: string
    isEmpty: boolean
}

const AVERAGE_READING_RATE = 189 // words per minute

/**
 * Extracts heading blocks from nested block structure
 */
function extractHeadings(blocks: any[]): HeadingItem[] {
    const headings: HeadingItem[] = []

    function traverse(blockList: any[]) {
        for (const block of blockList) {
            if (block.name === 'core/heading') {
                const content = block.attributes?.content || ''
                headings.push({
                    clientId: block.clientId,
                    level: block.attributes?.level || 2,
                    content: content,
                    isEmpty: !content || content.trim().length === 0
                })
            }
            if (block.innerBlocks?.length) {
                traverse(block.innerBlocks)
            }
        }
    }

    traverse(blocks)
    return headings
}

/**
 * Document Outline component showing word count, reading time, and heading structure
 */
const DocumentOutline = () => {
    const { selectBlock } = useDispatch(blockEditorStore)

    const { blocks, headings, wordCountValue, characterCount, readingTime } = useSelect((select) => {
        const { getBlocks } = select(blockEditorStore) as any
        const allBlocks = getBlocks()
        
        // Serialize blocks to get content for word/character count
        const content = serialize(allBlocks)
        const textContent = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
        
        const words = wordCount(textContent, 'words')
        const characters = textContent.length
        const minutes = Math.ceil(words / AVERAGE_READING_RATE)

        return {
            blocks: allBlocks,
            headings: extractHeadings(allBlocks),
            wordCountValue: words,
            characterCount: characters,
            readingTime: minutes
        }
    }, [])

    const handleHeadingClick = (clientId: string) => {
        selectBlock(clientId)
        // Scroll to the block
        const blockElement = document.querySelector(`[data-block="${clientId}"]`)
        if (blockElement) {
            blockElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }

    return (
        <div className="block-editor-document-outline">
            <div className="block-editor-document-outline__stats">
                <div className="block-editor-document-outline__stat">
                    <span className="block-editor-document-outline__stat-label">Characters:</span>
                    <span className="block-editor-document-outline__stat-value">{characterCount}</span>
                </div>
                <div className="block-editor-document-outline__stat">
                    <span className="block-editor-document-outline__stat-label">Words:</span>
                    <span className="block-editor-document-outline__stat-value">{wordCountValue}</span>
                </div>
                <div className="block-editor-document-outline__stat">
                    <span className="block-editor-document-outline__stat-label">Time to read:</span>
                    <span className="block-editor-document-outline__stat-value">
                        {readingTime} {readingTime === 1 ? 'minute' : 'minutes'}
                    </span>
                </div>
            </div>

            {headings.length === 0 ? (
                <div className="block-editor-document-outline__empty">
                    <p>Navigate the structure of your document and address issues like empty or incorrect heading levels.</p>
                </div>
            ) : (
                <ul className="block-editor-document-outline__list">
                    {headings.map((heading) => {
                        const displayContent = heading.isEmpty
                            ? '(Empty heading)'
                            : getTextContent(create({ html: heading.content }))

                        return (
                            <li
                                key={heading.clientId}
                                className={`block-editor-document-outline__item block-editor-document-outline__item--h${heading.level}`}
                            >
                                <button
                                    className="block-editor-document-outline__button"
                                    onClick={() => handleHeadingClick(heading.clientId)}
                                >
                                    <span className="block-editor-document-outline__level">H{heading.level}</span>
                                    <span className={`block-editor-document-outline__content ${heading.isEmpty ? 'is-empty' : ''}`}>
                                        {displayContent}
                                    </span>
                                </button>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}

export default DocumentOutline
