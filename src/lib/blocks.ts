import { registerCoreBlocks } from '@wordpress/block-library'
import { unregisterBlockType, getBlockTypes } from '@wordpress/blocks'
import { registerSimpleHTMLBlock } from '../blocks/html'

/**
 * Blocks that need custom implementations due to WordPress private APIs
 * not being available in standalone editor context
 */
const BLOCKS_WITH_CUSTOM_IMPLEMENTATION = [
	'core/html', // We provide a simplified version without Tabs private API
]

/**
 * Register all core blocks
 * In Gutenberg v15+, registerCoreBlocks() handles everything automatically
 * 
 * @param disabledCoreBlocks - Array of block names to exclude (optional)
 */
function registerBlocks(disabledCoreBlocks: string[] = []) {
	// Register all core blocks first
	registerCoreBlocks()
	
	// Replace blocks that use private APIs with our custom implementations
	registerSimpleHTMLBlock()
	
	// Unregister any user-disabled blocks
	disabledCoreBlocks.forEach(blockName => {
		try {
			unregisterBlockType(blockName)
		} catch (e) {
			// Block may not exist, ignore
		}
	})
}

export { registerBlocks }
