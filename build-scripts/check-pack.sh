#!/usr/bin/env bash
# Fail if the ember-gridstack tarball would contain files outside the expected set. Run after `pnpm build`.
set -euo pipefail
cd "$(dirname "$0")/../ember-gridstack"
npm pack --dry-run --json --ignore-scripts | node -e '
let s = "";
process.stdin.on("data", (d) => (s += d)).on("end", () => {
  const files = JSON.parse(s)[0].files.map((f) => f.path);
  const ok = (p) =>
    ["package.json", "README.md", "LICENSE.md", "LICENSE", "addon-main.cjs"].includes(p) ||
    /^(dist|declarations)\//.test(p);
  const bad = files.filter((p) => !ok(p));
  if (!files.some((p) => p.startsWith("dist/"))) bad.push("(no dist/ files: run pnpm build)");
  if (bad.length) {
    console.error("Unexpected files in package:\n" + bad.join("\n"));
    process.exit(1);
  }
  console.log(`Package contents OK (${files.length} files)`);
});
'
