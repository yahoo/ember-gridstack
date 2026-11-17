#!/usr/bin/env bash
# Run test-app against @embroider/try scenarios (all, or those named as arguments),
# restoring package.json, scenario files and the lockfile after each one.
# Discards uncommitted changes under test-app/ and in pnpm-lock.yaml.
set -uo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root/test-app" || exit 1

if [ $# -gt 0 ]; then
  scenarios=("$@")
else
  scenarios=()
  while IFS= read -r name; do scenarios+=("$name"); done < <(
    pnpm exec try list | node -e '
      let s = ""; process.stdin.on("data", (d) => (s += d));
      process.stdin.on("end", () => JSON.parse(s).name.forEach((n) => console.log(n)));
    '
  )
fi

restore() {
  git -C "$root" checkout -- test-app pnpm-lock.yaml
  (cd "$root" && pnpm install --frozen-lockfile >/dev/null)
}

failed=()
for name in "${scenarios[@]}"; do
  echo "=== $name"
  if pnpm exec try apply "$name" && SKIP_DECLARATIONS=1 pnpm install --no-frozen-lockfile && pnpm test:ember; then
    echo "=== $name: PASS"
  else
    echo "=== $name: FAIL"
    failed+=("$name")
  fi
  restore
done

if [ ${#failed[@]} -gt 0 ]; then
  echo "Failed scenarios: ${failed[*]}"
  exit 1
fi
echo "All scenarios passed"
