import {clipUrls,validateMedia} from './media.mjs';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function audioRoundMarkup(media) {
  validateMedia(media);
  return `<section class="audio-round" aria-label="جولة استماع">
    <div class="audio-badge">♫ <b>١٥ ثانية</b> · تعرّف عليها من الصوت</div>
    <p>شاشة سوداء أثناء الاستماع. الاسم والصورة بعد كشف الإجابة.</p>
    <div id="clip-player" class="clip-screen" aria-label="شاشة الاستماع السوداء"><div class="clip-curtain"><span aria-hidden="true">♫</span><p>جاهزين تسمعون؟</p></div></div>
    <p id="clip-status" class="tiny-note" role="status" aria-live="polite">اضغط التشغيل. وقت الإجابة متوقف حتى تبدأه.</p>
    <div class="audio-controls"><button class="button button-primary" data-action="play-clip">▶ شغّل / أعد ١٥ ثانية</button><button class="button button-quiet" data-action="stop-clip">■ إيقاف</button></div>
    <button class="button button-outline full-width" data-action="answer-time">▶ ابدأ وقت الإجابة</button>
    <details class="host-audio"><summary>إعدادات المضيف · إذا تعذّر التشغيل</summary>
      <p class="tiny-note">قد يمنع المتصفح التشغيل التلقائي. إظهار المشغّل يتيح ضغط زر YouTube أو التعامل مع إعلان؛ قد يكشف الصورة والعنوان، لذلك استخدمه بعيداً عن أنظار الفرق ثم أعد التغطية.</p>
      <button class="button button-quiet" data-action="toggle-clip-picture" aria-pressed="false">إظهار المشغّل للمضيف</button>
      <p class="tiny-note">روابط المصادر وأسماء الأغاني تظهر عند كشف الإجابة. قد يختلف توافر المقطع حسب البلد وإعدادات ناشره.</p>
    </details>
  </section>`;
}
export function audioCreditsMarkup(media) {
  const m=validateMedia(media),{watch}=clipUrls(m);
  return `<div class="audio-credits"><b dir="auto">${esc(m.title)}</b><span dir="auto">${esc(m.artist)} · ${esc(m.channel)}</span><a href="${esc(watch)}" target="_blank" rel="noopener noreferrer">اسمع المصدر الرسمي ↗</a></div>`;
}

let apiPromise;
function loadYouTubeAPI() {
  if(window.YT?.Player)return Promise.resolve(window.YT);
  if(apiPromise)return apiPromise;
  apiPromise=new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    let timeout;
    const previous=window.onYouTubeIframeAPIReady;
    const fail=()=>{clearTimeout(timeout);script.remove();apiPromise=null;reject(new Error('تعذّر الاتصال بمشغّل YouTube. أعد المحاولة أو استخدم المصدر بعد الكشف.'));};
    window.onYouTubeIframeAPIReady=()=>{clearTimeout(timeout);previous?.();resolve(window.YT);};
    script.src='https://www.youtube.com/iframe_api';script.onerror=fail;
    timeout=setTimeout(fail,12000);document.head.append(script);
  });
  return apiPromise;
}

// A single owned player. Destroy cancels late API loads as well as active playback.
export function mountClip(container,media,{onStatus=()=>{},loadAPI=loadYouTubeAPI}={}) {
  const m=validateMedia(media);
  let destroyed=false,player=null,poll=null,visible=false,finished=false;
  const picture=document.createElement('div');picture.className='clip-picture';picture.inert=true;picture.setAttribute('aria-hidden','true');
  const target=document.createElement('div');picture.append(target);
  const curtain=document.createElement('div');curtain.className='clip-curtain';curtain.innerHTML='<span aria-hidden="true">♫</span><p>اسمعوا… وش تعرفون؟</p>';
  container.classList.remove('show-clip-picture');container.replaceChildren(picture,curtain);
  const status=message=>{if(!destroyed)onStatus(message);};
  const finish=()=>{if(destroyed||finished)return;finished=true;clearInterval(poll);player?.stopVideo?.();status('انتهى المقطع. ابدأ وقت الإجابة عندما تكونون جاهزين.');};
  status('جارٍ تحميل المقطع…');
  Promise.resolve().then(loadAPI).then(YT=>{
    if(destroyed)return;
    player=new YT.Player(target,{
      host:'https://www.youtube-nocookie.com',width:'100%',height:'300',videoId:m.videoId,
      playerVars:{start:m.startSeconds,end:m.endSeconds,autoplay:1,playsinline:1,rel:0,fs:0,origin:window.location.origin},
      events:{
        onReady:({target:p})=>{if(destroyed){p.destroy();return;}p.loadVideoById({videoId:m.videoId,startSeconds:m.startSeconds,endSeconds:m.endSeconds});},
        onAutoplayBlocked:()=>status('المتصفح منع التشغيل التلقائي. افتح إعدادات المضيف لإظهار زر YouTube، ثم أعد تغطية المشغّل.'),
        onError:()=>{clearInterval(poll);status('هذا المقطع غير متاح للتضمين الآن. أعد المحاولة أو استخدم رابط المصدر بعد الكشف.');},
        onStateChange:({data})=>{
          if(destroyed||finished)return;
          clearInterval(poll);
          if(data===1){
            status('المقطع يعمل · ١٥ ثانية.');
            poll=setInterval(()=>{if(player?.getCurrentTime?.()>=m.endSeconds)finish();},200);
          }else if(data===0)finish();
          else if(data===2)status('المقطع متوقف مؤقتاً. اضغط التشغيل للإعادة.');
        }
      }
    });
  }).catch(error=>status(error.message));
  return {
    setVisible(show){visible=!!show;container.classList.toggle('show-clip-picture',visible);picture.inert=!visible;picture.setAttribute('aria-hidden',String(!visible));return visible;},
    get visible(){return visible;},
    destroy(){if(destroyed)return;destroyed=true;clearInterval(poll);player?.destroy?.();container.classList.remove('show-clip-picture');container.replaceChildren(curtain);curtain.innerHTML='<span aria-hidden="true">♫</span><p>المقطع متوقف</p>';}
  };
}
