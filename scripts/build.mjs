import {mkdir,copyFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const files=['index.html','styles.css','app.mjs','core.mjs','data.mjs','question-bank.mjs','audio-bank.mjs','media.mjs','audio-view.mjs','catalog-source.json','favicon.svg'];
const output=path.join(root,'dist');
await mkdir(output,{recursive:true});
await Promise.all(files.map(file=>copyFile(path.join(root,file),path.join(output,file))));
console.log(`Built ${files.length} static files in dist/`);
