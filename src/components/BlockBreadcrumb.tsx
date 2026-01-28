import { createElement } from '@wordpress/element'
import { Button } from '@wordpress/components'
import { useSelect, useDispatch } from '@wordpress/data'
import { store as blockEditorStore, BlockTitle } from '@wordpress/block-editor'
import { Icon, chevronRightSmall } from '@wordpress/icons'

interface BlockBreadcrumbProps {
    rootLabelText?: string
}

const BlockBreadcrumb = ({ rootLabelText = 'Document' }: BlockBreadcrumbProps) => {
    const { selectBlock, clearSelectedBlock } = useDispatch(blockEditorStore)

    const { clientId, parents, hasSelection } = useSelect((select) => {
        const {
            getSelectedBlockClientId,
            getBlockParents,
            getSelectionStart,
        } = select(blockEditorStore)

        const selectedBlockClientId = getSelectedBlockClientId()
        const selectionStart = getSelectionStart()
        const blockParents = selectedBlockClientId
            ? getBlockParents(selectedBlockClientId, true)
            : []

        return {
            clientId: selectedBlockClientId,
            parents: blockParents,
            hasSelection: !!selectionStart?.clientId,
        }
    }, [])

    return (
        <ul className="block-editor-block-breadcrumb" role="list" aria-label="Block breadcrumb">
            <li className={!hasSelection ? 'block-editor-block-breadcrumb__current' : undefined} aria-current={!hasSelection ? 'true' : undefined}>
                {hasSelection && (
                    <Button size="small" className="block-editor-block-breadcrumb__button" onClick={() => clearSelectedBlock()}>
                        {rootLabelText}
                    </Button>
                )}
                {!hasSelection && <span>{rootLabelText}</span>}
                {!!clientId && <Icon icon={chevronRightSmall} className="block-editor-block-breadcrumb__separator" />}
            </li>
            {parents.map((parentClientId: string) => (
                <li key={parentClientId}>
                    <Button size="small" className="block-editor-block-breadcrumb__button" onClick={() => selectBlock(parentClientId)}>
                        <BlockTitle clientId={parentClientId} maximumLength={35} />
                    </Button>
                    <Icon icon={chevronRightSmall} className="block-editor-block-breadcrumb__separator" />
                </li>
            ))}
            {!!clientId && (
                <li className="block-editor-block-breadcrumb__current" aria-current="true">
                    <BlockTitle clientId={clientId} maximumLength={35} />
                </li>
            )}
        </ul>
    )
}

export default BlockBreadcrumb