"""Build reviewed-topic image metadata. No runtime searching and no image downloads."""
import json,urllib.request,urllib.parse,time
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
TOPICS=json.loads((ROOT/'scripts/answer-image-topics.json').read_text())
titles=sorted({t for rows in TOPICS.values() for row in rows if row for t in (row if isinstance(row,list) else [row])})
cache={}
(ROOT/'work').mkdir(exist_ok=True)
for i in range(0,len(titles),30):
 batch=titles[i:i+30]
 params={'action':'query','format':'json','prop':'pageimages','piprop':'thumbnail|name','pithumbsize':'640','pilicense':'any','redirects':'1','titles':'|'.join(batch)}
 req=urllib.request.Request('https://en.wikipedia.org/w/api.php?'+urllib.parse.urlencode(params),headers={'User-Agent':'LammaTrivia/1.1 (answer illustrations)'})
 try:
  data=json.load(urllib.request.urlopen(req,timeout=30)).get('query',{})
  aliases={r['from']:r['to'] for r in data.get('normalized',[])+data.get('redirects',[])}
  pages={p['title']:p for p in data.get('pages',{}).values()}
  for title in batch:
   canonical=title;visited=set()
   while canonical in aliases and canonical not in visited:visited.add(canonical);canonical=aliases[canonical]
   page=pages.get(canonical,{})
   if page.get('thumbnail') and not page.get('title','').startswith('List of'):
    cache[title]={'url':page['thumbnail']['source'].split('?')[0],'alt':page['title'],'source':'https://en.wikipedia.org/wiki/'+urllib.parse.quote(page['title'].replace(' ','_')),'credit':'Wikipedia / Wikimedia','caption':page['title']}
 except Exception as e:print('Batch error',i,str(e),flush=True)
 time.sleep(.15)
manifest={}
missing={}
for category,rows in TOPICS.items():
 for i,row in enumerate(rows,1):
  if not row:continue
  targets=row if isinstance(row,list) else [row]
  found=[cache[t] for t in targets if t in cache]
  if found:manifest[f'{category}-v2-{i}']=found
  for title in targets:
   if title not in cache:missing.setdefault(category,[]).append(title)
(ROOT/'work/wiki-image-cache.json').write_text(json.dumps(cache,ensure_ascii=False,indent=2)+'\n')
(ROOT/'work/image-gaps.json').write_text(json.dumps(missing,ensure_ascii=False,indent=2)+'\n')
blocked=['digimon_adventure_group', 'detective_conan_characters', 'hunterxhunterprotagonists', 'dragon_ball_cast', 'furuba-ch66', 'major_konoha', 'kny_characters', 'international_pokémon_logo', 'straw_hats', 'prestige_poster', 'metal_gear_solid_cover', 'titanfall_2.jpg', 'final_fantasy_vi.jpg', 'reiner_braun._nein', 'bhre.png', 'pokémon_red_and_blue_cover']
for key in list(manifest):
 manifest[key]=[im for im in manifest[key] if not any(t in urllib.parse.unquote(im['url']).lower() for t in blocked)]
 if not manifest[key]:del manifest[key]
manifest.update(json.loads((ROOT/'scripts/answer-image-overrides.json').read_text()))
(ROOT/'answer-image-data.mjs').write_text('// Curated answer subjects resolved through public Wikipedia page-image metadata.\nexport const ANSWER_IMAGES = '+json.dumps(manifest,ensure_ascii=False,indent=2)+';\n')
print('Image metadata:',len(cache),'subjects;',len(manifest),'answers; gaps:',json.dumps(missing,ensure_ascii=False),flush=True)
