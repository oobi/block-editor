import EditorSettings from "../interfaces/editor-settings";

// Default content styles to inject into the iframe canvas
const defaultContentStyles = `
    body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
        font-size: 16px;
        line-height: 1.6;
        color: #1e1e1e;
        margin: 0;
        padding: 0;
    }

    .is-root-container {
        padding: 1rem;
        width: 100%;
        box-sizing: border-box;
    }

    /* Layout support styles */
    .is-root-container,
    .block-editor-block-list__layout {
        width: 100%;
    }

    /* Flow layout (default) */
    .is-layout-flow > * {
        margin-block-start: 0;
        margin-block-end: 0;
    }

    .is-layout-flow > * + * {
        margin-block-start: 1.5em;
    }

    /* Flex layout (for columns, buttons, etc.) */
    .is-layout-flex {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.5em;
    }

    /* Grid layout */
    .is-layout-grid {
        display: grid;
        gap: 1.5em;
    }

    /* Constrained layout */
    .is-layout-constrained > * {
        max-width: var(--wp--style--global--content-size, 650px);
        margin-left: auto;
        margin-right: auto;
    }

    .is-layout-constrained > .alignwide {
        max-width: var(--wp--style--global--wide-size, 1000px);
    }

    .is-layout-constrained > .alignfull {
        max-width: none;
    }
`;

const defaultSettings: EditorSettings = {
    // Laraberg settings
    height: '500px',
    mediaUpload: undefined,
    disabledCoreBlocks: [
        'core/embed',
        'core/freeform',
        'core/shortcode',
        'core/archives',
        'core/tag-cloud',
        'core/block',
        'core/rss',
        'core/search',
        'core/calendar',
        'core/categories',
        'core/more',
        'core/nextpage'
    ],

    // WordPress settings
    alignWide: true,
    supportsLayout: true,

    // Iframe/canvas settings - mark as initialized for BlockCanvas
    __internalIsInitialized: true,

    // Default content styles for the iframe canvas
    styles: [
        {
            css: defaultContentStyles,
        },
    ],
}

export default defaultSettings
