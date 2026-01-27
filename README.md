# Block Editor

This package is a Work In Progress. It aims to seperate the Javascript frontend from [Laraberg](https://github.com/VanOns/laraberg) so it can be maintained seperately, and maybe serve as a starting point for other backend implementations.

## Version Information

| Component | Version | Notes |
|-----------|---------|-------|
| Gutenberg Plugin (equivalent) | ~18.x | React 18 compatible |
| @wordpress/block-editor | 15.5.0 | |
| @wordpress/components | 29.5.0 | |
| @wordpress/blocks | 13.9.0 | |
| @wordpress/element | 6.9.0 | |
| @wordpress/data | 10.9.0 | |
| React / React-DOM | 18.x | Peer dependency |

### Upgrade History

- **v1.0.0:** Gutenberg ~14.x (React 17) - Original VanOns version
- **v2.0.0:** Gutenberg ~18.x (React 18) - Migrated to createRoot API

## Usage

To use the editor simply create a input or textarea element and use it to initalize it like this:

```js
import { initializeEditor } from 'mauricewijnia/block-editor'

const element = document.querySelector('#content')
initializeEditor(element)
```