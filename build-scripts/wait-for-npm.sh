#!/usr/bin/env bash
# Usage: wait-for-npm.sh <version> <minutes>. Writes approved=true|false to $GITHUB_OUTPUT.
set -euo pipefail
version=$1
minutes=$2
for _ in $(seq "$minutes"); do
  if npm view "ember-gridstack@$version" version --registry https://registry.npmjs.org/ >/dev/null 2>&1; then
    echo "approved=true" >>"$GITHUB_OUTPUT"
    exit 0
  fi
  sleep 60
done
echo "approved=false" >>"$GITHUB_OUTPUT"
