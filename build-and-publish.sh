#!/bin/bash
# Build block-editor, laraberg, and publish to thebuzz-app

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LARABERG_DIR="$SCRIPT_DIR/../laraberg"
THEBUZZ_DIR="/Users/ccarey/Sites/thebuzz-laravel/thebuzz-app"

echo "🔨 Building block-editor..."
cd "$SCRIPT_DIR"
npm run build

echo ""
echo "🔨 Building laraberg..."
cd "$LARABERG_DIR"
npm run build

echo ""
echo "📦 Publishing to thebuzz-app..."
cd "$THEBUZZ_DIR"
php artisan vendor:publish --provider="VanOns\Laraberg\LarabergServiceProvider" --force

echo ""
echo "✅ Done! Refresh your browser (Cmd+Shift+R) to see changes."
