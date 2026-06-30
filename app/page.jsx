"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  BarChart3, CheckCircle2, Disc3, Download, Globe2, Heart, Home, Library, LogIn,
  Mic2, Moon, Music2, Pause, Play, Search, Shield, SkipBack, SkipForward, Sparkles,
  Sun, UploadCloud, User, UserPlus, Volume2, X,
} from "lucide-react";
import { artists, getArtist, playlists, secondsToTime, songs as seedSongs } from "../lib/music";
import { getSupabase, isCloudConfigured } from "../lib/supabase";

const storageKeys = {
  favorites: "aura:favorites",
  uploads: "aura:uploads",
  user: "aura:user",
  language: "aura:language",
  listeningEvents: "aura:listening-events",
  followedArtists: "aura:followed-artists",
};

const legacyKeys = {
  favorites: "AURA:favorites",
  uploads: "AURA:uploads",
  user: "AURA:user",
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
const genreOptions = ["All", "Classical", "Ragtime", "Pop", "R&B", "Electronic", "Hip-Hop", "Afrobeats", "Jazz", "Indie"];

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
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("dark");
  const [uploads, setUploads] = useState([]);
  const [cloudSongs, setCloudSongs] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [followedArtists, setFollowedArtists] = useState([]);
  const [listeningEvents, setListeningEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [adminVerified, setAdminVerified] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [accountStatus, setAccountStatus] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [currentId, setCurrentId] = useState(seedSongs[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(seedSongs[0].duration);
  const [volume, setVolume] = useState(0.72);
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
    setUser(loadJson(storageKeys.user, null, legacyKeys.user));
    const savedLanguage = window.localStorage.getItem(storageKeys.language);
    const browserLanguage = window.navigator.language?.slice(0, 2);
    setLanguage(savedLanguage || (copy[browserLanguage] ? browserLanguage : "en"));
  }, []);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
    setIsInstalled(standalone);
    const onPrompt = (event) => { event.preventDefault(); setInstallPrompt(event); };
    const onInstalled = () => { setInstallPrompt(null); setIsInstalled(true); };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => { window.removeEventListener("beforeinstallprompt", onPrompt); window.removeEventListener("appinstalled", onInstalled); };
  }, []);

  useEffect(() => {
    const client = getSupabase();
    if (!client) return undefined;
    let active = true;

    async function syncSession(session) {
      if (!active) return;
      if (!session?.user) {
        setUser(null);
        setAdminVerified(false);
        return;
      }
      const metadata = session.user.user_metadata || {};
      const { data: profile } = await client
        .from("profiles")
        .select("display_name,role")
        .eq("id", session.user.id)
        .maybeSingle();
      if (!active) return;
      const role = profile?.role || "listener";
      setAdminVerified(role === "admin");
      setUser({
        id: session.user.id,
        name: profile?.display_name || metadata.name || metadata.display_name || session.user.email?.split("@")[0] || "Music fan",
        email: session.user.email,
        role,
        cloud: true,
      });
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
    client.from("songs").select("id,title,artist_name,album,genre,audio_url,cover_url,lyrics,created_at").eq("status", "published").order("created_at", { ascending: false }).then(({ data }) => {
      if (!data) return;
      setCloudSongs(data.map((song) => ({
        id: song.id,
        title: song.title,
        artist: song.artist_name,
        album: song.album || "Single",
        genre: song.genre || "Indie",
        audio: song.audio_url,
        cover: song.cover_url || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=900&q=80",
        lyrics: song.lyrics || [],
        duration: 180,
        plays: 0,
      })));
    });
  }, []);

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
  useEffect(() => { user ? window.localStorage.setItem(storageKeys.user, JSON.stringify(user)) : window.localStorage.removeItem(storageKeys.user); }, [user]);

  const allSongs = useMemo(() => [...uploads, ...(cloudSongs.length ? cloudSongs : seedSongs)], [uploads, cloudSongs]);
  const currentSong = allSongs.find((song) => song.id === currentId) ?? allSongs[0];
  const currentArtist = currentSong.artistId ? getArtist(currentSong.artistId) : { name: currentSong.artist };
  const featuredSong = cloudSongs[0] || seedSongs[0];
  const featuredArtist = featuredSong.artistId ? getArtist(featuredSong.artistId)?.name : featuredSong.artist;
  const filteredSongs = useMemo(() => {
    const term = query.trim().toLowerCase();
    return allSongs.filter((song) => {
      const artist = song.artistId ? getArtist(song.artistId)?.name : song.artist;
      const matchesSearch = !term || [song.title, artist, song.album].some((value) => value?.toLowerCase().includes(term));
      return matchesSearch && (genre === "All" || song.genre === genre);
    });
  }, [allSongs, query, genre]);
  const activeLyricIndex = useMemo(() => (currentSong.lyrics ?? []).reduce((active, line, index) => currentTime >= line.time ? index : active, 0), [currentSong, currentTime]);

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
    const event = { songId, type, at: new Date().toISOString() };
    setListeningEvents((items) => [event, ...items].slice(0, 250));
    const client = getSupabase();
    if (client && user?.cloud) client.from("listening_events").insert({ user_id: user.id, song_id: songId, event_type: type });
  }

  function playSong(id) { recordEvent(id, "play"); setCurrentId(id); setIsPlaying(true); setTimeout(() => audioRef.current?.play().catch(() => setIsPlaying(false)), 50); }
  function togglePlay() {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  }
  function nextSong(direction = 1, eventType = "skip") {
    if (eventType) recordEvent(currentSong.id, eventType);
    const index = allSongs.findIndex((song) => song.id === currentSong.id);
    playSong(allSongs[(index + direction + allSongs.length) % allSongs.length].id);
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
  async function installApp() { if (installPrompt) { await installPrompt.prompt(); await installPrompt.userChoice; setInstallPrompt(null); } }
  async function submitAccount(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = form.get("name") || "Music fan";
    const email = form.get("email") || "listener@example.com";
    const client = getSupabase();
    if (client) {
      setAccountStatus("Sending your secure sign-in link...");
      const { error } = await client.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin, data: { name } } });
      setAccountStatus(error ? error.message : "Check your email for the AURA sign-in link.");
      return;
    }
    setUser({ name, email, role: "Creator", cloud: false });
    setAccountStatus("");
    setShowAccount(false);
  }

  async function signOut() {
    const client = getSupabase();
    if (client && user?.cloud) await client.auth.signOut();
    setUser(null);
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
      cover: coverUrl || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=900&q=80",
      audio: audioUrl,
      lyrics: parseLyrics(uploadForm.lyrics || "Your first uploaded lyric line\nAdd timestamps like [0:15] Chorus begins"), uploadedAt: new Date().toISOString(),
    };
    if (client && user?.cloud) {
      const { error } = await client.from("songs").insert({
        owner_id: user.id, title: song.title, artist_name: song.artist, album: song.album, genre: song.genre,
        audio_url: song.audio, cover_url: song.cover, lyrics: song.lyrics, status: "pending",
      });
      if (error) { setUploadStatus(error.message); return; }
      setUploadStatus("Uploaded. Your release is now in the moderation queue.");
    } else setUploadStatus("Saved in prototype mode on this device.");
    setUploads((items) => [song, ...items]); setCurrentId(id);
    setUploadForm({ title: "", artist: "", album: "", genre: "Indie", audio: "", cover: "", audioFile: null, coverFile: null, lyrics: "" });
    if (!client) setView("library");
  }

  const favoriteSongs = allSongs.filter((song) => favorites.includes(song.id));
  const totalPlays = allSongs.reduce((sum, song) => sum + (song.plays || 0), 0);

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
          <section className="genre-section" aria-label={t.genres}><div className="genre-pills">{genreOptions.map((item) => <button key={item} className={genre === item ? "active" : ""} onClick={() => setGenre(item)}>{item}</button>)}</div></section>
          <Recommendations title={t.made} picks={recommendations} onPlay={playSong} />
          <SongSection title={query || genre !== "All" ? `${t.trending} · ${genre}` : t.trending} songs={filteredSongs} onPlay={playSong} favorites={favorites} onFavorite={toggleFavorite} trackLabel={t.tracks} />
          <Albums title={t.albums} songs={allSongs} onPlay={playSong} />
          <Lyrics title={t.lyrics} song={currentSong} artist={currentArtist} activeIndex={activeLyricIndex} />
        </>}

        {view === "library" && <><PageTitle title={t.library} subtitle="Saved music, uploads, and playlists." /><SongSection title="Your library" songs={filteredSongs} onPlay={playSong} favorites={favorites} onFavorite={toggleFavorite} trackLabel={t.tracks} /><SongSection title="Favorites" songs={favoriteSongs} onPlay={playSong} favorites={favorites} onFavorite={toggleFavorite} empty="Tap the heart beside a song to save it here." trackLabel={t.tracks} /><Playlists onPlay={playSong} /></>}
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
        {view === "admin" && isAdmin && <section className="section"><PageTitle title="Admin dashboard" subtitle="Catalog, listening, and creator metrics for the platform." /><div className="dashboard"><Metric label="Songs" value={allSongs.length} /><Metric label="Artists" value={artists.length + uploads.length} /><Metric label="Plays" value={totalPlays.toLocaleString()} /><Metric label="Uploads" value={uploads.length} /></div><SongSection title="Moderation queue" songs={uploads.length ? uploads : allSongs.slice(0, 3)} onPlay={playSong} favorites={favorites} onFavorite={toggleFavorite} trackLabel={t.tracks} /></section>}
      </div>

      <footer className="player">
        <audio ref={audioRef} src={currentSong.audio} onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)} onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || currentSong.duration)} onEnded={() => { recordEvent(currentSong.id, "complete"); nextSong(1, null); }} volume={volume} />
        <div className="mini"><img src={currentSong.cover} alt="" /><div className="track-title"><strong>{currentSong.title}</strong><span>{currentArtist?.name || currentSong.artist}</span></div></div>
        <div className="controls"><div className="control-buttons"><button className="bare-btn" onClick={() => nextSong(-1)} title="Previous"><SkipBack size={18} /></button><button className="play-btn" onClick={togglePlay} title="Play or pause">{isPlaying ? <Pause size={20} /> : <Play size={20} />}</button><button className="bare-btn" onClick={() => nextSong(1)} title="Next"><SkipForward size={18} /></button></div><div className="progress"><span>{secondsToTime(currentTime)}</span><input type="range" min="0" max={duration || 0} value={Math.min(currentTime, duration || 0)} onChange={(event) => { const value = Number(event.target.value); if (audioRef.current) audioRef.current.currentTime = value; setCurrentTime(value); }} /><span>{secondsToTime(duration)}</span></div></div>
        <label className="volume"><Volume2 size={17} /><input type="range" min="0" max="1" step="0.01" value={volume} onChange={(event) => { const value = Number(event.target.value); setVolume(value); if (audioRef.current) audioRef.current.volume = value; }} /></label>
      </footer>

      {showAccount && <div className="overlay"><div className="modal"><div className="modal-head"><h2>{user ? "Your AURA account" : "Keep your music with you"}</h2><button className="icon-btn" onClick={() => { setShowAccount(false); setAccountStatus(""); }} aria-label="Close"><X size={18} /></button></div>{user ? <><p><strong>{user.name}</strong></p><p className="muted">{user.email} · {roleLabel}</p>{isAdmin && <p className="form-status"><Shield size={17} />Owner admin access is active for this account.</p>}<p className="account-benefit">Your favorites, artist follows, and recommendations stay connected to this account.</p><button className="secondary-btn" onClick={signOut}>Sign out</button></> : <><p className="account-benefit">Create a free account to save favorites, follow artists, and shape your recommendations.</p><form className="form-grid" onSubmit={submitAccount}><label className="field full"><span>Name</span><input name="name" required /></label><label className="field full"><span>Email</span><input name="email" type="email" required /></label>{accountStatus && <p className="form-status full">{accountStatus}</p>}<button className="primary-btn" type="submit"><LogIn size={18} />{isCloudConfigured ? "Email me a secure link" : "Continue in prototype mode"}</button></form></>}</div></div>}
    </main>
  );
}

function PageTitle({ title, subtitle }) { return <div className="page-title"><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>; }

function Recommendations({ title, picks, onPlay }) {
  return <section className="section"><div className="section-head"><h2>{title}</h2></div><div className="recommend-grid">{picks.map((pick) => <button className="recommend-card" key={pick.title} onClick={() => onPlay(pick.songId)}><img src={pick.image} alt="" /><span><strong>{pick.title}</strong><small>{pick.description}</small></span><span className="recommend-play"><Play size={17} /></span></button>)}</div></section>;
}

function SongSection({ title, songs, onPlay, favorites, onFavorite, empty, trackLabel = "tracks" }) {
  return <section className="section"><div className="section-head"><h2>{title}</h2><span className="muted">{songs.length} {trackLabel}</span></div><div className="track-list">{songs.length === 0 && <div className="empty-state muted">{empty || "No songs found."}</div>}{songs.map((song, index) => { const artist = song.artistId ? getArtist(song.artistId)?.name : song.artist; return <div className="track-row" key={song.id}><span className="track-number">{String(index + 1).padStart(2, "0")}</span><button className="track-main" onClick={() => onPlay(song.id)}><img src={song.cover} alt="" /><span className="track-title"><strong>{song.title}</strong><small>{artist}</small></span></button><span className="muted hide-mobile">{song.album}</span><span className="muted hide-mobile">{secondsToTime(song.duration)}</span><button className={`bare-btn heart ${favorites.includes(song.id) ? "active" : ""}`} onClick={() => onFavorite(song.id)} title="Favorite"><Heart size={18} fill={favorites.includes(song.id) ? "currentColor" : "none"} /></button><button className="row-play" onClick={() => onPlay(song.id)} title={`Play ${song.title}`}><Play size={16} /></button></div>; })}</div></section>;
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
function Playlists({ onPlay }) { return <section className="section"><div className="section-head"><h2>Playlists</h2><Library size={20} /></div><div className="playlist-grid">{playlists.map((playlist) => <button className="playlist-card" key={playlist.id} onClick={() => onPlay(playlist.songIds[0])}><Library size={22} /><strong>{playlist.title}</strong><span>{playlist.description}</span><small>{playlist.songIds.length} songs</small></button>)}</div></section>; }
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
function Metric({ label, value }) { return <div className="metric"><span>{label}</span><strong>{value}</strong><BarChart3 size={20} /></div>; }
