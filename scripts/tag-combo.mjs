import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const { prompts } = JSON.parse(await fs.readFile(path.join(root, 'assets/combo-production/state-prompts.json'), 'utf8'));
const records = path.join(root, 'assets/combo-production/prompts');
await fs.mkdir(records, { recursive: true });
const binary = process.argv[2];
if (!binary) throw new Error('Usage: node scripts/tag-combo.mjs <impeccable-executable>');
for (const [id, prompt] of Object.entries(prompts)) {
  const record = path.join(records, `${id}.txt`);
  await fs.writeFile(record, prompt);
  for (const file of [`assets/combo-production/states/${id}.png`, `public/media/combo/${id}.webp`]) {
    const result = spawnSync(binary, ['embed-prompt', path.join(root, file), '--prompt-file', record], { encoding: 'utf8', windowsHide: true });
    if (result.status !== 0) throw new Error(result.stderr || result.error || result.stdout);
  }
}
console.log(`Recorded exact prompts for ${Object.keys(prompts).length} source PNGs and web assets.`);
