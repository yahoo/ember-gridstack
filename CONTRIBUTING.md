# How To Contribute

This repo is a pnpm workspace with two packages:

- `ember-gridstack/` – the v2 addon (built with rollup)
- `test-app/` – the test suite and the demo, deployed to GitHub Pages

Use Node 22 and pnpm 10 (both pinned in `package.json` via `volta` and `packageManager`; `corepack enable` also works).

## Installation

- `git clone https://github.com/yahoo/ember-gridstack.git`
- `cd ember-gridstack`
- `pnpm install`

## Linting

- `pnpm lint`
- `pnpm lint:fix`

## Building the addon

- `pnpm build`

test-app lists the addon as an injected dependency. It stays a symlink unless a try scenario changes `ember-source`, in which case pnpm copies the addon so it shares test-app's Ember; `pnpm build` re-syncs that copy.

## Running tests

- `pnpm test` – Lints and runs the test suite on the current Ember version
- `pnpm test:ember` – Runs the test suite on the current Ember version (test-app builds with Vite and Embroider)
- `pnpm test:try` – Runs the test suite against every `ember-lts-*`, release and beta scenario in `test-app/.try.mjs` (via [`@embroider/try`](https://github.com/embroider-build/embroider/tree/main/packages/try)). Pass scenario names to run a subset, e.g. `pnpm test:try ember-lts-4.12`. It resets `test-app/` and `pnpm-lock.yaml` after each scenario, so commit your work first. After `pnpm test:try`, restart the dev server with `vite --force`: Vite's dependency cache can keep the try scenario's bundles.
- [`test-app/tests/README.md`](test-app/tests/README.md) – How to filter tests and write grid tests with the test harness

## Continuous integration and releases

GitHub Actions runs CI (`.github/workflows/ci.yml`) on pull requests and on pushes to `main` and `alpha`: a lint job, a test job, and one job per try scenario in `test-app/.try.mjs`. Every job must pass.

Releases are done with [release-plan](https://github.com/embroider-build/release-plan); see [`RELEASE.md`](RELEASE.md). On pull requests, the `release-dry-run` job builds the addon, checks the package contents, runs `npm stage publish --dry-run` and previews the release plan in the job summary.

## Pull request labels

Every PR to `main` needs exactly one label (checked by CI). The title becomes the changelog line.

- `breaking` – major, breaking change
- `enhancement` – minor, new feature or improvement
- `bug` – patch, fixes a released bug
- `documentation` – no release, changelog only
- `internal` – no release, changelog only (tooling, CI, deps, refactors)

Merging to `main` updates the Prepare Release PR; see [RELEASE.md](RELEASE.md). Merging that stages the version on npm (not public yet). A maintainer approves it on npm (2FA) within an hour, and Publish then creates the git tag and GitHub release automatically. Approved later? Run Publish from the Actions tab.

The demo is built and deployed to GitHub Pages from `main` by the Pages workflow (`.github/workflows/pages.yml`).

## Running the demo application

- `pnpm start` – Watches the addon and serves the test-app
- Visit the demo at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://cli.emberjs.com/release/](https://cli.emberjs.com/release/).
