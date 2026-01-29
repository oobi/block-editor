import { useEffect, useState } from '@wordpress/element'
import type { DeviceType } from '../components/DevicePreview'

/**
 * Hook to resize the editor canvas based on device type.
 * Based on Gutenberg's useResizeCanvas hook.
 *
 * @param deviceType - The device type (Desktop, Tablet, or Mobile)
 * @return Inline styles to be added to the canvas container
 */
export default function useResizeCanvas(deviceType: DeviceType) {
    const [actualWidth, updateActualWidth] = useState(window.innerWidth)

    // Debug: log device type changes
    useEffect(() => {
        console.debug('[useResizeCanvas] deviceType changed =>', deviceType)
    }, [deviceType])

    useEffect(() => {
        if (deviceType === 'Desktop') {
            return
        }

        const resizeListener = () => updateActualWidth(window.innerWidth)
        window.addEventListener('resize', resizeListener)

        return () => {
            window.removeEventListener('resize', resizeListener)
        }
    }, [deviceType])

    const getCanvasWidth = (device: DeviceType): number | null => {
        let deviceWidth: number

        /*
         * Matches the breakpoints in Gutenberg's base-styles/_breakpoints.scss
         * minus 1 to trigger the media query for device preview.
         */
        switch (device) {
            case 'Tablet':
                deviceWidth = 782 - 1 // preview for useViewportMatch( 'medium', '<' )
                break
            case 'Mobile':
                deviceWidth = 480 - 1 // preview for useViewportMatch( 'mobile', '<' )
                break
            default:
                return null
        }

        return deviceWidth < actualWidth ? deviceWidth : actualWidth
    }

    const contentInlineStyles = (device: DeviceType): React.CSSProperties => {
        const height = device === 'Mobile' ? '768px' : '1024px'
        const marginVertical = '40px'
        const marginHorizontal = 'auto'

        let styles: React.CSSProperties

        switch (device) {
            case 'Tablet':
            case 'Mobile':
                styles = {
                    width: getCanvasWidth(device) ?? undefined,
                    flex: 'none', // Override flex: 1 from CSS to respect explicit width
                    marginTop: marginVertical,
                    marginBottom: marginVertical,
                    marginLeft: marginHorizontal,
                    marginRight: marginHorizontal,
                    height,
                    overflowY: 'auto',
                }
                break
            default:
                styles = {
                    flex: '1', // Allow to grow in desktop mode
                    marginLeft: marginHorizontal,
                    marginRight: marginHorizontal,
                }
        }

        // Debug: log computed styles
        console.debug('[useResizeCanvas] styles for', device, '=>', styles)

        return styles
    }

    return contentInlineStyles(deviceType)
}
