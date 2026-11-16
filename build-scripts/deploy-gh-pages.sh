#!/usr/bin/env bash
# Builds the test-app demo and commits it to the local gh-pages branch (push separately).
set -euo pipefail

message="${1:-Deploy gh-pages}"
root="$(git rev-parse --show-toplevel)"
worktree="$(mktemp -d)"

(cd "$root/test-app" && yarn ember build --environment=production)

rmdir "$worktree"

if git -C "$root" show-ref --verify --quiet refs/heads/gh-pages; then
  git -C "$root" worktree add "$worktree" gh-pages
elif git -C "$root" show-ref --verify --quiet refs/remotes/origin/gh-pages; then
  git -C "$root" worktree add -b gh-pages "$worktree" origin/gh-pages
else
  git -C "$root" worktree add --orphan -b gh-pages "$worktree"
fi
trap 'git -C "$root" worktree remove --force "$worktree"' EXIT

find "$worktree" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -R "$root/test-app/dist/." "$worktree/"
git -C "$worktree" add -A
git -C "$worktree" commit --allow-empty -m "$message"
