#!/bin/bash
set -e

# install node.js tools
pnpm install

# install git hooks (reads lefthook.yml)
pnpm exec lefthook install
