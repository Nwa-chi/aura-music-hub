"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity, Airplay, BarChart3, Bluetooth, CalendarClock, Cast, CheckCircle2, Clock3, Disc3, Download, FileCheck2, Globe2,
  Flag, Heart, Home, Library, LifeBuoy, ListChecks, LogIn, Megaphone, Mic2, Moon, Music2, Pause, Play, Radio,
  Search, Share2, Shield, SkipBack, SkipForward, Sparkles, Sun, Trash2, TrendingUp, UploadCloud, User, UserPlus,
  Users, Volume2, X,
} from "lucide-react";
import { artists, getArtist, playlists, secondsToTime, songs as seedSongs } from "../lib/music";
import { getSupabase, isCloudConfigured } from "../lib/supabase";
import versionInfo from "../VERSION.json";

const storageKeys = {
  favorites: "aura:favorites",
  uploads: "aura:uploads",
  user: "aura:user",
  language: "aura:language",
  listeningEvents: "aura:listening-events",
  followedArtists: "aura:followed-artists",
  contentReports: "aura:content-reports",
  deletionRequests: "aura:deletion-requests",
  auditLogs: "aura:audit-logs",
  releaseLogs: "aura:release-logs",
  ownerChanges: "aura:owner-changes",
  trendCountry: "aura:trend-country",
  installState: "aura:install-state",
};

const legacyKeys = {
  favorites: "AURA:favorites",
  uploads: "AURA:uploads",
  user: "AURA:user",
  installState: "AURA:install-state",
};

const copy = {
  en: { home: "Home", library: "Library", artists: "Artists", upload: "Upload", admin: "Admin", signIn: "Sign in", featured: "Featured track", play: "Play", search: "Search songs, artists, albums", made: "Made For You", trending: "Trending Now", albums: "Albums", lyrics: "Lyrics", tracks: "tracks", genres: "Browse by genre" },
  es: { home: "Inicio", library: "Biblioteca", artists: "Artistas", upload: "Subir", admin: "Admin", signIn: "Entrar", featured: "Canción destacada", play: "Reproducir", search: "Buscar canciones, artistas, álbumes", made: "Hecho para ti", trending: "Tendencias", albums: "Álbumes", lyrics: "Letras", tracks: "canciones", genres: "Explorar por género" },
  fr: { home: "Accueil", library: "Bibliothèque", artists: "Artistes", upload: "Importer", admin: "Admin", signIn: "Connexion", featured: "Titre à la une", play: "Écouter", search: "Rechercher titres, artistes, albums", made: "Pour vous", trending: "Tendances", albums: "Albums", lyrics: "Paroles", tracks: "titres", genres: "Explorer par genre" },
  pt: { home: "Início", library: "Biblioteca", artists: "Artistas", upload: "Enviar", admin: "Admin", signIn: "Entrar", featured: "Faixa em destaque", play: "Ouvir", search: "Buscar músicas, artistas, álbuns", made: "Feito para você", trending: "Em alta", albums: "Álbuns", lyrics: "Letras", tracks: "faixas", genres: "Explorar por gênero" },
  de: { home: "Start", library: "Bibliothek", artists: "Künstler", upload: "Hochladen", admin: "Admin", signIn: "Anmelden", featured: "Titel der Woche", play: "Abspielen", search: "Songs, Künstler, Alben suchen", made: "Für dich", trending: "Im Trend", albums: "Alben", lyrics: "Songtext", tracks: "Titel", genres: "Nach Genre stöbern" },
  ja: { home: "ホーム", library: "ライブラリ", artists: "アーティスト", upload: "アップロード", admin: "管理", signIn: "ログイン", featured: "注目の曲", play: "再生", search: "曲、アーティスト、アルバムを検索", made: "あなたへのおすすめ", trending: "トレンド", albums: "アルバム", lyrics: "歌詞", tracks: "曲", genres: "ジャンルから探す" },
  ar: { home: "الرئيسية", library: "المكتبة", artists: "الفنانون", upload: "رفع", admin: "الإدارة", signIn: "تسجيل الدخول", featured: "المقطع المميز", play: "تشغيل", search: "ابحث عن الأغاني والفنانين والألبومات", made: "مختار لك", trending: "الرائج الآن", albums: "الألبومات", lyrics: "الكلمات", tracks: "مقاطع", genres: "تصفح حسب النوع" },
  hi: { home: "होम", library: "लाइब्रेरी", artists: "कलाकार", upload: "अपलोड", admin: "एडमिन", signIn: "साइन इन", featured: "चुनिंदा गीत", play: "चलाएं", search: "गीत, कलाकार और एल्बम खोजें", made: "आपके लिए", trending: "अभी लोकप्रिय", albums: "एल्बम", lyrics: "बोल", tracks: "गीत", genres: "शैली के अनुसार खोजें" },
  ig: { home: "Ụlọ", library: "Ọba egwu", artists: "Ndị nka", upload: "Bulite", admin: "Nchịkwa", signIn: "Banye", featured: "Egwu pụrụ iche", play: "Kpọọ", search: "Chọọ egwu, ndị nka na ọba egwu", made: "Emere maka gị", trending: "Na-ewu ewu ugbu a", albums: "Ọba egwu", lyrics: "Okwu egwu", tracks: "egwu", genres: "Chọgharịa ụdị egwu" },
  it: { home: "Home", library: "Libreria", artists: "Artisti", upload: "Carica", admin: "Admin", signIn: "Accedi", featured: "Brano in evidenza", play: "Riproduci", search: "Cerca brani, artisti e album", made: "Scelto per te", trending: "Di tendenza", albums: "Album", lyrics: "Testi", tracks: "brani", genres: "Sfoglia per genere" },
  tr: { home: "Ana Sayfa", library: "Kitaplık", artists: "Sanatçılar", upload: "Yükle", admin: "Yönetim", signIn: "Giriş yap", featured: "Öne çıkan parça", play: "Oynat", search: "Şarkı, sanatçı ve albüm ara", made: "Senin İçin", trending: "Şu Anda Popüler", albums: "Albümler", lyrics: "Şarkı sözleri", tracks: "parça", genres: "Türe göre göz at" },
  srn: { home: "Oso", library: "Muziekverzameling", artists: "Artisti", upload: "Ladi", admin: "Bestuur", signIn: "Kon na ini", featured: "Fesi singi", play: "Prei", search: "Suku singi, artisti nanga album", made: "Gi yu", trending: "Now na fesi", albums: "Album", lyrics: "Singi wortu", tracks: "singi", genres: "Suku na sortu" },
  pcm: { home: "Home", library: "My Music", artists: "Artistes", upload: "Upload", admin: "Admin", signIn: "Sign in", featured: "Featured song", play: "Play am", search: "Find song, artiste or album", made: "Na For You", trending: "Wetin Dey Hot", albums: "Albums", lyrics: "Song words", tracks: "songs", genres: "Find by music type" },
  jam: { home: "Yard", library: "Mi Music", artists: "Artiste Dem", upload: "Upload", admin: "Admin", signIn: "Sign In", featured: "Featured Chune", play: "Play", search: "Search fi chune, artiste or album", made: "Fi Yuh", trending: "A Gwaan Now", albums: "Albums", lyrics: "Chune Words", tracks: "chunes", genres: "Browse by music style" },
  nl: { home: "Home", library: "Bibliotheek", artists: "Artiesten", upload: "Uploaden", admin: "Beheer", signIn: "Inloggen", featured: "Uitgelicht nummer", play: "Afspelen", search: "Zoek nummers, artiesten en albums", made: "Voor jou", trending: "Nu populair", albums: "Albums", lyrics: "Songtekst", tracks: "nummers", genres: "Bladeren op genre" },
  ln: { home: "Ndako", library: "Bibliotɛkɛ", artists: "Bayembi", upload: "Tinda", admin: "Bokambi", signIn: "Kota", featured: "Loyembo ya ntina", play: "Yoka", search: "Luka nzembo, moyembi to albomi", made: "Mpo na yo", trending: "Oyo ezali koyokana", albums: "Ba albomi", lyrics: "Maloba ya nzembo", tracks: "nzembo", genres: "Luka na lolenge" },
  yo: { home: "Ilé", library: "Àkójọpọ̀", artists: "Àwọn olórin", upload: "Gbé sókè", admin: "Ìṣàkóso", signIn: "Wọlé", featured: "Orin àkànṣe", play: "Dún", search: "Wá orin, olórin àti àwo orin", made: "Ti a ṣe fún ọ", trending: "Èyí tó gbajúmọ̀", albums: "Àwọn àwo orin", lyrics: "Ọ̀rọ̀ orin", tracks: "orin", genres: "Ṣàwárí nípa irú orin" },
};

const languages = [
  ["en", "English"], ["pcm", "Nigerian Pidgin"], ["jam", "Jamaican Patois"], ["ig", "Igbo"], ["yo", "Yorùbá"],
  ["es", "Español"], ["it", "Italiano"], ["tr", "Türkçe"], ["nl", "Nederlands"],
  ["srn", "Sranan Tongo"], ["ln", "Lingála (Congo)"], ["fr", "Français"], ["pt", "Português"],
  ["de", "Deutsch"], ["ja", "日本語"], ["ar", "العربية"], ["hi", "हिन्दी"],
];
const genreOptions = ["All", "Afrobeats", "Nigerian", "Turkish", "Traditional", "Jamaican Hip-Hop", "Reggae", "Highlife", "Blues", "Pop", "R&B", "Hip-Hop", "Gospel", "Electronic", "Jazz", "Indie"];
const trendingCountries = [
  { code: "global", label: "Global", genres: { Pop: 5, "Hip-Hop": 5, "R&B": 4, Afrobeats: 4, Nigerian: 3, Turkish: 3, Reggae: 3, "Jamaican Hip-Hop": 3, Traditional: 2, Gospel: 2, Blues: 2, Highlife: 1 } },
  { code: "ng", label: "Nigeria", genres: { Nigerian: 10, Afrobeats: 9, Gospel: 6, Traditional: 6, "Hip-Hop": 5, "R&B": 4, Highlife: 3, Pop: 2 } },
  { code: "gh", label: "Ghana", genres: { Highlife: 9, Afrobeats: 7, Traditional: 5, Gospel: 4, "Hip-Hop": 3, "R&B": 3 } },
  { code: "us", label: "United States", genres: { "Hip-Hop": 9, "R&B": 8, Pop: 7, Gospel: 4, Blues: 4, Afrobeats: 2 } },
  { code: "gb", label: "United Kingdom", genres: { Pop: 8, "R&B": 7, "Hip-Hop": 7, Afrobeats: 5, Gospel: 2 } },
  { code: "ca", label: "Canada", genres: { Pop: 8, "R&B": 7, "Hip-Hop": 6, Gospel: 3, Afrobeats: 2 } },
  { code: "za", label: "South Africa", genres: { Afrobeats: 6, Gospel: 6, "Hip-Hop": 5, Pop: 4, "R&B": 4 } },
  { code: "jm", label: "Jamaica", genres: { Reggae: 10, "Jamaican Hip-Hop": 9, Gospel: 6, Afrobeats: 5, "R&B": 4, "Hip-Hop": 4, Pop: 3 } },
  { code: "br", label: "Brazil", genres: { Pop: 8, Gospel: 5, "Hip-Hop": 4, "R&B": 4, Afrobeats: 3 } },
  { code: "fr", label: "France", genres: { Pop: 8, "Hip-Hop": 7, "R&B": 5, Afrobeats: 4, Gospel: 2 } },
  { code: "de", label: "Germany", genres: { Pop: 8, "Hip-Hop": 6, "R&B": 4, Gospel: 3, Afrobeats: 2 } },
  { code: "nl", label: "Netherlands", genres: { Pop: 8, "Hip-Hop": 6, "R&B": 5, Afrobeats: 4, Gospel: 2 } },
  { code: "it", label: "Italy", genres: { Pop: 9, "R&B": 4, "Hip-Hop": 4, Gospel: 3, Afrobeats: 2 } },
  { code: "es", label: "Spain", genres: { Pop: 9, "R&B": 5, "Hip-Hop": 4, Afrobeats: 3, Gospel: 2 } },
  { code: "tr", label: "Turkey", genres: { Turkish: 10, Traditional: 7, Pop: 9, "Hip-Hop": 5, "R&B": 4, Gospel: 2, Afrobeats: 2 } },
  { code: "sr", label: "Suriname", genres: { Pop: 7, Afrobeats: 6, Gospel: 5, "R&B": 4, "Hip-Hop": 3 } },
  { code: "cd", label: "Congo", genres: { Gospel: 7, Afrobeats: 6, "R&B": 5, Pop: 4, "Hip-Hop": 3 } },
];
const ownerEmails = Array.from(new Set([
  "udeinno01@gmail.com",
  ...(process.env.NEXT_PUBLIC_AURA_OWNER_EMAILS || "").split(/[,\s]+/),
].map((email) => email.trim().toLowerCase()).filter(Boolean)));

function isOwnerEmail(email) {
  return Boolean(email && ownerEmails.includes(email.trim().toLowerCase()));
}

function authRedirectUrl() {
  if (typeof window === "undefined") return "https://www.auramusichub.com/?auth=confirmed&open=account";
  const url = new URL(window.location.origin);
  url.searchParams.set("auth", "confirmed");
  url.searchParams.set("open", "account");
  return url.toString();
}

function cleanAuthReturnUrl() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (!url.searchParams.has("auth") && !url.searchParams.has("open")) return;
  url.searchParams.delete("auth");
  url.searchParams.delete("open");
  const cleanPath = `${url.pathname}${url.search}${url.hash}`;
  window.history.replaceState({}, "", cleanPath || "/");
}

function uniqueSongsById(items) {
  return Array.from(items.reduce((songs, song) => {
    if (song?.id && !songs.has(song.id)) songs.set(song.id, song);
    return songs;
  }, new Map()).values());
}

function collectionTagsFor(song) {
  return Array.from(new Set([song?.genre, ...(song?.collectionTags || [])].filter(Boolean)));
}

function artistNameFor(song) {
  return song?.artistId ? getArtist(song.artistId)?.name : song?.artist;
}

function addScore(scores, key, amount) {
  if (!key || !Number.isFinite(amount)) return;
  scores[key] = (scores[key] || 0) + amount;
}

function listeningRecencyBoost(timestamp) {
  const eventTime = Date.parse(timestamp || "");
  if (!Number.isFinite(eventTime)) return 1;
  const ageDays = Math.max(0, (Date.now() - eventTime) / 86400000);
  if (ageDays <= 2) return 1.35;
  if (ageDays <= 14) return 1.1;
  if (ageDays <= 45) return 0.85;
  return 0.6;
}

function buildListeningProfile(songs, listeningEvents, favorites, followedArtists) {
  const byId = new Map(songs.map((song) => [song.id, song]));
  const songScores = {};
  const tagScores = {};
  const artistScores = {};
  let positiveSignals = 0;

  for (const event of listeningEvents) {
    const song = byId.get(event.songId);
    if (!song) continue;
    const baseWeight = event.type === "favorite" ? 8 : event.type === "complete" ? 5 : event.type === "play" ? 2 : -3;
    const weight = baseWeight * listeningRecencyBoost(event.at);
    if (weight > 0) positiveSignals += 1;
    addScore(songScores, song.id, weight);
    for (const tag of collectionTagsFor(song)) addScore(tagScores, tag, weight);
    addScore(artistScores, artistNameFor(song), weight);
  }

  for (const id of favorites) {
    const song = byId.get(id);
    if (!song) continue;
    positiveSignals += 1;
    addScore(songScores, song.id, 10);
    for (const tag of collectionTagsFor(song)) addScore(tagScores, tag, 7);
    addScore(artistScores, artistNameFor(song), 7);
  }

  for (const artistId of followedArtists) {
    for (const song of songs.filter((item) => item.artistId === artistId)) {
      positiveSignals += 1;
      addScore(songScores, song.id, 4);
      for (const tag of collectionTagsFor(song)) addScore(tagScores, tag, 5);
      addScore(artistScores, artistNameFor(song), 8);
    }
  }

  return { songScores, tagScores, artistScores, hasSignals: positiveSignals > 0 };
}

function buildAuraMix(songs, listeningEvents, favorites, followedArtists) {
  const profile = buildListeningProfile(songs, listeningEvents, favorites, followedArtists);
  const ranked = songs
    .map((song, index) => {
      const tagScore = collectionTagsFor(song).reduce((sum, tag) => sum + (profile.tagScores[tag] || 0), 0);
      const artistScore = profile.artistScores[artistNameFor(song)] || 0;
      const directScore = profile.songScores[song.id] || 0;
      const freshness = 1 / (index + 2);
      return { song, score: directScore * 2.2 + tagScore * 1.15 + artistScore * 1.05 + freshness };
    })
    .sort((a, b) => b.score - a.score);

  const topTags = Object.entries(profile.tagScores)
    .filter(([tag, score]) => score > 0 && genreOptions.includes(tag))
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag)
    .slice(0, 4);
  const fallbackTags = ["Afrobeats", "Highlife", "Blues", "Pop", "R&B", "Hip-Hop", "Gospel"].filter((tag) => songs.some((song) => collectionTagsFor(song).includes(tag)));
  const tags = topTags.length ? topTags : fallbackTags;
  const mixSongs = (profile.hasSignals ? ranked : songs.map((song, index) => ({ song, score: songs.length - index }))).slice(0, Math.min(10, songs.length)).map(({ song }) => song);

  return {
    songs: mixSongs,
    tags,
    title: profile.hasSignals && tags.length ? `${tags.slice(0, 2).join(" + ")} Mix` : "Fresh AURA Mix",
    summary: profile.hasSignals
      ? `Updated from ${listeningEvents.length} listening signals, your favorites, and followed artists.`
      : "Start listening, favoriting, and following artists so AURA can shape this mix around you.",
  };
}

function buildCountryTrending(songs, listeningEvents, countryCode) {
  const country = trendingCountries.find((item) => item.code === countryCode) || trendingCountries[0];
  const genreWeights = country.genres || {};
  const signalScores = listeningEvents.reduce((items, event) => {
    if (event.country && event.country !== country.code && country.code !== "global") return items;
    const weight = event.type === "favorite" ? 8 : event.type === "complete" ? 5 : event.type === "play" ? 3 : event.type === "skip" ? -4 : 0;
    items[event.songId] = (items[event.songId] || 0) + weight;
    return items;
  }, {});
  return songs
    .map((song) => {
      const tags = collectionTagsFor(song);
      const marketScore = tags.reduce((sum, tag) => sum + (genreWeights[tag] || 0), 0);
      const publicScore = Math.log10((song.plays || 0) + 10) * 3;
      const recencyScore = song.createdAt || song.uploadedAt ? 2 : 0;
      const signalScore = signalScores[song.id] || 0;
      return { song, score: marketScore + publicScore + recencyScore + signalScore };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}

function songStatus(song) {
  return song?.status || (song?.uploadedAt ? "pending" : "published");
}

function songSourceType(song) {
  if (song?.sourceType) return song.sourceType;
  if (song?.uploadedAt) return "local";
  if (song?.source) return "starter";
  return "catalog";
}

function sourceLabel(song) {
  const source = songSourceType(song);
  if (source === "cloud") return "Supabase";
  if (source === "local") return "Local upload";
  if (source === "starter") return "Starter catalog";
  return "Catalog";
}

function shortDate(value) {
  if (!value) return "Today";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Today";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function dateLabelFor(song) {
  const value = song?.createdAt || song?.uploadedAt;
  if (value) return shortDate(value);
  return songSourceType(song) === "starter" ? "Starter catalog" : "No date";
}

function loadJson(key, fallback, legacyKey) {
  if (typeof window === "undefined") return fallback;
  try {
    const fallbackKeys = Array.isArray(legacyKey) ? legacyKey : legacyKey ? [legacyKey] : [];
    const value = [key, ...fallbackKeys]
      .map((storageKey) => window.localStorage.getItem(storageKey))
      .find((storedValue) => storedValue !== null);
    return value ? JSON.parse(value) : fallback;
  } catch { return fallback; }
}

export default function HomePage() {
  const audioRef = useRef(null);
  const [view, setView] = useState("home");
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All");
  const [trendCountry, setTrendCountry] = useState("global");
  const [collectionSongIds, setCollectionSongIds] = useState([]);
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("dark");
  const [uploads, setUploads] = useState([]);
  const [cloudSongs, setCloudSongs] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [followedArtists, setFollowedArtists] = useState([]);
  const [listeningEvents, setListeningEvents] = useState([]);
  const [contentReports, setContentReports] = useState([]);
  const [deletionRequests, setDeletionRequests] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [releaseLogs, setReleaseLogs] = useState([]);
  const [ownerChangeEvents, setOwnerChangeEvents] = useState([]);
  const [adminStats, setAdminStats] = useState({ users: 0, reports: 0, deletionRequests: 0, auditLogs: 0, releaseLogs: 0, ownerChanges: 0, storageMb: 0 });
  const [user, setUser] = useState(null);
  const [storageReady, setStorageReady] = useState(false);
  const [adminVerified, setAdminVerified] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showReport, setShowReport] = useState(null);
  const [accountStatus, setAccountStatus] = useState("");
  const [reportStatus, setReportStatus] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [adminStatus, setAdminStatus] = useState("");
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [currentId, setCurrentId] = useState(seedSongs[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playQueue, setPlayQueue] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(seedSongs[0].duration);
  const [volume, setVolume] = useState(0.72);
  const [deviceStatus, setDeviceStatus] = useState("");
  const [selectedArtist, setSelectedArtist] = useState(artists[0].id);
  const [uploadForm, setUploadForm] = useState({ title: "", artist: "", album: "", genre: "Indie", audio: "", cover: "", audioFile: null, coverFile: null, lyrics: "" });

  const t = copy[language] || copy.en;
  const isAdmin = adminVerified;
  const roleLabel = user?.role ? `${user.role.slice(0, 1).toUpperCase()}${user.role.slice(1)}` : "Listener";
  const navItems = [
    { id: "home", label: t.home, icon: Home }, { id: "library", label: t.library, icon: Library },
    { id: "artists", label: t.artists, icon: Mic2 }, { id: "upload", label: t.upload, icon: UploadCloud },
    ...(isAdmin ? [{ id: "admin", label: t.admin, icon: Shield }] : []),
  ];

  useEffect(() => {
    setFavorites(loadJson(storageKeys.favorites, [], legacyKeys.favorites));
    setUploads(loadJson(storageKeys.uploads, [], legacyKeys.uploads).filter((song) => song.audio && !song.audio.includes("soundhelix.com")));
    setListeningEvents(loadJson(storageKeys.listeningEvents, []));
    setFollowedArtists(loadJson(storageKeys.followedArtists, []));
    setContentReports(loadJson(storageKeys.contentReports, []));
    setDeletionRequests(loadJson(storageKeys.deletionRequests, []));
    setAuditLogs(loadJson(storageKeys.auditLogs, []));
    setReleaseLogs(loadJson(storageKeys.releaseLogs, []));
    setOwnerChangeEvents(loadJson(storageKeys.ownerChanges, []));
    const savedUser = loadJson(storageKeys.user, null, legacyKeys.user);
    setUser(savedUser);
    setAdminVerified(savedUser?.role === "admin" || isOwnerEmail(savedUser?.email));
    const savedLanguage = window.localStorage.getItem(storageKeys.language);
    const savedTrendCountry = window.localStorage.getItem(storageKeys.trendCountry);
    const browserLanguage = window.navigator.language?.slice(0, 2);
    setLanguage(savedLanguage || (copy[browserLanguage] ? browserLanguage : "en"));
    if (trendingCountries.some((country) => country.code === savedTrendCountry)) setTrendCountry(savedTrendCountry);
    setStorageReady(true);
  }, []);

  useEffect(() => {
    const savedInstallState = loadJson(storageKeys.installState, null, legacyKeys.installState);
    const standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
    const installed = standalone || savedInstallState === "installed";
    setIsInstalled(installed);
    if (installed) window.localStorage.setItem(storageKeys.installState, JSON.stringify("installed"));
    const onPrompt = (event) => {
      event.preventDefault();
      const alreadyInstalled = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true || loadJson(storageKeys.installState, null, legacyKeys.installState) === "installed";
      if (alreadyInstalled) {
        setInstallPrompt(null);
        setIsInstalled(true);
        return;
      }
      setInstallPrompt(event);
    };
    const onInstalled = () => {
      window.localStorage.setItem(storageKeys.installState, JSON.stringify("installed"));
      setInstallPrompt(null);
      setIsInstalled(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => { window.removeEventListener("beforeinstallprompt", onPrompt); window.removeEventListener("appinstalled", onInstalled); };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("auth") !== "confirmed") return;
    setShowAccount(true);
    setAccountStatus(isCloudConfigured
      ? "Finishing your secure sign-in..."
      : "Your email was confirmed. Connect Supabase in production to restore the account session here.");
    if (!isCloudConfigured) cleanAuthReturnUrl();
  }, []);

  useEffect(() => {
    const client = getSupabase();
    if (!client) return undefined;
    let active = true;

    async function syncSession(session) {
      if (!active) return;
      const authReturn = new URLSearchParams(window.location.search).get("auth") === "confirmed";
      if (!session?.user) {
        setUser(null);
        setAdminVerified(false);
        if (authReturn) {
          setShowAccount(true);
          setAccountStatus("Your email was confirmed. If you do not see your account yet, tap the secure link again from this device.");
          cleanAuthReturnUrl();
        }
        return;
      }
      const metadata = session.user.user_metadata || {};
      const ownerEmail = isOwnerEmail(session.user.email);
      let { data: profile } = await client
        .from("profiles")
        .select("display_name,role")
        .eq("id", session.user.id)
        .maybeSingle();
      if (ownerEmail && profile?.role !== "admin") {
        const { data: ownerProfile } = await client.rpc("ensure_owner_admin");
        if (ownerProfile) profile = ownerProfile;
      }
      if (!active) return;
      const role = ownerEmail ? "admin" : profile?.role || "listener";
      const displayName = profile?.display_name || metadata.name || metadata.display_name || session.user.email?.split("@")[0] || "Music fan";
      setAdminVerified(role === "admin");
      if (ownerEmail && profile?.role !== "admin") {
        setAdminStatus("Owner access is visible here. Run the latest Supabase owner SQL to activate secure moderation in the database.");
      }
      setUser({
        id: session.user.id,
        name: displayName,
        email: session.user.email,
        role,
        cloud: true,
      });
      if (authReturn) {
        setView("home");
        setShowAccount(true);
        setAccountStatus("You are signed in. Welcome back to AURA.");
        cleanAuthReturnUrl();
      }
      const [{ data: savedFavorites }, { data: savedEvents }, { data: savedFollows }] = await Promise.all([
        client.from("favorites").select("song_id"),
        client.from("listening_events").select("song_id,event_type,created_at").order("created_at", { ascending: false }).limit(250),
        client.from("artist_follows").select("artist_id"),
      ]);
      if (active && savedFavorites) setFavorites(savedFavorites.map((item) => item.song_id));
      if (active && savedEvents) setListeningEvents(savedEvents.map((item) => ({ songId: item.song_id, type: item.event_type, at: item.created_at })));
      if (active && savedFollows) setFollowedArtists(savedFollows.map((item) => item.artist_id));
    }

    client.auth.getSession().then(({ data }) => syncSession(data.session));
    const { data: authListener } = client.auth.onAuthStateChange((_event, session) => syncSession(session));
    return () => { active = false; authListener.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    const client = getSupabase();
    if (!client) return;
    let active = true;
    let query = client
      .from("songs")
      .select("id,title,artist_name,album,genre,audio_url,cover_url,lyrics,status,owner_id,created_at")
      .order("created_at", { ascending: false });
    if (!isAdmin) query = query.eq("status", "published");
    query.then(({ data }) => {
      if (!active || !data) return;
      setCloudSongs(data.map((song) => ({
        id: song.id,
        title: song.title,
        artist: song.artist_name,
        album: song.album || "Single",
        genre: song.genre || "Indie",
        collectionTags: [song.genre || "Indie"],
        status: song.status || "published",
        ownerId: song.owner_id,
        sourceType: "cloud",
        createdAt: song.created_at,
        audio: song.audio_url,
        cover: song.cover_url || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=900&q=80",
        lyrics: song.lyrics || [],
        duration: 180,
        plays: 0,
      })));
    });
    return () => { active = false; };
  }, [isAdmin, user?.id]);

  useEffect(() => { document.documentElement.classList.toggle("light", theme === "light"); }, [theme]);
  useEffect(() => { if (view === "admin" && !isAdmin) setView("home"); }, [view, isAdmin]);
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem(storageKeys.language, language);
  }, [language]);
  useEffect(() => { window.localStorage.setItem(storageKeys.favorites, JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { window.localStorage.setItem(storageKeys.uploads, JSON.stringify(uploads)); }, [uploads]);
  useEffect(() => { window.localStorage.setItem(storageKeys.listeningEvents, JSON.stringify(listeningEvents.slice(0, 250))); }, [listeningEvents]);
  useEffect(() => { window.localStorage.setItem(storageKeys.followedArtists, JSON.stringify(followedArtists)); }, [followedArtists]);
  useEffect(() => { window.localStorage.setItem(storageKeys.contentReports, JSON.stringify(contentReports.slice(0, 250))); }, [contentReports]);
  useEffect(() => { window.localStorage.setItem(storageKeys.deletionRequests, JSON.stringify(deletionRequests.slice(0, 100))); }, [deletionRequests]);
  useEffect(() => { window.localStorage.setItem(storageKeys.auditLogs, JSON.stringify(auditLogs.slice(0, 250))); }, [auditLogs]);
  useEffect(() => { window.localStorage.setItem(storageKeys.releaseLogs, JSON.stringify(releaseLogs.slice(0, 100))); }, [releaseLogs]);
  useEffect(() => { window.localStorage.setItem(storageKeys.ownerChanges, JSON.stringify(ownerChangeEvents.slice(0, 250))); }, [ownerChangeEvents]);
  useEffect(() => { window.localStorage.setItem(storageKeys.trendCountry, trendCountry); }, [trendCountry]);
  useEffect(() => {
    if (!storageReady) return;
    user ? window.localStorage.setItem(storageKeys.user, JSON.stringify(user)) : window.localStorage.removeItem(storageKeys.user);
  }, [storageReady, user]);

  useEffect(() => {
    const client = getSupabase();
    if (!client || !isAdmin) return;
    let active = true;

    async function refreshOwnerData() {
      const [users, reports, deletions, audits, releases, changes, reportRows, deletionRows, auditRows, releaseRows, changeRows] = await Promise.all([
        client.from("profiles").select("id", { count: "exact", head: true }),
        client.from("content_reports").select("id", { count: "exact", head: true }),
        client.from("account_deletion_requests").select("id", { count: "exact", head: true }),
        client.from("audit_logs").select("id", { count: "exact", head: true }),
        client.from("release_logs").select("id", { count: "exact", head: true }),
        client.from("owner_change_events").select("id", { count: "exact", head: true }),
        client.from("content_reports").select("id,song_id,song_title,reason,status,created_at").order("created_at", { ascending: false }).limit(50),
        client.from("account_deletion_requests").select("id,email,status,created_at").order("created_at", { ascending: false }).limit(50),
        client.from("audit_logs").select("id,action,entity_type,entity_id,details,created_at").order("created_at", { ascending: false }).limit(50),
        client.from("release_logs").select("id,version,status,notes,created_at").order("created_at", { ascending: false }).limit(50),
        client.from("owner_change_events").select("id,change_type,title,detail,actor_email,metadata,created_at").order("created_at", { ascending: false }).limit(80),
      ]);
      if (!active) return;
      setAdminStats({
        users: users.count || 0,
        reports: reports.count || 0,
        deletionRequests: deletions.count || 0,
        auditLogs: audits.count || 0,
        releaseLogs: releases.count || 0,
        ownerChanges: changes.count || 0,
        storageMb: Math.round(cloudSongs.length * 4.5),
      });
      if (reportRows.data) setContentReports(reportRows.data);
      if (deletionRows.data) setDeletionRequests(deletionRows.data);
      if (auditRows.data) setAuditLogs(auditRows.data);
      if (releaseRows.data) setReleaseLogs(releaseRows.data);
      if (changeRows.data) setOwnerChangeEvents(changeRows.data);
    }

    refreshOwnerData();
    const interval = window.setInterval(refreshOwnerData, 15000);
    const channel = client.channel("owner-private-change-watch")
      .on("postgres_changes", { event: "*", schema: "public", table: "owner_change_events" }, refreshOwnerData)
      .on("postgres_changes", { event: "*", schema: "public", table: "content_reports" }, refreshOwnerData)
      .on("postgres_changes", { event: "*", schema: "public", table: "account_deletion_requests" }, refreshOwnerData)
      .on("postgres_changes", { event: "*", schema: "public", table: "audit_logs" }, refreshOwnerData)
      .on("postgres_changes", { event: "*", schema: "public", table: "release_logs" }, refreshOwnerData)
      .subscribe();
    return () => { active = false; window.clearInterval(interval); client.removeChannel(channel); };
  }, [isAdmin, cloudSongs.length]);

  const allSongs = useMemo(() => uniqueSongsById([...uploads, ...cloudSongs, ...seedSongs]), [uploads, cloudSongs]);
  const currentSong = allSongs.find((song) => song.id === currentId) ?? allSongs[0];
  const currentArtist = currentSong.artistId ? getArtist(currentSong.artistId) : { name: currentSong.artist };
  const featuredSong = cloudSongs[0] || seedSongs[0];
  const featuredArtist = featuredSong.artistId ? getArtist(featuredSong.artistId)?.name : featuredSong.artist;
  const filteredSongs = useMemo(() => {
    const term = query.trim().toLowerCase();
    return allSongs.filter((song) => {
      const artist = song.artistId ? getArtist(song.artistId)?.name : song.artist;
      const matchesSearch = !term || [song.title, artist, song.album].some((value) => value?.toLowerCase().includes(term));
      const matchesCollection = genre === "All" || collectionTagsFor(song).includes(genre) || collectionSongIds.includes(song.id);
      return matchesSearch && matchesCollection;
    });
  }, [allSongs, query, genre, collectionSongIds]);
  const activeLyricIndex = useMemo(() => (currentSong.lyrics ?? []).reduce((active, line, index) => currentTime >= line.time ? index : active, 0), [currentSong, currentTime]);
  const auraMix = useMemo(() => buildAuraMix(allSongs, listeningEvents, favorites, followedArtists), [allSongs, favorites, followedArtists, listeningEvents]);
  const countryTrending = useMemo(() => buildCountryTrending(allSongs, listeningEvents, trendCountry), [allSongs, listeningEvents, trendCountry]);

  useEffect(() => {
    if (!storageReady) return;
    const songParam = new URLSearchParams(window.location.search).get("song");
    if (songParam && allSongs.some((song) => song.id === songParam)) setCurrentId(songParam);
  }, [storageReady, allSongs]);

  useEffect(() => {
    if (!("mediaSession" in navigator) || !currentSong) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentSong.title,
      artist: currentArtist?.name || currentSong.artist || "AURA",
      album: currentSong.album || "AURA",
      artwork: currentSong.cover ? [{ src: currentSong.cover, sizes: "512x512", type: "image/png" }] : [],
    });
    navigator.mediaSession.setActionHandler("play", () => audioRef.current?.play().then(() => setIsPlaying(true)));
    navigator.mediaSession.setActionHandler("pause", () => { audioRef.current?.pause(); setIsPlaying(false); });
    navigator.mediaSession.setActionHandler("previoustrack", () => nextSong(-1));
    navigator.mediaSession.setActionHandler("nexttrack", () => nextSong(1));
  }, [currentSong, currentArtist, allSongs, playQueue]);

  const recommendations = useMemo(() => {
    const genreScores = {};
    for (const event of listeningEvents) {
      const song = allSongs.find((item) => item.id === event.songId);
      if (!song?.genre) continue;
      const weight = event.type === "favorite" ? 5 : event.type === "complete" ? 3 : event.type === "play" ? 1 : -2;
      genreScores[song.genre] = (genreScores[song.genre] || 0) + weight;
    }
    for (const id of favorites) {
      const song = allSongs.find((item) => item.id === id);
      if (song?.genre) genreScores[song.genre] = (genreScores[song.genre] || 0) + 5;
    }
    for (const artistId of followedArtists) {
      for (const song of allSongs.filter((item) => item.artistId === artistId)) {
        if (song.genre) genreScores[song.genre] = (genreScores[song.genre] || 0) + 4;
      }
    }
    return allSongs
      .map((song) => ({ song, score: (genreScores[song.genre] || 0) + Math.log10((song.plays || 0) + 10) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(({ song }) => ({
        title: song.title,
        description: genreScores[song.genre] ? `Because you listen to ${song.genre}` : `${song.genre || "Fresh"} pick for you`,
        songId: song.id,
        image: song.cover,
      }));
  }, [allSongs, favorites, followedArtists, listeningEvents]);

  function recordEvent(songId, type) {
    const event = { songId, type, country: trendCountry, at: new Date().toISOString() };
    setListeningEvents((items) => [event, ...items].slice(0, 250));
    const client = getSupabase();
    if (client && user?.cloud) client.from("listening_events").insert({ user_id: user.id, song_id: songId, event_type: type });
  }

  function playSong(id, queue = null) {
    if (!id) return;
    setPlayQueue(Array.isArray(queue) ? queue.filter(Boolean) : []);
    recordEvent(id, "play");
    setCurrentId(id);
    setIsPlaying(true);
    setTimeout(() => audioRef.current?.play().catch(() => setIsPlaying(false)), 50);
  }
  function playAuraMix() {
    const queue = auraMix.songs.map((song) => song.id);
    playSong(queue[0], queue);
  }
  function togglePlay() {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  }
  function nextSong(direction = 1, eventType = "skip") {
    if (eventType) recordEvent(currentSong.id, eventType);
    const availableIds = new Set(allSongs.map((song) => song.id));
    const queue = (playQueue.length ? playQueue : allSongs.map((song) => song.id)).filter((id) => availableIds.has(id));
    const activeQueue = queue.length ? queue : allSongs.map((song) => song.id);
    const index = activeQueue.includes(currentSong.id) ? activeQueue.indexOf(currentSong.id) : 0;
    playSong(activeQueue[(index + direction + activeQueue.length) % activeQueue.length], activeQueue);
  }
  async function toggleFavorite(id) {
    const isFavorite = favorites.includes(id);
    setFavorites((items) => isFavorite ? items.filter((item) => item !== id) : [...items, id]);
    if (!isFavorite) recordEvent(id, "favorite");
    const client = getSupabase();
    if (!client || !user?.cloud) return;
    if (isFavorite) await client.from("favorites").delete().eq("user_id", user.id).eq("song_id", id);
    else await client.from("favorites").upsert({ user_id: user.id, song_id: id });
  }
  async function toggleFollow(artistId) {
    const isFollowing = followedArtists.includes(artistId);
    setFollowedArtists((items) => isFollowing ? items.filter((item) => item !== artistId) : [...items, artistId]);
    const client = getSupabase();
    if (!client || !user?.cloud) return;
    if (isFollowing) await client.from("artist_follows").delete().eq("user_id", user.id).eq("artist_id", artistId);
    else await client.from("artist_follows").upsert({ user_id: user.id, artist_id: artistId });
  }
  async function installApp() {
    if (isInstalled || !installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice?.outcome === "accepted") {
      window.localStorage.setItem(storageKeys.installState, JSON.stringify("installed"));
      setIsInstalled(true);
    }
    setInstallPrompt(null);
  }
  async function submitAccount(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = form.get("name") || "Music fan";
    const email = form.get("email") || "listener@example.com";
    const client = getSupabase();
    if (client) {
      setAccountStatus("Sending your secure sign-in link...");
      const { error } = await client.auth.signInWithOtp({ email, options: { emailRedirectTo: authRedirectUrl(), data: { name } } });
      setAccountStatus(error ? error.message : "Check your email. The secure link will bring you straight back into AURA after confirmation.");
      return;
    }
    const ownerEmail = isOwnerEmail(email);
    setAdminVerified(ownerEmail);
    setUser({ name, email, role: ownerEmail ? "admin" : "Creator", cloud: false });
    setAccountStatus("");
    setShowAccount(false);
  }

  async function signOut() {
    const client = getSupabase();
    if (client && user?.cloud) await client.auth.signOut();
    setUser(null);
    setAdminVerified(false);
  }

  async function recordOwnerChange(changeType, title, detail, metadata = {}) {
    const event = {
      id: `change-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      change_type: changeType,
      title,
      detail,
      actor_email: user?.email || metadata.actor_email || null,
      metadata,
      created_at: new Date().toISOString(),
    };
    if (isAdmin) setOwnerChangeEvents((items) => [event, ...items].slice(0, 250));
    const client = getSupabase();
    if (!client) return;
    await client.from("owner_change_events").insert({
      change_type: changeType,
      title,
      detail,
      actor_email: user?.email || metadata.actor_email || null,
      metadata,
    });
  }

  async function requestAccountDeletion() {
    if (!user) return;
    const request = { id: `delete-${Date.now()}`, email: user.email, status: "requested", created_at: new Date().toISOString() };
    const client = getSupabase();
    if (client && user.cloud) {
      const { error } = await client.from("account_deletion_requests").insert({ email: user.email, reason: "User requested account deletion from AURA account panel." });
      if (error) { setAccountStatus(error.message); return; }
    }
    setDeletionRequests((items) => [request, ...items]);
    setFavorites([]);
    setFollowedArtists([]);
    setListeningEvents([]);
    setUploads([]);
    await recordOwnerChange("account", "Account deletion requested", `${user.email} asked the owner to delete account data.`, { email: user.email });
    await signOut();
    setAccountStatus("Your deletion request was recorded. The owner must complete permanent deletion in Supabase.");
  }
  function parseLyrics(text) {
    return text.split("\n").map((line, index) => {
      const match = line.match(/^\[(\d+):(\d+)]\s*(.+)$/);
      return match ? { time: Number(match[1]) * 60 + Number(match[2]), text: match[3] } : { time: index * 15, text: line.trim() };
    }).filter((line) => line.text);
  }
  async function uploadAsset(file, kind) {
    const client = getSupabase();
    const { data } = await client.auth.getSession();
    const response = await fetch("/api/uploads/sign", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${data.session.access_token}` },
      body: JSON.stringify({ filename: file.name, contentType: file.type, kind }),
    });
    const signed = await response.json();
    if (!response.ok) throw new Error(signed.error || "Upload authorization failed.");
    const uploadResponse = await fetch(signed.uploadUrl, { method: "PUT", headers: { "content-type": file.type }, body: file });
    if (!uploadResponse.ok) throw new Error(`The ${kind} upload failed.`);
    return signed.publicUrl;
  }

  async function submitUpload(event) {
    event.preventDefault();
    setUploadStatus("Preparing your release...");
    const client = getSupabase();
    if ((uploadForm.audioFile || uploadForm.coverFile) && (!client || !user?.cloud)) {
      setUploadStatus("Connect Supabase and sign in to upload files securely. URL uploads still work in prototype mode.");
      return;
    }
    let audioUrl = uploadForm.audio.trim();
    let coverUrl = uploadForm.cover.trim();
    try {
      if (uploadForm.audioFile) audioUrl = await uploadAsset(uploadForm.audioFile, "audio");
      if (uploadForm.coverFile) coverUrl = await uploadAsset(uploadForm.coverFile, "cover");
    } catch (error) {
      setUploadStatus(error.message);
      return;
    }
    if (!audioUrl) {
      setUploadStatus("Add an audio file or audio URL before submitting.");
      return;
    }
    const id = `upload-${Date.now()}`;
    const song = {
      id, title: uploadForm.title || "Untitled song", artist: uploadForm.artist || user?.name || "Independent artist",
      album: uploadForm.album || "Uploads", genre: uploadForm.genre, duration: 180, plays: 0, color: "#38bdf8",
      collectionTags: [uploadForm.genre], status: "pending", sourceType: client && user?.cloud ? "cloud" : "local",
      cover: coverUrl || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=900&q=80",
      audio: audioUrl,
      lyrics: parseLyrics(uploadForm.lyrics || "Your first uploaded lyric line\nAdd timestamps like [0:15] Chorus begins"), uploadedAt: new Date().toISOString(),
    };
    if (client && user?.cloud) {
      const { data, error } = await client.from("songs").insert({
        owner_id: user.id, title: song.title, artist_name: song.artist, album: song.album, genre: song.genre,
        audio_url: song.audio, cover_url: song.cover, lyrics: song.lyrics, status: "pending",
      }).select("id,status,created_at").single();
      if (error) { setUploadStatus(error.message); return; }
      if (data) {
        song.id = data.id;
        song.status = data.status || "pending";
        song.createdAt = data.created_at;
      }
      setUploadStatus("Uploaded. Your release is now in the moderation queue.");
    } else setUploadStatus("Saved in prototype mode on this device.");
    setUploads((items) => [song, ...items]); setCurrentId(id);
    await recordOwnerChange("upload", "New song entered review", `${song.title} by ${song.artist} is waiting for owner review.`, { song_id: song.id, status: song.status, genre: song.genre });
    setUploadForm({ title: "", artist: "", album: "", genre: "Indie", audio: "", cover: "", audioFile: null, coverFile: null, lyrics: "" });
    if (!client) setView("library");
  }

  async function deleteUploadedSong(songId) {
    const song = allSongs.find((item) => item.id === songId);
    if (!song) return;
    const source = songSourceType(song);
    if (!["local", "cloud"].includes(source)) return;
    if (source === "cloud") {
      const client = getSupabase();
      if (!client || !user?.cloud) {
        setUploadStatus("Sign in to delete cloud uploads.");
        return;
      }
      const { error } = await client.from("songs").delete().eq("id", songId);
      if (error) { setUploadStatus(error.message); return; }
      setCloudSongs((items) => items.filter((item) => item.id !== songId));
    }
    setUploads((items) => items.filter((item) => item.id !== songId));
    setAuditLogs((items) => [{ id: `audit-${Date.now()}`, action: "delete_song", entity_type: "song", entity_id: songId, details: { title: song.title }, created_at: new Date().toISOString() }, ...items]);
    await recordOwnerChange("catalog", "Song deleted", `${song.title} was removed from the catalog workspace.`, { song_id: songId, title: song.title });
  }

  async function updateSongStatus(songId, status) {
    const song = allSongs.find((item) => item.id === songId);
    if (!song) return;
    const localOnly = songSourceType(song) === "local";
    setAdminStatus(`Updating ${song.title}...`);
    if (localOnly) {
      setUploads((items) => items.map((item) => item.id === songId ? { ...item, status } : item));
      setAuditLogs((items) => [{ id: `audit-${Date.now()}`, action: `mark_${status}`, entity_type: "song", entity_id: songId, details: { title: song.title }, created_at: new Date().toISOString() }, ...items]);
      await recordOwnerChange("moderation", `Song marked ${status}`, `${song.title} was marked ${status} in prototype mode.`, { song_id: songId, status });
      setAdminStatus(`${song.title} marked ${status} in prototype mode.`);
      return;
    }
    const client = getSupabase();
    if (!client || !user?.cloud) {
      setAdminStatus("Supabase is not connected, so only local prototype uploads can be moderated here.");
      return;
    }
    const { error } = await client.from("songs").update({ status }).eq("id", songId);
    if (error) {
      setAdminStatus(error.message);
      return;
    }
    setCloudSongs((items) => items.map((item) => item.id === songId ? { ...item, status } : item));
    setUploads((items) => items.map((item) => item.id === songId ? { ...item, status } : item));
    await client.from("audit_logs").insert({ action: `mark_${status}`, entity_type: "song", entity_id: songId, details: { title: song.title, status } });
    setAuditLogs((items) => [{ id: `audit-${Date.now()}`, action: `mark_${status}`, entity_type: "song", entity_id: songId, details: { title: song.title, status }, created_at: new Date().toISOString() }, ...items]);
    await recordOwnerChange("moderation", `Song marked ${status}`, `${song.title} was marked ${status}.`, { song_id: songId, status });
    setAdminStatus(`${song.title} is now ${status}.`);
  }

  async function submitReport(event) {
    event.preventDefault();
    if (!showReport) return;
    const form = new FormData(event.currentTarget);
    const reason = form.get("reason") || "copyright";
    const details = form.get("details") || "";
    const report = {
      id: `report-${Date.now()}`,
      song_id: showReport.id,
      song_title: showReport.title,
      reason,
      details,
      status: "open",
      created_at: new Date().toISOString(),
    };
    const client = getSupabase();
    if (client) {
      const { error } = await client.from("content_reports").insert({
        song_id: showReport.id,
        song_title: showReport.title,
        reason,
        details,
        reporter_email: user?.email || null,
        status: "open",
      });
      if (error) { setReportStatus(error.message); return; }
    }
    setContentReports((items) => [report, ...items]);
    await recordOwnerChange("report", "New content report", `${showReport.title} was reported for ${reason}.`, { song_id: showReport.id, reason });
    setReportStatus("Report submitted. The owner can review it in the Admin dashboard.");
    setShowReport(null);
  }

  function shareSong(song) {
    const url = `${window.location.origin}/?song=${encodeURIComponent(song.id)}`;
    if (navigator.share) navigator.share({ title: song.title, text: `Listen to ${song.title} on AURA`, url }).catch(() => {});
    else navigator.clipboard?.writeText(url);
  }

  function canDeleteSong(song) {
    const source = songSourceType(song);
    return source === "local" || (source === "cloud" && user?.cloud && song.ownerId === user.id);
  }

  async function chooseAudioOutput() {
    const audio = audioRef.current;
    if (audio?.setSinkId && navigator.mediaDevices?.selectAudioOutput) {
      try {
        const device = await navigator.mediaDevices.selectAudioOutput();
        await audio.setSinkId(device.deviceId);
        setDeviceStatus(`Playing through ${device.label || "selected output"}.`);
      } catch {
        setDeviceStatus("Audio output selection was cancelled.");
      }
      return;
    }
    setDeviceStatus("Pair Bluetooth in your phone or computer settings, then play AURA through that device.");
  }

  async function openAirPlay() {
    const audio = audioRef.current;
    if (audio?.webkitShowPlaybackTargetPicker) {
      audio.webkitShowPlaybackTargetPicker();
      setDeviceStatus("Choose an AirPlay device.");
      return;
    }
    setDeviceStatus("AirPlay is available through Safari/iOS playback controls when the device supports it.");
  }

  async function openCast() {
    const audio = audioRef.current;
    if (audio?.remote?.prompt) {
      try {
        await audio.remote.prompt();
        setDeviceStatus("Choose a cast device.");
      } catch {
        setDeviceStatus("Cast selection was cancelled or no cast device was found.");
      }
      return;
    }
    setDeviceStatus("Cast needs a browser with Remote Playback support or a future Google Cast SDK setup.");
  }

  const favoriteSongs = allSongs.filter((song) => favorites.includes(song.id));

  return (
    <main className="app-shell">
      <header className="site-header">
        <button className="brand" onClick={() => setView("home")} aria-label="AURA home"><span className="brand-mark"><Music2 size={19} /></span><span>AURA</span></button>
        <nav className="nav" aria-label="Main navigation">
          {navItems.map((item) => { const Icon = item.icon; return <button key={item.id} className={view === item.id ? "active" : ""} onClick={() => setView(item.id)} aria-label={item.label} title={item.label}><Icon size={17} /><span>{item.label}</span></button>; })}
        </nav>
        <div className="header-actions">
          <label className="language" title="Language"><Globe2 size={17} /><select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label="Language">{languages.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
          {installPrompt && !isInstalled && <button className="icon-btn" onClick={installApp} title="Install AURA" aria-label="Install AURA"><Download size={18} /></button>}
          <button className="icon-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title="Toggle theme" aria-label="Toggle theme">{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</button>
          <button className="account-btn" onClick={() => setShowAccount(true)} aria-label={user ? `Account: ${user.name}` : t.signIn} title={user ? user.name : t.signIn}><User size={17} /><span>{user ? user.name : t.signIn}</span></button>
        </div>
      </header>

      <div className="main">
        {view === "home" && <>
          <section className="hero">
            <div className="hero-copy"><p className="brand-promise">Your music. Your moments. Your AURA.</p><p className="eyebrow">{t.featured}</p><h1>{featuredSong.title}</h1><p>{featuredArtist} · {featuredSong.album}</p><div className="button-row"><button className="primary-btn" onClick={() => playSong(featuredSong.id)}><Play size={17} />{t.play}</button><button className="secondary-btn" onClick={() => setView("upload")}><UploadCloud size={17} />{t.upload}</button></div></div>
            <img src={featuredSong.cover} alt={`${featuredSong.title} album cover`} />
          </section>

          {!user && <section className="account-cta"><div><Sparkles size={20} /><div><h2>Keep your AURA with you</h2><p>Save favorites, follow artists, and get recommendations that improve as you listen.</p></div></div><button className="primary-btn" onClick={() => setShowAccount(true)}><UserPlus size={18} />Create free account</button></section>}

          <label className="search"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} /></label>
          <section className="genre-section" aria-label={t.genres}><div className="genre-pills">{genreOptions.map((item) => <button key={item} className={genre === item ? "active" : ""} onClick={() => { setCollectionSongIds([]); setGenre(item); }}>{item}</button>)}</div></section>
          <AutoMix mix={auraMix} onPlayMix={playAuraMix} onPlaySong={(id) => playSong(id, auraMix.songs.map((song) => song.id))} />
          <CountryTrending songs={countryTrending} country={trendCountry} countries={trendingCountries} onCountry={setTrendCountry} onPlay={(id) => playSong(id, countryTrending.map((item) => item.song.id))} />
          <Recommendations title={t.made} picks={recommendations} onPlay={playSong} />
          <SongSection title={query || genre !== "All" ? `Catalog · ${genre}` : "Catalog"} songs={filteredSongs} onPlay={playSong} favorites={favorites} onFavorite={toggleFavorite} onReport={setShowReport} onShare={shareSong} trackLabel={t.tracks} />
          <Albums title={t.albums} songs={allSongs} onPlay={playSong} />
          <Lyrics title={t.lyrics} song={currentSong} artist={currentArtist} activeIndex={activeLyricIndex} />
        </>}

        {view === "library" && <><PageTitle title={t.library} subtitle="Saved music, uploads, and playlists." /><AutoMix mix={auraMix} onPlayMix={playAuraMix} onPlaySong={(id) => playSong(id, auraMix.songs.map((song) => song.id))} /><SongSection title="Your library" songs={filteredSongs} onPlay={playSong} favorites={favorites} onFavorite={toggleFavorite} onReport={setShowReport} onShare={shareSong} onDelete={deleteUploadedSong} canDelete={canDeleteSong} trackLabel={t.tracks} /><SongSection title="Favorites" songs={favoriteSongs} onPlay={playSong} favorites={favorites} onFavorite={toggleFavorite} onReport={setShowReport} onShare={shareSong} empty="Tap the heart beside a song to save it here." trackLabel={t.tracks} /><Playlists songs={allSongs} onPlay={playSong} onSelectTag={(tag, songIds = []) => { setQuery(""); setCollectionSongIds(songIds); setGenre(tag); setView("home"); }} /></>}
        {view === "artists" && <><PageTitle title={t.artists} subtitle="Meet the voices shaping AURA." /><Artists songs={allSongs} useCloudCatalog={cloudSongs.length > 0} selectedArtist={selectedArtist} onSelect={setSelectedArtist} onPlay={playSong} followedArtists={followedArtists} onFollow={toggleFollow} /></>}
        {view === "upload" && <section className="section panel">
          <PageTitle title="Upload songs and lyrics" subtitle={isCloudConfigured ? "Secure uploads enter moderation before appearing in AURA." : "Prototype mode is active. Connect Supabase and R2 to accept secure file uploads."} />
          <form className="form-grid" onSubmit={submitUpload}>
            {["title", "artist", "album"].map((field) => <label className="field" key={field}><span>{field}</span><input value={uploadForm[field]} onChange={(event) => setUploadForm({ ...uploadForm, [field]: event.target.value })} /></label>)}
            <label className="field"><span>Genre</span><select value={uploadForm.genre} onChange={(event) => setUploadForm({ ...uploadForm, genre: event.target.value })}>{genreOptions.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="field"><span>Audio file</span><input type="file" accept="audio/*" onChange={(event) => setUploadForm({ ...uploadForm, audioFile: event.target.files?.[0] || null })} /></label>
            <label className="field"><span>Cover artwork</span><input type="file" accept="image/*" onChange={(event) => setUploadForm({ ...uploadForm, coverFile: event.target.files?.[0] || null })} /></label>
            <label className="field full"><span>Audio URL fallback</span><input value={uploadForm.audio} onChange={(event) => setUploadForm({ ...uploadForm, audio: event.target.value })} /></label>
            <label className="field full"><span>Cover image URL fallback</span><input value={uploadForm.cover} onChange={(event) => setUploadForm({ ...uploadForm, cover: event.target.value })} /></label>
            <label className="field full"><span>Synchronized lyrics</span><textarea value={uploadForm.lyrics} onChange={(event) => setUploadForm({ ...uploadForm, lyrics: event.target.value })} placeholder={'[0:00] First lyric\n[0:15] Second lyric'} /></label>
            {uploadStatus && <p className="form-status full"><CheckCircle2 size={17} />{uploadStatus}</p>}
            <button className="primary-btn" type="submit"><UploadCloud size={18} />Submit for review</button>
          </form>
        </section>}
        {view === "admin" && isAdmin && <AdminDashboard songs={allSongs} uploads={uploads} listeningEvents={listeningEvents} reports={contentReports} deletionRequests={deletionRequests} auditLogs={auditLogs} releaseLogs={releaseLogs} ownerChangeEvents={ownerChangeEvents} adminStats={adminStats} versionInfo={versionInfo} statusMessage={adminStatus} onPlay={playSong} onModerate={updateSongStatus} />}
      </div>

      <footer className="player">
        <audio ref={audioRef} src={currentSong.audio} x-webkit-airplay="allow" onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)} onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || currentSong.duration)} onEnded={() => { recordEvent(currentSong.id, "complete"); nextSong(1, null); }} volume={volume} />
        <div className="mini"><img src={currentSong.cover} alt="" /><div className="track-title"><strong>{currentSong.title}</strong><span>{currentArtist?.name || currentSong.artist}</span></div></div>
        <div className="controls"><div className="control-buttons"><button className="bare-btn" onClick={() => nextSong(-1)} title="Previous"><SkipBack size={18} /></button><button className="play-btn" onClick={togglePlay} title="Play or pause">{isPlaying ? <Pause size={20} /> : <Play size={20} />}</button><button className="bare-btn" onClick={() => nextSong(1)} title="Next"><SkipForward size={18} /></button><button className="bare-btn device-btn" onClick={chooseAudioOutput} title="Bluetooth or audio output" aria-label="Bluetooth or audio output"><Bluetooth size={17} /></button><button className="bare-btn device-btn" onClick={openAirPlay} title="AirPlay" aria-label="AirPlay"><Airplay size={17} /></button><button className="bare-btn device-btn" onClick={openCast} title="Cast" aria-label="Cast"><Cast size={17} /></button></div><div className="progress"><span>{secondsToTime(currentTime)}</span><input type="range" min="0" max={duration || 0} value={Math.min(currentTime, duration || 0)} onChange={(event) => { const value = Number(event.target.value); if (audioRef.current) audioRef.current.currentTime = value; setCurrentTime(value); }} /><span>{secondsToTime(duration)}</span></div>{deviceStatus && <span className="device-status">{deviceStatus}</span>}</div>
        <label className="volume"><Volume2 size={17} /><input type="range" min="0" max="1" step="0.01" value={volume} onChange={(event) => { const value = Number(event.target.value); setVolume(value); if (audioRef.current) audioRef.current.volume = value; }} /></label>
      </footer>

      {showAccount && <div className="overlay"><div className="modal"><div className="modal-head"><h2>{user ? "Your AURA account" : "Keep your music with you"}</h2><button className="icon-btn" onClick={() => { setShowAccount(false); setAccountStatus(""); }} aria-label="Close"><X size={18} /></button></div>{user ? <><p><strong>{user.name}</strong></p><p className="muted">{user.email} · {roleLabel}</p>{isAdmin && <p className="form-status"><Shield size={17} />Owner admin access is active for this account.</p>}<p className="account-benefit">Your favorites, artist follows, and recommendations stay connected to this account.</p>{accountStatus && <p className="form-status">{accountStatus}</p>}<div className="account-actions"><a className="secondary-btn" href="mailto:support@auramusichub.com"><LifeBuoy size={17} />Support</a><button className="secondary-btn" onClick={signOut}>Sign out</button><button className="secondary-btn danger-btn" onClick={requestAccountDeletion}><Trash2 size={17} />Request deletion</button></div><LegalLinks /></> : <><p className="account-benefit">Create a free account to save favorites, follow artists, and shape your recommendations.</p><form className="form-grid" onSubmit={submitAccount}><label className="field full"><span>Name</span><input name="name" required /></label><label className="field full"><span>Email</span><input name="email" type="email" required /></label>{accountStatus && <p className="form-status full">{accountStatus}</p>}<button className="primary-btn" type="submit"><LogIn size={18} />{isCloudConfigured ? "Email me a secure link" : "Continue in prototype mode"}</button></form><LegalLinks /></>}</div></div>}
      {showReport && <div className="overlay"><div className="modal"><div className="modal-head"><h2>Report content</h2><button className="icon-btn" onClick={() => { setShowReport(null); setReportStatus(""); }} aria-label="Close"><X size={18} /></button></div><p className="account-benefit">Report copyright, incorrect artist identity, harmful content, or upload issues for <strong>{showReport.title}</strong>.</p><form className="form-grid" onSubmit={submitReport}><label className="field full"><span>Reason</span><select name="reason"><option value="copyright">Copyright or licensing concern</option><option value="artist_identity">Wrong artist or impersonation</option><option value="lyrics">Lyrics issue</option><option value="content">Content concern</option><option value="other">Other</option></select></label><label className="field full"><span>Details</span><textarea name="details" required placeholder="Tell us what should be reviewed." /></label>{reportStatus && <p className="form-status full">{reportStatus}</p>}<button className="primary-btn" type="submit"><Flag size={18} />Submit report</button></form></div></div>}
    </main>
  );
}

function PageTitle({ title, subtitle }) { return <div className="page-title"><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>; }

function AutoMix({ mix, onPlayMix, onPlaySong }) {
  if (!mix?.songs?.length) return null;
  return <section className="section automix-panel"><div className="automix-copy"><p className="eyebrow">AURA Auto Mix</p><h2>{mix.title}</h2><p>{mix.summary}</p><div className="automix-tags">{mix.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><button className="primary-btn" onClick={onPlayMix}><Play size={17} />Play AURA Mix</button></div><div className="automix-tracks">{mix.songs.slice(0, 5).map((song, index) => <button className="automix-track" key={song.id} onClick={() => onPlaySong(song.id)}><img src={song.cover} alt="" /><span><strong>{song.title}</strong><small>{artistNameFor(song)} · {song.genre}</small></span><em>{String(index + 1).padStart(2, "0")}</em></button>)}</div></section>;
}

function CountryTrending({ songs, country, countries, onCountry, onPlay }) {
  const activeCountry = countries.find((item) => item.code === country) || countries[0];
  return <section className="section country-trending">
    <div className="section-head trend-head">
      <div>
        <p className="eyebrow">Country charts</p>
        <h2>Trending in {activeCountry.label}</h2>
      </div>
      <span className="muted">Market-weighted trend list</span>
    </div>
    <div className="country-pills" aria-label="Choose trending country">
      {countries.map((item) => <button key={item.code} className={country === item.code ? "active" : ""} onClick={() => onCountry(item.code)}>{item.label}</button>)}
    </div>
    <div className="trending-chart">
      {songs.map(({ song, score }, index) => <button className="trending-card" type="button" key={song.id} onClick={() => onPlay(song.id)}>
        <span className="trend-rank">{String(index + 1).padStart(2, "0")}</span>
        <img src={song.cover} alt="" />
        <span className="trend-copy"><strong>{song.title}</strong><small>{artistNameFor(song)} · {song.genre || "Unsorted"}</small></span>
        <span className="trend-score">{Math.max(Math.round(score), 0)}</span>
        <span className="recommend-play"><Play size={17} /></span>
      </button>)}
    </div>
  </section>;
}

function Recommendations({ title, picks, onPlay }) {
  return <section className="section"><div className="section-head"><h2>{title}</h2></div><div className="recommend-grid">{picks.map((pick) => <button className="recommend-card" key={pick.title} onClick={() => onPlay(pick.songId)}><img src={pick.image} alt="" /><span><strong>{pick.title}</strong><small>{pick.description}</small></span><span className="recommend-play"><Play size={17} /></span></button>)}</div></section>;
}

function SongSection({ title, songs, onPlay, favorites, onFavorite, onReport, onShare, onDelete, canDelete, empty, trackLabel = "tracks" }) {
  return <section className="section"><div className="section-head"><h2>{title}</h2><span className="muted">{songs.length} {trackLabel}</span></div><div className="track-list">{songs.length === 0 && <div className="empty-state muted">{empty || "No songs found."}</div>}{songs.map((song, index) => { const artist = song.artistId ? getArtist(song.artistId)?.name : song.artist; const [primaryTag] = collectionTagsFor(song); return <div className="track-row" key={song.id}><span className="track-number">{String(index + 1).padStart(2, "0")}</span><button className="track-main" onClick={() => onPlay(song.id)}><img src={song.cover} alt="" /><span className="track-title"><strong>{song.title}</strong><small>{artist}</small></span></button><span className="muted hide-mobile track-meta"><span>{song.album}{primaryTag ? ` · ${primaryTag}` : ""}</span>{song.source && <a href={song.source} target="_blank" rel="noreferrer">{song.license || "Source"} · {song.sourceLabel || "Source"}</a>}</span><span className="muted hide-mobile">{secondsToTime(song.duration)}</span><button className={`bare-btn heart ${favorites.includes(song.id) ? "active" : ""}`} onClick={() => onFavorite(song.id)} title="Favorite"><Heart size={18} fill={favorites.includes(song.id) ? "currentColor" : "none"} /></button>{onShare && <button className="bare-btn" onClick={() => onShare(song)} title="Share"><Share2 size={17} /></button>}{onReport && <button className="bare-btn" onClick={() => onReport(song)} title="Report"><Flag size={17} /></button>}{onDelete && canDelete?.(song) && <button className="bare-btn danger-btn" onClick={() => onDelete(song.id)} title="Delete upload"><Trash2 size={17} /></button>}<button className="row-play" onClick={() => onPlay(song.id)} title={`Play ${song.title}`}><Play size={16} /></button></div>; })}</div></section>;
}

function LegalLinks() {
  return <nav className="legal-links" aria-label="Legal links"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/dmca">DMCA</a><a href="/upload-rules">Upload rules</a><a href="/account-deletion">Delete account</a></nav>;
}

function Albums({ title = "Albums", songs = seedSongs, onPlay }) {
  const catalog = Array.from(songs.reduce((items, song) => {
    const key = `${song.album || "Single"}-${song.artistId || song.artist}`;
    if (!items.has(key)) items.set(key, {
      id: key,
      title: song.album || "Single",
      artist: song.artistId ? getArtist(song.artistId)?.name : song.artist,
      cover: song.cover,
      songId: song.id,
    });
    return items;
  }, new Map()).values()).slice(0, 6);
  return <section className="section"><div className="section-head"><h2>{title}</h2><Disc3 size={20} /></div><div className="album-grid">{catalog.map((album) => <article className="album-card" key={album.id}><button onClick={() => onPlay(album.songId)}><img src={album.cover} alt="" /><h3>{album.title}</h3><p>{album.artist}</p></button></article>)}</div></section>;
}
function Playlists({ songs = seedSongs, onPlay, onSelectTag }) {
  const cards = playlists.map((playlist) => {
    const playlistSongs = songs.filter((song) => playlist.songIds.includes(song.id) || (playlist.tag && collectionTagsFor(song).includes(playlist.tag)));
    return { ...playlist, songs: playlistSongs, firstSongId: playlistSongs[0]?.id || playlist.songIds[0] };
  });
  return <section className="section"><div className="section-head"><h2>Collection Tags</h2><Library size={20} /></div><div className="playlist-grid">{cards.map((playlist) => <button className="playlist-card" key={playlist.id} onClick={() => playlist.tag ? onSelectTag?.(playlist.tag, playlist.songIds) : onPlay(playlist.firstSongId)}><Library size={22} /><strong>{playlist.title}</strong><span>{playlist.description}</span><small>{playlist.songs.length || playlist.songIds.length} songs{playlist.tag ? ` · ${playlist.tag}` : ""}</small></button>)}</div></section>;
}
function Lyrics({ title, song, artist, activeIndex }) { return <section className="section lyrics-panel"><div className="section-head"><div><h2>{title}</h2><p className="muted">{song.title} · {artist?.name || song.artist}</p></div><Mic2 size={20} /></div><div className="lyrics">{(song.lyrics || []).map((line, index) => <button className={`lyric-line ${index === activeIndex ? "active" : ""}`} key={`${line.time}-${line.text}`}>{line.text}</button>)}</div></section>; }
function Artists({ songs, useCloudCatalog, selectedArtist, onSelect, onPlay, followedArtists, onFollow }) {
  const artistList = useCloudCatalog ? Array.from(songs.reduce((items, song) => {
    const name = song.artist || getArtist(song.artistId)?.name;
    if (!name || items.has(name)) return items;
    items.set(name, { id: `artist-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, name, genre: song.genre || "Independent", location: "AURA", bio: `Listen to ${name}'s latest releases on AURA.`, image: song.cover, followers: "New" });
    return items;
  }, new Map()).values()) : artists;
  const artist = artistList.find((item) => item.id === selectedArtist) || artistList[0];
  if (!artist) return <p className="muted">No artists have been published yet.</p>;
  const artistSongs = songs.filter((song) => song.artistId === artist.id || song.artist === artist.name);
  const isFollowing = followedArtists.includes(artist.id);
  return <><section className="section"><div className="artist-grid">{artistList.map((item) => <button className={`artist-card ${item.id === artist.id ? "active" : ""}`} key={item.id} onClick={() => onSelect(item.id)}><img src={item.image} alt="" /><strong>{item.name}</strong><span>{item.genre}</span></button>)}</div></section><section className="section artist-profile"><img src={artist.image} alt="" /><div><p className="eyebrow">{artist.genre} · {artist.location}</p><h2>{artist.name}</h2><p>{artist.bio}</p><p className="muted">{artist.followers} followers</p><div className="button-row"><button className="primary-btn" onClick={() => onPlay(artistSongs[0]?.id)}><Play size={18} />Play artist</button><button className="secondary-btn" onClick={() => onFollow(artist.id)}>{isFollowing ? <CheckCircle2 size={18} /> : <UserPlus size={18} />}{isFollowing ? "Following" : "Follow"}</button></div></div></section></>;
}
function AdminDashboard({ songs, uploads, listeningEvents, reports = [], deletionRequests = [], auditLogs = [], releaseLogs = [], ownerChangeEvents = [], adminStats = {}, versionInfo, statusMessage, onPlay, onModerate }) {
  const [showPublishPanel, setShowPublishPanel] = useState(false);
  const [publishState, setPublishState] = useState({ status: "idle", message: "" });
  const catalog = songs.map((song) => ({ ...song, status: songStatus(song), sourceName: sourceLabel(song) }));
  const reviewQueue = catalog.filter((song) => ["draft", "pending", "rejected"].includes(song.status) && ["cloud", "local"].includes(songSourceType(song)));
  const pending = reviewQueue.filter((song) => song.status !== "rejected");
  const published = catalog.filter((song) => song.status === "published");
  const rejected = catalog.filter((song) => song.status === "rejected");
  const cloudRows = catalog.filter((song) => songSourceType(song) === "cloud");
  const uniqueArtists = new Set(catalog.map((song) => artistNameFor(song)).filter(Boolean));
  const songById = new Map(catalog.map((song) => [song.id, song]));
  const missingLyrics = catalog.filter((song) => !song.lyrics?.length);
  const releaseReadiness = catalog.length ? Math.round(catalog.reduce((sum, song) => {
    const checks = [song.title, artistNameFor(song), song.audio, song.cover, song.lyrics?.length];
    return sum + checks.filter(Boolean).length / checks.length;
  }, 0) / catalog.length * 100) : 0;
  const signalStats = listeningEvents.reduce((items, event) => {
    const stat = items[event.songId] || { plays: 0, completes: 0, favorites: 0, skips: 0, total: 0 };
    if (event.type === "play") stat.plays += 1;
    if (event.type === "complete") stat.completes += 1;
    if (event.type === "favorite") stat.favorites += 1;
    if (event.type === "skip") stat.skips += 1;
    stat.total += 1;
    items[event.songId] = stat;
    return items;
  }, {});
  const topTracks = catalog
    .map((song) => ({ song, ...(signalStats[song.id] || { plays: 0, completes: 0, favorites: 0, skips: 0, total: 0 }) }))
    .sort((a, b) => (b.plays + b.completes * 2 + b.favorites * 3 - b.skips) - (a.plays + a.completes * 2 + a.favorites * 3 - a.skips))
    .slice(0, 5);
  const plays = Object.values(signalStats).reduce((sum, item) => sum + item.plays, 0);
  const completes = Object.values(signalStats).reduce((sum, item) => sum + item.completes, 0);
  const skips = Object.values(signalStats).reduce((sum, item) => sum + item.skips, 0);
  const completionRate = plays ? Math.round(completes / plays * 100) : 0;
  const skipRate = plays ? Math.round(skips / plays * 100) : 0;
  const genreSignals = listeningEvents.reduce((items, event) => {
    const song = songById.get(event.songId);
    if (!song || event.type === "skip") return items;
    const genre = song.genre || "Unsorted";
    items[genre] = (items[genre] || 0) + (event.type === "favorite" ? 4 : event.type === "complete" ? 3 : 1);
    return items;
  }, {});
  const topGenres = Object.entries(genreSignals).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const fallbackGenres = Object.entries(catalog.reduce((items, song) => {
    const genre = song.genre || "Unsorted";
    items[genre] = (items[genre] || 0) + 1;
    return items;
  }, {})).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const recentActivity = listeningEvents.slice(0, 6).map((event) => ({ ...event, song: songById.get(event.songId) })).filter((event) => event.song);
  const activeGenres = topGenres.length ? topGenres : fallbackGenres;
  const sourceRows = ["cloud", "local", "starter"].map((source) => ({
    source,
    label: source === "cloud" ? "Cloud catalog" : source === "local" ? "Device uploads" : "Starter catalog",
    count: catalog.filter((song) => songSourceType(song) === source).length,
  })).filter((row) => row.count > 0);
  const maxSourceCount = Math.max(...sourceRows.map((row) => row.count), 1);
  const operations = [
    { icon: ListChecks, title: "Review release queue", value: pending.length, detail: "Songs waiting for a publish or reject decision.", target: "admin-release-pipeline" },
    { icon: FileCheck2, title: "Rights and metadata", value: missingLyrics.length + rejected.length, detail: "Tracks needing lyrics, rights review, or a cleanup pass.", target: "admin-catalog-table" },
    { icon: Megaphone, title: "Promotion candidates", value: published.length, detail: "Published tracks ready for playlists, artist picks, and campaigns.", target: "admin-top-tracks" },
  ];
  const privateChangeFeed = [
    { id: "build-version", type: "build", title: `Prepared app version ${versionInfo?.version || "unknown"}`, detail: versionInfo?.notes || "Current private build metadata.", at: versionInfo?.preparedAt, actor: "versioning" },
    ...ownerChangeEvents.map((event) => ({ id: event.id, type: event.change_type || "change", title: event.title, detail: event.detail, at: event.created_at || event.createdAt, actor: event.actor_email || "AURA" })),
    ...auditLogs.map((log) => ({ id: `audit-${log.id}`, type: log.action || "audit", title: `Audit: ${log.action || "owner action"}`, detail: `${log.entity_type || "item"} ${log.entity_id || ""}`.trim(), at: log.created_at || log.createdAt, actor: "owner" })),
    ...releaseLogs.map((log) => ({ id: `release-${log.id}`, type: log.status || "release", title: `Release ${log.version || "record"}`, detail: log.notes || "Owner release record.", at: log.created_at || log.createdAt, actor: "release" })),
    ...reports.map((report) => ({ id: `report-${report.id}`, type: "report", title: report.song_title || "Content report", detail: report.reason || report.status || "open", at: report.created_at || report.createdAt, actor: "listener" })),
    ...deletionRequests.map((request) => ({ id: `delete-${request.id}`, type: "account", title: "Account deletion request", detail: request.email || request.status || "requested", at: request.created_at || request.createdAt, actor: "account" })),
  ].filter((item) => item.title).sort((a, b) => new Date(b.at || 0) - new Date(a.at || 0)).slice(0, 18);
  const publishBlockers = [
    pending.length ? `${pending.length} release${pending.length === 1 ? "" : "s"} still waiting for review` : "",
    rejected.length ? `${rejected.length} rejected release${rejected.length === 1 ? "" : "s"} need correction` : "",
    missingLyrics.length ? `${missingLyrics.length} track${missingLyrics.length === 1 ? "" : "s"} missing synced lyrics` : "",
  ].filter(Boolean);
  const preparedVersion = versionInfo?.version || "1.0.2";
  const publishedVersion = versionInfo?.publishedVersion || "1.0.1";
  const publicUrl = versionInfo?.publicUrl || "https://www.auramusichub.com/";
  const reviewUrl = versionInfo?.reviewUrl || "/?ownerPreview=1";
  const releaseHighlights = Array.isArray(versionInfo?.highlights) && versionInfo.highlights.length ? versionInfo.highlights : [
    { title: "Owner build review", status: "ready", detail: "Admin can inspect the prepared build before public release." },
    { title: "Manual publish control", status: "ready", detail: "Publishing stays behind the owner dashboard and Cloudflare deploy hook." },
    { title: "Private change watch", status: "ready", detail: "Owner-only release events stay hidden from public listeners." },
  ];
  const releaseArtifacts = Array.isArray(versionInfo?.artifacts) && versionInfo.artifacts.length ? versionInfo.artifacts : [
    "outputs/manual-release/web",
    "outputs/manual-release/owner-change-report.md",
    "outputs/manual-release/publish-checklist.md",
  ];
  const collectionReview = ["Afrobeats", "Jamaican Hip-Hop", "Reggae", "Highlife", "Blues", "Gospel"].map((tag) => ({
    tag,
    count: catalog.filter((song) => collectionTagsFor(song).includes(tag)).length,
  }));

  function jumpToAdminSection(sectionId) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function targetForChange(type) {
    if (type === "report") return "admin-trust-queue";
    if (type === "account") return "admin-account-requests";
    if (type === "publish" || type === "release" || type === "build") return "admin-release-log";
    if (type === "moderation" || type === "catalog" || type === "upload") return "admin-moderation-desk";
    if (type === "audit" || String(type || "").startsWith("mark_")) return "admin-audit-log";
    return "admin-private-change-watch";
  }

  async function publishRelease() {
    if (publishBlockers.length) {
      setPublishState({ status: "blocked", message: "Resolve the release blockers before publishing." });
      return;
    }
    const client = getSupabase();
    if (!client) {
      setPublishState({ status: "blocked", message: "Supabase is not connected in this build, so the owner cannot be verified for publishing." });
      return;
    }
    const { data } = await client.auth.getSession();
    const token = data.session?.access_token;
    if (!token) {
      setPublishState({ status: "blocked", message: "Sign in as the owner before publishing." });
      return;
    }
    setPublishState({ status: "publishing", message: "Sending owner-approved publish request to Cloudflare..." });
    try {
      const response = await fetch("/api/releases/publish", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({
          version: versionInfo?.version,
          commit: versionInfo?.commit || null,
          notes: versionInfo?.notes || "Owner-approved release from AURA Admin dashboard.",
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setPublishState({ status: "blocked", message: result.nextStep || result.error || "Publish request failed." });
        return;
      }
      setPublishState({ status: "success", message: `${result.message} Version ${result.version || versionInfo?.version || ""} is now deploying.` });
    } catch (error) {
      setPublishState({ status: "blocked", message: "This review server cannot run Cloudflare Functions. The publish button works on Cloudflare Pages after the deploy hook secret is configured." });
    }
  }

  return <section className="section admin-shell">
    <div className="admin-hero">
      <div>
        <p className="eyebrow">Owner control room</p>
        <h1>AURA operations</h1>
        <p>Monitor releases, protect the catalog, and read audience signals before you decide what gets promoted next.</p>
        <div className="admin-hero-actions">
          <button className="primary-btn publish-release-btn" onClick={() => setShowPublishPanel(true)}><UploadCloud size={18} />Publish release</button>
          <span>Manual approval gate is active</span>
        </div>
      </div>
      <div className="admin-health">
        <span>Catalog health</span>
        <strong>{releaseReadiness}%</strong>
        <meter min="0" max="100" value={releaseReadiness} />
        <small>{published.length} published · {pending.length} pending · {rejected.length} rejected</small>
      </div>
    </div>
    {statusMessage && <p className="form-status admin-status"><CheckCircle2 size={17} />{statusMessage}</p>}
    {showPublishPanel && <section className="admin-panel publish-panel">
      <div className="section-head">
        <div>
          <h2>Publish release</h2>
          <p className="muted">Use this control before moving a reviewed build or approved catalog update to the public app.</p>
        </div>
        <button className="icon-btn" onClick={() => setShowPublishPanel(false)} aria-label="Close publish panel"><X size={18} /></button>
      </div>
      <div className="publish-grid">
        <div className="publish-readiness">
          <span>Release readiness</span>
          <strong>{publishBlockers.length ? "Review needed" : "Ready to publish"}</strong>
          <p>{publishBlockers.length ? "Resolve the blockers below before publishing publicly." : "This button will call the secure Cloudflare publish endpoint, verify the owner session, trigger deployment, and log the release."}</p>
        </div>
        <div className="publish-checks">
          {(publishBlockers.length ? publishBlockers : ["Catalog is reviewed", "Owner sign-in is required", "Cloudflare deploy hook must be configured", "Release will be logged privately for the owner"]).map((item) => <p key={item}><CheckCircle2 size={16} />{item}</p>)}
        </div>
      </div>
      {publishState.message && <p className={`form-status publish-status ${publishState.status}`}><CheckCircle2 size={17} />{publishState.message}</p>}
      <div className="button-row">
        <button className="primary-btn" disabled={publishState.status === "publishing" || publishBlockers.length > 0} onClick={publishRelease}><UploadCloud size={18} />{publishState.status === "publishing" ? "Publishing..." : "Publish to Cloudflare"}</button>
        <button className="secondary-btn" onClick={() => setShowPublishPanel(false)}>Close</button>
      </div>
    </section>}
    <div className="admin-kpi-grid">
      <AdminStatCard icon={Music2} label="Published catalog" value={published.length} detail={`${uniqueArtists.size} artists represented`} onClick={() => jumpToAdminSection("admin-catalog-table")} />
      <AdminStatCard icon={Globe2} label="Prepared build" value={preparedVersion} detail={`Public remains ${publishedVersion} until owner approval`} onClick={() => jumpToAdminSection("admin-build-review")} />
      <AdminStatCard icon={CalendarClock} label="Release queue" value={pending.length} detail={`${rejected.length} rejected items need owner attention`} tone="warn" onClick={() => jumpToAdminSection("admin-release-pipeline")} />
      <AdminStatCard icon={Users} label="Listener signals" value={listeningEvents.length} detail={`${completionRate}% completion · ${skipRate}% skips`} onClick={() => jumpToAdminSection("admin-audience-pulse")} />
      <AdminStatCard icon={Shield} label="Cloud-controlled" value={cloudRows.length} detail="Rows backed by Supabase moderation" onClick={() => jumpToAdminSection("admin-catalog-sources")} />
      <AdminStatCard icon={Users} label="User accounts" value={adminStats.users ?? 0} detail="Supabase profile records visible to the owner" onClick={() => jumpToAdminSection("admin-account-requests")} />
      <AdminStatCard icon={Flag} label="Open reports" value={adminStats.reports ?? reports.length} detail="Copyright, identity, lyrics, and content reports" tone="warn" onClick={() => jumpToAdminSection("admin-trust-queue")} />
      <AdminStatCard icon={Trash2} label="Deletion queue" value={adminStats.deletionRequests ?? deletionRequests.length} detail="Account/data deletion requests waiting for owner action" tone="warn" onClick={() => jumpToAdminSection("admin-account-requests")} />
      <AdminStatCard icon={Activity} label="Private changes" value={adminStats.ownerChanges ?? ownerChangeEvents.length} detail="Owner-only change events hidden from public listeners" onClick={() => jumpToAdminSection("admin-private-change-watch")} />
      <AdminStatCard icon={Download} label="Storage estimate" value={`${adminStats.storageMb ?? Math.round(cloudRows.length * 4.5)} MB`} detail="Catalog storage estimate until R2 usage is wired in" onClick={() => jumpToAdminSection("admin-catalog-sources")} />
    </div>
    <div className="admin-layout">
      <section id="admin-build-review" className="admin-panel admin-wide build-review-panel">
        <div className="section-head">
          <div>
            <h2>Build review</h2>
            <p className="muted">Inspect the prepared private build before you decide whether it becomes the public AURA app.</p>
          </div>
          <Globe2 size={20} />
        </div>
        <div className="build-review-grid">
          <div className="build-preview-shell">
            <div className="build-preview-top">
              <span>Prepared preview</span>
              <strong>AURA {preparedVersion}</strong>
            </div>
            <iframe className="build-preview-frame" title={`AURA ${preparedVersion} prepared build preview`} src={reviewUrl} />
          </div>
          <div className="build-review-detail">
            <div className="release-compare-grid">
              <article className="release-version-card">
                <span>Public right now</span>
                <strong>{publishedVersion}</strong>
                <p>Current live version at auramusichub.com. This remains public until you approve a release.</p>
                <a className="secondary-btn" href={publicUrl} target="_blank" rel="noreferrer"><Globe2 size={16} />Open live app</a>
              </article>
              <article className="release-version-card active">
                <span>Prepared for review</span>
                <strong>{preparedVersion}</strong>
                <p>{versionInfo?.notes || "Private owner build waiting for review."}</p>
                <a className="primary-btn" href={reviewUrl}><Play size={16} />Open preview</a>
              </article>
            </div>
            <div className="release-highlights">
              {releaseHighlights.map((item) => <article className="release-highlight-card" key={item.title}>
                <span>{item.status || "ready"}</span>
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
              </article>)}
            </div>
            <div className="release-review-strip">
              {collectionReview.map((item) => <button className="release-review-pill" type="button" key={item.tag} onClick={() => jumpToAdminSection("admin-catalog-table")}>
                <span>{item.tag}</span>
                <strong>{item.count}</strong>
              </button>)}
            </div>
            <div className="release-artifacts">
              <span>Owner release package</span>
              {releaseArtifacts.map((artifact) => <code key={artifact}>{artifact}</code>)}
            </div>
          </div>
        </div>
      </section>
      <section id="admin-private-change-watch" className="admin-panel admin-wide change-watch-panel">
        <div className="section-head">
          <div>
            <h2>Private change watch</h2>
            <p className="muted">Owner-only feed for code releases, uploads, reports, deletion requests, and moderation changes. Public users do not see this dashboard.</p>
          </div>
          <Activity size={20} />
        </div>
        <div className="change-watch-grid">
          <button className="version-card" type="button" onClick={() => jumpToAdminSection("admin-release-log")}>
            <span>Current prepared build</span>
            <strong>{versionInfo?.version || "Unknown"}</strong>
            <small>{versionInfo?.status || "prepared"} · Android {versionInfo?.androidVersionCode || "-"} · iOS {versionInfo?.iosBuildNumber || "-"}</small>
            <p>{versionInfo?.notes || "No private build notes saved yet."}</p>
          </button>
          <div className="change-feed">{privateChangeFeed.length === 0 && <p className="muted">No private changes recorded yet.</p>}{privateChangeFeed.map((item) => <OwnerChangeRow key={item.id} item={item} onClick={() => jumpToAdminSection(targetForChange(item.type))} />)}</div>
        </div>
      </section>
      <section id="admin-release-pipeline" className="admin-panel admin-wide">
        <div className="section-head">
          <div>
            <h2>Release pipeline</h2>
            <p className="muted">A publish desk for uploaded songs, rejected items, and campaign-ready releases.</p>
          </div>
          <ListChecks size={20} />
        </div>
        <div className="pipeline-grid">
          <AdminPipelineCard title="Needs review" songs={pending} empty="No pending releases." onOpen={() => jumpToAdminSection("admin-moderation-desk")} onPlay={onPlay} />
          <AdminPipelineCard title="Needs correction" songs={rejected} empty="No rejected releases." onOpen={() => jumpToAdminSection("admin-moderation-desk")} onPlay={onPlay} />
          <AdminPipelineCard title="Published" songs={published.slice(0, 4)} empty="No published releases yet." onOpen={() => jumpToAdminSection("admin-catalog-table")} onPlay={onPlay} />
        </div>
      </section>
      <section id="admin-operations" className="admin-panel">
        <div className="section-head"><h2>Operations</h2><Activity size={20} /></div>
        <div className="action-list">{operations.map((item) => <AdminActionItem key={item.title} item={item} onClick={() => jumpToAdminSection(item.target)} />)}</div>
      </section>
      <section id="admin-trust-queue" className="admin-panel">
        <div className="section-head"><h2>Trust queue</h2><Flag size={20} /></div>
        <div className="trust-list">{reports.length === 0 && <p className="muted">No content reports yet.</p>}{reports.slice(0, 5).map((report) => <AdminTrustRow key={report.id} label={report.reason || "Report"} title={report.song_title || report.songId || "Reported content"} detail={report.status || "open"} date={report.created_at || report.createdAt} onClick={() => jumpToAdminSection("admin-moderation-desk")} />)}</div>
      </section>
      <section id="admin-account-requests" className="admin-panel">
        <div className="section-head"><h2>Account requests</h2><Trash2 size={20} /></div>
        <div className="trust-list">{deletionRequests.length === 0 && <p className="muted">No deletion requests yet.</p>}{deletionRequests.slice(0, 5).map((request) => <AdminTrustRow key={request.id} label={request.status || "requested"} title={request.email || "Account"} detail="Data deletion" date={request.created_at || request.createdAt} onClick={() => jumpToAdminSection("admin-audit-log")} />)}</div>
      </section>
      <section id="admin-audit-log" className="admin-panel">
        <div className="section-head"><h2>Owner audit log</h2><FileCheck2 size={20} /></div>
        <div className="trust-list">{auditLogs.length === 0 && <p className="muted">Publish, reject, delete, and account actions will appear here.</p>}{auditLogs.slice(0, 6).map((log) => <AdminTrustRow key={log.id} label={log.action || "action"} title={log.entity_type || "catalog"} detail={log.entity_id || "AURA"} date={log.created_at || log.createdAt} onClick={() => jumpToAdminSection("admin-catalog-table")} />)}</div>
      </section>
      <section id="admin-release-log" className="admin-panel">
        <div className="section-head"><h2>Release log</h2><Megaphone size={20} /></div>
        <div className="trust-list">{releaseLogs.length === 0 && <p className="muted">Saved versions and manual publish notes will appear here after backend release logging is connected.</p>}{releaseLogs.slice(0, 6).map((log) => <AdminTrustRow key={log.id} label={log.status || "release"} title={log.version || "Version"} detail={log.notes || "Owner release record"} date={log.created_at || log.createdAt} onClick={() => setShowPublishPanel(true)} />)}</div>
      </section>
      <section id="admin-audience-pulse" className="admin-panel">
        <div className="section-head"><h2>Audience pulse</h2><Radio size={20} /></div>
        <div className="insight-list">{recentActivity.length === 0 && <p className="muted">No listener activity yet. Plays, skips, favorites, and completed songs will appear here.</p>}{recentActivity.map((event) => <button className="insight-row" type="button" key={`${event.songId}-${event.type}-${event.at}`} onClick={() => onPlay(event.song.id)}><span>{event.type}</span><strong>{event.song.title}</strong><small>{shortDate(event.at)}</small></button>)}</div>
      </section>
      <section id="admin-moderation-desk" className="admin-panel admin-wide">
        <div className="section-head">
          <div>
            <h2>Moderation desk</h2>
            <p className="muted">Preview, publish, or reject uploaded tracks with source and status context.</p>
          </div>
          <Shield size={20} />
        </div>
        <div className="admin-list">{reviewQueue.length === 0 && <p className="empty-state muted">No uploads are waiting for review.</p>}{reviewQueue.map((song) => <AdminSongRow key={song.id} song={song} onPlay={onPlay} onModerate={onModerate} />)}</div>
      </section>
      <section id="admin-top-tracks" className="admin-panel">
        <div className="section-head"><h2>Top tracks</h2><TrendingUp size={20} /></div>
        <div className="track-insight-list">{topTracks.map((item) => <AdminTrackInsight key={item.song.id} item={item} onPlay={onPlay} />)}</div>
      </section>
      <section id="admin-genre-demand" className="admin-panel">
        <div className="section-head"><h2>Genre demand</h2><BarChart3 size={20} /></div>
        <div className="insight-list">{activeGenres.map(([genre, count]) => <button className="insight-bar" type="button" key={genre} onClick={() => jumpToAdminSection("admin-catalog-table")}><span>{genre}</span><meter min="0" max={Math.max(...activeGenres.map(([, value]) => value), 1)} value={count} /><strong>{count}</strong></button>)}</div>
      </section>
      <section id="admin-catalog-sources" className="admin-panel">
        <div className="section-head"><h2>Catalog sources</h2><Disc3 size={20} /></div>
        <div className="insight-list">{sourceRows.map((row) => <button className="source-row" type="button" key={row.source} onClick={() => jumpToAdminSection("admin-catalog-table")}><span>{row.label}</span><meter min="0" max={maxSourceCount} value={row.count} /><strong>{row.count}</strong></button>)}</div>
      </section>
      <section id="admin-catalog-table" className="admin-panel admin-wide">
        <div className="section-head">
          <div>
            <h2>Catalog command table</h2>
            <p className="muted">{catalog.length} songs · {uploads.length} device uploads · {missingLyrics.length} tracks missing synced lyrics.</p>
          </div>
          <Clock3 size={20} />
        </div>
        <div className="admin-list compact">{catalog.map((song) => <AdminSongRow key={song.id} song={song} onPlay={onPlay} onModerate={onModerate} compact />)}</div>
      </section>
    </div>
  </section>;
}

function AdminStatCard({ icon: Icon, label, value, detail, tone = "brand", onClick }) {
  return <button className={`admin-stat-card ${tone}`} type="button" onClick={onClick} aria-label={`Open ${label}`}><div><span>{label}</span><strong>{value}</strong></div><Icon size={22} /><small>{detail}</small></button>;
}

function AdminActionItem({ item, onClick }) {
  const Icon = item.icon;
  return <button className="action-item" type="button" onClick={onClick}><span className="action-icon"><Icon size={17} /></span><div><strong>{item.title}</strong><small>{item.detail}</small></div><em>{item.value}</em></button>;
}

function AdminTrustRow({ label, title, detail, date, onClick }) {
  return <button className="trust-row" type="button" onClick={onClick}><span>{label}</span><strong>{title}</strong><small>{detail}{date ? ` · ${shortDate(date)}` : ""}</small></button>;
}

function OwnerChangeRow({ item, onClick }) {
  return <button className="owner-change-row" type="button" onClick={onClick}><span>{item.type}</span><div><strong>{item.title}</strong><small>{item.detail}{item.actor ? ` · ${item.actor}` : ""}</small></div><time>{item.at ? shortDate(item.at) : "now"}</time></button>;
}

function AdminPipelineCard({ title, songs, empty, onOpen, onPlay }) {
  return <article className="pipeline-card"><button className="pipeline-head" type="button" onClick={onOpen}><strong>{title}</strong><span>{songs.length}</span></button><div className="pipeline-stack">{songs.length === 0 && <button className="empty-pipeline-action" type="button" onClick={onOpen}>{empty}</button>}{songs.slice(0, 4).map((song) => <button key={song.id} onClick={() => onPlay(song.id)}><img src={song.cover} alt="" /><span><strong>{song.title}</strong><small>{artistNameFor(song)} · {song.genre || "Unsorted"}</small></span></button>)}</div></article>;
}

function AdminTrackInsight({ item, onPlay }) {
  const score = item.plays + item.completes * 2 + item.favorites * 3 - item.skips;
  return <button className="track-insight" onClick={() => onPlay(item.song.id)}><img src={item.song.cover} alt="" /><span><strong>{item.song.title}</strong><small>{artistNameFor(item.song)} · {item.song.genre || "Unsorted"}</small></span><em>{Math.max(score, 0)}</em></button>;
}

function AdminSongRow({ song, onPlay, onModerate, compact = false }) {
  const status = songStatus(song);
  const source = songSourceType(song);
  const canModerate = ["cloud", "local"].includes(source);
  const artist = artistNameFor(song) || "Unknown artist";
  return <article className={`admin-row ${compact ? "compact" : ""}`}><button className="admin-track" onClick={() => onPlay(song.id)}><img src={song.cover} alt="" /><span><strong>{song.title}</strong><small>{artist} · {song.genre || "Unsorted"}</small></span></button><span className={`status-pill ${status}`}>{status}</span><span className="admin-source">{song.sourceName}<small>{dateLabelFor(song)}</small></span><div className="admin-actions"><button className="secondary-btn" onClick={() => onPlay(song.id)}><Play size={15} />Preview</button>{canModerate && <button className="primary-btn" disabled={status === "published"} onClick={() => onModerate(song.id, "published")}>Publish</button>}{canModerate && <button className="secondary-btn danger-btn" disabled={status === "rejected"} onClick={() => onModerate(song.id, "rejected")}>Reject</button>}</div></article>;
}
function Metric({ label, value }) { return <div className="metric"><span>{label}</span><strong>{value}</strong><BarChart3 size={20} /></div>; }
