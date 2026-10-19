import {readdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
const root=new URL('../',import.meta.url);
const files=(await readdir(new URL('tests/',root))).filter(name=>name.endsWith('.test.mjs')).sort();
for(const file of files){
  const result=spawnSync(process.execPath,[new URL(`tests/${file}`,root).pathname],{stdio:'inherit'});
  if(result.error)throw result.error;
  if(result.status!==0)process.exit(result.status||1);
}
