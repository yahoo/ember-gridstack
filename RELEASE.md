# Release Process

## TL;DR

1. Label every PR to `main` with exactly one of `breaking`, `enhancement`, `bug`, `documentation`, `internal`; the title is the changelog line.
2. Merging to `main` opens or updates the Prepare Release PR.
3. Merging it runs Publish, which stages the version on npm (not public yet).
4. A maintainer approves it on npmjs.com (Staged Packages, 2FA) or with `npm stage approve <id>`.
5. Approved within an hour, Publish then creates the git tag and GitHub release automatically. Approved later? Run Publish from the Actions tab. A rejected stage needs a new Prepare Release PR.

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

The `Plan Release` workflow (`.github/workflows/plan-release.yml`) keeps that PR up to date on every push to `main` and whenever a PR label changes. Merging it changes `.release-plan.json`, which triggers `.github/workflows/publish.yml`. The **Publish** workflow then:

1. **Stage.** The version is not on npm yet, so the workflow runs `npm stage publish` with trusted publishing (OIDC) and provenance (no npm token). The job summary links to the approval page and shows the version and dist-tag.
2. **Approve.** An npm maintainer approves the staged version with 2FA on the [package page](https://www.npmjs.com/package/ember-gridstack) (Staged Packages tab), or with `npm stage approve <id>`.
3. **Tag and release.** The same run waits up to 1 hour. Once the version appears on npm, `release-plan publish` skips the npm publish and creates the git tag and GitHub release.

If approval comes later than 1 hour, run **Publish** from the Actions tab on `main` (Run workflow): it sees the version on npm and only tags and releases. If the stage was rejected, merge a new Prepare Release PR.

All workflows pin npm `11.21.0` (`npm stage` needs >= 11.15.0, OIDC `npm dist-tag` needs >= 11.21.0).

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

Promoting an already published version (e.g. make `6.0.0-rc.2` `latest`, or fix a wrong tag): run the **npm dist-tag** workflow (`.github/workflows/dist-tag.yml`) with `action: add`, `tag: latest`. After a stable release, point stale prerelease tags at it instead of removing them, so installs of `ember-gridstack@alpha` keep working (e.g. `action: add`, `tag: alpha`, `version: 6.0.0`). Remove a tag nobody should use with `action: rm`; `latest` cannot be removed. Both start as a dry run; uncheck `dry_run` to apply. The workflow authenticates with OIDC through a second trusted publisher for `dist-tag.yml` (see One-time setup) and needs npm >= 11.21.0.

## Deprecating versions

Use the **npm deprecate (dry run)** workflow (`.github/workflows/deprecate.yml`). It lists the published versions matching the range (prereleases included) and prints the exact command. CI never deprecates (OIDC is not documented for `npm deprecate`); a maintainer runs the command locally with 2FA:

```sh
npm deprecate "ember-gridstack@<range>" "<message>"
```

- When a stable major ships, deprecate its prereleases, e.g. range `>=6.0.0-0 <6.0.0`, message `Use ember-gridstack@6 (6.0.0)`.
- Deprecate an old major only once it is no longer supported, with an upgrade pointer, e.g. `<5` with `ember-gridstack <5 is unsupported; upgrade to ember-gridstack@6`.
- An empty message undeprecates the matching versions.

## Dry run

Every pull request runs the `release-dry-run` job in `.github/workflows/ci.yml` without secrets: it builds the addon, checks the tarball contents (`build-scripts/check-pack.sh`), runs `npm stage publish --dry-run --tag <dist-tag of the current channel>`, writes the channel, dist-tag and next versions plus `release-plan explain-plan` output to the job summary. The preview step is non-blocking, since it fails while any merged PR is unlabelled.

Locally:

```sh
pnpm build
bash build-scripts/check-pack.sh
(cd ember-gridstack && npx -y npm@11.21.0 stage publish --dry-run --tag "$(node ../build-scripts/release-channel.mts status --package package.json | sed -n 's/^publish-tag=//p')" --provenance=false)
GITHUB_AUTH=<read-only token> pnpm exec release-plan explain-plan
```

## Manual fallback

If the workflows cannot be used, from a clean checkout of `main`:

1. `GITHUB_AUTH=<token> pnpm exec release-plan prepare`, then open a PR with the result and merge it.
2. From a clean checkout of the merged `main`: `GITHUB_AUTH=<token> pnpm exec release-plan publish --otp=<code>`.

Only do this as an npm maintainer with interactive 2FA; never publish from a machine that skipped CI on that commit. Direct publishing with bypass-2FA tokens ends around January 2027. Prefer fixing the workflow, since only CI publishes with provenance.

## One-time setup (repository owner)

- npm: configure a trusted publisher for `ember-gridstack`: repository `yahoo/ember-gridstack`, workflow file `publish.yml`, no environment. Direct `npm publish` is not allowed for it, only `npm stage publish`.
- npm: add a second trusted publisher: repository `yahoo/ember-gridstack`, workflow file `dist-tag.yml`, no environment, with only "Allow npm dist-tag" checked. `dist-tag.yml` fails until it exists.
- npm: under the package's Publishing access, choose "Require two-factor authentication and disallow bypass 2fa tokens".
- No npm tokens or GitHub environments are used.
- GitHub: create the labels `breaking`, `enhancement`, `bug`, `documentation`, `internal`. They must exist before Dependabot can apply `internal` to its PRs.
- Rename the default branch to `main` (the workflows only run for `main`).
- Pushing the `alpha` branch no longer releases anything; alphas are published from `main`.
- First release: `CHANGELOG.md` has a hand-written `## 6.0.0 (unreleased)` section. In the first Prepare Release PR, merge it into the generated section (or remove it) by hand.
