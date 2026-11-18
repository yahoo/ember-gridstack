#!/usr/bin/env bash
# Install the packed tarball into the classic ember-cli + ember-auto-import v2 fixture, then build and test it.
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
tmp="$root/node_modules/.cache/polish/classic"
rm -rf "$tmp"
mkdir -p "$tmp/app"

(cd "$root/ember-gridstack" && npm pack --pack-destination "$tmp" --ignore-scripts)
rsync -a --exclude node_modules --exclude dist "$root/test-classic/" "$tmp/app/"

cd "$tmp/app"
export npm_config_registry=https://registry.npmjs.org/
npm install --no-package-lock --no-audit --no-fund "$tmp"/ember-gridstack-*.tgz
npx ember build --environment=test
npx ember test --path dist

node -p '["ember-auto-import", "ember-source"].map((n) => `${n}@${require(`${n}/package.json`).version}`).join("\n")'
