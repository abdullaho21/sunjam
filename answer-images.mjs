import {ANSWER_IMAGES} from './answer-image-data.mjs';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function httpsUrl(value) {
  if(typeof value!=='string'||value.length>3000)throw new Error('رابط صورة الإجابة غير صالح.');
  const url=new URL(value);
  if(url.protocol!=='https:'||url.username||url.password)throw new Error('صور الإجابات ومصادرها تحتاج روابط HTTPS.');
  return url.href;
}
export function validateAnswerImages(value) {
  if(!Array.isArray(value)||value.length>4)throw new Error('أضف أربع صور للإجابة كحد أقصى.');
  return value.map(image=>{
    if(!image||typeof image.alt!=='string'||!image.alt.trim()||image.alt.length>400)
      throw new Error('أضف وصفاً نصياً لصورة الإجابة.');
    return {url:httpsUrl(image.url),source:httpsUrl(image.source),alt:image.alt.trim(),
      caption:typeof image.caption==='string'?image.caption.slice(0,400):'',
      credit:typeof image.credit==='string'?image.credit.slice(0,400):''};
  });
}
export function answerImagesFor(question) {
  try {
    if(question.answerImages!==undefined)return validateAnswerImages(question.answerImages);
    // Older saved seed matches get the newly curated images. Imported IDs are not trusted as seed identities.
    if(question.origin!=='imported'&&ANSWER_IMAGES[question.id])return validateAnswerImages(ANSWER_IMAGES[question.id]);
    if(question.type==='audio'&&/^[\w-]{11}$/.test(question.media?.videoId)) {
      return validateAnswerImages([{url:`https://i.ytimg.com/vi/${question.media.videoId}/hqdefault.jpg`,
        source:`https://www.youtube.com/watch?v=${question.media.videoId}`,
        alt:`غلاف ${question.media.title}`,caption:question.media.title,credit:question.media.channel}]);
    }
  }catch{}
  return [];
}
export function answerImagesMarkup(question,revealed=false) {
  if(!revealed)return '';
  const images=answerImagesFor(question);
  if(!images.length)return '';
  return `<div class="answer-images ${images.length===1?'single':''}" aria-label="صور الإجابة">${images.map(image=>`
    <figure class="answer-image">
      <img src="${esc(image.url)}" alt="${esc(image.alt)}" loading="lazy" decoding="async" referrerpolicy="no-referrer">
      <figcaption><span dir="auto">${esc(image.caption||image.alt)}</span><a href="${esc(image.source)}" target="_blank" rel="noopener noreferrer">مصدر الصورة ↗${image.credit?` · ${esc(image.credit)}`:''}</a></figcaption>
    </figure>`).join('')}</div>`;
}
