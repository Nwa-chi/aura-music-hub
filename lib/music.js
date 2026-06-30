export const artists = [
  {
    id: "scott-joplin",
    name: "Scott Joplin",
    genre: "Ragtime",
    location: "United States",
    bio: "A foundational ragtime composer whose piano works helped shape American popular music.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/1/18/Scott_Joplin_1907.jpg",
    followers: "Historic catalog",
  },
  {
    id: "johann-sebastian-bach",
    name: "Johann Sebastian Bach",
    genre: "Classical",
    location: "Germany",
    bio: "A baroque composer whose melodies still carry quiet drama, structure, and emotional force.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/6/6a/Johann_Sebastian_Bach.jpg",
    followers: "Historic catalog",
  },
  {
    id: "frederic-chopin",
    name: "Frederic Chopin",
    genre: "Classical",
    location: "Poland / France",
    bio: "A poet of the piano, known for intimate nocturnes and deeply expressive solo works.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/e/e8/Frederic_Chopin_photo.jpeg",
    followers: "Historic catalog",
  },
];

export const songs = [
  {
    id: "maple-leaf-rag",
    title: "Maple Leaf Rag",
    artistId: "scott-joplin",
    album: "Public Domain Essentials",
    genre: "Ragtime",
    duration: 181,
    plays: 0,
    color: "#38bdf8",
    cover:
      "https://upload.wikimedia.org/wikipedia/commons/1/18/Scott_Joplin_1907.jpg",
    audio:
      "https://upload.wikimedia.org/wikipedia/commons/f/fe/Maple_Leaf_Rag.ogg",
    source:
      "https://commons.wikimedia.org/wiki/File:Maple_Leaf_Rag.ogg",
    license: "Public domain",
    lyrics: [
      { time: 0, text: "Piano roll begins with the ragtime theme" },
      { time: 24, text: "Syncopated melody moves into the first strain" },
      { time: 58, text: "The left hand keeps the march-like pulse" },
      { time: 96, text: "A brighter strain opens the middle section" },
      { time: 136, text: "The main rhythm returns with a final lift" },
    ],
  },
  {
    id: "air-on-the-g-string",
    title: "Air on the G String",
    artistId: "johann-sebastian-bach",
    album: "Public Domain Essentials",
    genre: "Classical",
    duration: 266,
    plays: 0,
    color: "#7dd3fc",
    cover:
      "https://upload.wikimedia.org/wikipedia/commons/6/6a/Johann_Sebastian_Bach.jpg",
    audio:
      "https://upload.wikimedia.org/wikipedia/commons/1/1e/Air_%28Bach%29.ogg",
    source:
      "https://commons.wikimedia.org/wiki/File:Air_(Bach).ogg",
    license: "Public domain",
    lyrics: [
      { time: 0, text: "Violin line rises slowly over the piano" },
      { time: 34, text: "The melody stretches with a calm, suspended feeling" },
      { time: 84, text: "A gentle phrase settles into the harmony" },
      { time: 148, text: "The theme opens again with warmer motion" },
      { time: 216, text: "The final passage resolves quietly" },
    ],
  },
  {
    id: "nocturne-op-9-no-2",
    title: "Nocturne Op. 9 No. 2",
    artistId: "frederic-chopin",
    album: "Public Domain Essentials",
    genre: "Classical",
    duration: 252,
    plays: 0,
    color: "#0ea5e9",
    cover:
      "https://upload.wikimedia.org/wikipedia/commons/e/e8/Frederic_Chopin_photo.jpeg",
    audio:
      "https://upload.wikimedia.org/wikipedia/commons/f/fd/Chopin_Nocturne_Op_9_No_2.ogg",
    source:
      "https://commons.wikimedia.org/wiki/File:Chopin_Nocturne_Op_9_No_2.ogg",
    license: "CC BY-SA 3.0",
    lyrics: [
      { time: 0, text: "The nocturne opens with a soft piano melody" },
      { time: 38, text: "Ornamented notes drift around the main theme" },
      { time: 92, text: "The music grows more expressive and intimate" },
      { time: 156, text: "A delicate turn brings the theme back into focus" },
      { time: 214, text: "The final phrase fades with a quiet cadence" },
    ],
  },
];

export const albums = [
  {
    id: "public-domain-essentials",
    title: "Public Domain Essentials",
    artistId: "scott-joplin",
    year: 2026,
    songIds: songs.map((song) => song.id),
    cover: songs[0].cover,
  },
];

export const playlists = [
  {
    id: "aura-starter-library",
    title: "AURA Starter Library",
    description: "Three real tracks to start the catalog cleanly.",
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
