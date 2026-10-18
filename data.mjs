import {BANKS} from './question-bank.mjs';
import {AUDIO_BANKS} from './audio-bank.mjs';
import {validateMedia,clipUrls} from './media.mjs';

export const CONTENT_REVISION = 2;
export const CATEGORIES = [];
export const QUESTIONS = [];
const palette={أنمي:['lavender','✦'],ألعاب:['mint','⌘'],عام:['peach','◎'],دول:['sky','◉'],إسلامي:['mint','☾'],السعودية:['sand','✧'],تفكير:['yellow','?'],'فن أجنبي':['rose','▷'],رياضة:['sky','◈'],حروف:['peach','أ'],بباي:['yellow','★']};
function add(id,name,group,description,rows,{icon,tone,featured=false}={}) {
  const style=palette[group]||['lavender','✦'];
  CATEGORIES.push({id,name,group,description,icon:icon||style[1],tone:tone||style[0],featured});
  if (!rows) throw new Error(`Missing question bank: ${id}`);
  for (const [index,line] of rows.trim().split('\n').filter(Boolean).entries()) {
    const [points,question,answer,hint,...extra]=line.split('|');
    if (extra.length || ![200,400,600].includes(Number(points)) || !question || !answer || !hint)
      throw new Error(`Invalid question row: ${id}:${index+1}`);
    QUESTIONS.push({id:`${id}-v2-${index+1}`,categoryId:id,points:Number(points),question,answer,hint,type:'text',source:'',origin:'original'});
  }
}

add('rdr2','Red Dead Redemption 2','ألعاب','آرثر، العصابة، والعالم المفتوح. من أحداث البداية وتفاصيل العالم.', BANKS["rdr2"],{featured:true,icon:'RDR',tone:'peach'});
add('expedition-33','Expedition 33','ألعاب','أعضاء البعثة، أنظمة القتال، وتفاصيل تطوير الشخصيات.', BANKS["expedition-33"],{featured:true,icon:'33',tone:'sky'});
add('roguelites','Roguelites · روجلايت','ألعاب','محاولة جديدة، بناء جديد: Hades وDead Cells وSlay the Spire وغيرها.', BANKS["roguelites"],{featured:true,icon:'↻',tone:'yellow'});
add('witcher-3','The Witcher 3','ألعاب','جيرالت، العلامات، والعقود. تفاصيل من اللعبة وإضافاتها.', BANKS["witcher-3"],{featured:true,icon:'W3',tone:'mint'});
add('baldurs-gate-3',"Baldur’s Gate 3",'ألعاب','الرفاق، النرد، وفصول المغامرة. تفاصيل من المغامرة والمهام الجانبية.', BANKS["baldurs-gate-3"],{featured:true,icon:'D20',tone:'lavender'});
add('romance-anime','أنمي رومانسي','أنمي','قصص وشخصيات من أنمي رومانسي. لا توجد أعمال مصنفة إيتشي في هذه المجموعة.', BANKS["romance-anime"],{featured:true,icon:'♡',tone:'rose'});
add('metroidvania','Metroidvania','ألعاب','خرائط مترابطة وقدرات تفتح مسارات جديدة. Hollow Knight وMetroid وCastlevania.', BANKS["metroidvania"],{featured:true,icon:'⌖',tone:'sky'});
add('jrpg','JRPG','ألعاب','من فاينل فانتسي إلى بيرسونا وكرونو تريغر.', BANKS["jrpg"],{featured:true,icon:'XP',tone:'sand'});
add('linear-fps','Linear FPS','ألعاب','حملات تصويب من منظور أول: Half-Life وBioShock وTitanfall 2 وغيرها.', BANKS["linear-fps"],{featured:true,icon:'⊕',tone:'mint'});
add('character-action','Character Action','ألعاب','كومبوهات وأسلحة وأساليب قتال: DMC وBayonetta وMetal Gear Rising.', BANKS["character-action"],{featured:true,icon:'S+',tone:'rose'});
add('anime','أنمي','أنمي','عوالم وشخصيات يعرفها كل محب للأنمي.', BANKS["anime"]);
add('naruto','Naruto','أنمي','قرية الورق والفرق وتقنيات النينجا.', BANKS["naruto"]);
add('one-piece','One Piece','أنمي','قراصنة قبعة القش، أحلامهم وعالمهم.', BANKS["one-piece"]);
add('attack-on-titan','Attack on Titan','أنمي','الفيلق والأسوار وتفاصيل من القصة والأعمال الجانبية.', BANKS["attack-on-titan"]);
add('hunter','Hunter × Hunter','أنمي','غون وكيلوا والنين وامتحان الصيادين.', BANKS["hunter"]);
add('bleach','Bleach','أنمي','إيتشيغو، الزانباكتو وعالم الأرواح.', BANKS["bleach"]);
add('demon-slayer','Demon Slayer','أنمي','تانجيرو وفيلق قاتلي الشياطين.', BANKS["demon-slayer"]);
add('dragon-ball','Dragon Ball','أنمي','السايان وكرات التنين والتقنيات المعروفة.', BANKS["dragon-ball"]);
add('pokemon','Pokémon','أنمي','البوكيمونات والمدربون والتطورات.', BANKS["pokemon"]);
add('games','Video Games','ألعاب','تاريخ الألعاب وشخصياتها وعوالمها.', BANKS["games"]);
add('elden-ring','Elden Ring','ألعاب','الأراضي الوسطى والشخصيات والمواقع المعروفة.', BANKS["elden-ring"]);
add('minecraft','Minecraft','ألعاب','مكعبات ووحوش ووصفات يعرفها المنقّبون.', BANKS["minecraft"]);
add('resident-evil','Resident Evil','ألعاب','راكون سيتي، الشخصيات، وعناوين السلسلة.', BANKS["resident-evil"]);
add('valorant','Valorant','ألعاب','عملاء وقدرات وأسلحة في فالورانت.', BANKS["valorant"]);
add('general','معلومات عامة','عام','من كل بحر قطرة. للفريق اللي يعرف شيئاً عن كل شيء.', BANKS["general"]);
add('technology','تكنولوجيا','عام','اختراعات وحواسيب ولغة العالم الرقمي.', BANKS["technology"]);
add('animals','عالم الحيوان','عام','حيوانات البر والبحر وحقائقها المدهشة.', BANKS["animals"]);
add('history','تاريخ','عام','أحداث واختراعات وحضارات عبر العصور.', BANKS["history"]);
add('literature','لغة وأدب','عام','كتب وشعر ومفردات عربية.', BANKS["literature"]);
add('geography','جغرافيا','دول','خرائط وبحار وجبال وقارات.', BANKS["geography"]);
add('capitals','دول و عواصم','دول','جولة حول العالم، عاصمة في كل سؤال.', BANKS["capitals"]);
add('flags','أعلام','دول','تعرّف على الدول من ألوان وأشكال أعلامها.', BANKS["flags"]);
add('currencies','عملات','دول','من الين إلى الفرنك: تعرف على العملات.', BANKS["currencies"]);
add('saudi','السعودية','السعودية','مناطق ومعالم وتاريخ المملكة.', BANKS["saudi"]);
add('islam','إسلامي','إسلامي','معلومات أساسية من القرآن والسيرة.', BANKS["islam"]);
add('quran','القرآن','إسلامي','السور وأسماؤها وترتيبها في المصحف.', BANKS["quran"]);
add('riddles','ألغاز','تفكير','بعض الأجوبة أقرب مما تتوقع.', BANKS["riddles"]);
add('reverse','كلمات معكوسة','تفكير','اقرأ ترتيب الحروف بالعكس لتعرف الكلمة.', BANKS["reverse"]);
add('movies','فن أجنبي','فن أجنبي','عناوين وأبطال وأفلام معروفة.', BANKS["movies"]);
add('harry-potter','Harry Potter','فن أجنبي','هوغوورتس والتعاويذ والشخصيات.', BANKS["harry-potter"]);
add('friends','Friends','فن أجنبي','المقهى والشقق والأصدقاء الستة.', BANKS["friends"]);
add('breaking-bad','Breaking Bad','فن أجنبي','والتر وجيسي وعالم المسلسل.', BANKS["breaking-bad"]);
add('marvel','Marvel','فن أجنبي','أبطال وعوالم مارفل المعروفة.', BANKS["marvel"]);
add('sports','رياضة','رياضة','رياضات متنوعة من دون كرة قدم.', BANKS["sports"]);
add('nba','NBA','رياضة','فرق وأسماء من كرة السلة الأمريكية.', BANKS["nba"]);
add('f1','Formula 1','رياضة','فرق وحلبات وتفاصيل السباق.', BANKS["f1"]);
add('grammar','نحو وإعراب','حروف','أساسيات اللغة العربية وإعرابها.', BANKS["grammar"]);
add('cartoons','سبيستون','بباي','ذكريات الرسوم والبرامج المعروفة.', BANKS["cartoons"]);

for (const [id,rows] of Object.entries(AUDIO_BANKS)) {
  const songs=id==='song-recognition';
  CATEGORIES.push({id,name:songs?'تحدي الأغاني':id==='anime-op'?'Anime OP':'Anime ED',group:songs?'موسيقى':'أنمي',description:songs?'سمّ الأغنية من مقطع مدته ١٥ ثانية.':'سمّ الأنمي من شارة مسموعة مدتها ١٥ ثانية. من المعروف إلى الأقل شيوعاً.',icon:songs?'♫':id==='anime-op'?'OP':'ED',tone:id==='anime-ed'?'rose':'lavender',featured:true});
  rows.forEach((q,i)=>{
    const media=validateMedia(q.media);
    QUESTIONS.push({...q,media,id:`${id}-v2-${i+1}`,categoryId:id,question:songs?'استمعوا للمقطع: ما اسم الأغنية؟':'استمعوا للشارة: ما اسم الأنمي؟',source:clipUrls(media).watch,origin:'original'});
  });
}
// Keep the existing category order; the new song round joins the requested additions.
CATEGORIES.sort((a,b)=> Number(b.id==='anime-op')-Number(a.id==='anime-op') || Number(b.id==='anime-ed')-Number(a.id==='anime-ed'));

export const EXCLUDED_GROUPS=['فن خليجي','بنات','الأردن','البحرين','الإمارات','عمان','قطر','الكويت','مسرح','فن عربي','أغاني','فن تركي','كرة قدم'];
export const REQUESTED_IDS=['anime-op','anime-ed','rdr2','expedition-33','roguelites','witcher-3','baldurs-gate-3','romance-anime','metroidvania','jrpg','linear-fps','character-action','song-recognition'];

// References for specifically checked mechanics and side-quest details.
const checkedSources = {
  'rdr2-v2-3':'https://reddead.fandom.com/wiki/Advertising,_The_New_American_Art',
  'expedition-33-v2-4':'https://en.wikipedia.org/wiki/Clair_Obscur:_Expedition_33',
  'expedition-33-v2-5':'https://clair-obscur.fandom.com/wiki/Skills',
  'expedition-33-v2-6':'https://clair-obscur.fandom.com/wiki/Skills',
  'baldurs-gate-3-v2-5':'https://bg3.wiki/wiki/Wyrmway',
  'baldurs-gate-3-v2-6':'https://bg3.wiki/wiki/Daughter_of_Darkness',
  'dragon-ball-v2-6':'https://dragonball.fandom.com/wiki/South_Supreme_Kai',
};
for (const q of QUESTIONS) if(checkedSources[q.id]) q.source=checkedSources[q.id];
