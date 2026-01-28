import { createElement } from '@wordpress/element'
import {
    __experimentalLibrary as InserterLibrary,
    __experimentalListView as ListView,
} from '@wordpress/block-editor'
import { Button } from '@wordpress/components'
import { closeSmall } from '@wordpress/icons'

type LeftSidebarView = 'inserter' | 'listview'

interface LeftSidebarProps {
    activeView: LeftSidebarView | null
    onClose: () => void
}

const LeftSidebar = ({ activeView, onClose }: LeftSidebarProps) => {
    const isOpen = activeView !== null
    const sidebarClasses = [
        'block-editor__left-sidebar',
        isOpen ? 'is-open' : ''
    ].filter(Boolean).join(' ')

    return (
        <div className={sidebarClasses}>
            {activeView === 'listview' && (
                <div className="block-editor-tabbed-sidebar">
                    <div className="block-editor-tabbed-sidebar__tablist-and-close-button">
                        <Button
                            className="block-editor-tabbed-sidebar__close-button"
                            icon={closeSmall}
                            label="Close"
                            onClick={onClose}
                            size="compact"
                        />
                        <div
                            role="tablist"
                            aria-orientation="horizontal"
                            className="block-editor-tabbed-sidebar__tablist"
                        >
                            <button
                                role="tab"
                                aria-selected="true"
                                className="block-editor-tabbed-sidebar__tab"
                                data-active-item="true"
                                type="button"
                            >
                                <span>List View</span>
                            </button>
                        </div>
                    </div>
                    <div className="block-editor-tabbed-sidebar__tabpanel">
                        <ListView />
                    </div>
                </div>
            )}
            {activeView === 'inserter' && (
                <InserterLibrary
                    showMostUsedBlocks={false}
                    showInserterHelpPanel={false}
                    shouldFocusBlock={true}
                    onClose={onClose}
                />
            )}
        </div>
    )
}

export default LeftSidebar
export type { LeftSidebarView }
