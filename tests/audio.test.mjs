import test from 'node:test';
import assert from 'node:assert/strict';
import {CATEGORIES,QUESTIONS} from '../data.mjs';
import {AUDIO_CATEGORY_IDS,clipUrls,validateMedia} from '../media.mjs';
import {audioRoundMarkup,audioCreditsMarkup} from '../audio-view.mjs';
import {createGame,openQuestion,isGame,validatePack,revealAnswer,resolveQuestion,undoLast} from '../core.mjs';
const music=QUESTIONS.filter(q=>AUDIO_CATEGORY_IDS.includes(q.categoryId));
const pack={version:1,categories:CATEGORIES,questions:QUESTIONS};

test('all music rounds have real media, 15-second bounds and explicit difficulty coverage',()=>{
 assert.equal(music.length,54);
 assert.equal(QUESTIONS.length,918);
 for(const id of AUDIO_CATEGORY_IDS){
   const rows=music.filter(q=>q.categoryId===id);
   assert.equal(rows.length,18);
   for(const points of [200,400,600])assert.equal(rows.filter(q=>q.points===points).length,6);
   for(const q of rows){assert.equal(q.type,'audio');assert.equal(q.media.endSeconds-q.media.startSeconds,15);assert.ok(q.media.channel);}
 }
 assert.match(music.find(q=>q.categoryId==='anime-op'&&q.points===200).answer,/Demon Slayer/);
 assert.ok(!music.some(q=>/Blue Bird/i.test(q.media.title)));
});
test('media validation rejects untrusted IDs, injected titles are escaped, and end time is absolute',()=>{
 const m=music[0].media;
 const urls=clipUrls(m),url=new URL(urls.embed);
 assert.equal(url.hostname,'www.youtube-nocookie.com');
 assert.equal(Number(url.searchParams.get('end')),m.startSeconds+15);
 for(const change of [{videoId:'../bad'},{videoId:'x" onload="x'},{startSeconds:-1},{endSeconds:m.startSeconds+14},{startSeconds:'0'},{provider:'custom'},{title:''}])assert.throws(()=>validateMedia({...m,...change}));
 assert.ok(!audioCreditsMarkup({...m,title:'<img src=x onerror=alert(1)>'}).includes('<img'));
 const html=audioRoundMarkup(m);
 assert.ok(!html.includes('<iframe'));
 assert.ok(!html.includes(m.title));
 assert.ok(html.includes('<details class="host-audio">'));
});
test('audio survives full-bank export/import, match persistence, reveal, scoring and undo',()=>{
 const imported=validatePack(JSON.parse(JSON.stringify(pack)));
 assert.deepEqual(imported.questions.find(q=>q.type==='audio').media,music[0].media);
 const g=createGame(['anime-op','anime-ed','song-recognition','rdr2','expedition-33','witcher-3'],['A','B'],CATEGORIES,QUESTIONS);
 const q=g.deck.find(q=>q.type==='audio');openQuestion(g,q.slot,1000);
 assert.equal(g.active.paused,true);assert.equal(g.active.remaining,60);
 const restored=JSON.parse(JSON.stringify(g));assert.ok(isGame(restored));
 revealAnswer(restored);resolveQuestion(restored,0);assert.equal(restored.teams[0].score,q.points);
 undoLast(restored);assert.equal(restored.teams[0].score,0);
 restored.deck.find(q=>q.type==='audio').media.videoId='invalid';assert.equal(isGame(restored),false);
});
test('text-only imports cannot reintroduce text music rounds; legacy storage can still be read',()=>{
 const categories=CATEGORIES.filter(c=>c.id==='anime-op');
 const questions=music.filter(q=>q.categoryId==='anime-op').map(({media,...q})=>({...q,type:'text'}));
 assert.throws(()=>validatePack({version:1,categories,questions}));
 assert.equal(validatePack({version:1,categories,questions},{allowLegacyAudioText:true}).questions.length,18);
 assert.throws(()=>validatePack({...pack,questions:QUESTIONS.map(q=>q.type==='audio'?{...q,media:{...q.media,endSeconds:0}}:q)}));
});
test('all seed rows are unique within a category, and reverse clues actually reverse the answer',()=>{
 const seen=new Set();
 for(const q of QUESTIONS.filter(q=>q.type!=='audio')){
  const key=q.categoryId+'|'+q.question;assert.ok(!seen.has(key),key);seen.add(key);
  assert.ok(!/السؤال يصحح|لا يُستخدم هذا السطر|هل تعتمد المعارك/.test(q.question+q.answer+q.hint));
  if(q.categoryId==='reverse')assert.equal(q.question.split(': ')[1],[...q.answer].reverse().join(''));
 }
});

test('different clips sharing one listening prompt have distinct import identities',async()=>{
 const {questionKey}=await import('../core.mjs');
 const samePrompt=music.filter(q=>q.categoryId==='anime-op');
 assert.equal(new Set(samePrompt.map(questionKey)).size,18);
 assert.equal(questionKey({...samePrompt[0],id:'another-id'}),questionKey(samePrompt[0]));
 assert.notEqual(questionKey({...samePrompt[0],media:{...samePrompt[0].media,startSeconds:60,endSeconds:75}}),questionKey(samePrompt[0]));
});
