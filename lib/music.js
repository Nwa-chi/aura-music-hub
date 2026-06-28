export const artists = [
  {
    id: "amara-vale",
    name: "Amara Vale",
    genre: "Afro soul",
    location: "Lagos",
    bio: "Warm vocal stacks, live percussion, and late-night synths.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
    followers: "1.8M",
  },
  {
    id: "nova-saint",
    name: "Nova Saint",
    genre: "Alt pop",
    location: "Berlin",
    bio: "Glass-bright hooks over punchy electronic production.",
    image:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80",
    followers: "964K",
  },
  {
    id: "kito-ray",
    name: "Kito Ray",
    genre: "House",
    location: "Accra",
    bio: "Festival drums, deep basslines, and sunrise-ready melodies.",
    image:
      "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=800&q=80",
    followers: "642K",
  },
];

export const songs = [
  {
    id: "golden-hour",
    title: "Golden Hour",
    artistId: "amara-vale",
    album: "Afterglow",
    duration: 214,
    plays: 1842300,
    color: "#f4b942",
    cover:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    audio:
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    lyrics: [
      { time: 0, text: "The room wakes slowly in amber light" },
      { time: 18, text: "I hear your name in the morning tide" },
      { time: 38, text: "Golden hour, hold me close" },
      { time: 62, text: "Every shadow learns to glow" },
      { time: 89, text: "We keep moving where the drums roll low" },
      { time: 124, text: "Golden hour, take us home" },
      { time: 168, text: "Let the skyline sing what we know" },
    ],
  },
  {
    id: "neon-prayer",
    title: "Neon Prayer",
    artistId: "nova-saint",
    album: "Signal Blue",
    duration: 188,
    plays: 982400,
    color: "#36d1dc",
    cover:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80",
    audio:
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    lyrics: [
      { time: 0, text: "City lights flicker like a sign" },
      { time: 16, text: "Your voice cuts through the static line" },
      { time: 40, text: "Say a neon prayer for me" },
      { time: 67, text: "I am running through electricity" },
      { time: 101, text: "Blue hearts beat in the underground" },
      { time: 138, text: "We are louder than the lost and found" },
    ],
  },
  {
    id: "rain-dance",
    title: "Rain Dance",
    artistId: "kito-ray",
    album: "Drum Maps",
    duration: 236,
    plays: 1255000,
    color: "#7cdb79",
    cover:
      "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=900&q=80",
    audio:
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    lyrics: [
      { time: 0, text: "Clouds gather over the speaker wall" },
      { time: 22, text: "Feet answer every thunder call" },
      { time: 53, text: "Rain dance, move the ground" },
      { time: 86, text: "Let the rhythm turn us around" },
      { time: 127, text: "Hands up high where the daylight bends" },
      { time: 181, text: "We begin again when the bass descends" },
    ],
  },
  {
    id: "velvet-road",
    title: "Velvet Road",
    artistId: "amara-vale",
    album: "Afterglow",
    duration: 202,
    plays: 741900,
    color: "#e65a7a",
    cover:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=80",
    audio:
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    lyrics: [
      { time: 0, text: "Take the velvet road past midnight" },
      { time: 28, text: "Every mile hums under moonlight" },
      { time: 61, text: "If we drift, let the melody steer" },
      { time: 96, text: "There is no leaving when the song is here" },
    ],
  },
];

export const albums = [
  {
    id: "afterglow",
    title: "Afterglow",
    artistId: "amara-vale",
    year: 2026,
    songIds: ["golden-hour", "velvet-road"],
    cover: songs[0].cover,
  },
  {
    id: "signal-blue",
    title: "Signal Blue",
    artistId: "nova-saint",
    year: 2026,
    songIds: ["neon-prayer"],
    cover: songs[1].cover,
  },
  {
    id: "drum-maps",
    title: "Drum Maps",
    artistId: "kito-ray",
    year: 2025,
    songIds: ["rain-dance"],
    cover: songs[2].cover,
  },
];

export const playlists = [
  {
    id: "daily-pulse",
    title: "Daily Pulse",
    description: "Fresh rhythmic picks for focused listening.",
    songIds: ["golden-hour", "rain-dance", "neon-prayer"],
  },
  {
    id: "late-drive",
    title: "Late Drive",
    description: "Warm songs for evening roads.",
    songIds: ["velvet-road", "neon-prayer"],
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
