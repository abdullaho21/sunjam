import test from 'node:test';
import assert from 'node:assert/strict';
import {setImmediate} from 'node:timers/promises';
import {mountClip,audioRoundMarkup} from '../audio-view.mjs';
import {QUESTIONS} from '../data.mjs';
const media=QUESTIONS.find(q=>q.type==='audio').media;
class Element {
 constructor(){this.children=[];this.attrs={};this.inert=false;this.classes=new Set();this.classList={add:c=>this.classes.add(c),remove:c=>this.classes.delete(c),toggle:(c,v)=>v?this.classes.add(c):this.classes.delete(c)};}
 append(...nodes){this.children.push(...nodes);}
 replaceChildren(...nodes){this.children=nodes;}
 setAttribute(k,v){this.attrs[k]=v;}
}
function environment(t){
 const doc=globalThis.document,win=globalThis.window;
 globalThis.document={createElement:()=>new Element()};globalThis.window={location:{origin:'https://example.test'}};
 t.after(()=>{globalThis.document=doc;globalThis.window=win;});
 return new Element();
}
test('the listening screen contains no source title, answer artwork, source link, or player before play',()=>{
 const html=audioRoundMarkup(media);
 assert.ok(html.includes('clip-curtain'));assert.ok(!html.includes('<iframe'));
 for(const secret of [media.videoId,media.title,media.artist])assert.ok(!html.includes(secret),secret);
 assert.ok(!html.includes('<img'));assert.ok(!html.includes('href='));
});
test('the curtain is installed before the API loads; player stays inert until explicitly shown',async t=>{
 const container=environment(t);let options;
 const session=mountClip(container,media,{loadAPI:async()=>({Player:class{constructor(target,o){options=o;}}})});
 assert.equal(container.children[0].inert,true);
 assert.equal(container.children[1].className,'clip-curtain');
 await setImmediate();assert.equal(options.host,'https://www.youtube-nocookie.com');
 assert.equal(options.playerVars.fs,0);assert.equal(options.playerVars.origin,'https://example.test');
 assert.equal(session.setVisible(true),true);assert.equal(container.children[0].inert,false);
 assert.equal(session.setVisible(false),false);assert.equal(container.children[0].inert,true);
 session.destroy();
});
test('end boundary uses video time, stops playback and destroys the owned player',async t=>{
 const container=environment(t);let options,callback,time=media.startSeconds,stopped=0,destroyed=0,loaded;
 t.mock.method(globalThis,'setInterval',fn=>{callback=fn;return 1;});t.mock.method(globalThis,'clearInterval',()=>{});
 const p={getCurrentTime:()=>time,stopVideo:()=>stopped++,destroy:()=>destroyed++,loadVideoById:v=>loaded=v};
 const status=[];
 const session=mountClip(container,media,{onStatus:s=>status.push(s),loadAPI:async()=>({Player:class{constructor(target,o){options=o;return p;}}})});
 await setImmediate();options.events.onReady({target:p});
 assert.deepEqual(loaded,{videoId:media.videoId,startSeconds:media.startSeconds,endSeconds:media.endSeconds});
 options.events.onStateChange({data:1});callback();assert.equal(stopped,0);
 time=media.endSeconds;callback();assert.equal(stopped,1);assert.match(status.at(-1),/انتهى المقطع/);
 session.destroy();session.destroy();assert.equal(destroyed,1);assert.equal(container.children.length,1);
});
test('closing during API loading cancels late playback, and blocked autoplay reports a usable fallback',async t=>{
 const container=environment(t);let ready,constructed=0;
 const promise=new Promise(resolve=>ready=resolve);
 const s=mountClip(container,media,{loadAPI:()=>promise});s.destroy();
 ready({Player:class{constructor(){constructed++;}}});await setImmediate();assert.equal(constructed,0);
 let options;const messages=[];
 const second=mountClip(container,media,{onStatus:s=>messages.push(s),loadAPI:async()=>({Player:class{constructor(n,o){options=o;}destroy(){}}})});
 await setImmediate();options.events.onAutoplayBlocked();assert.match(messages.at(-1),/منع التشغيل التلقائي/);
 options.events.onError();assert.match(messages.at(-1),/غير متاح/);second.destroy();
});
