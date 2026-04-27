import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const rootPath = path.resolve(process.cwd(), 'package.json');
const { version } = JSON.parse(fs.readFileSync(rootPath, 'utf8'));

const message = [
  'Package `ClientStorage` is deprecated and renamed to `@veliovgroup/client-storage`.',
  'Migrate now: npm install @veliovgroup/client-storage',
  'Full migration notes: https://github.com/veliovgroup/client-storage/blob/master/docs/migration-v5.md'
].join(' ');

execSync(
  `npm deprecate ClientStorage@${version} "${message}"`,
  { stdio: 'inherit' }
);
