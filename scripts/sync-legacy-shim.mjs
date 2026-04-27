import fs from 'node:fs';
import path from 'node:path';

const rootPath = path.resolve(process.cwd(), 'package.json');
const legacyPath = path.resolve(process.cwd(), 'legacy/package.json');

const rootPkg = JSON.parse(fs.readFileSync(rootPath, 'utf8'));
const legacyPkg = JSON.parse(fs.readFileSync(legacyPath, 'utf8'));

legacyPkg.version = rootPkg.version;
legacyPkg.dependencies = {
  ...legacyPkg.dependencies,
  '@veliovgroup/client-storage': `^${rootPkg.version}`
};

fs.writeFileSync(legacyPath, `${JSON.stringify(legacyPkg, null, 2)}\n`, 'utf8');
