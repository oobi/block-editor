import { createElement, useState } from '@wordpress/element'
import { DropdownMenu, MenuGroup, MenuItemsChoice } from '@wordpress/components'
import { desktop, tablet, mobile } from '@wordpress/icons'
import { __ } from '@wordpress/i18n'

export type DeviceType = 'Desktop' | 'Tablet' | 'Mobile'

interface DevicePreviewProps {
    deviceType: DeviceType
    setDeviceType: (deviceType: DeviceType) => void
}

const deviceIcons = {
    Desktop: desktop,
    Tablet: tablet,
    Mobile: mobile,
}

const choices = [
    {
        value: 'Desktop',
        label: __('Desktop'),
        icon: desktop,
    },
    {
        value: 'Tablet',
        label: __('Tablet'),
        icon: tablet,
    },
    {
        value: 'Mobile',
        label: __('Mobile'),
        icon: mobile,
    },
]

const DevicePreview = ({ deviceType, setDeviceType }: DevicePreviewProps) => {
    return (
        <DropdownMenu
            className="block-editor__device-preview"
            icon={deviceIcons[deviceType]}
            label={__('Preview')}
            popoverProps={{ zIndex: 10000 }}
        >
            {({ onClose }) => (
                <MenuGroup>
                    <MenuItemsChoice
                        choices={choices}
                        value={deviceType}
                        onSelect={(value) => {
                            // Debug: trace selection
                            // eslint-disable-next-line no-console
                            console.debug('[DevicePreview] selected =>', value)
                            setDeviceType(value as DeviceType)
                            onClose()
                        }}
                    />
                </MenuGroup>
            )}
        </DropdownMenu>
    )
}

export default DevicePreview
