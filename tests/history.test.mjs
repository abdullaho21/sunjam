import test from 'node:test';
import assert from 'node:assert/strict';
import {CATEGORIES,QUESTIONS} from '../data.mjs';
import {createGame,openQuestion,revealAnswer,resolveQuestion,undoLast,useHelper} from '../core.mjs';
import {readHistory,drawForSlot,recordFinished,abandonQuestion,categoryProgress,availableForTier,browserHistory} from '../question-history.mjs';
const ids=['rdr2','expedition-33','witcher-3','anime-op','anime-ed','song-recognition'];
const make=()=>createGame(ids,['A','B'],CATEGORIES,QUESTIONS);
const answer=(g,q,h)=>{openQuestion(g,q.slot);revealAnswer(g);resolveQuestion(g,null);recordFinished(h,q);};

test('three matches finish all 18 questions in every selected category without repeating',()=>{
 const history=readHistory(null),seen=new Set();
 for(let match=0;match<3;match++){
  const g=make();
  for(const tile of [...g.deck]){
   const q=drawForSlot(g,tile.slot,QUESTIONS,history);
   assert.ok(!seen.has(q.id),q.id);seen.add(q.id);answer(g,q,history);
  }
 }
 assert.equal(seen.size,108);
 for(const id of ids)assert.deepEqual(categoryProgress(history,id,QUESTIONS),{finished:18,total:18,cycle:0,complete:true});
 const g=make(),q=drawForSlot(g,'rdr2:0',QUESTIONS,history);
 assert.ok(seen.has(q.id));assert.equal(categoryProgress(history,'rdr2',QUESTIONS).cycle,1);
 assert.equal(categoryProgress(history,'rdr2',QUESTIONS).finished,0);
 assert.equal(categoryProgress(history,'expedition-33',QUESTIONS).finished,18);
});
test('finished tier waits for the whole category rather than repeating early',()=>{
 const history=readHistory(null);
 for(const q of QUESTIONS.filter(q=>q.categoryId==='rdr2'&&q.points===200))recordFinished(history,q);
 assert.equal(availableForTier(history,'rdr2',200,QUESTIONS),0);
 const g=make();assert.throws(()=>drawForSlot(g,'rdr2:0',QUESTIONS,history),/أكمل المستويات الأخرى/);
 assert.equal(drawForSlot(g,'rdr2:2',QUESTIONS,history).points,400);
});
test('abandoning leaves history untouched, refunds this question’s helpers and redraws a different question',()=>{
 const g=make(),history=readHistory(null);
 const first=drawForSlot(g,'expedition-33:0',QUESTIONS,history,()=>0.5);
 openQuestion(g,first.slot);useHelper(g,'hint');useHelper(g,'double');useHelper(g,'time');
 assert.equal(abandonQuestion(g),true);assert.equal(g.active,null);
 assert.deepEqual(g.teams[0].helpers,{hint:false,time:false,double:false});
 const other=drawForSlot(g,'rdr2:0',QUESTIONS,history);openQuestion(g,other.slot);abandonQuestion(g);
 const next=drawForSlot(g,first.slot,QUESTIONS,history,()=>0.5);
 assert.notEqual(next.id,first.id);assert.equal(next.points,200);
 assert.equal(categoryProgress(history,'expedition-33',QUESTIONS).finished,0);
});
test('reveal cannot be abandoned; undo keeps the revealed question for score correction',()=>{
 const g=make(),h=readHistory(null),q=drawForSlot(g,'rdr2:0',QUESTIONS,h);
 openQuestion(g,q.slot);revealAnswer(g);assert.equal(abandonQuestion(g),false);
 assert.throws(()=>drawForSlot(g,'rdr2:1',QUESTIONS,h));
 resolveQuestion(g,0);recordFinished(h,q);undoLast(g);
 assert.equal(drawForSlot(g,q.slot,QUESTIONS,h).id,q.id);
});
test('history is idempotent, ignores removed questions and includes newly added ones',()=>{
 const h=readHistory(null),pool=QUESTIONS.filter(q=>q.categoryId==='rdr2');
 for(const q of pool){recordFinished(h,q);recordFinished(h,q);}
 assert.equal(h.categories.rdr2.finished.length,18);
 const bank=[...QUESTIONS,{...pool[0],id:'rdr2-future',question:'New question'}];
 assert.equal(categoryProgress(h,'rdr2',bank).complete,false);
 const g=make();assert.equal(drawForSlot(g,'rdr2:0',bank,h).id,'rdr2-future');
});
test('cookie identifies one browser and persistent flags survive a new session',()=>{
 const values=new Map(),storage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)};
 let cookie='';const doc={get cookie(){return cookie;},set cookie(value){cookie=value.split(';')[0];}};
 const args={doc,storage,cryptoAPI:{randomUUID:()=> '12345678-1234-4567-8901-123456789012'},secure:true};
 const a=browserHistory(args),h=a.read();recordFinished(h,QUESTIONS[0]);a.write(h);
 assert.ok(cookie.startsWith('lamma_player='));
 const b=browserHistory(args);assert.equal(a.id,b.id);assert.deepEqual(b.read(),h);
 assert.ok(!cookie.includes(QUESTIONS[0].id));
});
test('blocked storage still works in memory without breaking a match',()=>{
 const fail=()=>{throw new Error('blocked');};
 const history=browserHistory({doc:{get cookie(){return '';},set cookie(v){fail();}},storage:{getItem:fail,setItem:fail},cryptoAPI:{randomUUID:()=> '12345678-1234-4567-8901-123456789012'},secure:false});
 const h=history.read();recordFinished(h,QUESTIONS[0]);history.write(h);
 assert.equal(history.read().categories[QUESTIONS[0].categoryId].finished.length,1);
});
test('only one unseen question left is retained instead of repeating a finished one',()=>{
 const h=readHistory(null),pool=QUESTIONS.filter(q=>q.categoryId==='rdr2'&&q.points===200);
 for(const q of pool.slice(1))recordFinished(h,q);
 const g=make(),q=drawForSlot(g,'rdr2:0',QUESTIONS,h);openQuestion(g,q.slot);abandonQuestion(g);
 assert.equal(drawForSlot(g,q.slot,QUESTIONS,h).id,q.id);
});

test('unanswered draws rotate across different tiles and matches, not only within one tile',()=>{
 const h=readHistory(null),seen=new Set();
 for(let i=0;i<6;i++){const g=make();const q=drawForSlot(g,`rdr2:${i%2}`,QUESTIONS,h);assert.ok(!seen.has(q.id));seen.add(q.id);openQuestion(g,q.slot);abandonQuestion(g);}
 assert.equal(categoryProgress(h,'rdr2',QUESTIONS).finished,0);
 const g=make();const last=h.categories.rdr2.encountered.at(-1);assert.notEqual(drawForSlot(g,'rdr2:0',QUESTIONS,h).id,last);
});
