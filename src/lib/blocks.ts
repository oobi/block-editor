import { registerCoreBlocks } from '@wordpress/block-library'

/**
 * Register all core blocks
 * In Gutenberg v15+, registerCoreBlocks() handles everything automatically
 * 
 * @param disabledCoreBlocks - Array of block names to exclude (optional, not currently used)
 */
function registerBlocks(disabledCoreBlocks: string[] = []) {
	// TODO: Implement selective block disabling if needed in the future
	// For now, register all core blocks using the built-in function
	registerCoreBlocks()
}

export { registerBlocks }
