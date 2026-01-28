/**
 * Custom HTML Block - Simplified version that works without WordPress private APIs
 * 
 * The WordPress core/html block uses privateApis for the Tabs component,
 * which doesn't work in standalone editor contexts. This provides a simpler
 * alternative that just uses a textarea.
 */
import { createElement, useState } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { 
    useBlockProps, 
    BlockControls
} from '@wordpress/block-editor'
import { 
    ToolbarGroup, 
    ToolbarButton,
    Placeholder,
    Button
} from '@wordpress/components'
import { code as codeIcon } from '@wordpress/icons'
import { registerBlockType, unregisterBlockType, getBlockType } from '@wordpress/blocks'

/**
 * Simple HTML Edit Component - inline editing without modal
 */
function SimpleHTMLEdit({ attributes, setAttributes, isSelected }: any) {
    const [isEditing, setIsEditing] = useState(false)
    const [editedContent, setEditedContent] = useState(attributes.content || '')
    const blockProps = useBlockProps({
        className: 'block-library-html__edit',
    })

    const handleStartEditing = () => {
        setEditedContent(attributes.content || '')
        setIsEditing(true)
    }

    const handleSave = () => {
        setAttributes({ content: editedContent })
        setIsEditing(false)
    }

    const handleCancel = () => {
        setEditedContent(attributes.content || '')
        setIsEditing(false)
    }

    // Inline styles for elements inside the iframe
    const containerStyle: React.CSSProperties = {
        background: '#fff',
        border: '1px solid #e0e0e0',
        borderRadius: '2px',
    }
    
    const headerStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: '#f0f0f0',
        borderBottom: '1px solid #e0e0e0',
        fontSize: '13px',
        fontWeight: 500,
    }
    
    const actionsStyle: React.CSSProperties = {
        display: 'flex',
        gap: '8px',
    }
    
    const textareaStyle: React.CSSProperties = {
        display: 'block',
        width: '100%',
        minHeight: '250px',
        padding: '16px',
        margin: 0,
        border: 'none',
        borderRadius: 0,
        resize: 'vertical',
        fontFamily: 'Menlo, Consolas, monaco, monospace',
        fontSize: '14px',
        lineHeight: 1.8,
        color: '#1e1e1e',
        background: '#fff',
        boxSizing: 'border-box',
    }

    // Editing mode - show textarea
    if (isEditing) {
        return (
            <div {...blockProps}>
                <div style={containerStyle}>
                    <div style={headerStyle}>
                        <span>{__('Editing HTML')}</span>
                        <div style={actionsStyle}>
                            <Button
                                variant="tertiary"
                                onClick={handleCancel}
                                size="small"
                            >
                                {__('Cancel')}
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleSave}
                                size="small"
                            >
                                {__('Save')}
                            </Button>
                        </div>
                    </div>
                    <textarea
                        style={textareaStyle}
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        placeholder={__('Write HTML…')}
                        rows={10}
                    />
                </div>
            </div>
        )
    }

    // Show placeholder when content is empty
    if (!attributes.content?.trim()) {
        return (
            <div {...blockProps}>
                <Placeholder
                    icon={codeIcon}
                    label={__('Custom HTML')}
                    instructions={__('Add custom HTML code and preview how it looks.')}
                >
                    <Button
                        variant="primary"
                        onClick={handleStartEditing}
                    >
                        {__('Edit HTML')}
                    </Button>
                </Placeholder>
            </div>
        )
    }

    // Preview mode
    const previewStyle: React.CSSProperties = {
        padding: '16px',
        minHeight: '40px',
    }
    
    return (
        <div {...blockProps}>
            <BlockControls>
                <ToolbarGroup>
                    <ToolbarButton onClick={handleStartEditing}>
                        {__('Edit HTML')}
                    </ToolbarButton>
                </ToolbarGroup>
            </BlockControls>
            
            {/* Preview the HTML content */}
            <div 
                style={previewStyle}
                dangerouslySetInnerHTML={{ __html: attributes.content }}
            />
        </div>
    )
}

/**
 * Register simplified Custom HTML block
 * This replaces the core/html block with one that doesn't use private APIs
 */
export function registerSimpleHTMLBlock() {
    // First unregister the problematic core block if it exists
    if (getBlockType('core/html')) {
        try {
            unregisterBlockType('core/html')
        } catch (e) {
            // Ignore if already unregistered
        }
    }

    // Register our simplified version
    registerBlockType('core/html', {
        title: __('Custom HTML'),
        description: __('Add custom HTML code and preview how it looks.'),
        category: 'widgets',
        icon: codeIcon,
        keywords: ['embed', 'html'],
        attributes: {
            content: {
                type: 'string',
                source: 'raw',
            },
        },
        supports: {
            customClassName: false,
            className: false,
            html: false,
        },
        edit: SimpleHTMLEdit,
        save: ({ attributes }: any) => {
            return createElement('div', {
                dangerouslySetInnerHTML: { __html: attributes.content }
            })
        },
    })
}
