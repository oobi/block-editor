import { createElement, useState } from '@wordpress/element'
import {
    __experimentalLibrary as InserterLibrary,
    __experimentalListView as ListView,
} from '@wordpress/block-editor'
import { Button } from '@wordpress/components'
import { closeSmall } from '@wordpress/icons'
import DocumentOutline from './DocumentOutline'

type LeftSidebarView = 'inserter' | 'listview'
type ListViewTab = 'list-view' | 'outline'

interface LeftSidebarProps {
    activeView: LeftSidebarView | null
    onClose: () => void
}

const LeftSidebar = ({ activeView, onClose }: LeftSidebarProps) => {
    const isOpen = activeView !== null
    const [listViewTab, setListViewTab] = useState<ListViewTab>('list-view')

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
                                aria-selected={listViewTab === 'list-view'}
                                className="block-editor-tabbed-sidebar__tab"
                                data-active-item={listViewTab === 'list-view' ? 'true' : undefined}
                                type="button"
                                onClick={() => setListViewTab('list-view')}
                            >
                                <span>List View</span>
                            </button>
                            <button
                                role="tab"
                                aria-selected={listViewTab === 'outline'}
                                className="block-editor-tabbed-sidebar__tab"
                                data-active-item={listViewTab === 'outline' ? 'true' : undefined}
                                type="button"
                                onClick={() => setListViewTab('outline')}
                            >
                                <span>Outline</span>
                            </button>
                        </div>
                    </div>
                    <div className="block-editor-tabbed-sidebar__tabpanel">
                        {listViewTab === 'list-view' && <ListView />}
                        {listViewTab === 'outline' && <DocumentOutline />}
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
