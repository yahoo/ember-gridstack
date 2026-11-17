#!/usr/bin/env bash
# CI runners only reach the public registry; mirror tarball URLs break installs.
set -euo pipefail
bad=$(grep -oE 'tarball: *https?://[^/]+' pnpm-lock.yaml | grep -v 'https://registry.npmjs.org$' | sort -u || true)
if [ -n "$bad" ]; then
  echo "pnpm-lock.yaml has non-npmjs tarball hosts:" >&2
  echo "$bad" >&2
  exit 1
fi
