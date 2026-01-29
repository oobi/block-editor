import { ToolbarButton, createSlotFill } from '@wordpress/components'
import { createElement } from '@wordpress/element'
import { cog as cogIcon, code as codeIcon } from '@wordpress/icons'

const { Slot, Fill } = createSlotFill(
    'HeaderToolbar'
);

interface HeaderProps {
    toggleSidebar: () => void,
    sidebarOpen: boolean,
    toggleCodeEditor: () => void,
    isCodeEditor: boolean,
    actionSlot?: React.ReactNode
}

const Header = ({ toggleSidebar, sidebarOpen, toggleCodeEditor, isCodeEditor, actionSlot }: HeaderProps) => {
    return (
        <div
            className="block-editor__header"
            role="region"
        >
            <Slot className="block-editor__header-toolbar"  bubblesVirtually />
            <div className="block-editor__header-actions">
                {actionSlot}
                <ToolbarButton
                    onClick={toggleCodeEditor}
                    isPressed={isCodeEditor}
                    icon={codeIcon}
                    label={isCodeEditor ? 'Exit code editor' : 'Code editor'}
                />
                <ToolbarButton
                    onClick={toggleSidebar}
                    isPressed={sidebarOpen}
                    icon={cogIcon}
                    label={'Settings'}
                />
            </div>
        </div>
    );
};

Header.Fill = Fill;

export default Header;
