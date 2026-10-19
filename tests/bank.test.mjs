import test from 'node:test';
import assert from 'node:assert/strict';
import {CATEGORIES,QUESTIONS} from '../data.mjs';
import {EXTRA_BANKS} from '../question-expansion.mjs';
test('every one of 51 categories has tripled to 18 entries, six per tier',()=>{
 assert.equal(CATEGORIES.length,51);assert.equal(QUESTIONS.length,918);
 for(const c of CATEGORIES){const rows=QUESTIONS.filter(q=>q.categoryId===c.id);assert.equal(rows.length,18,c.id);for(const p of [200,400,600])assert.equal(rows.filter(q=>q.points===p).length,6,c.id+':'+p);}
 assert.equal(Object.keys(EXTRA_BANKS).length,48);
 for(const rows of Object.values(EXTRA_BANKS))assert.equal(rows.trim().split('\n').length,12);
 assert.ok(!QUESTIONS.some(q=>/غير معتمد|يحتاج تحقق|يحتاج تعديل|سؤال يحتاج/.test(q.question+q.answer+q.hint)));
});
test('Sciel’s old Sun/Moon giveaway has been replaced with a precise skill-mechanics question',()=>{
 const q=QUESTIONS.find(q=>q.id==='expedition-33-v2-6');assert.equal(q.points,600);
 assert.match(q.question,/Fortune/);assert.match(q.answer,/5 AP/);assert.match(q.answer,/لدور واحد/);
 assert.ok(!QUESTIONS.some(q=>q.categoryId==='expedition-33'&&/ما موردا البطاقات/.test(q.question)));
});
test('each music category contains 18 different recordings rather than repeated timestamps',()=>{
 for(const id of ['anime-op','anime-ed','song-recognition']){
  const rows=QUESTIONS.filter(q=>q.categoryId===id);assert.equal(new Set(rows.map(q=>q.media.videoId)).size,18);
  assert.equal(new Set(rows.map(q=>q.media.title.toLowerCase())).size,18);
 }
});
