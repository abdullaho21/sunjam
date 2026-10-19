import {shuffle} from './core.mjs';

export function readHistory(value) {
  const categories=Object.create(null);
  if(value?.version===1&&value.categories&&typeof value.categories==='object') {
    for(const [id,entry] of Object.entries(value.categories).slice(0,200)) {
      if(!/^[a-z0-9][a-z0-9_-]{0,59}$/.test(id)||!Array.isArray(entry?.finished))continue;
      categories[id]={cycle:Number.isSafeInteger(entry.cycle)&&entry.cycle>=0?entry.cycle:0,
        finished:[...new Set(entry.finished.filter(x=>typeof x==='string'&&x.length<=200))].slice(0,5000),
        encountered:[...new Set((Array.isArray(entry.encountered)?entry.encountered:[]).filter(x=>typeof x==='string'&&x.length<=200))].slice(-5000)};
    }
  }
  return {version:1,categories};
}
function stateFor(history,id,bank) {
  const pool=bank.filter(q=>q.categoryId===id);
  const valid=new Set(pool.map(q=>q.id));
  const entry=history.categories[id]||{cycle:0,finished:[],encountered:[]};
  const finished=new Set(entry.finished.filter(id=>valid.has(id)));
  return {pool,entry,finished,complete:pool.length>0&&pool.every(q=>finished.has(q.id))};
}
export function categoryProgress(history,id,bank) {
  const s=stateFor(history,id,bank);
  return {finished:s.finished.size,total:s.pool.length,cycle:s.entry.cycle,complete:s.complete};
}
export function availableForTier(history,id,points,bank) {
  const s=stateFor(history,id,bank);
  return s.pool.filter(q=>q.points===points&&(s.complete||!s.finished.has(q.id))).length;
}
export function recordFinished(history,question) {
  const entry=history.categories[question.categoryId]||{cycle:0,finished:[],encountered:[]};
  if(!entry.finished.includes(question.id))entry.finished.push(question.id);
  history.categories[question.categoryId]=entry;
  return history;
}
export function drawForSlot(game,slot,bank,history,rng=Math.random) {
  if(game.active||game.finished)throw new Error('أكمل السؤال الحالي أولاً');
  const index=game.deck.findIndex(q=>q.slot===slot),old=game.deck[index];
  if(!old||old.resolved)throw new Error('هذا السؤال منتهٍ');
  // Undo is a score correction: it must keep the question whose answer was revealed.
  if(old.answerSeen)return old;
  const s=stateFor(history,old.categoryId,bank);
  if(s.complete){s.entry.cycle++;s.entry.finished=[];s.entry.encountered=[];s.finished.clear();history.categories[old.categoryId]=s.entry;}
  const usedHere=new Set(game.deck.filter(q=>q.resolved).map(q=>q.id));
  let candidates=s.pool.filter(q=>q.points===old.points&&!s.finished.has(q.id)&&!usedHere.has(q.id));
  if(!candidates.length)throw new Error(`أنهيت أسئلة ${old.points} الجديدة في هذه الفئة. أكمل المستويات الأخرى؛ تتجدد الفئة بعد إنهاء جميع أسئلتها.`);
  // Prefer questions never encountered this cycle, even across abandoned tiles or matches.
  const encountered=s.entry.encountered||[];
  const fresh=candidates.filter(q=>!encountered.includes(q.id));
  if(fresh.length)candidates=fresh;
  else {
    const different=candidates.filter(q=>q.id!==encountered.at(-1)&&(!old.encountered||q.id!==old.id));
    if(different.length)candidates=different;
  }
  const selected=shuffle(candidates,rng)[0];
  const next={...selected,slot:old.slot,categoryName:old.categoryName,resolved:false,winner:null,awarded:0,encountered:true};
  s.entry.encountered=[...(s.entry.encountered||[]).filter(id=>id!==selected.id),selected.id];
  history.categories[old.categoryId]=s.entry;
  game.deck[index]=next;return next;
}
export function abandonQuestion(game) {
  const a=game.active;
  if(!a)return false;
  if(a.revealed)return false;
  if(a.helpersBefore)game.teams[game.turn].helpers={...a.helpersBefore};
  game.active=null;
  return true;
}

// The cookie identifies this browser only. The growing question flags stay in localStorage,
// rather than overflowing the 4 KB cookie limit or being sent with every HTTP request.
export function browserHistory({doc=document,storage,cryptoAPI=crypto,secure=location.protocol==='https:'}={}) {
  if(!storage){try{storage=globalThis.localStorage;}catch{} }
  storage ||= {getItem:()=>null,setItem:()=>{}};
  const idKey='lamma.player.v1',cookieName='lamma_player';
  let id;
  try{id=doc.cookie.split(';').map(s=>s.trim()).find(s=>s.startsWith(cookieName+'='))?.slice(cookieName.length+1);}catch{}
  if(!/^[a-z0-9-]{16,80}$/i.test(id||'')){try{id=storage.getItem(idKey);}catch{}}
  if(!/^[a-z0-9-]{16,80}$/i.test(id||''))id=cryptoAPI.randomUUID();
  try{doc.cookie=`${cookieName}=${id}; Max-Age=31536000; Path=/; SameSite=Lax${secure?'; Secure':''}`;}catch{}
  try{storage.setItem(idKey,id);}catch{}
  const key=`lamma.question-history.v1.${id}`;
  let memory=readHistory(null);
  return {id,
    read(){try{const raw=storage.getItem(key);if(raw)memory=readHistory(JSON.parse(raw));}catch{}return readHistory(memory);},
    write(value){memory=readHistory(value);try{storage.setItem(key,JSON.stringify(memory));}catch{}},
  };
}
