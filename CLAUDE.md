# ember-gridstack

Ember wrapper (v2 addon) for [gridstack.js](https://gridstackjs.com/).

## Layout

- pnpm monorepo; workspace packages (`pnpm-workspace.yaml`): `ember-gridstack`, `test-app`.
- `ember-gridstack/`: the v2 addon. Source in `ember-gridstack/src/` (`components/` with `grid-stack.gts`, `grid-stack-item.gts`, `grid-stack-layout.gts`; `modifiers/`, `services/`, `utils/`, `index.ts`). `.gts`/`.ts`, typed with Glint.
- `test-app/`: tests (`test-app/tests`) and the GitHub Pages demo.
- `test-classic/`: classic ember-cli smoke test. Not a workspace package; run via `pnpm test:classic`.
- `build-scripts/`: release and CI helper scripts.

## Commands

Node >= 20.19; volta pins Node 22 and pnpm 10 (`packageManager`). Run from the repo root.

- `pnpm install`: install deps (also builds the addon via `prepare`).
- `pnpm lint`: workspace lint plus `lint:scripts` (prettier on `build-scripts`, release-channel tests, lockfile check).
- `pnpm lint:fix`: auto-fix lint issues.
- `pnpm build`: build the addon.
- `pnpm test`: `pnpm lint` + `pnpm test:ember`.
- `pnpm test:ember`: slow (vite build + testem); needs Chrome.
- `./build-scripts/try-scenarios.sh [scenario...]` (alias `pnpm test:try`): slow, runs every ember-try scenario. Warning: discards uncommitted changes under `test-app/` and in `pnpm-lock.yaml`.
- `pnpm test:classic`: slow; packs the addon and builds/tests the classic fixture.
- `pnpm release:channel status`: read-only release channel status.
- `pnpm start`: addon and test-app dev servers.

## Conventions

- Two public, additive APIs: template (`<GridStack>`/`<GridStackItem>`) and data mode (`@layout`, `grid-stack-layout.gts`). Do not break or remove one for the other.
- A public API change needs README, types and tests together.
- No `any`. Comments only for non-obvious why.
- A behaviour change needs a test.
- Prettier, ESLint and Glint types are enforced; the husky pre-commit hook runs pretty-quick. Run `pnpm lint` before finishing.

## Pull requests and releases

- Exactly one release label per PR: `breaking`, `enhancement`, `bug`, `documentation`, `internal`. See [CONTRIBUTING.md](CONTRIBUTING.md#pull-request-labels).
- The PR title becomes the changelog line; write it for users.
- Release flow:
  1. Merge labelled PRs to `main`.
  2. Merge the auto-opened Prepare Release PR.
  3. The `Publish` workflow stages the version on npm (not public yet).
  4. A maintainer approves it within 1 hour and the same run tags and releases (if later: run `Publish` from Actions; if rejected: a new Prepare Release PR).
- Details: [RELEASE.md](RELEASE.md).

## Agents must never

- Publish to npm or approve staged versions.
- Push tags.
- Edit workflow `permissions:` in `.github/workflows/*`.
- Push without being asked.
