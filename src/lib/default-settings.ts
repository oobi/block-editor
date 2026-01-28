import EditorSettings from "../interfaces/editor-settings";

// Default editor styles that WordPress uses when no theme styles are present
const defaultEditorStylesCss = `
/**
 * Default editor styles.
 *
 * These styles are shown if a theme does not register its own editor style,
 * a theme.json file, or has toggled off "Use theme styles" in preferences.
 */
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
  font-size: 18px;
  line-height: 1.5;
  --wp--style--block-gap: 2em;
}

p {
  line-height: 1.8;
}

.editor-post-title__block {
  margin-top: 2em;
  margin-bottom: 1em;
  font-size: 2.5em;
  font-weight: 800;
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

    // Default editor styles for the iframe content
    styles: [
        { css: defaultEditorStylesCss }
    ],

    // Resolved assets - these are injected into the iframe's <head>
    // The laraberg.css path will be determined at runtime by the consumer
    __unstableResolvedAssets: {
        styles: '',
        scripts: ''
    },

    // Iframe/canvas settings - mark as initialized for BlockCanvas
    __internalIsInitialized: true,
}

export default defaultSettings
