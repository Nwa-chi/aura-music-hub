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
];

export const songs = [
  {
    id: "vibe-and-bubble",
    title: "Vibe And Bubble",
    artistId: "creepzz",
    album: "AURA Modern Starter",
    genre: "Afrobeats",
    duration: 156,
    plays: 0,
    color: "#38bdf8",
    cover:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80",
    audio:
      "https://freemusicarchive.org/track/creepzz-x-kosi-sia-vibe-and-bubble/stream/",
    source:
      "https://freemusicarchive.org/music/creepzz/single/creepzz-x-kosi-sia-vibe-and-bubble/",
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
    duration: 163,
    plays: 0,
    color: "#7dd3fc",
    cover:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=80",
    audio:
      "https://freemusicarchive.org/track/fashion-week/stream/",
    source:
      "https://freemusicarchive.org/music/1000-handz/cc-by-free-to-use-dancehouse-instrumentals/fashion-week/",
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
    duration: 174,
    plays: 0,
    color: "#0ea5e9",
    cover:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80",
    audio:
      "https://freemusicarchive.org/track/follow-my-soul/stream/",
    source:
      "https://freemusicarchive.org/music/Ketsa/concrete-flowers/follow-my-soul/",
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
    duration: 127,
    plays: 0,
    color: "#0284c7",
    cover:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80",
    audio:
      "https://freemusicarchive.org/track/metamorph-1/stream/",
    source:
      "https://freemusicarchive.org/music/1000-handz/cc-by-free-to-use-melodic-rap-instrumentals-vol-2/metamorph-1/",
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
];

export const albums = [
  {
    id: "aura-modern-starter",
    title: "AURA Modern Starter",
    artistId: "creepzz",
    year: 2026,
    songIds: songs.map((song) => song.id),
    cover: songs[0].cover,
  },
];

export const playlists = [
  {
    id: "new-aura-groove",
    title: "New AURA Groove",
    description: "Afrobeats, pop, R&B, and hip-hop to make the app feel alive.",
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
