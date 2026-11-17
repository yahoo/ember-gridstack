import { readFileSync, writeFileSync } from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import semver from 'semver';

export type Channel = 'alpha' | 'beta' | 'rc' | 'stable';
export type ReleaseType = semver.ReleaseType;
export interface Block {
  semverIncrementAs: {
    major: ReleaseType;
    minor: ReleaseType;
    patch: ReleaseType;
  };
  semverIncrementTag: string;
  publishTag: string;
}

export const CHANNELS: readonly Channel[] = ['alpha', 'beta', 'rc', 'stable'];
const KEY = 'release-plan';
const USAGE = `usage: node build-scripts/release-channel.mts <alpha|beta|rc|stable|status [--github-output]|next> [--package <path>]`;

export function configFor(
  channel: Channel,
  version: string,
): Block | undefined {
  if (channel === 'stable') return undefined;
  const isPre = semver.prerelease(version) !== null;
  return {
    semverIncrementAs: isPre
      ? { major: 'prerelease', minor: 'prerelease', patch: 'prerelease' }
      : { major: 'premajor', minor: 'preminor', patch: 'prepatch' },
    semverIncrementTag: channel,
    publishTag: channel,
  };
}

export interface NextRow {
  label: string;
  version: string | null;
  distTag: string;
}

export function nextVersions(
  version: string,
  block: Block | undefined,
): NextRow[] {
  const kinds = [
    ['breaking', 'major'],
    ['enhancement', 'minor'],
    ['bug', 'patch'],
  ] as const;
  return kinds.map(([label, kind]) => ({
    label,
    version: block
      ? semver.inc(
          version,
          block.semverIncrementAs[kind],
          block.semverIncrementTag,
        )
      : semver.inc(version, kind),
    distTag: block?.publishTag ?? 'latest',
  }));
}

export function status(block: Block | undefined): Record<string, string> {
  return {
    channel: block?.semverIncrementTag ?? 'stable',
    'publish-tag': block?.publishTag ?? 'latest',
    prerelease: block ? 'true' : 'false',
  };
}

type Pkg = Record<string, unknown> & { version: string };

function readPkg(path: string): Pkg {
  return JSON.parse(readFileSync(path, 'utf8')) as Pkg;
}

function withBlock(pkg: Pkg, block: Block | undefined): Pkg {
  const out: Record<string, unknown> = {};
  const hadKey = KEY in pkg;
  for (const [k, v] of Object.entries(pkg)) {
    if (k === KEY) {
      if (block) out[KEY] = block;
      continue;
    }
    out[k] = v;
    if (!hadKey && block && k === 'publishConfig') out[KEY] = block;
  }
  if (block && !(KEY in out)) out[KEY] = block;
  return out as Pkg;
}

function table(version: string, block: Block | undefined): string {
  const rows = nextVersions(version, block).map(
    (r) =>
      `  ${r.label.padEnd(12)} ${version} -> ${r.version ?? '?'}  (dist-tag ${r.distTag})`,
  );
  return [
    ...rows,
    'for real PR labels run: GITHUB_AUTH=... pnpm exec release-plan explain-plan',
  ].join('\n');
}

export function main(argv: string[]): number {
  const args = [...argv];
  let path = 'ember-gridstack/package.json';
  const pi = args.indexOf('--package');
  if (pi !== -1) {
    const p = args[pi + 1];
    if (!p) {
      console.error(USAGE);
      return 1;
    }
    path = p;
    args.splice(pi, 2);
  }
  const [cmd, ...rest] = args;
  const pkg = readPkg(path);
  const current = pkg[KEY] as Block | undefined;

  if (cmd === 'status') {
    const s = status(current);
    const lines = Object.entries(s).map(([k, v]) => `${k}=${v}`);
    if (!rest.includes('--github-output'))
      lines.unshift(`version=${pkg.version}`);
    console.log(lines.join('\n'));
    return 0;
  }
  if (cmd === 'next') {
    console.log(table(pkg.version, current));
    return 0;
  }
  if (!cmd || !(CHANNELS as readonly string[]).includes(cmd) || rest.length) {
    console.error(USAGE);
    return 1;
  }
  const next = configFor(cmd as Channel, pkg.version);
  if (isDeepStrictEqual(current, next)) {
    console.log(`${KEY} unchanged (channel ${status(current).channel})`);
    return 0;
  }
  writeFileSync(path, JSON.stringify(withBlock(pkg, next), null, 2) + '\n');
  console.log(
    `${KEY}: ${JSON.stringify(current ?? null)} -> ${JSON.stringify(next ?? null)}`,
  );
  console.log(table(pkg.version, next));
  return 0;
}

if (process.argv[1]?.endsWith('release-channel.mts')) {
  process.exitCode = main(process.argv.slice(2));
}
