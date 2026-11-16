#!/usr/bin/env bash
# Builds the test-app demo and commits it to the local gh-pages branch (push separately).
set -euo pipefail

message="${1:-Deploy gh-pages}"
root="$(git rev-parse --show-toplevel)"
worktree="$(mktemp -d)"
trap 'git -C "$root" worktree remove --force "$worktree" 2>/dev/null || rm -rf "$worktree"' EXIT

(cd "$root/test-app" && yarn ember build --environment=production)

if git -C "$root" show-ref --verify --quiet refs/heads/gh-pages; then
  git -C "$root" worktree add "$worktree" gh-pages
elif git -C "$root" show-ref --verify --quiet refs/remotes/origin/gh-pages; then
  git -C "$root" worktree add -b gh-pages "$worktree" origin/gh-pages
else
  # worktree add --orphan needs git >= 2.42; node:22 (bookworm) ships 2.39
  git -C "$root" worktree add --detach "$worktree"
  git -C "$worktree" checkout --orphan gh-pages
fi

find "$worktree" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -R "$root/test-app/dist/." "$worktree/"
git -C "$worktree" add -A
git -C "$worktree" commit --allow-empty -m "$message"
