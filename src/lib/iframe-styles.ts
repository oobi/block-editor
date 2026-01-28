/**
 * Iframe styles for the block editor canvas.
 *
 * These styles are injected into the iframe via __unstableResolvedAssets.
 * They include:
 * - Block library styles (for rendering blocks)
 * - Block editor content styles (for selection, multi-select, etc.)
 * - Default editor styles (typography, spacing)
 */

// Import CSS files as raw strings (webpack/vite will handle this with ?raw or raw-loader)
// For now, we'll provide the essential styles inline

const iframeStyles = `
/* ==========================================================================
   WordPress Block Editor - Iframe Styles
   These styles are injected into the editor iframe canvas
   ========================================================================== */

/* --------------------------------------------------------------------------
   CSS Custom Properties (from WordPress)
   -------------------------------------------------------------------------- */
:root {
    --wp-block-synced-color: #7a00df;
    --wp-block-synced-color--rgb: 122, 0, 223;
    --wp-bound-block-color: var(--wp-block-synced-color);
    --wp-admin-theme-color: #007cba;
    --wp-admin-theme-color--rgb: 0, 124, 186;
    --wp-admin-theme-color-darker-10: rgb(0, 107, 160.5);
    --wp-admin-theme-color-darker-10--rgb: 0, 107, 160.5;
    --wp-admin-theme-color-darker-20: #005a87;
    --wp-admin-theme-color-darker-20--rgb: 0, 90, 135;
    --wp-admin-border-width-focus: 2px;
    --wp--style--block-gap: 24px;
    --wp--style--global--content-size: 650px;
    --wp--style--global--wide-size: 1000px;
}

@media (min-resolution: 192dpi) {
    :root {
        --wp-admin-border-width-focus: 1.5px;
    }
}

/* --------------------------------------------------------------------------
   Base Typography & Body Styles
   -------------------------------------------------------------------------- */
body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: #1e1e1e;
    margin: 0;
    padding: 0;
}

.editor-styles-wrapper {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: #1e1e1e;
}

p {
    font-size: inherit;
    line-height: 1.8;
}

h1, h2, h3, h4, h5, h6 {
    margin-top: 0;
    margin-bottom: 0.5em;
}

/* --------------------------------------------------------------------------
   Root Container & Layout
   -------------------------------------------------------------------------- */
.is-root-container {
    padding: 36px;
    width: 100%;
    box-sizing: border-box;
}

.block-editor-block-list__layout {
    position: relative;
}

/* --------------------------------------------------------------------------
   Block Widths & Alignment
   -------------------------------------------------------------------------- */
.wp-block {
    max-width: var(--wp--style--global--content-size, 650px);
    margin-left: auto;
    margin-right: auto;
}

.wp-block[data-align="wide"],
.wp-block.alignwide {
    max-width: var(--wp--style--global--wide-size, 1000px);
}

.wp-block[data-align="full"],
.wp-block.alignfull {
    max-width: none;
}

.wp-block[data-align="left"] {
    float: left;
    margin-right: 2em;
}

.wp-block[data-align="right"] {
    float: right;
    margin-left: 2em;
}

.wp-block[data-align="center"] {
    margin-left: auto;
    margin-right: auto;
}

/* --------------------------------------------------------------------------
   Flow Layout
   -------------------------------------------------------------------------- */
.is-layout-flow > * {
    margin-block-start: 0;
    margin-block-end: 0;
}

.is-layout-flow > * + * {
    margin-block-start: var(--wp--style--block-gap, 1.5em);
}

/* --------------------------------------------------------------------------
   Flex Layout
   -------------------------------------------------------------------------- */
.is-layout-flex {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5em;
}

.is-layout-flex.is-vertical {
    flex-direction: column;
    align-items: flex-start;
}

/* --------------------------------------------------------------------------
   Grid Layout
   -------------------------------------------------------------------------- */
.is-layout-grid {
    display: grid;
    gap: var(--wp--style--block-gap, 1.5em);
}

/* --------------------------------------------------------------------------
   Constrained Layout
   -------------------------------------------------------------------------- */
.is-layout-constrained > * {
    max-width: var(--wp--style--global--content-size, 650px);
    margin-left: auto !important;
    margin-right: auto !important;
}

.is-layout-constrained > .alignwide {
    max-width: var(--wp--style--global--wide-size, 1000px);
}

.is-layout-constrained > .alignfull {
    max-width: none;
}

.is-layout-constrained > .alignleft {
    float: left;
    margin-inline-start: 0;
    margin-inline-end: 2em;
}

.is-layout-constrained > .alignright {
    float: right;
    margin-inline-start: 2em;
    margin-inline-end: 0;
}

/* --------------------------------------------------------------------------
   Block Selection Styles
   -------------------------------------------------------------------------- */
@keyframes selection-overlay__fade-in-animation {
    from {
        opacity: 0;
    }
    to {
        opacity: 0.4;
    }
}

.block-editor-block-list__layout .block-editor-block-list__block.is-multi-selected:not(.is-partially-selected)::selection,
.block-editor-block-list__layout .block-editor-block-list__block.is-multi-selected:not(.is-partially-selected) ::selection {
    background: transparent;
}

.block-editor-block-list__layout .block-editor-block-list__block.is-multi-selected:not(.is-partially-selected)::after {
    content: "";
    position: absolute;
    z-index: 1;
    pointer-events: none;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: var(--wp-admin-theme-color);
    opacity: 0.4;
    animation: selection-overlay__fade-in-animation 0.1s ease-out;
    animation-fill-mode: forwards;
    outline: 2px solid transparent;
}

.block-editor-block-list__layout .block-editor-block-list__block.is-highlighted,
.block-editor-block-list__layout .block-editor-block-list__block:not([contenteditable=true]):focus {
    outline: none;
}

/* --------------------------------------------------------------------------
   List Styles
   -------------------------------------------------------------------------- */
ul, ol {
    margin: 0;
    padding-left: 1.3em;
}

ul li, ol li {
    margin-bottom: 0;
}

ul {
    list-style-type: disc;
}

ol {
    list-style-type: decimal;
}

ul ul, ol ul {
    list-style-type: circle;
}

/* --------------------------------------------------------------------------
   Paragraph Block
   -------------------------------------------------------------------------- */
.wp-block-paragraph {
    margin-top: 0;
    margin-bottom: 0;
}

.has-drop-cap:not(:focus)::first-letter {
    float: left;
    font-size: 8.4em;
    line-height: 0.68;
    font-weight: 100;
    margin: 0.05em 0.1em 0 0;
    text-transform: uppercase;
    font-style: normal;
}

/* --------------------------------------------------------------------------
   Heading Block
   -------------------------------------------------------------------------- */
.wp-block-heading {
    margin-top: 0;
    margin-bottom: 0;
}

/* --------------------------------------------------------------------------
   Image Block
   -------------------------------------------------------------------------- */
.wp-block-image {
    margin: 0;
}

.wp-block-image img {
    max-width: 100%;
    height: auto;
    vertical-align: bottom;
}

.wp-block-image.aligncenter {
    text-align: center;
}

.wp-block-image.alignleft {
    float: left;
    margin-right: 1em;
}

.wp-block-image.alignright {
    float: right;
    margin-left: 1em;
}

.wp-block-image figcaption {
    margin-top: 0.5em;
    margin-bottom: 1em;
    color: #555;
    font-size: 13px;
    text-align: center;
}

/* --------------------------------------------------------------------------
   Quote Block
   -------------------------------------------------------------------------- */
.wp-block-quote {
    border-left: 4px solid #000;
    margin: 0;
    padding-left: 1em;
}

.wp-block-quote cite,
.wp-block-quote footer {
    color: #6c7781;
    font-size: 13px;
    font-style: normal;
}

.wp-block-quote.is-style-large,
.wp-block-quote.is-large {
    border: none;
    padding-left: 0;
}

.wp-block-quote.is-style-large p,
.wp-block-quote.is-large p {
    font-size: 24px;
    font-style: italic;
    line-height: 1.6;
}

/* --------------------------------------------------------------------------
   List Block
   -------------------------------------------------------------------------- */
.wp-block-list {
    margin: 0;
    padding-left: 1.3em;
}

/* --------------------------------------------------------------------------
   Code Block
   -------------------------------------------------------------------------- */
.wp-block-code {
    font-family: Menlo, Consolas, monaco, monospace;
    font-size: 14px;
    color: #1e1e1e;
    padding: 0.8em 1em;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: #f5f5f5;
    overflow: auto;
}

.wp-block-code code {
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    background: transparent;
    padding: 0;
}

/* --------------------------------------------------------------------------
   Preformatted Block
   -------------------------------------------------------------------------- */
.wp-block-preformatted {
    font-family: Menlo, Consolas, monaco, monospace;
    font-size: 14px;
    white-space: pre-wrap;
    word-wrap: break-word;
}

/* --------------------------------------------------------------------------
   Button Block
   -------------------------------------------------------------------------- */
.wp-block-button__link {
    color: #fff;
    background-color: #32373c;
    border-radius: 9999px;
    box-shadow: none;
    cursor: pointer;
    display: inline-block;
    font-size: 1.125em;
    padding: calc(0.667em + 2px) calc(1.333em + 2px);
    text-align: center;
    text-decoration: none;
    word-break: break-word;
    box-sizing: border-box;
}

.wp-block-button__link:hover,
.wp-block-button__link:focus,
.wp-block-button__link:active,
.wp-block-button__link:visited {
    color: #fff;
}

.wp-block-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5em;
}

.is-style-outline > .wp-block-button__link,
.wp-block-button__link.is-style-outline {
    color: #32373c;
    background-color: transparent;
    border: 2px solid currentColor;
}

/* --------------------------------------------------------------------------
   Columns Block
   -------------------------------------------------------------------------- */
.wp-block-columns {
    display: flex;
    flex-wrap: wrap;
    gap: var(--wp--style--block-gap, 2em);
}

.wp-block-columns.are-vertically-aligned-top {
    align-items: flex-start;
}

.wp-block-columns.are-vertically-aligned-center {
    align-items: center;
}

.wp-block-columns.are-vertically-aligned-bottom {
    align-items: flex-end;
}

.wp-block-column {
    flex-grow: 1;
    min-width: 0;
    word-break: break-word;
    overflow-wrap: break-word;
}

@media (max-width: 781px) {
    .wp-block-columns:not(.is-not-stacked-on-mobile) > .wp-block-column {
        flex-basis: 100% !important;
    }
}

@media (min-width: 782px) {
    .wp-block-columns:not(.is-not-stacked-on-mobile) {
        flex-wrap: nowrap;
    }
    .wp-block-column {
        flex-basis: 0;
        flex-grow: 1;
    }
    .wp-block-column[style*="flex-basis"] {
        flex-grow: 0;
    }
}

/* --------------------------------------------------------------------------
   Group Block
   -------------------------------------------------------------------------- */
.wp-block-group {
    box-sizing: border-box;
}

.wp-block-group.has-background {
    padding: 1.25em 2.375em;
}

/* --------------------------------------------------------------------------
   Separator Block
   -------------------------------------------------------------------------- */
.wp-block-separator {
    border: none;
    border-bottom: 2px solid currentColor;
    margin-left: auto;
    margin-right: auto;
    opacity: 0.4;
}

.wp-block-separator:not(.is-style-wide):not(.is-style-dots) {
    width: 100px;
}

.wp-block-separator.is-style-dots {
    background: none !important;
    border: none;
    text-align: center;
    max-width: none;
    line-height: 1;
    height: auto;
}

.wp-block-separator.is-style-dots::before {
    content: "···";
    color: currentColor;
    font-size: 1.5em;
    letter-spacing: 2em;
    padding-left: 2em;
    font-family: serif;
}

/* --------------------------------------------------------------------------
   Spacer Block
   -------------------------------------------------------------------------- */
.wp-block-spacer {
    clear: both;
}

/* --------------------------------------------------------------------------
   Table Block
   -------------------------------------------------------------------------- */
.wp-block-table {
    margin: 0;
    overflow-x: auto;
}

.wp-block-table table {
    border-collapse: collapse;
    width: 100%;
}

.wp-block-table td,
.wp-block-table th {
    padding: 0.5em;
    border: 1px solid #ddd;
    word-break: normal;
}

.wp-block-table th {
    font-weight: 600;
    background: #f5f5f5;
}

.wp-block-table.is-style-stripes tbody tr:nth-child(odd) {
    background-color: #f5f5f5;
}

.wp-block-table.is-style-stripes {
    border-bottom: 1px solid #ddd;
}

.wp-block-table.is-style-stripes td,
.wp-block-table.is-style-stripes th {
    border-color: transparent;
}

/* --------------------------------------------------------------------------
   Cover Block
   -------------------------------------------------------------------------- */
.wp-block-cover {
    position: relative;
    background-size: cover;
    background-position: center center;
    min-height: 430px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1em;
    box-sizing: border-box;
}

.wp-block-cover.has-background-dim::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: inherit;
    opacity: 0.5;
    z-index: 1;
}

.wp-block-cover__inner-container {
    width: 100%;
    z-index: 2;
    color: #fff;
}

/* --------------------------------------------------------------------------
   Media & Text Block
   -------------------------------------------------------------------------- */
.wp-block-media-text {
    display: grid;
    grid-template-columns: 50% 1fr;
    grid-template-rows: auto;
}

.wp-block-media-text.has-media-on-the-right {
    grid-template-columns: 1fr 50%;
}

.wp-block-media-text__media {
    grid-column: 1;
    grid-row: 1;
    margin: 0;
}

.wp-block-media-text.has-media-on-the-right .wp-block-media-text__media {
    grid-column: 2;
}

.wp-block-media-text__content {
    grid-column: 2;
    grid-row: 1;
    padding: 0 8%;
    word-break: break-word;
}

.wp-block-media-text.has-media-on-the-right .wp-block-media-text__content {
    grid-column: 1;
}

.wp-block-media-text__media img,
.wp-block-media-text__media video {
    max-width: unset;
    width: 100%;
    vertical-align: middle;
}

@media (max-width: 600px) {
    .wp-block-media-text.is-stacked-on-mobile {
        grid-template-columns: 100% !important;
    }
    .wp-block-media-text.is-stacked-on-mobile .wp-block-media-text__media {
        grid-column: 1;
        grid-row: 1;
    }
    .wp-block-media-text.is-stacked-on-mobile .wp-block-media-text__content {
        grid-column: 1;
        grid-row: 2;
    }
}

/* --------------------------------------------------------------------------
   Gallery Block
   -------------------------------------------------------------------------- */
.wp-block-gallery {
    display: flex;
    flex-wrap: wrap;
    list-style-type: none;
    padding: 0;
    margin: 0;
    gap: var(--wp--style--gallery-gap-default, var(--gallery-block--gutter-size, var(--wp--style--block-gap, 0.5em)));
}

.wp-block-gallery .wp-block-image {
    width: calc((100% - var(--wp--style--gallery-gap-default, var(--gallery-block--gutter-size, var(--wp--style--block-gap, 0.5em)))) / 2);
    flex-grow: 1;
}

.wp-block-gallery.columns-3 .wp-block-image {
    width: calc((100% - var(--wp--style--gallery-gap-default, var(--gallery-block--gutter-size, var(--wp--style--block-gap, 0.5em))) * 2) / 3);
}

.wp-block-gallery.columns-4 .wp-block-image {
    width: calc((100% - var(--wp--style--gallery-gap-default, var(--gallery-block--gutter-size, var(--wp--style--block-gap, 0.5em))) * 3) / 4);
}

/* --------------------------------------------------------------------------
   Video Block
   -------------------------------------------------------------------------- */
.wp-block-video {
    margin: 0;
}

.wp-block-video video {
    max-width: 100%;
    vertical-align: middle;
}

/* --------------------------------------------------------------------------
   Audio Block
   -------------------------------------------------------------------------- */
.wp-block-audio {
    margin: 0;
}

.wp-block-audio audio {
    width: 100%;
    min-width: 300px;
}

/* --------------------------------------------------------------------------
   Embed Block
   -------------------------------------------------------------------------- */
.wp-block-embed {
    margin: 0;
}

.wp-block-embed__wrapper {
    position: relative;
}

.wp-block-embed.is-type-video .wp-block-embed__wrapper::before {
    content: "";
    display: block;
    padding-top: 56.25%;
}

.wp-block-embed.is-type-video .wp-block-embed__wrapper iframe {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

/* --------------------------------------------------------------------------
   File Block
   -------------------------------------------------------------------------- */
.wp-block-file {
    margin: 0;
}

.wp-block-file__button {
    background: #32373c;
    border-radius: 2em;
    color: #fff;
    font-size: 13px;
    padding: 0.5em 1em;
}

/* --------------------------------------------------------------------------
   Pullquote Block
   -------------------------------------------------------------------------- */
.wp-block-pullquote {
    border-top: 4px solid currentColor;
    border-bottom: 4px solid currentColor;
    margin-bottom: 1.75em;
    color: currentColor;
}

.wp-block-pullquote blockquote,
.wp-block-pullquote cite,
.wp-block-pullquote p {
    color: inherit;
}

.wp-block-pullquote blockquote {
    margin: 0;
}

.wp-block-pullquote p {
    font-size: 1.75em;
    line-height: 1.6;
}

.wp-block-pullquote cite,
.wp-block-pullquote footer {
    position: relative;
    text-transform: uppercase;
    font-size: 0.8125em;
    font-style: normal;
}

/* --------------------------------------------------------------------------
   Verse Block
   -------------------------------------------------------------------------- */
.wp-block-verse {
    font-family: inherit;
    font-size: inherit;
    font-style: italic;
    white-space: pre-wrap;
}

/* --------------------------------------------------------------------------
   Details Block
   -------------------------------------------------------------------------- */
.wp-block-details {
    box-sizing: border-box;
}

.wp-block-details summary {
    cursor: pointer;
}

/* --------------------------------------------------------------------------
   Block Alignment Classes (editor-specific)
   -------------------------------------------------------------------------- */
.editor-styles-wrapper .has-text-align-left {
    text-align: left;
}

.editor-styles-wrapper .has-text-align-center {
    text-align: center;
}

.editor-styles-wrapper .has-text-align-right {
    text-align: right;
}

/* --------------------------------------------------------------------------
   Color Classes
   -------------------------------------------------------------------------- */
.has-background {
    padding: 1.25em 2.375em;
}

/* --------------------------------------------------------------------------
   Font Size Classes
   -------------------------------------------------------------------------- */
.has-small-font-size {
    font-size: 13px;
}

.has-regular-font-size,
.has-normal-font-size {
    font-size: 16px;
}

.has-medium-font-size {
    font-size: 20px;
}

.has-large-font-size {
    font-size: 36px;
}

.has-larger-font-size,
.has-huge-font-size {
    font-size: 42px;
}
`;

export default iframeStyles;
