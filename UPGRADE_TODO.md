# Upgrade TODO: Gutenberg 14.x → React 18 (Gutenberg 14.8+)

This document tracks the work required to upgrade from Gutenberg ~14.x (React 17) to Gutenberg 14.8+ (React 18).

## Overview

| Current | Target |
|---------|--------|
| Gutenberg plugin equivalent | ~14.x | 14.8+ |
| React | 17.0.2 | 18.x |
| @wordpress/block-editor | 10.5.0 | 11.x+ |
| @wordpress/element | 4.20.0 | 5.0.0+ |
| @wordpress/data | 7.6.0 | 8.0.0+ |
| @wordpress/components | 22.1.0 | 23.0.0+ |

**Target Version:** Gutenberg 14.8 (first React 18 version, December 2022)

---

## Projects Affected

### block-editor (PRIMARY)
Most upgrade work happens here. This package contains:
- All `@wordpress/*` package dependencies
- React rendering code (`render()` → `createRoot()`)
- TypeScript/build configuration

### laraberg (SECONDARY)
Thin wrapper around block-editor. Changes needed:
- Update React CDN version in example Blade templates
- Rebuild after block-editor upgrade

### thebuzz-app (CONSUMER)
Laravel application consuming laraberg:
- Update React CDN in Blade layouts
- Re-publish vendor assets
- Integration testing

---

## Breaking Changes from Gutenberg Changelog & Deprecations

### From @wordpress/element 5.0.0 (Gutenberg 14.8)
1. **React 18 Required** - All @wordpress/* packages now require React 18
2. **New APIs exported:**
   - `createRoot` - replaces `render`
   - `hydrateRoot` - replaces `hydrate`
   - `flushSync` - for synchronous updates
3. **Deprecated (still work but will be removed):**
   - `render()` - use `createRoot().render()` instead
   - `hydrate()` - use `hydrateRoot()` instead
   - `unmountComponentAtNode()` - use `root.unmount()` instead

### From @wordpress/data 8.0.0 (Gutenberg 14.8)
1. **React 18 Required**
2. **New Feature:** `registry.subscribe` can now subscribe to one specific store

### From deprecations.md (Versions 9.7 → 11.0)
1. **v9.7.0:** `leftSidebar` prop in `InterfaceSkeleton` removed → use `secondarySidebar`
2. **v10.3.0:** `ActionItem.Slot` tuple `as` prop removed → pass single component
3. **v11.0.0:** `wp.blocks.registerBlockTypeFromMetadata` removed → use `registerBlockType`
4. **Unreleased:** `wp.blocks.isValidBlockContent` removed → use `validateBlock`

### React 18 Behavioral Changes
1. **Automatic batching** - State updates are batched by default (may change timing)
2. **Concurrent features** - New rendering model, may affect state updates
3. **Stricter Strict Mode** - Double-invokes effects in development
4. **`act()` enforcement** - Tests must properly wrap state updates

---

## TODO Checklist

### Phase 1: block-editor Package Updates

- [ ] **1. Update React peer dependencies**
  - File: `package.json`
  - Change: `"react": "~17.0.2"` → `"react": "^18.0.0"`
  - Change: `"react-dom": "~17.0.2"` → `"react-dom": "^18.0.0"`

- [ ] **2. Migrate render() to createRoot()**
  - File: `src/components/Editor.tsx`
  - Current code (lines ~117-130):
    ```tsx
    import { render, unmountComponentAtNode } from '@wordpress/element'

    // In initializeEditor:
    render(<Editor ... />, container)

    // In removeEditor:
    unmountComponentAtNode(container)
    ```
  - Must change to:
    ```tsx
    import { createRoot } from '@wordpress/element'

    // Store roots globally or in WeakMap
    const editorRoots = new WeakMap<HTMLElement, ReturnType<typeof createRoot>>()

    // In initializeEditor:
    const root = createRoot(container)
    editorRoots.set(container, root)
    root.render(<Editor ... />)

    // In removeEditor:
    const root = editorRoots.get(container)
    if (root) {
      root.unmount()
      editorRoots.delete(container)
    }
    ```

- [ ] **3. Upgrade @wordpress/* packages**
  - All packages must be upgraded together (they're designed as a set)
  - Target versions (Gutenberg 14.8 equivalents):
    | Package | From | To |
    |---------|------|-----|
    | @wordpress/block-editor | 10.5.0 | 11.0.0+ |
    | @wordpress/element | 4.20.0 | 5.0.0 |
    | @wordpress/components | 22.1.0 | 23.0.0 |
    | @wordpress/blocks | 11.21.0 | 12.0.0 |
    | @wordpress/data | 7.6.0 | 8.0.0 |
    | @wordpress/block-library | 7.19.0 | 8.0.0 |
    | @wordpress/format-library | 3.20.0 | 4.0.0 |
    | @wordpress/keyboard-shortcuts | 3.20.0 | 4.0.0 |
    | @wordpress/notices | 3.22.0 | 4.0.0 |
    | @wordpress/server-side-render | 3.20.0 | 4.0.0 |
  - Run: `npm info @wordpress/element@5 peerDependencies` to verify React version

- [ ] **4. Check for removed/deprecated APIs in our code**
  - Search codebase for:
    - `registerBlockTypeFromMetadata` → replace with `registerBlockType`
    - `isValidBlockContent` → replace with `validateBlock`
    - `leftSidebar` prop → replace with `secondarySidebar`
    - `ActionItem.Slot` with tuple `as` → use single component

- [ ] **5. Update TypeScript configuration**
  - May need to add `"skipLibCheck": true` to `tsconfig.json`
  - Update `@types/react` to v18: `npm install @types/react@18 @types/react-dom@18`
  - Watch for type conflicts between packages

- [ ] **6. Handle StrictMode double-invocation**
  - React 18 StrictMode double-invokes:
    - `constructor`
    - `componentWillMount` (if used)
    - `componentDidMount`
    - `useEffect` cleanup + setup
  - Ensure effects are idempotent (can run twice safely)
  - Check `useEffect` in `Editor.tsx` for side effects

### Phase 2: laraberg Updates

- [x] **7. Update example Blade template**
  - File: `example/resources/views/layouts/app.blade.php`
  - Updated from React 17 to React 18 CDN

- [ ] **8. Rebuild laraberg**
  - Run `npm run build` after block-editor is upgraded

### Phase 3: thebuzz-app Integration

- [x] **9. Update React CDN in Laravel app**
  - Updated `test-editor.blade.php` to use React 18

- [ ] **10. Re-publish vendor assets**
  ```bash
  php artisan vendor:publish --provider="VanOns\Laraberg\LarabergServiceProvider" --tag="public" --force
  ```

### Phase 4: Testing

- [ ] **11. Test concurrent mode behavior**
  - React 18's concurrent mode may affect:
    - Typing responsiveness (automatic batching changes timing)
    - Undo/redo state management
    - Block selection/focus
    - Async state updates in `useEffect`

- [ ] **12. Full integration test**
  - Create new page with blocks
  - Edit existing content
  - Test all block types used in production
  - Check browser console for:
    - React deprecation warnings
    - "act() wrapped" warnings
    - "Cannot update during render" warnings

---

## Known Issues & Solutions

### Issue: "Cannot read properties of undefined (reading 'getNotices')"
**Cause:** Store registration timing changed in newer versions
**Solution:** Explicitly register stores before use (already handled in current code)

### Issue: TypeScript errors about ReactNode types
**Cause:** Conflicting @types/react versions between packages
**Solution:** Add `"skipLibCheck": true` to tsconfig.json, or use npm overrides

### Issue: act() warnings in tests
**Cause:** React 18 is stricter about wrapping state updates in act()
**Solution:** Update tests to properly await async updates with `waitFor()`

### Issue: useEffect runs twice in development
**Cause:** React 18 StrictMode intentionally double-invokes effects
**Solution:** Ensure effects are idempotent; use cleanup functions properly

### Issue: State update timing changes
**Cause:** React 18 automatic batching batches more updates
**Solution:** Use `flushSync` if you need synchronous updates (rare)

---

## Commands Reference

```bash
# Check available versions of a package
npm info @wordpress/element versions

# Check peer dependencies
npm info @wordpress/element@5.0.0 peerDependencies

# Install specific version
npm install @wordpress/element@5.0.0

# Find what versions work together (check Gutenberg 14.8 package.json)
# https://github.com/WordPress/gutenberg/blob/v14.8.0/package.json
```

---

## References

- [Gutenberg PR #45235 - React 18 Upgrade](https://github.com/WordPress/gutenberg/pull/45235)
- [Gutenberg 14.8.0 Changelog](https://github.com/WordPress/gutenberg/releases/tag/v14.8.0)
- [Gutenberg Deprecations](https://github.com/WordPress/gutenberg/blob/trunk/docs/contributors/code/deprecations.md)
- [@wordpress/element CHANGELOG](https://github.com/WordPress/gutenberg/blob/trunk/packages/element/CHANGELOG.md)
- [React 18 Upgrade Guide](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)
- [UPGRADE_NOTES.md](./UPGRADE_NOTES.md) - General upgrade guidance

---

## Version History

| Date | Status | Notes |
|------|--------|-------|
| 2026-01-27 | Created | Initial TODO list for React 18 migration |
