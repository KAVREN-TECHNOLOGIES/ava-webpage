import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const source = path.join(root, 'assets/combo-production/states');
const destination = path.join(root, 'public/media/combo');
await fs.mkdir(destination, { recursive: true });
const files = (await fs.readdir(source)).filter(file => file.endsWith('.png'));
const manifest = {};
for (const file of files) {
  const id = path.basename(file, '.png');
  const input = path.join(source, file);
  const meta = await sharp(input).metadata();
  if (meta.width !== 1536 || meta.height !== 1024) throw new Error(`Unexpected strip dimensions: ${file}`);
  const output = path.join(destination, `${id}.webp`);
  await sharp(input).webp({ quality: 88, effort: 6 }).toFile(output);
  const { size } = await fs.stat(output);
  manifest[id] = { src: `/media/combo/${id}.webp`, width: meta.width, height: meta.height, bytes: size };
}
await fs.writeFile(path.join(root, 'assets/combo-production/export-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`Exported ${files.length} three-view strips; ${Math.round(Object.values(manifest).reduce((sum, item) => sum + item.bytes, 0) / 1024)} KB total.`);
