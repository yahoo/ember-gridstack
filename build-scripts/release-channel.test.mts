import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import { main, configFor, nextVersions } from './release-channel.mts';

const SCRATCH = 'node_modules/.cache/channels';

function scratch(version: string): string {
  mkdirSync(SCRATCH, { recursive: true });
  const dir = mkdtempSync(join(SCRATCH, 't-'));
  const file = join(dir, 'package.json');
  copyFileSync('ember-gridstack/package.json', file);
  const pkg = JSON.parse(readFileSync(file, 'utf8')) as Record<string, unknown>;
  pkg.version = version;
  writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n');
  return file;
}

function run(file: string, ...args: string[]): Record<string, unknown> {
  assert.equal(main([...args, '--package', file]), 0);
  return JSON.parse(readFileSync(file, 'utf8')) as Record<string, unknown>;
}

test('alpha -> beta -> rc -> stable -> alpha on stable version', () => {
  const file = scratch('5.0.1');
  const keys = Object.keys(JSON.parse(readFileSync(file, 'utf8')) as object);
  const stableMap = { major: 'premajor', minor: 'preminor', patch: 'prepatch' };
  for (const ch of ['alpha', 'beta', 'rc'] as const) {
    const pkg = run(file, ch);
    assert.deepEqual(pkg['release-plan'], {
      semverIncrementAs: stableMap,
      semverIncrementTag: ch,
      publishTag: ch,
    });
    assert.deepEqual(Object.keys(pkg), keys);
  }
  const stable = run(file, 'stable');
  assert.equal('release-plan' in stable, false);
  const again = run(file, 'alpha');
  assert.deepEqual(Object.keys(again), keys);
  assert.ok(readFileSync(file, 'utf8').endsWith('}\n'));
  const before = readFileSync(file, 'utf8');
  run(file, 'alpha');
  assert.equal(readFileSync(file, 'utf8'), before);
});

test('prerelease version uses prerelease everywhere', () => {
  const file = scratch('6.0.0-alpha.0');
  const pkg = run(file, 'alpha');
  assert.deepEqual(pkg['release-plan'], {
    semverIncrementAs: {
      major: 'prerelease',
      minor: 'prerelease',
      patch: 'prerelease',
    },
    semverIncrementTag: 'alpha',
    publishTag: 'alpha',
  });
});

test('next versions', () => {
  assert.deepEqual(
    nextVersions('5.0.1', configFor('alpha', '5.0.1')).map((r) => r.version),
    ['6.0.0-alpha.0', '5.1.0-alpha.0', '5.0.2-alpha.0'],
  );
  assert.equal(
    nextVersions('6.0.0-alpha.3', configFor('beta', '6.0.0-alpha.3'))[0]
      ?.version,
    '6.0.0-beta.0',
  );
  const stable = nextVersions('5.0.1', undefined);
  assert.deepEqual(
    stable.map((r) => [r.version, r.distTag]),
    [
      ['6.0.0', 'latest'],
      ['5.1.0', 'latest'],
      ['5.0.2', 'latest'],
    ],
  );
});

test('unknown channel rejected', () => {
  const file = scratch('5.0.1');
  assert.equal(main(['gamma', '--package', file]), 1);
});
