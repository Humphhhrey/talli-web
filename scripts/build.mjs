import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';

await rm('dist', { force: true, recursive: true });
await mkdir('dist', { recursive: true });
await cp('public', 'dist', { recursive: true });

const appStoreUrl = process.env.TALLI_APP_STORE_URL ?? 'https://apps.apple.com';
const scriptPath = 'dist/app.js';
const script = await readFile(scriptPath, 'utf8');
await writeFile(scriptPath, script.replace("'__TALLI_APP_STORE_URL__'", JSON.stringify(appStoreUrl)));
