import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const source = JSON.parse(await fs.readFile(path.join(root, 'assets/combo-photo/reference-manifest.json'), 'utf8'));
const destination = path.join(root, 'deliverables/AE-original-references');
await fs.mkdir(destination, { recursive: true });
const pairs = new Map();
const slug = text => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
for (const row of source) {
  const key = `${row.front}\n${row.back}`;
  if (pairs.has(key)) { pairs.get(key).sourceEntries.push(row); continue; }
  const number = String(pairs.size + 1).padStart(2, '0');
  const name = row.procedures.length ? row.procedures.map(slug).join('_') : 'base';
  pairs.set(key, { folder:`${number}-${name}`, procedures:row.procedures, sourceEntries:[row], front:row.front, back:row.back });
}

const downloads = [];
for (const pair of pairs.values()) {
  await fs.mkdir(path.join(destination, pair.folder), { recursive:true });
  for (const view of ['front', 'back']) downloads.push({ pair, view, url:pair[view], file:`${pair.folder}/${view}.png` });
}
let cursor = 0;
let completed = 0;
const failures = [];

async function download(item) {
  const output = path.join(destination, item.file);
  let bytes;
  try {
    const existing = await fs.readFile(output);
    if (existing.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) bytes = existing;
  } catch {}
  if (!bytes) {
    for (let attempt=0; attempt<3; attempt++) {
      try {
        const response = await fetch(item.url, { signal:AbortSignal.timeout(30000) });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        bytes = Buffer.from(await response.arrayBuffer());
        if (!bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) throw new Error('Response is not a PNG');
        await fs.writeFile(output, bytes);
        break;
      } catch (error) {
        if (attempt === 2) throw error;
      }
    }
  }
  const metadata = await sharp(bytes).metadata();
  item.originalFilename = path.posix.basename(new URL(item.url).pathname);
  item.width = metadata.width;
  item.height = metadata.height;
  item.bytes = bytes.length;
  item.sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
  completed++;
  if (completed % 10 === 0 || completed === downloads.length) console.log(`Downloaded and verified ${completed}/${downloads.length} originals`);
}

await Promise.all(Array.from({length:6}, async () => {
  while (cursor < downloads.length) {
    const item = downloads[cursor++];
    try { await download(item); }
    catch (error) { failures.push({file:item.file,url:item.url,error:String(error)}); }
  }
}));
if (failures.length) {
  await fs.writeFile(path.join(destination, 'download-errors.json'), JSON.stringify(failures,null,2));
  throw new Error(`${failures.length} originals could not be downloaded: ${JSON.stringify(failures)}`);
}

const manifest = { source:'https://aeplasticsurgerymiami.com/',
  sourceEntryCount:source.length, combinationImagePairs:pairs.size, originalPngFiles:downloads.length,
  transformations:'None. Original PNG bytes preserved, with local filenames front.png and back.png.',
  combinations:[...pairs.values()].map(pair=>({folder:pair.folder,procedures:pair.procedures,
    sourceEntries:pair.sourceEntries.map(row=>({variable:row.variable,id:row.id,procedures:row.procedures})),
    images:downloads.filter(item=>item.pair===pair).map(({pair:unused,...image})=>image)
  }))
};
await fs.writeFile(path.join(destination, 'MANIFEST.json'), JSON.stringify(manifest,null,2)+'\n');
const csvField = value => `"${String(value).replaceAll('"','""')}"`;
const rows = [['Carpeta','Procedimientos del sitio','Frente','Espalda','URL frente','URL espalda'],
  ...[...pairs.values()].map(pair=>[pair.folder,pair.procedures.join(' + ')||'Natural body',
    `${pair.folder}/front.png`,`${pair.folder}/back.png`,pair.front,pair.back])];
await fs.writeFile(path.join(destination, 'COMBINACIONES.csv'), '\uFEFF'+rows.map(row=>row.map(csvField).join(',')).join('\r\n')+'\r\n');
await fs.writeFile(path.join(destination,'LEEME.txt'),
  `A&E — imágenes originales de Try your Combo\n\nFuente: https://aeplasticsurgerymiami.com/\n\n${pairs.size} pares de imágenes, ${downloads.length} PNG originales.\n\nCada carpeta contiene front.png (frente) y back.png (espalda). Los archivos conservan sus bytes originales, resolución y transparencia.\n\nCOMBINACIONES.csv relaciona cada carpeta con los procedimientos y enlaces originales. MANIFEST.json añade nombres originales, dimensiones y hashes SHA-256.\n\nSe mantuvieron las asociaciones de procedimientos del sitio, incluso cuando varias entradas comparten imágenes o nombres. Las entradas que usan exactamente el mismo par de imágenes se agrupan en una carpeta y se conservan en el manifiesto.\n`);
console.log(JSON.stringify({folder:destination,pairs:pairs.size,images:downloads.length,sourceEntries:source.length,totalBytes:downloads.reduce((sum,item)=>sum+item.bytes,0)}));
