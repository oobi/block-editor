# Block Editor Upgrade Notes

This document captures lessons learned and gotchas when upgrading the WordPress Gutenberg packages in this fork.

## Current Version (January 2026)

**Target:** React 18-compatible Gutenberg packages (~v18.x era)
**Tag:** v2.0.0-react18-alpha.2

### Key Package Versions

| Package | Version | Notes |
|---------|---------|-------|
| @wordpress/block-editor | 15.5.0 | React 18 compatible |
| @wordpress/components | 29.5.0 | |
| @wordpress/blocks | 13.9.0 | |
| @wordpress/data | 10.9.0 | |
| @wordpress/element | 6.9.0 | |
| @wordpress/notices | 5.9.0 | |
| @wordpress/block-library | 9.9.0 | |
| @wordpress/format-library | 5.9.0 | |
| @wordpress/keyboard-shortcuts | 5.9.0 | |
| react / react-dom | 18.3.1 | Peer dependency |

### Known Issues

1. **Block width issue:** Internal div wrapping blocks doesn't go full width in some cases. The root container and layout have width: 100% but an inner wrapper constrains content. Needs further investigation.

2. **List View sidebar:** Fixed - was overlapping content, now positioned as proper sidebar.

3. **Block variation picker:** Fixed - needed content.css import for proper styling.

---

## Previous Version (Pre-React 18)

**Target:** React 17-compatible Gutenberg packages (v10.x era)
**Tag:** v1.0.0-react17-baseline

| Package | Version | Notes |
|---------|---------|-------|
| @wordpress/block-editor | 10.5.0 | Last major React 17-compatible version |
| @wordpress/components | 22.1.0 | |
| @wordpress/blocks | 11.21.0 | |
| @wordpress/data | 7.6.0 | |
| @wordpress/element | 4.20.0 | |
| @wordpress/notices | 3.22.0 | Requires explicit store registration |
| @wordpress/block-library | 7.19.0 | |
| @wordpress/format-library | 3.20.0 | |
| @wordpress/keyboard-shortcuts | 3.20.0 | |
| react / react-dom | 17.0.2 | Peer dependency |

---

## Upgrade Process

### Step 1: Identify Target Versions

WordPress Gutenberg packages are tied to React versions. Use the WordPress/Gutenberg releases page to find compatible package sets:

1. Check the Gutenberg changelog for when React 18 was adopted (~Gutenberg 14.x)
2. Find the last stable release before that transition
3. Use `npm info @wordpress/block-editor versions` to find available versions

### Step 2: Update package.json

Update all `@wordpress/*` packages together. They're designed to work as a set - mixing versions causes subtle bugs.

```bash
# Check for peer dependency issues
npm install 2>&1 | grep -i peer
```

### Step 3: Build and Test

```bash
# In block-editor directory
npm run build

# In laraberg directory
npm run build

# In Laravel app
php artisan vendor:publish --provider="VanOns\Laraberg\LarabergServiceProvider" --tag="public" --force
```

### Step 4: Debug Runtime Errors

Check browser logs carefully. Common issues:
- Store registration errors
- Missing dependencies
- React version mismatches

---

## Known Gotchas

### 1. Store Registration (CRITICAL)

**Problem:** `Cannot read properties of undefined (reading 'getNotices')`

**Cause:** In newer Gutenberg versions, some stores (like `@wordpress/notices`) need explicit registration even though they call `register()` internally. This is due to how webpack bundles modules - the side-effect registration may not run in time.

**Solution:** Explicitly register stores before using them:

```tsx
import { useSelect, useDispatch, register } from '@wordpress/data'
import { store as noticesStore } from '@wordpress/notices'

// Register BEFORE component definition
register(noticesStore)

export default function MyComponent() {
    // Use store object, not string name
    const notices = useSelect((select) => select(noticesStore).getNotices())
    const { removeNotice } = useDispatch(noticesStore)
    // ...
}
```

**Files affected:** `src/components/Notices.tsx`

---

### 2. SCSS Source Files No Longer Available

**Problem:** Build fails with errors like `Can't find stylesheet to import`

**Cause:** Newer `@wordpress/*` packages ship pre-compiled CSS instead of SCSS source files.

**Solution:** Switch from SCSS imports to CSS concatenation:

```json
// package.json build:css script
"build:css": "npm run build:sass && cat node_modules/@wordpress/components/build-style/style.css node_modules/@wordpress/block-editor/build-style/style.css ... > dist/styles.css"
```

Keep custom styles in `src/styles.scss` and compile separately.

---

### 3. TypeScript Declaration Conflicts

**Problem:** Type errors about conflicting React types

**Cause:** Different packages may bundle different versions of `@types/react`

**Solution:** Add to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "skipLibCheck": true
  }
}
```

---

### 4. React Version Mismatch in Browser

**Problem:** Editor fails to render with cryptic React errors

**Cause:** The HTML page loads React from a CDN that doesn't match the version the packages were built against.

**Solution:** Ensure the CDN React version matches `peerDependencies`:

```html
<!-- For React 18 -->
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
```

---

### 5. Missing Block Types

**Problem:** Some blocks don't appear or fail to render

**Cause:** Block definitions change between versions. Some blocks are added, renamed, or have different dependencies.

**Solution:** Check `src/lib/blocks.ts` imports against available exports in the new `@wordpress/block-library` version.

---

## Future Upgrade Path (React 18)

Upgrading to React 18 will be a larger undertaking:

1. **Concurrent Mode:** React 18 introduces concurrent rendering which may affect editor behavior
2. **createRoot API:** `ReactDOM.render` is deprecated; need to use `createRoot`
3. **Package Versions:** Will need Gutenberg 14.x+ packages
4. **Testing:** More extensive testing required for rendering changes

### Packages to Watch

| Current (React 17) | Target (React 18) |
|--------------------|-------------------|
| @wordpress/block-editor 10.x | @wordpress/block-editor 12.x+ |
| @wordpress/element 4.x | @wordpress/element 5.x+ |
| react 17.0.2 | react 18.x |

---

## Development Workflow

### Quick Rebuild Script

Use the laraberg rebuild script for the full build-publish cycle:

```bash
cd /path/to/laraberg
./rebuild-and-publish.sh
```

This will:
1. Build block-editor
2. Build laraberg
3. Publish assets to Laravel app

### Debugging Tips

1. **Browser Logs:** Check `storage/logs/browser.log` in Laravel app
2. **Source Maps:** Use `npm run dev` instead of `npm run build` for readable stack traces
3. **Console:** Look for store-related errors in browser DevTools

---

## Version History

| Date | Change | Notes |
|------|--------|-------|
| 2026-01-26 | Upgraded to v10.x packages | Fixed notices store registration, switched to pre-built CSS |
| Previous | v9.x packages | Original VanOns fork baseline |
