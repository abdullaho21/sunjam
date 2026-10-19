import {validateAnswerImages} from './answer-images.mjs';
import {AUDIO_CATEGORY_IDS,validateMedia,clipUrls} from './media.mjs';
export const POINTS = [200, 200, 400, 400, 600, 600];
export const STORAGE_KEY = 'lamma.game.v1';
export const CUSTOM_KEY = 'lamma.custom.v1';
export function normalize(value) { return String(value).normalize('NFKC').replace(/[\u064B-\u065F\u0670\u0640]/g, '').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').trim().toLowerCase(); }
export function questionKey(q) {
  return q.type==='audio'
    ? `${q.categoryId}|audio|${q.media.videoId}|${q.media.startSeconds}|${q.media.endSeconds}`
    : normalize(`${q.categoryId}|${q.question}`);
}
export function shuffle(items, rng = Math.random) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; }
  return copy;
}
export function createGame(ids, names, categories, questionBank, seconds = 60, rng = Math.random) {
  if (ids.length !== 6 || new Set(ids).size !== 6) throw new Error('اختر ٦ فئات مختلفة');
  if (!Array.isArray(names) || names.length !== 2 || names.some(n => !String(n).trim())) throw new Error('أدخل اسمي الفريقين');
  const deck = [];
  for (const id of ids) {
    const category = categories.find(c => c.id === id);
    if (!category) throw new Error('فئة غير موجودة');
    const pool = questionBank.filter(q => q.categoryId === id);
    const chosen = [];
    for (const points of [200,400,600]) {
      const matching = shuffle(pool.filter(q => q.points === points), rng).slice(0,2);
      if (matching.length !== 2) throw new Error(`فئة ${category.name} تحتاج سؤالين لكل مستوى`);
      chosen.push(...matching);
    }
    chosen.forEach((q,i) => deck.push({...q,slot:`${id}:${i}`,resolved:false,winner:null,awarded:0}));
  }
  return {version:1,contentRevision:3,id:`game-${Date.now()}`,createdAt:new Date().toISOString(),categoryIds:[...ids],teams:names.map(name => ({name:String(name).trim().slice(0,30),score:0,helpers:{hint:false,time:false,double:false}})),turn:0,seconds:[30,60,90].includes(Number(seconds))?Number(seconds):60,deck,active:null,history:[],finished:false};
}
export function openQuestion(game, slot, now=Date.now()) {
  if(game.active || game.finished) throw new Error('أكمل السؤال الحالي أولاً');
  const q=game.deck.find(q=>q.slot===slot);
  if(!q || q.resolved) throw new Error('هذا السؤال منتهٍ');
  game.active={slot,deadline:now+game.seconds*1000,remaining:game.seconds,paused:q.type==='audio',revealed:false,hint:false,multiplier:1,helpersBefore:{...game.teams[game.turn].helpers}};
  return game;
}
export function useHelper(game, kind) {
  if(!game.active || game.active.revealed || !Object.hasOwn(game.teams[game.turn].helpers,kind)) throw new Error('المساعدة غير متاحة');
  if(game.teams[game.turn].helpers[kind]) throw new Error('استُخدمت هذه المساعدة');
  game.teams[game.turn].helpers[kind]=true;
  if(kind==='hint') game.active.hint=true;
  if(kind==='time') {game.active.deadline+=30000;game.active.remaining+=30;}
  if(kind==='double') game.active.multiplier=2;
  return game;
}
export function revealAnswer(game) { if(!game.active) throw new Error('لا يوجد سؤال');game.active.revealed=true;game.deck.find(q=>q.slot===game.active.slot).answerSeen=true;return game; }
export function resolveQuestion(game, winner) {
  if(!game.active?.revealed || ![0,1,null].includes(winner)) throw new Error('اكشف الإجابة قبل تسجيل النتيجة');
  const q=game.deck.find(q=>q.slot===game.active.slot);
  if(!q || q.resolved) throw new Error('هذا السؤال منتهٍ');
  game.history.push({slot:q.slot,turn:game.turn,teams:structuredClone(game.teams)});
  q.resolved=true;q.winner=winner;
  q.awarded=winner===null?0:q.points*(winner===game.turn?game.active.multiplier:1);
  if(winner!==null) game.teams[winner].score+=q.awarded;
  game.turn=1-game.turn;game.active=null;
  game.finished=game.deck.every(q=>q.resolved);
  return game;
}
export function undoLast(game) {
  if(game.active) throw new Error('أكمل السؤال الحالي قبل التراجع');
  const previous=game.history.pop(); if(!previous) throw new Error('لا توجد نتيجة للتراجع عنها');
  const q=game.deck.find(q=>q.slot===previous.slot);
  q.resolved=false;q.winner=null;q.awarded=0;
  game.turn=previous.turn;game.teams=previous.teams;game.finished=false;return game;
}
export function isGame(value) {
  if (Array.isArray(value?.deck)) {
    try { for (const q of value.deck) {if(q.type==='audio'||q.media)validateMedia(q.media);if(q.answerImages!==undefined)validateAnswerImages(q.answerImages);} }
    catch { return false; }
  }
  return value?.version===1 && Array.isArray(value.categoryIds) && value.categoryIds.length===6 && Array.isArray(value.teams) && value.teams.length===2 && value.teams.every(t=>typeof t.name==='string'&&Number.isFinite(t.score)&&t.helpers&&['hint','time','double'].every(k=>typeof t.helpers[k]==='boolean')) && [0,1].includes(value.turn) && [30,60,90].includes(value.seconds) && Array.isArray(value.deck) && value.deck.length===36 && value.deck.every(q=>typeof q.slot==='string'&&typeof q.question==='string'&&typeof q.answer==='string'&&[200,400,600].includes(q.points)&&typeof q.resolved==='boolean') && Array.isArray(value.history) && (!value.active || (typeof value.active.slot==='string'&&Number.isFinite(value.active.deadline)&&Number.isFinite(value.active.remaining)&&[1,2].includes(value.active.multiplier)));
}
export function validatePack(raw, {allowLegacyAudioText=false}={}) {
  if(!raw || raw.version!==1 || !Array.isArray(raw.categories) || !Array.isArray(raw.questions)) throw new Error('الملف يحتاج version: 1 و categories و questions');
  if(raw.categories.length>200 || raw.questions.length>5000) throw new Error('الحد الأقصى ٢٠٠ فئة و٥٠٠٠ سؤال في الملف');
  const ids=new Set();
  const categories=raw.categories.map(c=>{
    if(!c || !/^[a-z0-9][a-z0-9_-]{0,59}$/.test(c.id) || typeof c.name!=='string'||!c.name.trim()||c.name.length>60||ids.has(c.id)) throw new Error('معرّف الفئة غير صالح أو مكرر');
    ids.add(c.id);return {id:c.id,name:c.name.trim(),group:typeof c.group==='string'?c.group.slice(0,40):'فئاتي',icon:'✦',tone:'lavender',custom:true};
  });
  const qids=new Set();
  const questions=raw.questions.map((q,i)=>{
    if(!q || !ids.has(q.categoryId)||typeof q.question!=='string'||!q.question.trim()||q.question.length>800||typeof q.answer!=='string'||!q.answer.trim()||q.answer.length>400||![200,400,600].includes(q.points)) throw new Error(`السؤال ${i+1} غير صالح: تحقق من الفئة والنص والإجابة والنقاط`);
    const id=typeof q.id==='string'?q.id:`${q.categoryId}-import-${i}`;
    if(qids.has(id)) throw new Error('معرّفات الأسئلة مكررة');qids.add(id);
    let source='';
    if(q.source){try{const url=new URL(q.source);if(url.protocol!=='https:') throw new Error();source=url.href;}catch{throw new Error(`رابط المصدر في السؤال ${i+1} يجب أن يبدأ بـ https://`);}}
    const type=q.type ?? (q.media?'audio':'text');
    if(!['text','audio'].includes(type)) throw new Error(`نوع السؤال ${i+1} غير مدعوم`);
    if(!allowLegacyAudioText && AUDIO_CATEGORY_IDS.includes(q.categoryId) && type!=='audio')
      throw new Error('فئات OP وED والأغاني تحتاج مقاطع استماع، وليست أسئلة نصية.');
    const media=type==='audio'?validateMedia(q.media):undefined;
    const answerImages=q.answerImages===undefined?undefined:validateAnswerImages(q.answerImages);
    return {id,categoryId:q.categoryId,question:q.question.trim(),answer:q.answer.trim(),points:q.points,hint:typeof q.hint==='string'?q.hint.slice(0,300):'لا يوجد تلميح لهذا السؤال.',source:media?clipUrls(media).watch:source,origin:'imported',type,...(media?{media}:{}),...(answerImages?{answerImages}:{})};
  });
  if(!categories.length) throw new Error('أضف فئة واحدة على الأقل');
  for(const c of categories) for(const p of [200,400,600]) if(questions.filter(q=>q.categoryId===c.id&&q.points===p).length<2) throw new Error(`${c.name}: أضف سؤالين على الأقل لكل مستوى (٢٠٠، ٤٠٠، ٦٠٠)`);
  return {version:1,categories,questions};
}
