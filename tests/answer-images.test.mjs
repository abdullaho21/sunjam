import test from 'node:test';
import assert from 'node:assert/strict';
import {QUESTIONS,CATEGORIES} from '../data.mjs';
import {answerImagesFor,answerImagesMarkup,validateAnswerImages} from '../answer-images.mjs';
import {createGame,openQuestion,revealAnswer,isGame,validatePack} from '../core.mjs';
const gustave=QUESTIONS.find(q=>q.id==='expedition-33-v2-1');

test('answer pictures are absent before reveal and include accessible images and sources after reveal',()=>{
 assert.equal(answerImagesMarkup(gustave),'');
 assert.equal(answerImagesMarkup(gustave,false),'');
 const html=answerImagesMarkup(gustave,true);
 assert.match(html,/<img /);assert.match(html,/Gustave/);assert.match(html,/مصدر الصورة/);
 assert.ok(html.includes('loading="lazy"'));
 assert.ok(html.includes('https://www.expedition33.com/overview/characters'));
 assert.equal(answerImagesMarkup({id:'unknown',origin:'imported'},true),'');
});
test('curated coverage includes every music round and the main requested game portraits',()=>{
 const illustrated=QUESTIONS.filter(q=>answerImagesFor(q).length);
 assert.ok(illustrated.length>=130);
 for(const q of QUESTIONS.filter(q=>q.type==='audio'))assert.ok(answerImagesFor(q).length,q.id);
 assert.match(answerImagesFor(gustave)[0].url,/Gustave/);
 assert.match(answerImagesFor(QUESTIONS.find(q=>q.id==='rdr2-v2-1'))[0].url,/ArthurMorgan/);
 assert.match(answerImagesFor(QUESTIONS.find(q=>q.id==='minecraft-v2-1'))[0].url,/minecraft\.wiki/);
});
test('image metadata survives full bank import, game persistence and legacy seed matches',()=>{
 const pack=validatePack(JSON.parse(JSON.stringify({version:1,categories:CATEGORIES,questions:QUESTIONS})));
 assert.deepEqual(pack.questions.find(q=>q.id===gustave.id).answerImages,gustave.answerImages);
 const g=createGame(['anime-op','anime-ed','rdr2','expedition-33','witcher-3','baldurs-gate-3'],['A','B'],CATEGORIES,QUESTIONS);
 const q=g.deck.find(q=>q.id===gustave.id);openQuestion(g,q.slot);revealAnswer(g);
 const restored=JSON.parse(JSON.stringify(g));assert.ok(isGame(restored));
 assert.deepEqual(answerImagesFor(restored.deck.find(q=>q.id===gustave.id)),gustave.answerImages);
 const {answerImages,...legacy}=gustave;assert.deepEqual(answerImagesFor(legacy),answerImages);
 assert.equal(answerImagesFor({...legacy,origin:'imported'}).length,0);
});
test('image validation rejects executable URLs, credentials and unsafe source schemes; captions are escaped',()=>{
 const image=gustave.answerImages[0];
 for(const change of [{url:'javascript:alert(1)'},{url:'data:image/svg+xml,<svg/>'},{url:'https://user:password@example.com/image.jpg'},{source:'http://example.com'},{alt:''}])assert.throws(()=>validateAnswerImages([{...image,...change}]));
 assert.throws(()=>validateAnswerImages(Array(5).fill(image)));
 const html=answerImagesMarkup({answerImages:[{...image,caption:'<script>alert(1)</script>',alt:'" onerror="bad'}]},true);
 assert.ok(!html.includes('<script>'));assert.ok(!html.includes('alt="" onerror='));
 const pack={version:1,categories:CATEGORIES,questions:QUESTIONS.map(q=>q.id===gustave.id?{...q,answerImages:[{...image,url:'javascript:alert(1)'}]}:q)};
 assert.throws(()=>validatePack(pack));
});
