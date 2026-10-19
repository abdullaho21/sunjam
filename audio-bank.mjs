// External platform embeds: no downloaded songs, lyrics, or rehosted media.
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

// Twelve additional recordings in each category, with four at every tier.
AUDIO_BANKS['anime-op'].push(
  clip(200,'SPY×FAMILY — عائلة فورجر','Mixed Nuts','Official Hige Dandism','Official Hige Dandism','CbH2F0kXgTY',45,'جاسوس وقاتلة وطفلة تقرأ الأفكار.'),
  clip(200,'My Hero Academia — أكاديمية بطلي','Peace Sign','Kenshi Yonezu','Kenshi Yonezu / Sony Music Labels','EJAEzPwcQPs',45,'مدرسة يو إيه لتدريب الأبطال.'),
  clip(200,'Fire Force — قوة النار','Inferno','Mrs. GREEN APPLE','Mrs. GREEN APPLE','wfCcs0vLysk',40,'شينرا ووحدة الإطفاء الخاصة الثامنة.'),
  clip(200,'Hunter × Hunter — القناص','Departure!','Masatoshi Ono','Crunchyroll','faqmNf_fZlE',20,'رحلة غون للعثور على غينغ.'),
  clip(400,'Noragami Aragoto — نوراغامي','Kyouran Hey Kids!!','THE ORAL CIGARETTES','THE ORAL CIGARETTES / Universal Music Group','cp3OV9pzlkE',65,'إله فقير يُدعى ياتو.'),
  clip(400,'Blood Blockade Battlefront — Kekkai Sensen','Hello,world!','BUMP OF CHICKEN','BUMP OF CHICKEN / TOY’S FACTORY','RB7zvP8U5ak',45,'منظمة ليبرا في مدينة هيلسالمز لوت.'),
  clip(400,'Mob Psycho 100 — موب سايكو','99','MOB CHOIR','Crunchyroll','Bw-5Lka7gPE',35,'شيغيو كاغياما ومكتب ريغن.'),
  clip(400,'Fullmetal Alchemist: Brotherhood — الخيميائي المعدني','Again','YUI','YUI / Sony Music Labels','0NJCpJZ19n8',45,'أخَوان يحاولان استعادة جسديهما.'),
  clip(600,'Land of the Lustrous — Houseki no Kuni','Kyoumen no Nami','YURiKA','TOHO animation','WvupNifis2g',45,'كائنات بلورية تقاتل القمريين.'),
  clip(600,'ACCA: 13-Territory Inspection Dept.','Shadow and Truth','ONE III NOTES','ONE III NOTES / NexTone','B_BRs_DTvqo',50,'جان أوتوس يفتش مقاطعات مملكة دوا.'),
  clip(600,'Odd Taxi — أود تاكسي','ODDTAXI','Skirt and PUNPEE','Crunchyroll','zI_cLtW3PnA',30,'سائق أجرة يُدعى أودوكاوا.'),
  clip(600,'Shouwa Genroku Rakugo Shinjuu','Usurahi Shinjuu','Megumi Hayashibara','KING RECORDS','a_UxWeBT1BY',40,'ياكومو ويوتارو وفن سرد الراكوغو.'),
);
AUDIO_BANKS['anime-ed'].push(
  clip(200,'SPY×FAMILY — عائلة فورجر','Comedy','Gen Hoshino','Gen Hoshino','D_Oyplmhhv0',45,'آنيا ووالداها ذوا الهويتين السريتين.'),
  clip(200,'Chainsaw Man — رجل المنشار','CHAINSAW BLOOD','Vaundy','Vaundy','FL1QjjkZVm4',45,'دينجي وبوتشيتا.'),
  clip(200,'Jujutsu Kaisen — أرك الماضي / Hidden Inventory','Akari','Soushi Sakiyama','Soushi Sakiyama','4jWzGkRsHw8',45,'غوجو وغيتو في شبابهما.'),
  clip(200,'My Hero Academia — أكاديمية بطلي','HEROES','Brian the Sun','Brian the Sun / Sony Music Labels','6DVEjsJhcCA',40,'إيزوكو ميدوريا يسعى لوراثة لقب رمز السلام.'),
  clip(400,'Blood Blockade Battlefront — Kekkai Sensen','Sugar Song to Bitter Step','UNISON SQUARE GARDEN','UNISON SQUARE GARDEN / TOY’S FACTORY','QkksQoqMakQ',45,'ليوناردو ووتش ومنظمة ليبرا.'),
  clip(400,'Vinland Saga — ملحمة فينلاند','Torches','Aimer','Aimer / Sony Music Labels','_jTCDPWy0tw',50,'ثورفين وأبوه ثورز.'),
  clip(400,'Mob Psycho 100 II — الموسم الثاني','Memosepia','sajou no hana','Crunchyroll','4p_OmTMlZXw',30,'شيغيو يتعلم التوازن بين قواه وحياته.'),
  clip(400,'Link Click — Shiguang Dailiren','OverThink','Fan Ka','Wakanim','ehzk_lrkWh0',25,'متجر تصوير يستطيع دخول ذكريات الصور.'),
  clip(600,'Girls’ Last Tour — Shoujo Shuumatsu Ryokou','More One Night','Chito & Yuuri (Inori Minase & Yurika Kubo)','KADOKAWA / Artist Topic','cUtOgwdJNUE',50,'فتاتان ومركبة كيتنكراد في مدينة مهجورة.'),
  clip(600,'Land of the Lustrous — Houseki no Kuni','Kirameku Hamabe','Yuiko Ohara','Yuiko Ohara Official YouTube','cfOAY-1ir1c',50,'فوس البلورية تبحث عن دور تؤديه.'),
  clip(600,'From the New World — Shinsekai Yori','Wareta Ringo','Saki Watanabe (Risa Taneda)','PONY CANYON / Artist Topic','AuFdVEtAwjs',50,'مجتمع بشري تُحكمه القدرات النفسية بعد ألف عام.'),
  clip(600,'Tsuki ga Kirei — كجمال القمر','Tsuki ga Kirei','Nao Toyama','FlyingDog','nw2Uw0Eww_w',40,'أكاني وكوتارو في سنتهما الأخيرة من المتوسطة.'),
);
AUDIO_BANKS['song-recognition'].push(
  clip(200,'Adventure of a Lifetime — Coldplay','Adventure of a Lifetime','Coldplay','Coldplay','QtXby3twMmI',70,'من ألبوم A Head Full of Dreams.'),
  clip(200,'Waiting for the End — Linkin Park','Waiting for the End','Linkin Park','Linkin Park','5qF_qbaWt3Q',65,'من ألبوم A Thousand Suns.'),
  clip(200,'On Melancholy Hill — Gorillaz','On Melancholy Hill','Gorillaz','Gorillaz','04mfKJWDSzI',55,'فرقة افتراضية من مشروع ديمون ألبارن.'),
  clip(200,'Fluorescent Adolescent — Arctic Monkeys','Fluorescent Adolescent','Arctic Monkeys','Arctic Monkeys / Domino','ma9I9VBKPiw',45,'من ألبوم Favourite Worst Nightmare.'),
  clip(400,'Let It Happen — Tame Impala','Let It Happen','Tame Impala','Tame Impala','pFptt7Cargc',65,'مشروع كيفن باركر وألبوم Currents.'),
  clip(400,'Shake It Out — Florence + The Machine','Shake It Out','Florence + The Machine','Florence + The Machine','WbN0nX61rIs',55,'من ألبوم Ceremonials.'),
  clip(400,'Holocene — Bon Iver','Holocene','Bon Iver','Bon Iver','TWcyIpul8OE',65,'جاستن فيرنون ومشاهد آيسلندية في الفيديو.'),
  clip(400,'Gooey — Glass Animals','Gooey','Glass Animals','Glass Animals','jeo3an2M_Lo',55,'من ألبوم ZABA.'),
  clip(600,'Helplessness Blues — Fleet Foxes','Helplessness Blues','Fleet Foxes','Sub Pop','7HHgedNNQco',65,'عنوان ألبوم الفرقة الصادر سنة 2011.'),
  clip(600,'Riverside — Agnes Obel','Riverside','Agnes Obel','Agnes Obel / PIAS','vjncyiuwwXQ',55,'من ألبوم Philharmonics.'),
  clip(600,'Youth — Daughter','Youth','Daughter','Daughter','2QT5eGHCJdE',65,'فرقة إيلينا تونرا؛ من ألبوم If You Leave.'),
  clip(600,'Show Me How — Men I Trust','Show Me How','Men I Trust','Men I Trust','OZRYzH0Q0pU',50,'ثلاثي كندي وصوت إيما برولكس.'),
);

// Six further recordings per category, keeping prior IDs stable.
AUDIO_BANKS['anime-op'].push(
  clip(200,'Demon Slayer — أرك حي الترفيه','Zankyosanka','Aimer','Aimer Official YouTube Channel','tLQLa6lM3Us',45,'تينغن أوزوي ورفاقه في حي الترفيه.'),
  clip(200,'Kaiju No. 8 — كايجو رقم 8','Abyss','YUNGBLUD','YUNGBLUD','YJkOxWVn0SU',35,'كافكا هيبينو وقوات الدفاع.'),
  clip(400,'Death Parade — ديث باريد','Flyers','BRADIO','Crunchyroll','Ca5Tf5BDSYI',25,'حانة كوينديكيم وألعاب الحكم على الزوار.'),
  clip(400,'Durarara!! — دورارارا','Complication','ROOKiEZ is PUNK’D','ROOKiEZ is PUNK’D / Sony Music Labels / Topic','HkQ_mzbC_WY',50,'عصابات إكيبوكورو وراكبة الدراجة بلا رأس.'),
  clip(600,'Katanagatari — إعادة العرض عام 2013','Hakushu Kassai Utaawase','supercell','ryo (supercell) / Sony Music Labels','gifxbyjWElY',45,'شيتشيكا وتوغامي في رحلة لجمع السيوف.'),
  clip(600,'Ergo Proxy — إرغو بروكسي','Kiri','MONORAL','MONORAL / CD Baby / Topic','rIi9LLqx5t4',50,'ريل ماير وفينسنت لو ومدينة رومدو.'),
);
AUDIO_BANKS['anime-ed'].push(
  clip(200,'Demon Slayer: Mugen Train — فيلم القطار اللانهائي','Homura','LiSA','LiSA Official YouTube','4DxL6IKmXx4',50,'أغنية ختام الفيلم الذي يشارك فيه رينغوكو.'),
  clip(200,'Naruto Shippuden — ناروتو شيبودن','Utakata Hanabi','supercell','ryo (supercell) / Sony Music Labels','e6edTTwERyE',50,'إحدى شارات النهاية خلال أحداث ماضي كونوها.'),
  clip(400,'Fullmetal Alchemist: Brotherhood — الخيميائي المعدني','Uso','SID','SID Official YouTube','eglYGbybkrY',45,'أول شارة نهاية لهذا الاقتباس من مغامرة الأخوين إلريك.'),
  clip(400,'Natsume’s Book of Friends Go — الموسم الخامس','Akane Sasu','Aimer','Aimer Official YouTube Channel','bN1t3-2X3aM',50,'ناتسومي ودفتر الأسماء ونْيانكو سينسي.'),
  clip(600,'Ergo Proxy — إرغو بروكسي','Paranoid Android','Radiohead','Radiohead','fHiGbolFFGw',75,'شارة نهاية أنمي مدينة رومدو.'),
  clip(600,'Mononoke — مونونوكي (2007)','Natsu no Hana','JUJU','JUJU / Sony Music Labels / Topic','9tmcOccV4KI',50,'بائع الأدوية وسيف طرد الأرواح؛ ليس فيلم الأميرة مونونوكي.'),
);
AUDIO_BANKS['song-recognition'].push(
  clip(200,'Shiver — Coldplay','Shiver','Coldplay','Coldplay','u8XFFTWwSvY',60,'من ألبوم Parachutes.'),
  clip(200,'Still Into You — Paramore','Still Into You','Paramore','Fueled By Ramen','OblL026SvD4',45,'صوت هايلي ويليامز ومن ألبوم الفرقة الذي يحمل اسمها.'),
  clip(400,'Reckoner — Radiohead','Reckoner','Radiohead','Radiohead / XL Recordings / Beggars / Topic','pYHEpDnvVPk',60,'من ألبوم In Rainbows.'),
  clip(400,'I Need My Girl — The National','I Need My Girl','The National','The National','A-Tod1_tZdU',55,'صوت مات بيرنينغر؛ من ألبوم Trouble Will Find Me.'),
  clip(600,'Lullaby — Low','Lullaby','Low','Low / Universal Music Group / Topic','zEmtfA8FETc',150,'من ألبوم I Could Live in Hope الصادر عام 1994.'),
  clip(600,'Feel You — Julia Holter','Feel You','Julia Holter','Domino Recording Co.','X2JgMniIpRM',50,'من ألبوم Have You in My Wilderness.'),
);
