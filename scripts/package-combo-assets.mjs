import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const destination = path.join(root, 'deliverables/AVA-combo-assets');
const exportManifest = JSON.parse(await fs.readFile(path.join(root, 'assets/combo-production/export-manifest.json'), 'utf8'));
const inventory = [];

async function copy(source, output, kind) {
  const input = path.join(root, source);
  const target = path.join(destination, output);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.copyFile(input, target);
  const bytes = await fs.readFile(target);
  const meta = await sharp(bytes).metadata();
  inventory.push({ file: output, kind, bytes: bytes.length, width: meta.width, height: meta.height,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') });
}

await copy('assets/combo-photo/model-reference.png', '01-modelo/modelo-referencia.png', 'user-supplied model reference');
await copy('assets/combo-photo/pilots/swim-base-front-v2.png', '02-swimwear/base-front.png', 'photographic swimsuit base, front three-quarter');
await copy('assets/combo-photo/pilots/swim-base-back.png', '02-swimwear/base-back.png', 'photographic swimsuit base, back three-quarter');

for (const id of Object.keys(exportManifest).sort()) {
  await copy(`assets/combo-production/states/${id}.png`, `03-maniqui-png/${id}.png`, 'earlier clothed mannequin state, three views');
  await copy(`public/media/combo/${id}.webp`, `04-maniqui-webp/${id}.webp`, 'optimized earlier clothed mannequin state, three views');
}

if (Object.keys(exportManifest).length !== 29 || inventory.length !== 61) throw new Error('Incomplete asset family');
for (const item of inventory.filter(item => item.kind.includes('mannequin'))) {
  if (item.width !== 1536 || item.height !== 1024) throw new Error(`Invalid mannequin strip: ${item.file}`);
}
const photos = inventory.filter(item => item.file.startsWith('02-swimwear/'));
if (photos.some(item => item.width !== 1024 || item.height !== 1536)) throw new Error('Unexpected swimsuit photo size');

await fs.mkdir(path.join(destination, '05-integracion'), { recursive: true });
const states = Object.keys(exportManifest).sort().map(id => ({ id,
  procedures: id === 'base' ? [] : id.split('__'),
  existingMannequinPng: `03-maniqui-png/${id}.png`,
  existingMannequinWebp: `04-maniqui-webp/${id}.webp`,
  photographicFrontFilename: `${id}-front.png`,
  photographicBackFilename: `${id}-back.png`,
  photographicStatus: id === 'base' ? 'two preview files included in 02-swimwear' : 'not produced'
}));
await fs.writeFile(path.join(destination, '05-integracion/estados.json'), JSON.stringify({
  selectionRule: 'Maximum three procedures and at most one breast option.',
  canonicalOrder: ['bbl', 'liposuccion', 'abdominoplastia', 'aumento-de-pecho', 'levantamiento-de-pecho', 'reduccion-de-pecho'],
  currentWebsiteFormat: { width:1536, height:1024, panels:['front','side','back'], panelWidth:512 },
  photographicPreviewFormat: { width:1024, height:1536, views:['front','back'] },
  states
}, null, 2) + '\n');

await fs.writeFile(path.join(destination, '05-integracion/inventario.json'), JSON.stringify(inventory, null, 2) + '\n');
await fs.copyFile(path.join(root, 'assets/combo-photo/handoff-readme.txt'), path.join(destination, 'LEEME.txt'));
console.log(JSON.stringify({ folder:destination, imageFiles:inventory.length, mannequinStates:states.length,
  photographicBaseViews:photos.length, totalImageBytes:inventory.reduce((sum, item) => sum + item.bytes, 0) }));
