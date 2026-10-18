import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {CATEGORIES,QUESTIONS,EXCLUDED_GROUPS,REQUESTED_IDS} from '../data.mjs';
import {createGame,openQuestion,useHelper,revealAnswer,resolveQuestion,undoLast,isGame,validatePack} from '../core.mjs';

const ids=REQUESTED_IDS.slice(0,6);
const make=()=>createGame(ids,['Alpha','Bravo'],CATEGORIES,QUESTIONS,60,()=>0.5);
test('every playable category supplies two distinct questions per points tier',()=>{
 assert.equal(new Set(CATEGORIES.map(c=>c.id)).size,CATEGORIES.length);
 assert.equal(new Set(QUESTIONS.map(q=>q.id)).size,QUESTIONS.length);
 for(const c of CATEGORIES){assert.ok(!EXCLUDED_GROUPS.includes(c.group));const rows=QUESTIONS.filter(q=>q.categoryId===c.id);for(const p of [200,400,600])assert.ok(rows.filter(q=>q.points===p).length>=2,`${c.id}: ${p}`);for(const q of rows){assert.ok(q.question&&q.answer&&q.hint);assert.ok(!/undefined|TODO|placeholder/.test(q.question+q.answer));}}
 assert.ok(REQUESTED_IDS.every(id=>CATEGORIES.some(c=>c.id===id)));
});
test('removed groups and related country, football and music categories stay out of retained catalogue',async()=>{
 const data=JSON.parse(await readFile(new URL('../catalog-source.json',import.meta.url)));
 for(const c of data.retained){assert.ok(!EXCLUDED_GROUPS.includes(c.group),c.name);assert.ok(!/كروي|كروية|غناوي|أغاني|كويتي|قطري|أردني|بحرين|إماراتي|عماني/.test(c.name),c.name);assert.notEqual(c.name,'Live');}
});
test('game setup rejects invalid selections and creates exactly 36 distinct slots',()=>{
 assert.throws(()=>createGame(ids.slice(0,5),['A','B'],CATEGORIES,QUESTIONS));
 assert.throws(()=>createGame([ids[0],...ids.slice(0,5)],['A','B'],CATEGORIES,QUESTIONS));
 const g=make();assert.equal(g.deck.length,36);assert.equal(new Set(g.deck.map(q=>q.id)).size,36);assert.equal(new Set(g.deck.map(q=>q.slot)).size,36);assert.equal(g.deck.reduce((s,q)=>s+q.points,0),14400);assert.ok(isGame(g));
});
test('scoring requires reveal, helpers apply once, and double only benefits the active team',()=>{
 const g=make();openQuestion(g,g.deck[0].slot,1000);assert.throws(()=>resolveQuestion(g,0));useHelper(g,'double');assert.throws(()=>useHelper(g,'double'));useHelper(g,'time');assert.equal(g.active.deadline,91000);useHelper(g,'hint');assert.ok(g.active.hint);revealAnswer(g);assert.throws(()=>useHelper(g,'time'));resolveQuestion(g,0);assert.equal(g.teams[0].score,400);assert.equal(g.turn,1);
 openQuestion(g,g.deck[1].slot);useHelper(g,'double');revealAnswer(g);resolveQuestion(g,0);assert.equal(g.teams[0].score,600);assert.equal(g.teams[1].score,0);assert.throws(()=>openQuestion(g,g.deck[0].slot));
});
test('undo restores scoring and turn, including the final answer',()=>{
 const g=make();for(const q of g.deck){openQuestion(g,q.slot);revealAnswer(g);resolveQuestion(g,g.turn);}assert.ok(g.finished);assert.equal(g.teams[0].score+g.teams[1].score,14400);undoLast(g);assert.equal(g.finished,false);assert.equal(g.deck.filter(q=>q.resolved).length,35);assert.equal(g.turn,1);assert.equal(g.teams[0].score+g.teams[1].score,13800);
});
test('skip gives no score and a match survives JSON persistence',()=>{
 const g=make();openQuestion(g,g.deck[0].slot);revealAnswer(g);resolveQuestion(g,null);assert.equal(g.teams[0].score+g.teams[1].score,0);assert.equal(g.turn,1);const restored=JSON.parse(JSON.stringify(g));assert.ok(isGame(restored));openQuestion(restored,restored.deck[1].slot);assert.ok(isGame(restored));assert.ok(!isGame({version:1,deck:[]}));
});
test('question imports require full difficulty coverage and safe source URLs',()=>{
 const pack={version:1,categories:[{id:'example',name:'Example'}],questions:[200,200,400,400,600,600].map((points,i)=>({categoryId:'example',points,question:`Q${i}`,answer:`A${i}`}))};
 const valid=validatePack(pack);assert.equal(valid.questions.length,6);assert.equal(valid.categories[0].group,'فئاتي');assert.throws(()=>validatePack({...pack,questions:pack.questions.slice(0,5)}));assert.throws(()=>validatePack({...pack,questions:pack.questions.map(q=>({...q,source:'javascript:alert(1)'}))}));assert.throws(()=>validatePack({...pack,categories:[{id:'../bad',name:'Example'}]}));assert.throws(()=>validatePack({...pack,questions:pack.questions.map(q=>({...q,id:'same'}))}));
});
