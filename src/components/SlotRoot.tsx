import { createElement, useEffect } from '@wordpress/element'
import { SlotFillProvider, Popover } from '@wordpress/components'
import { createPortal } from 'react-dom'

interface SlotRootProps {
    children: any
}

const SlotRoot = ({ children }: SlotRootProps) => {
    // Ensure document.body exists before attempting portal
    if (typeof document === 'undefined') {
        return (
            <SlotFillProvider>
                {children}
                <Popover.Slot />
            </SlotFillProvider>
        )
    }

    return (
        <SlotFillProvider>
            {children}
            {createPortal(<Popover.Slot />, document.body)}
        </SlotFillProvider>
    )
}

export default SlotRoot
