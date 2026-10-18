// Licensed platform playback only: no downloaded songs, lyrics, or rehosted media.
// All rounds use 15 seconds. Familiarity, then less obvious passages, set the tiers.
const clip = (points, answer, title, artist, channel, videoId, startSeconds, hint) => ({
  points, answer, hint, type:'audio',
  media:{provider:'youtube',videoId,startSeconds,endSeconds:startSeconds+15,title,artist,channel},
});
export const AUDIO_BANKS = {
  'anime-op': [
    clip(200,'Demon Slayer: Kimetsu no Yaiba — قاتل الشياطين','Gurenge','LiSA','LiSA / Sony Music Labels','TqyfmFaZlqw',40,'رحلة أخ يحاول إنقاذ أخته.'),
    clip(200,'Chainsaw Man — رجل المنشار','KICK BACK','Kenshi Yonezu','Kenshi Yonezu','M2cckDmNLMI',45,'اقتباس مانغا لتاتسوكي فوجيموتو.'),
    clip(400,'Jujutsu Kaisen — جوجوتسو كايسن','Kaikai Kitan','Eve','Crunchyroll','GwaRztMaoY0',24,'قتال اللعنات في طوكيو.'),
    clip(400,'Tokyo Ghoul — طوكيو غول','unravel','TK from Ling tosite sigure','凛として時雨 / TK','Fve_lHIPa-I',32,'مقهى أنتيكو أحد أماكنه الأساسية.'),
    clip(600,'Serial Experiments Lain — تجارب لين التسلسلية','Duvet','bôa','Bôa','Uoox9fpmDP0',110,'عمل من عام 1998 عن الهوية والشبكات.'),
    clip(600,'Fate/stay night: Unlimited Blade Works — الموسم الثاني','Brave Shine','Aimer','Aimer Official YouTube Channel','XeI8E20ZUE4',130,'أحد مسارات حرب الكأس المقدسة.'),
  ],
  'anime-ed': [
    clip(200,'Jujutsu Kaisen — جوجوتسو كايسن','LOST IN PARADISE feat. AKLO','ALI feat. AKLO','ALI','tLsJQ5srVQA',55,'راقصون من مدرسة لتعليم السحر واللعنات.'),
    clip(200,'Attack on Titan: The Final Season Part 2 — هجوم العمالقة','Akuma no Ko','Ai Higuchi','Ai Higuchi','WPl10ZrhCtk',45,'عالم الأسوار وفيلق الاستطلاع.'),
    clip(400,'Frieren: Beyond Journey’s End — فرييرن','Anytime Anywhere','milet','milet Official YouTube Channel','qFAYqLs1zGw',30,'رحلة بعد هزيمة ملك الشياطين.'),
    clip(400,'SPY×FAMILY — نهاية القسم الثاني من الموسم الأول','Shikisai','yama','TOHO animation','4kNt62PptEQ',25,'عائلة فورجر.'),
    clip(600,'No. 6 — رقم 6','Rokutousei no Yoru','Aimer','Aimer / Sony Music Labels','pHsaIsUTHdc',105,'شِيون ونيزومي في مدينة تبدو مثالية.'),
    clip(600,'Bleach — شارة النهاية التاسعة والعشرون','Re:pray','Aimer','Aimer Official YouTube Channel','nt58j1QGXhQ',130,'من شارات أرك العميل البديل المفقود.'),
  ],
  'song-recognition': [
    clip(200,'Take On Me — a-ha','Take On Me','a-ha','a-ha','djV11Xbc914',55,'فرقة نرويجية؛ فيديو مشهور يمزج الرسم والواقع.'),
    clip(200,'Bohemian Rhapsody — Queen','Bohemian Rhapsody','Queen','Queen Official','fJ9rUzIMcZQ',195,'فرقة فريدي ميركوري.'),
    clip(400,'Instant Crush — Daft Punk feat. Julian Casablancas','Instant Crush','Daft Punk feat. Julian Casablancas','Daft Punk','a5uQMwRMHcs',35,'ثنائي فرنسي وصوت مغني The Strokes.'),
    clip(400,'Teardrop — Massive Attack','Teardrop','Massive Attack','Massive Attack / VEVO','u7K72X4eo_s',50,'من ألبوم Mezzanine.'),
    clip(600,'Iron — Woodkid','Iron','Woodkid','Woodkid','vSkb0kDacjs',90,'استُخدمت في إعلان Assassin’s Creed Revelations.'),
    clip(600,'Roads — Portishead','Roads','Portishead','Portishead / Universal Music Group','7nxWP9BhI7w',105,'من ألبوم Dummy الصادر عام 1994.'),
  ],
};
