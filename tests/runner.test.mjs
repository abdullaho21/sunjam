import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, copyFileSync, writeFileSync, readFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';

function runFixture(source) {
  const root=mkdtempSync(join(tmpdir(),'lamma test runner '));
  try {
    mkdirSync(join(root,'scripts'));
    mkdirSync(join(root,'tests'));
    copyFileSync(new URL('../scripts/test.mjs',import.meta.url),join(root,'scripts','test.mjs'));
    writeFileSync(join(root,'tests','fixture.test.mjs'),source);
    const result=spawnSync(process.execPath,[join(root,'scripts','test.mjs')],{encoding:'utf8'});
    assert.ifError(result.error);
    return {result, marker:result.status===0?readFileSync(join(root,'ran.txt'),'utf8'):null};
  } finally {
    rmSync(root,{recursive:true,force:true});
  }
}

test('the test runner executes projects whose path contains spaces',()=>{
  const {result,marker}=runFixture("import {writeFileSync} from 'node:fs'; writeFileSync(new URL('../ran.txt',import.meta.url),'ran');");
  assert.equal(result.status,0,result.stderr);
  assert.equal(marker,'ran');
});

test('the test runner preserves a failing test exit code',()=>{
  const {result}=runFixture('process.exit(7);');
  assert.equal(result.status,7,result.stderr);
});
