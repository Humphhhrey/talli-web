import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';

await rm('dist', { force: true, recursive: true });
await mkdir('dist', { recursive: true });
await cp('public', 'dist', { recursive: true });

const appStoreUrl = process.env.TALLI_APP_STORE_URL ?? 'https://apps.apple.com';
const apiBaseUrl = process.env.TALLI_API_BASE_URL ?? 'https://api.talli.hamfri.me';
const scriptPath = 'dist/app.js';
const script = await readFile(scriptPath, 'utf8');
const updated = script
  .replace("'__TALLI_APP_STORE_URL__'", JSON.stringify(appStoreUrl))
  .replace("'__TALLI_API_BASE_URL__'", JSON.stringify(apiBaseUrl));
await writeFile(scriptPath, updated);
