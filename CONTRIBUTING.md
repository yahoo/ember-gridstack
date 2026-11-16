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
- `pnpm test:ember` – Runs the test suite on the current Ember version
- `pnpm test:try` – Runs the test suite against every scenario in `test-app/.try.mjs` (via [`@embroider/try`](https://github.com/embroider-build/embroider/tree/main/packages/try)). Pass scenario names to run a subset, e.g. `pnpm test:try ember-lts-4.12`. It resets `test-app/` and `pnpm-lock.yaml` after each scenario, so commit your work first.

## Continuous integration and releases

GitHub Actions runs CI (`.github/workflows/ci.yml`) on pull requests and on pushes to `main` and `alpha`: a lint job, a test job, and one job per try scenario in `test-app/.try.mjs`. Every job must pass.

Releases come from the `release` job in `.github/workflows/ci.yml`, which runs after the lint, test and try jobs pass on a push to `main` (published to npm as `latest`) or `alpha` (prerelease under the `alpha` dist-tag). It uses semantic-release to derive the version from conventional commits and publishes with npm trusted publishing and provenance, so no npm token is needed. The job lives in ci.yml (not a separate `workflow_run` workflow) so it also runs for `alpha` while that branch is not the default.

The demo is built and deployed to GitHub Pages from `main` by the Pages workflow (`.github/workflows/pages.yml`).

## Running the demo application

- `pnpm start` – Watches the addon and serves the test-app
- Visit the demo at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://cli.emberjs.com/release/](https://cli.emberjs.com/release/).
