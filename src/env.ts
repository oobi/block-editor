// @ts-nocheck
import * as hooks from '@wordpress/hooks'

window.process = {
    env: {
        FORCE_REDUCED_MOTION: false,
        GUTENBERG_PHASE: 2,
        COMPONENT_SYSTEM_PHASE: 1
    }
}

window.wp = { hooks }
