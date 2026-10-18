export const AUDIO_CATEGORY_IDS = ['anime-op', 'anime-ed', 'song-recognition'];

// Only video IDs and numeric bounds are accepted; imported URLs/HTML never become embeds.
export function validateMedia(value) {
  if (!value || value.provider !== 'youtube' || !/^[\w-]{11}$/.test(value.videoId))
    throw new Error('المقطع يحتاج معرّف فيديو YouTube صالحاً.');
  const {startSeconds, endSeconds} = value;
  if (!Number.isInteger(startSeconds) || startSeconds < 0 || !Number.isInteger(endSeconds)
      || endSeconds - startSeconds !== 15 || endSeconds > 86400)
    throw new Error('حدد بداية المقطع ونهايته بالأرقام، بفارق ١٥ ثانية بالضبط.');
  for (const key of ['title', 'artist', 'channel']) {
    if (typeof value[key] !== 'string' || !value[key].trim() || value[key].length > 200)
      throw new Error('أضف اسم الأغنية والفنان وقناة المصدر للمقطع.');
  }
  return {provider:'youtube',videoId:value.videoId,startSeconds,endSeconds,
    title:value.title.trim(),artist:value.artist.trim(),channel:value.channel.trim()};
}

export function clipUrls(value) {
  const m = validateMedia(value);
  const params = new URLSearchParams({start:String(m.startSeconds),end:String(m.endSeconds),autoplay:'1',playsinline:'1',rel:'0'});
  return {
    embed: `https://www.youtube-nocookie.com/embed/${m.videoId}?${params}`,
    watch: `https://www.youtube.com/watch?v=${m.videoId}&t=${m.startSeconds}s`,
  };
}
