# Release Process

Releases in this repo are mostly automated using [release-plan](https://github.com/embroider-build/release-plan/). Once you label all your PRs correctly (see below) you will have an automatically generated PR that updates your CHANGELOG.md file and a `.release-plan.json` that is used to prepare the release once the PR is merged.

## Preparation

Since the majority of the actual release process is automated, the remaining tasks before releasing are:

- correctly labeling **all** pull requests that have been merged since the last release
- updating pull request titles so they make sense to our users

Some great information on why this is important can be found at [keepachangelog.com](https://keepachangelog.com/en/1.1.0/), but the overall
guiding principle here is that changelogs are for humans, not machines.

When reviewing merged PR's the labels to be used are:

- breaking - Used when the PR is considered a breaking change.
- enhancement - Used when the PR adds a new feature or enhancement.
- bug - Used when the PR fixes a bug included in a previous release.
- documentation - Used when the PR adds or updates documentation.
- internal - Internal changes or things that don't fit in any other category.

**Note:** `release-plan` requires that **all** PRs are labeled. If a PR doesn't fit in a category it's fine to label it as `internal`

## Release

Once the prep work is completed, the actual release is straight forward: you just need to merge the open [Plan Release](https://github.com/yahoo/ember-gridstack/pulls?q=is%3Apr+is%3Aopen+%22Prepare+Release%22+in%3Atitle) PR.

The `Plan Release` workflow (`.github/workflows/plan-release.yml`) keeps that PR up to date on every push to `main` and whenever a PR label changes. Merging it changes `.release-plan.json`, which triggers `.github/workflows/publish.yml`: it publishes to npm with trusted publishing and provenance (no npm token), and creates the git tag and GitHub release.

## Prereleases

While 6.0 is in alpha, `ember-gridstack/package.json` contains:

```json
"release-plan": {
  "semverIncrementAs": { "major": "premajor", "minor": "prerelease", "patch": "prerelease" },
  "semverIncrementTag": "alpha",
  "publishTag": "alpha"
}
```

- From `5.0.0`, a `breaking` PR gives `6.0.0-alpha.0`; any further release gives `6.0.0-alpha.1`, `6.0.0-alpha.2`, ...
- `publishTag` sets the npm dist-tag (`alpha`); release-plan has no `--tag` option. `publish.yml` passes `--github-prerelease` so the GitHub releases are marked as prereleases.
- **Right after `6.0.0-alpha.0` is published**, change `"major": "premajor"` to `"major": "prerelease"`. Otherwise the next `breaking` PR produces `7.0.0-alpha.0`.
- **Going stable:** in the Prepare Release PR for 6.0.0, delete the whole `release-plan` block and remove `--github-prerelease` from `publish.yml`. A major bump on `6.0.0-alpha.N` yields `6.0.0`, published as `latest`.

## Dry run

Every pull request runs the `release-dry-run` job in `.github/workflows/ci.yml` without secrets: it builds the addon, checks the tarball contents (`build-scripts/check-pack.sh`), runs `npm publish --dry-run --tag alpha`, and writes `release-plan explain-plan` output to the job summary. The preview step is non-blocking, since it fails while any merged PR is unlabelled.

Locally:

```sh
pnpm build
bash build-scripts/check-pack.sh
(cd ember-gridstack && npm publish --dry-run --tag alpha --provenance=false)
GITHUB_AUTH=<read-only token> pnpm exec release-plan explain-plan
```

## Manual fallback

If the workflows cannot be used, from a clean checkout of `main`:

1. `GITHUB_AUTH=<token> pnpm exec release-plan prepare`, then open a PR with the result and merge it.
2. From a clean checkout of the merged `main`: `GITHUB_AUTH=<token> pnpm exec release-plan publish --otp=<code>`.

Only do this as an npm maintainer with 2FA; never publish from a machine that skipped CI on that commit. Prefer fixing the workflow, since only CI publishes with provenance.

## One-time setup (repository owner)

- npm: configure a trusted publisher for `ember-gridstack`: repository `yahoo/ember-gridstack`, workflow file `publish.yml`, no environment.
- GitHub: create the labels `breaking`, `enhancement`, `bug`, `documentation`, `internal`. They must exist before Dependabot can apply `internal` to its PRs.
- Rename the default branch to `main` (the workflows only run for `main`).
- Pushing the `alpha` branch no longer releases anything; alphas are published from `main`.
- First release: `CHANGELOG.md` has a hand-written `## 6.0.0 (unreleased)` section. In the first Prepare Release PR, merge it into the generated section (or remove it) by hand.
