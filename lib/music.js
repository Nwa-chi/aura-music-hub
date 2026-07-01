export const artists = [
  {
    id: "creepzz",
    name: "Creepzz",
    genre: "Afrobeats",
    location: "Free Music Archive",
    bio: "Bright Afrobeats and island-leaning grooves with smooth vocal energy.",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80",
    followers: "Starter catalog",
  },
  {
    id: "one-thousand-handz",
    name: "1000 Handz",
    genre: "Hip-Hop / Pop",
    location: "Free Music Archive",
    bio: "Melodic rap instrumentals, fashion-week polish, and clean beat-driven hooks.",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80",
    followers: "Starter catalog",
  },
  {
    id: "ketsa",
    name: "Ketsa",
    genre: "R&B / Soul",
    location: "Free Music Archive",
    bio: "Soulful instrumental production with warm textures and steady headphone-friendly rhythm.",
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&q=80",
    followers: "Starter catalog",
  },
  {
    id: "timo-versemann",
    name: "Timo Versemann",
    genre: "Gospel / Hymn",
    location: "Free Music Archive",
    bio: "Reflective hymn arrangements with a warm, modern worship atmosphere.",
    image:
      "https://freemusicarchive.org/image/?file=image%2FTBJAwNWg6Djnl7Z7dOAQYYg3gt16dmXsWFzV67po.png&width=400&height=400&type=album",
    followers: "Starter catalog",
  },
  {
    id: "fisk-jubilee-singers",
    name: "Fisk Jubilee Singers",
    genre: "Gospel / Spirituals",
    location: "Wikimedia Commons",
    bio: "A historic vocal ensemble whose spirituals helped carry gospel music to the world.",
    image:
      "https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=800&q=80",
    followers: "Historic catalog",
  },
  {
    id: "spiritual-four-quartet",
    name: "The Spiritual Four Quartet",
    genre: "Gospel / Spirituals",
    location: "Wikimedia Commons",
    bio: "Classic quartet gospel harmonies with roots in African American spiritual tradition.",
    image:
      "https://images.unsplash.com/photo-1527596428171-7885b82c91c6?auto=format&fit=crop&w=800&q=80",
    followers: "Historic catalog",
  },
];

export const songs = [
  {
    id: "vibe-and-bubble",
    title: "Vibe And Bubble",
    artistId: "creepzz",
    album: "AURA Modern Starter",
    genre: "Afrobeats",
    collectionTags: ["Afrobeats", "New AURA Groove"],
    duration: 156,
    plays: 0,
    color: "#38bdf8",
    cover:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80",
    audio:
      "https://freemusicarchive.org/track/creepzz-x-kosi-sia-vibe-and-bubble/stream/",
    source:
      "https://freemusicarchive.org/music/creepzz/single/creepzz-x-kosi-sia-vibe-and-bubble/",
    sourceLabel: "FMA",
    license: "CC BY",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    lyrics: [
      { time: 0, text: "Afrobeats groove opens with a bright bounce" },
      { time: 26, text: "The vocal hook lifts over the percussion" },
      { time: 58, text: "Bass and rhythm settle into the dance pocket" },
      { time: 94, text: "A soft break lets the melody breathe" },
      { time: 128, text: "The final groove rides out with summer energy" },
    ],
  },
  {
    id: "fashion-week",
    title: "Fashion Week",
    artistId: "one-thousand-handz",
    album: "AURA Modern Starter",
    genre: "Pop",
    collectionTags: ["Pop", "New AURA Groove"],
    duration: 163,
    plays: 0,
    color: "#7dd3fc",
    cover:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=80",
    audio:
      "https://freemusicarchive.org/track/fashion-week/stream/",
    source:
      "https://freemusicarchive.org/music/1000-handz/cc-by-free-to-use-dancehouse-instrumentals/fashion-week/",
    sourceLabel: "FMA",
    license: "CC BY",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    lyrics: [
      { time: 0, text: "Clean pop drums step into the spotlight" },
      { time: 24, text: "Synth lines move like runway lights" },
      { time: 54, text: "The hook keeps the track glossy and bright" },
      { time: 104, text: "A dance break opens the rhythm wider" },
      { time: 138, text: "The final phrase lands with a polished lift" },
    ],
  },
  {
    id: "follow-my-soul",
    title: "Follow My Soul",
    artistId: "ketsa",
    album: "AURA Modern Starter",
    genre: "R&B",
    collectionTags: ["R&B", "New AURA Groove"],
    duration: 174,
    plays: 0,
    color: "#0ea5e9",
    cover:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80",
    audio:
      "https://freemusicarchive.org/track/follow-my-soul/stream/",
    source:
      "https://freemusicarchive.org/music/Ketsa/concrete-flowers/follow-my-soul/",
    sourceLabel: "FMA",
    license: "CC BY",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    lyrics: [
      { time: 0, text: "Warm keys and drums open the soul pocket" },
      { time: 32, text: "A mellow phrase leans into the rhythm" },
      { time: 72, text: "The beat stays soft, steady, and intimate" },
      { time: 116, text: "Textures rise like late-night city lights" },
      { time: 148, text: "The groove fades with a calm resolve" },
    ],
  },
  {
    id: "metamorph",
    title: "Metamorph",
    artistId: "one-thousand-handz",
    album: "AURA Modern Starter",
    genre: "Hip-Hop",
    collectionTags: ["Hip-Hop", "New AURA Groove"],
    duration: 127,
    plays: 0,
    color: "#0284c7",
    cover:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80",
    audio:
      "https://freemusicarchive.org/track/metamorph-1/stream/",
    source:
      "https://freemusicarchive.org/music/1000-handz/cc-by-free-to-use-melodic-rap-instrumentals-vol-2/metamorph-1/",
    sourceLabel: "FMA",
    license: "CC BY",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    lyrics: [
      { time: 0, text: "Melodic rap drums set the pace" },
      { time: 18, text: "The synth lead cuts through with confidence" },
      { time: 45, text: "808 movement gives the hook its weight" },
      { time: 82, text: "The beat shifts into a darker pocket" },
      { time: 108, text: "Final hits close the loop cleanly" },
    ],
  },
  {
    id: "amazing-grace",
    title: "Amazing Grace",
    artistId: "timo-versemann",
    album: "AURA Gospel Starter",
    genre: "Gospel",
    collectionTags: ["Gospel", "AURA Gospel Starter"],
    duration: 389,
    plays: 0,
    color: "#38bdf8",
    cover:
      "https://freemusicarchive.org/image/?file=image%2FTBJAwNWg6Djnl7Z7dOAQYYg3gt16dmXsWFzV67po.png&width=400&height=400&type=album",
    audio:
      "https://freemusicarchive.org/track/amazing-grace-1/stream/",
    source:
      "https://freemusicarchive.org/music/timoversemann/electronic-church-instrumentals/amazing-grace-1/",
    sourceLabel: "FMA",
    license: "CC0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    lyrics: [
      { time: 0, text: "A gentle hymn atmosphere opens the room" },
      { time: 56, text: "The melody moves with quiet gratitude" },
      { time: 132, text: "Soft harmony gives the song a worshipful lift" },
      { time: 230, text: "The arrangement settles into a peaceful glow" },
      { time: 330, text: "The final phrase fades with reverence" },
    ],
  },
  {
    id: "swing-low-sweet-chariot",
    title: "Swing Low, Sweet Chariot",
    artistId: "fisk-jubilee-singers",
    album: "AURA Gospel Starter",
    genre: "Gospel",
    collectionTags: ["Gospel", "AURA Gospel Starter"],
    duration: 207,
    plays: 0,
    color: "#7dd3fc",
    cover:
      "https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=900&q=80",
    audio:
      "https://upload.wikimedia.org/wikipedia/commons/6/6b/Swing_Low%2C_Sweet_Chariot_-_Fisk_Jubilee_Singers.ogg",
    source:
      "https://commons.wikimedia.org/wiki/File:Swing_Low,_Sweet_Chariot_-_Fisk_Jubilee_Singers.ogg",
    sourceLabel: "Commons",
    license: "Public domain",
    licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/",
    lyrics: [
      { time: 0, text: "Voices enter with a classic spiritual hush" },
      { time: 32, text: "The refrain rises with hope and longing" },
      { time: 78, text: "Harmony gathers around the old gospel line" },
      { time: 130, text: "The choir leans into the song's promise" },
      { time: 176, text: "The closing phrase lands gently" },
    ],
  },
  {
    id: "john-the-revelator",
    title: "John the Revelator",
    artistId: "spiritual-four-quartet",
    album: "AURA Gospel Starter",
    genre: "Gospel",
    collectionTags: ["Gospel", "AURA Gospel Starter"],
    duration: 172,
    plays: 0,
    color: "#0ea5e9",
    cover:
      "https://images.unsplash.com/photo-1527596428171-7885b82c91c6?auto=format&fit=crop&w=900&q=80",
    audio:
      "https://upload.wikimedia.org/wikipedia/commons/2/2c/The_Spiritual_Four_Quartet_-_John_the_Revelator.ogg",
    source:
      "https://commons.wikimedia.org/wiki/File:The_Spiritual_Four_Quartet_-_John_the_Revelator.ogg",
    sourceLabel: "Commons",
    license: "Public domain",
    licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/",
    lyrics: [
      { time: 0, text: "Quartet voices begin with a strong gospel call" },
      { time: 24, text: "The response locks into tight harmony" },
      { time: 64, text: "The rhythm pushes the testimony forward" },
      { time: 112, text: "The lead voice cuts through with conviction" },
      { time: 148, text: "The final cadence closes with church energy" },
    ],
  },
];

export const albums = [
  {
    id: "aura-modern-starter",
    title: "AURA Modern Starter",
    artistId: "creepzz",
    year: 2026,
    songIds: ["vibe-and-bubble", "fashion-week", "follow-my-soul", "metamorph"],
    cover: songs[0].cover,
  },
  {
    id: "aura-gospel-starter",
    title: "AURA Gospel Starter",
    artistId: "timo-versemann",
    year: 2026,
    songIds: ["amazing-grace", "swing-low-sweet-chariot", "john-the-revelator"],
    cover: "https://freemusicarchive.org/image/?file=image%2FTBJAwNWg6Djnl7Z7dOAQYYg3gt16dmXsWFzV67po.png&width=400&height=400&type=album",
  },
];

export const playlists = [
  {
    id: "aura-afrobeats",
    title: "Afrobeats Collection",
    description: "Warm rhythm, bounce, and summer energy.",
    tag: "Afrobeats",
    songIds: ["vibe-and-bubble"],
  },
  {
    id: "aura-pop",
    title: "Pop Collection",
    description: "Bright hooks and clean runway-ready polish.",
    tag: "Pop",
    songIds: ["fashion-week"],
  },
  {
    id: "aura-highlife",
    title: "Highlife Collection",
    description: "Guitar-led grooves, warm horns, and West African dance elegance.",
    tag: "Highlife",
    songIds: [],
  },
  {
    id: "aura-blues",
    title: "Blues Collection",
    description: "Soulful progressions, honest vocals, and deep roots rhythm.",
    tag: "Blues",
    songIds: [],
  },
  {
    id: "aura-rnb",
    title: "R&B Collection",
    description: "Soft soul textures and late-night rhythm.",
    tag: "R&B",
    songIds: ["follow-my-soul"],
  },
  {
    id: "aura-hip-hop",
    title: "Hip-Hop Collection",
    description: "Melodic rap beats and confident low-end movement.",
    tag: "Hip-Hop",
    songIds: ["metamorph"],
  },
  {
    id: "aura-gospel",
    title: "Gospel Collection",
    description: "Hymns, spirituals, and uplifting gospel roots.",
    tag: "Gospel",
    songIds: ["amazing-grace", "swing-low-sweet-chariot", "john-the-revelator"],
  },
  {
    id: "new-aura-groove",
    title: "New AURA Groove",
    description: "Afrobeats, highlife, blues, pop, R&B, hip-hop, and gospel to make the app feel alive.",
    songIds: songs.map((song) => song.id),
  },
];

export function getArtist(id) {
  return artists.find((artist) => artist.id === id);
}

export function secondsToTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}
