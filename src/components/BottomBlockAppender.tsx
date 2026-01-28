import { createElement } from '@wordpress/element'
import { useDispatch } from '@wordpress/data'
import { store as blockEditorStore } from '@wordpress/block-editor'
import { Button } from '@wordpress/components'
import { plus } from '@wordpress/icons'
import { _x } from '@wordpress/i18n'

/**
 * A simple block appender that appears at the bottom of the editor.
 * Clicking it inserts a new default block (paragraph).
 */
const BottomBlockAppender = () => {
    const { insertDefaultBlock } = useDispatch(blockEditorStore)

    const handleClick = () => {
        insertDefaultBlock()
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
