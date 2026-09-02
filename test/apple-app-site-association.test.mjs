import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('Apple Universal Link association is restricted to Talli invite URLs', async () => {
  const raw = await readFile(new URL('../public/.well-known/apple-app-site-association', import.meta.url), 'utf8');
  const association = JSON.parse(raw);
  const detail = association.applinks.details[0];

  assert.equal(detail.appID, 'K448VGJ2WW.com.hamfri.talli');
  assert.deepEqual(detail.paths, ['/join/*']);
});

test('invite routes remain static and hand off through the Talli scheme', async () => {
  const script = await readFile(new URL('../public/app.js', import.meta.url), 'utf8');

  assert.match(script, /talli:\/\/join/);
  assert.match(script, /window\.location\.pathname/);
});
