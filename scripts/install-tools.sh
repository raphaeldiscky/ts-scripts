#!/bin/bash
set -e

# install node.js tools
pnpm install

# add husky hooks
pnpm exec husky init
cat > .husky/pre-commit << 'HOOK'
task format && task lint && git add -A .
HOOK
cat > .husky/pre-push << 'HOOK'
task lint
HOOK
echo "pnpm exec commitlint --edit \$1" > .husky/commit-msg
