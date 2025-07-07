
#!/bin/bash
echo "🔄 Starting system refresh..."

# Kill hanging processes
pkill -f node 2>/dev/null || true
pkill -f python 2>/dev/null || true

# Clear temporary files
find . -name "*.tmp" -delete 2>/dev/null || true
find . -name ".DS_Store" -delete 2>/dev/null || true

# Clear any build artifacts that might be causing issues
rm -rf .next 2>/dev/null || true
rm -rf dist 2>/dev/null || true
rm -rf build 2>/dev/null || true

# Force garbage collection if possible
sync 2>/dev/null || true

echo "✅ System refresh complete!"
echo "If issues persist, try: bash nuclear-reset.sh"
