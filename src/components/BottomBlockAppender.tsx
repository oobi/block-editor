import { createElement } from '@wordpress/element'
import { useDispatch, useSelect } from '@wordpress/data'
import { store as blockEditorStore } from '@wordpress/block-editor'
import { Button } from '@wordpress/components'
import { plus } from '@wordpress/icons'
import { _x } from '@wordpress/i18n'

/**
 * A simple block appender that appears at the bottom of the editor.
 * Clicking it inserts a new default block (paragraph) or focuses the last empty paragraph.
 */
const BottomBlockAppender = () => {
    const { insertDefaultBlock, selectBlock } = useDispatch(blockEditorStore)

    const { lastBlock, lastBlockIsEmpty } = useSelect((select) => {
        const blocks = select(blockEditorStore).getBlocks()
        const last = blocks[blocks.length - 1]

        if (!last) {
            return { lastBlock: null, lastBlockIsEmpty: false }
        }

        // Check if it's a paragraph block
        const isParagraph = last.name === 'core/paragraph'

        // Check if it's empty (no content or only whitespace)
        const isEmpty = !last.attributes?.content ||
                       last.attributes.content.trim() === ''

        return {
            lastBlock: last,
            lastBlockIsEmpty: isParagraph && isEmpty
        }
    }, [])

    const handleClick = () => {
        // If last block is an empty paragraph, just focus it instead of creating a new one
        if (lastBlockIsEmpty && lastBlock) {
            selectBlock(lastBlock.clientId)
        } else {
            insertDefaultBlock()
        }
    }

    return (
        <div className="block-editor__bottom-appender">
            <Button
                className="block-editor__bottom-appender-button"
                onClick={handleClick}
                label={_x('Add block', 'Generic label for block inserter button')}
                icon={plus}
            />
        </div>
    )
}

export default BottomBlockAppender
