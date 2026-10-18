import {clipUrls,validateMedia} from './media.mjs';
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const time = seconds => `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;

export function audioRoundMarkup(media) {
  const m = validateMedia(media), urls = clipUrls(m);
  return `<section class="audio-round" aria-label="جولة استماع">
    <div class="audio-badge">♫ <b>١٥ ثانية</b> · تعرّف عليها من الصوت</div>
    <p>المضيف يشغّل المقطع على شاشته، والفرق تسمع وتجاوب. ابدأ وقت الإجابة بعد الاستماع.</p>
    <button class="button button-outline full-width" data-action="answer-time">▶ ابدأ وقت الإجابة</button>
    <details class="host-audio"><summary>أدوات المضيف فقط · قد يظهر اسم الإجابة</summary>
      <p class="tiny-note">لا تعرض هذه اللوحة على الفرق: عنوان YouTube والصورة قد يكشفان الإجابة. أبقِ المشغّل مرئياً للمضيف.</p>
      <div id="clip-player"></div>
      <div class="audio-controls"><button class="button button-primary" data-action="play-clip">▶ شغّل / أعد ١٥ ثانية</button><button class="button button-quiet" data-action="stop-clip">■ إيقاف المقطع</button></div>
      <a href="${esc(urls.watch)}" target="_blank" rel="noopener noreferrer">فتح المصدر الرسمي عند بداية المقطع ↗</a>
      <p class="tiny-note">المقطع من ${time(m.startSeconds)} إلى ${time(m.endSeconds)}. الرابط الخارجي يبدأ عند التوقيت؛ أوقفه عند النهاية المحددة. اضغط التشغيل داخل المشغّل إذا لم يبدأ تلقائياً. إذا تعذّر التضمين أو ظهر إعلان، استخدم الرابط ثم ابدأ وقت الإجابة يدوياً.</p>
    </details>
  </section>`;
}

export function audioCreditsMarkup(media) {
  const m = validateMedia(media), {watch} = clipUrls(m);
  return `<div class="audio-credits"><b dir="auto">${esc(m.title)}</b><span dir="auto">${esc(m.artist)} · ${esc(m.channel)}</span><a href="${esc(watch)}" target="_blank" rel="noopener noreferrer">اسمع المصدر الرسمي ↗</a></div>`;
}

export function mountClip(container, media) {
  const frame = document.createElement('iframe');
  frame.src = clipUrls(media).embed;
  frame.title = 'مشغّل المقطع للمضيف';
  frame.allow = 'autoplay; encrypted-media; picture-in-picture';
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  frame.allowFullscreen = true;
  container.replaceChildren(frame);
}
