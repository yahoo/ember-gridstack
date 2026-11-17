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

## Channels

The release channel is the `release-plan` block in `ember-gridstack/package.json`. Change it only with:

```sh
pnpm release:channel alpha   # or beta, rc, stable
pnpm release:channel status  # current channel, dist-tag, prerelease flag
pnpm release:channel next    # next version per PR label
```

Commit the resulting `ember-gridstack/package.json` change in its own PR. The command is idempotent and prints the next version for `breaking` / `enhancement` / `bug`.

| channel             | version shape   | npm dist-tag | GitHub release |
| ------------------- | --------------- | ------------ | -------------- |
| `alpha`             | `6.0.0-alpha.N` | `alpha`      | prerelease     |
| `beta`              | `6.0.0-beta.N`  | `beta`       | prerelease     |
| `rc`                | `6.0.0-rc.N`    | `rc`         | prerelease     |
| `stable` (no block) | `6.0.0`         | `latest`     | normal         |

- On a stable version (e.g. `5.0.1`) a channel maps `breaking/enhancement/bug` to `premajor/preminor/prepatch` (`6.0.0-alpha.0`, `5.1.0-alpha.0`, `5.0.2-alpha.0`). On a prerelease version all three map to `prerelease`.
- **Right after the first prerelease is published** (e.g. `6.0.0-alpha.0`), run `pnpm release:channel alpha` again so the block switches to `prerelease`; otherwise the next `breaking` PR produces `7.0.0-alpha.0`.
- Switching channel on a prerelease resets the counter: `6.0.0-alpha.3` -> `beta` gives `6.0.0-beta.0`.
- **Going stable:** `pnpm release:channel stable` deletes the block; the next release of `6.0.0-rc.N` is `6.0.0` on `latest`.
- `publish.yml` and the CI dry run read the channel from `package.json` (`release-channel.mts status`), so no workflow edits are needed; release-plan itself has no `--tag` option and uses `publishTag`.

Promoting an already published version (e.g. make `6.0.0-rc.2` `latest`, or fix a wrong tag): run the **npm dist-tag** workflow (`.github/workflows/dist-tag.yml`) with `action: add`, `tag: latest`. Remove a stale tag (e.g. `alpha` after 6.0.0 ships) with `action: rm`; `latest` cannot be removed. Both start as a dry run; uncheck `dry_run` to apply.

## Deprecating versions

Use the **npm deprecate** workflow (`.github/workflows/deprecate.yml`). It lists the published versions matching the range (prereleases included) and the exact command; uncheck `dry_run` to apply.

- When a stable major ships, deprecate its prereleases, e.g. range `>=6.0.0-0 <6.0.0`, message `Use ember-gridstack@6 (6.0.0)`.
- Deprecate an old major only once it is no longer supported, with an upgrade pointer, e.g. `<5` with `ember-gridstack <5 is unsupported; upgrade to ember-gridstack@6`.
- An empty message undeprecates the matching versions.

`dist-tag.yml` and `deprecate.yml` authenticate with `NPM_TOKEN`, not trusted publishing: npm's trusted publisher is bound to `publish.yml`, and `npm deprecate` does not attempt an OIDC token exchange.

## Dry run

Every pull request runs the `release-dry-run` job in `.github/workflows/ci.yml` without secrets: it builds the addon, checks the tarball contents (`build-scripts/check-pack.sh`), runs `npm publish --dry-run --tag <dist-tag of the current channel>`, writes the channel, dist-tag and next versions plus `release-plan explain-plan` output to the job summary. The preview step is non-blocking, since it fails while any merged PR is unlabelled.

Locally:

```sh
pnpm build
bash build-scripts/check-pack.sh
(cd ember-gridstack && npm publish --dry-run --tag "$(node ../build-scripts/release-channel.mts status --package package.json | sed -n 's/^publish-tag=//p')" --provenance=false)
GITHUB_AUTH=<read-only token> pnpm exec release-plan explain-plan
```

## Manual fallback

If the workflows cannot be used, from a clean checkout of `main`:

1. `GITHUB_AUTH=<token> pnpm exec release-plan prepare`, then open a PR with the result and merge it.
2. From a clean checkout of the merged `main`: `GITHUB_AUTH=<token> pnpm exec release-plan publish --otp=<code>`.

Only do this as an npm maintainer with 2FA; never publish from a machine that skipped CI on that commit. Prefer fixing the workflow, since only CI publishes with provenance.

## One-time setup (repository owner)

- npm: configure a trusted publisher for `ember-gridstack`: repository `yahoo/ember-gridstack`, workflow file `publish.yml`, no environment.
- GitHub: create the environment `npm-admin` with required reviewers. Add `NPM_TOKEN` as an **environment** secret there (not a repository secret): a granular npm token, read-write, limited to `ember-gridstack`, short expiry. Only `dist-tag.yml` and `deprecate.yml` use it.
- GitHub: create the labels `breaking`, `enhancement`, `bug`, `documentation`, `internal`. They must exist before Dependabot can apply `internal` to its PRs.
- Rename the default branch to `main` (the workflows only run for `main`).
- Pushing the `alpha` branch no longer releases anything; alphas are published from `main`.
- First release: `CHANGELOG.md` has a hand-written `## 6.0.0 (unreleased)` section. In the first Prepare Release PR, merge it into the generated section (or remove it) by hand.
