"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  BarChart3, Disc3, Download, Globe2, Heart, Home, Library, LogIn, Mic2, Moon,
  Music2, Pause, Play, Search, Shield, SkipBack, SkipForward, Sun, UploadCloud,
  User, Volume2, X,
} from "lucide-react";
import { albums, artists, getArtist, playlists, secondsToTime, songs as seedSongs } from "../lib/music";

const storageKeys = {
  favorites: "aura:favorites",
  uploads: "aura:uploads",
  user: "aura:user",
  language: "aura:language",
};

const legacyKeys = {
  favorites: "auralyn:favorites",
  uploads: "auralyn:uploads",
  user: "auralyn:user",
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
  nl: { home: "Home", library: "Bibliotheek", artists: "Artiesten", upload: "Uploaden", admin: "Beheer", signIn: "Inloggen", featured: "Uitgelicht nummer", play: "Afspelen", search: "Zoek nummers, artiesten en albums", made: "Voor jou", trending: "Nu populair", albums: "Albums", lyrics: "Songtekst", tracks: "nummers", genres: "Bladeren op genre" },
  ln: { home: "Ndako", library: "Bibliotɛkɛ", artists: "Bayembi", upload: "Tinda", admin: "Bokambi", signIn: "Kota", featured: "Loyembo ya ntina", play: "Yoka", search: "Luka nzembo, moyembi to albomi", made: "Mpo na yo", trending: "Oyo ezali koyokana", albums: "Ba albomi", lyrics: "Maloba ya nzembo", tracks: "nzembo", genres: "Luka na lolenge" },
  yo: { home: "Ilé", library: "Àkójọpọ̀", artists: "Àwọn olórin", upload: "Gbé sókè", admin: "Ìṣàkóso", signIn: "Wọlé", featured: "Orin àkànṣe", play: "Dún", search: "Wá orin, olórin àti àwo orin", made: "Ti a ṣe fún ọ", trending: "Èyí tó gbajúmọ̀", albums: "Àwọn àwo orin", lyrics: "Ọ̀rọ̀ orin", tracks: "orin", genres: "Ṣàwárí nípa irú orin" },
};

const languages = [
  ["en", "English"], ["pcm", "Nigerian Pidgin"], ["ig", "Igbo"], ["yo", "Yorùbá"],
  ["es", "Español"], ["it", "Italiano"], ["tr", "Türkçe"], ["nl", "Nederlands"],
  ["srn", "Sranan Tongo"], ["ln", "Lingála (Congo)"], ["fr", "Français"], ["pt", "Português"],
  ["de", "Deutsch"], ["ja", "日本語"], ["ar", "العربية"], ["hi", "हिन्दी"],
];
const genreOptions = ["All", "Pop", "R&B", "Electronic", "Hip-Hop", "Afrobeats", "Jazz", "Indie"];

function loadJson(key, fallback, legacyKey) {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key) ?? (legacyKey ? window.localStorage.getItem(legacyKey) : null);
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
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const [showAccount, setShowAccount] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [currentId, setCurrentId] = useState(seedSongs[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(seedSongs[0].duration);
  const [volume, setVolume] = useState(0.72);
  const [selectedArtist, setSelectedArtist] = useState(artists[0].id);
  const [uploadForm, setUploadForm] = useState({ title: "", artist: "", album: "", genre: "Indie", audio: "", cover: "", lyrics: "" });

  const t = copy[language] || copy.en;
  const navItems = [
    { id: "home", label: t.home, icon: Home }, { id: "library", label: t.library, icon: Library },
    { id: "artists", label: t.artists, icon: Mic2 }, { id: "upload", label: t.upload, icon: UploadCloud },
    { id: "admin", label: t.admin, icon: Shield },
  ];

  useEffect(() => {
    setFavorites(loadJson(storageKeys.favorites, [], legacyKeys.favorites));
    setUploads(loadJson(storageKeys.uploads, [], legacyKeys.uploads));
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

  useEffect(() => { document.documentElement.classList.toggle("light", theme === "light"); }, [theme]);
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem(storageKeys.language, language);
  }, [language]);
  useEffect(() => { window.localStorage.setItem(storageKeys.favorites, JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { window.localStorage.setItem(storageKeys.uploads, JSON.stringify(uploads)); }, [uploads]);
  useEffect(() => { user ? window.localStorage.setItem(storageKeys.user, JSON.stringify(user)) : window.localStorage.removeItem(storageKeys.user); }, [user]);

  const allSongs = useMemo(() => [...uploads, ...seedSongs], [uploads]);
  const currentSong = allSongs.find((song) => song.id === currentId) ?? allSongs[0];
  const currentArtist = currentSong.artistId ? getArtist(currentSong.artistId) : { name: currentSong.artist };
  const filteredSongs = useMemo(() => {
    const term = query.trim().toLowerCase();
    return allSongs.filter((song) => {
      const artist = song.artistId ? getArtist(song.artistId)?.name : song.artist;
      const matchesSearch = !term || [song.title, artist, song.album].some((value) => value?.toLowerCase().includes(term));
      return matchesSearch && (genre === "All" || song.genre === genre);
    });
  }, [allSongs, query, genre]);
  const activeLyricIndex = useMemo(() => (currentSong.lyrics ?? []).reduce((active, line, index) => currentTime >= line.time ? index : active, 0), [currentSong, currentTime]);

  function playSong(id) { setCurrentId(id); setIsPlaying(true); setTimeout(() => audioRef.current?.play().catch(() => setIsPlaying(false)), 50); }
  function togglePlay() {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  }
  function nextSong(direction = 1) {
    const index = allSongs.findIndex((song) => song.id === currentSong.id);
    playSong(allSongs[(index + direction + allSongs.length) % allSongs.length].id);
  }
  function toggleFavorite(id) { setFavorites((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]); }
  async function installApp() { if (installPrompt) { await installPrompt.prompt(); await installPrompt.userChoice; setInstallPrompt(null); } }
  function submitAccount(event) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    setUser({ name: form.get("name") || "Music fan", email: form.get("email") || "listener@example.com", role: "Creator" }); setShowAccount(false);
  }
  function parseLyrics(text) {
    return text.split("\n").map((line, index) => {
      const match = line.match(/^\[(\d+):(\d+)]\s*(.+)$/);
      return match ? { time: Number(match[1]) * 60 + Number(match[2]), text: match[3] } : { time: index * 15, text: line.trim() };
    }).filter((line) => line.text);
  }
  function submitUpload(event) {
    event.preventDefault(); const id = `upload-${Date.now()}`;
    const song = {
      id, title: uploadForm.title || "Untitled song", artist: uploadForm.artist || user?.name || "Independent artist",
      album: uploadForm.album || "Uploads", genre: uploadForm.genre, duration: 180, plays: 0, color: "#38bdf8",
      cover: uploadForm.cover || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=900&q=80",
      audio: uploadForm.audio || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      lyrics: parseLyrics(uploadForm.lyrics || "Your first uploaded lyric line\nAdd timestamps like [0:15] Chorus begins"), uploadedAt: new Date().toISOString(),
    };
    setUploads((items) => [song, ...items]); setCurrentId(id);
    setUploadForm({ title: "", artist: "", album: "", genre: "Indie", audio: "", cover: "", lyrics: "" }); setView("library");
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
            <div className="hero-copy"><p className="eyebrow">{t.featured}</p><h1>{seedSongs[0].title}</h1><p>{getArtist(seedSongs[0].artistId)?.name} · {seedSongs[0].album}</p><div className="button-row"><button className="primary-btn" onClick={() => playSong(seedSongs[0].id)}><Play size={17} />{t.play}</button><button className="secondary-btn" onClick={() => setView("upload")}><UploadCloud size={17} />{t.upload}</button></div></div>
            <img src={seedSongs[0].cover} alt="Golden Hour album cover" />
          </section>

          <label className="search"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} /></label>
          <section className="genre-section" aria-label={t.genres}><div className="genre-pills">{genreOptions.map((item) => <button key={item} className={genre === item ? "active" : ""} onClick={() => setGenre(item)}>{item}</button>)}</div></section>
          <Recommendations title={t.made} onPlay={playSong} />
          <SongSection title={query || genre !== "All" ? `${t.trending} · ${genre}` : t.trending} songs={filteredSongs} onPlay={playSong} favorites={favorites} onFavorite={toggleFavorite} trackLabel={t.tracks} />
          <Albums title={t.albums} onPlay={playSong} />
          <Lyrics title={t.lyrics} song={currentSong} artist={currentArtist} activeIndex={activeLyricIndex} />
        </>}

        {view === "library" && <><PageTitle title={t.library} subtitle="Saved music, uploads, and playlists." /><SongSection title="Your library" songs={filteredSongs} onPlay={playSong} favorites={favorites} onFavorite={toggleFavorite} trackLabel={t.tracks} /><SongSection title="Favorites" songs={favoriteSongs} onPlay={playSong} favorites={favorites} onFavorite={toggleFavorite} empty="Tap the heart beside a song to save it here." trackLabel={t.tracks} /><Playlists onPlay={playSong} /></>}
        {view === "artists" && <><PageTitle title={t.artists} subtitle="Meet the voices shaping AURA." /><Artists selectedArtist={selectedArtist} onSelect={setSelectedArtist} onPlay={playSong} /></>}
        {view === "upload" && <section className="section panel"><PageTitle title="Upload songs and lyrics" subtitle="Use URLs for this Cloudflare Pages prototype. Production audio can move to Cloudflare R2." /><form className="form-grid" onSubmit={submitUpload}>{["title", "artist", "album", "audio", "cover"].map((field) => <label className={field === "audio" || field === "cover" ? "field full" : "field"} key={field}><span>{field === "audio" ? "Audio URL" : field === "cover" ? "Cover image URL" : field}</span><input value={uploadForm[field]} onChange={(event) => setUploadForm({ ...uploadForm, [field]: event.target.value })} /></label>)}<label className="field"><span>Genre</span><select value={uploadForm.genre} onChange={(event) => setUploadForm({ ...uploadForm, genre: event.target.value })}>{genreOptions.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label><label className="field full"><span>Synchronized lyrics</span><textarea value={uploadForm.lyrics} onChange={(event) => setUploadForm({ ...uploadForm, lyrics: event.target.value })} placeholder={'[0:00] First lyric\n[0:15] Second lyric'} /></label><button className="primary-btn" type="submit"><UploadCloud size={18} />Publish upload</button></form></section>}
        {view === "admin" && <section className="section"><PageTitle title="Admin dashboard" subtitle="Catalog, listening, and creator metrics for the platform." /><div className="dashboard"><Metric label="Songs" value={allSongs.length} /><Metric label="Artists" value={artists.length + uploads.length} /><Metric label="Plays" value={totalPlays.toLocaleString()} /><Metric label="Uploads" value={uploads.length} /></div><SongSection title="Moderation queue" songs={uploads.length ? uploads : allSongs.slice(0, 3)} onPlay={playSong} favorites={favorites} onFavorite={toggleFavorite} trackLabel={t.tracks} /></section>}
      </div>

      <footer className="player">
        <audio ref={audioRef} src={currentSong.audio} onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)} onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || currentSong.duration)} onEnded={() => nextSong(1)} volume={volume} />
        <div className="mini"><img src={currentSong.cover} alt="" /><div className="track-title"><strong>{currentSong.title}</strong><span>{currentArtist?.name || currentSong.artist}</span></div></div>
        <div className="controls"><div className="control-buttons"><button className="bare-btn" onClick={() => nextSong(-1)} title="Previous"><SkipBack size={18} /></button><button className="play-btn" onClick={togglePlay} title="Play or pause">{isPlaying ? <Pause size={20} /> : <Play size={20} />}</button><button className="bare-btn" onClick={() => nextSong(1)} title="Next"><SkipForward size={18} /></button></div><div className="progress"><span>{secondsToTime(currentTime)}</span><input type="range" min="0" max={duration || 0} value={Math.min(currentTime, duration || 0)} onChange={(event) => { const value = Number(event.target.value); if (audioRef.current) audioRef.current.currentTime = value; setCurrentTime(value); }} /><span>{secondsToTime(duration)}</span></div></div>
        <label className="volume"><Volume2 size={17} /><input type="range" min="0" max="1" step="0.01" value={volume} onChange={(event) => { const value = Number(event.target.value); setVolume(value); if (audioRef.current) audioRef.current.volume = value; }} /></label>
      </footer>

      {showAccount && <div className="overlay"><div className="modal"><div className="modal-head"><h2>{user ? "Account" : t.signIn}</h2><button className="icon-btn" onClick={() => setShowAccount(false)} aria-label="Close"><X size={18} /></button></div>{user ? <><p><strong>{user.name}</strong></p><p className="muted">{user.email} · {user.role}</p><button className="secondary-btn" onClick={() => setUser(null)}>Sign out</button></> : <form className="form-grid" onSubmit={submitAccount}><label className="field full"><span>Name</span><input name="name" required /></label><label className="field full"><span>Email</span><input name="email" type="email" required /></label><button className="primary-btn" type="submit"><LogIn size={18} />Continue</button></form>}</div></div>}
    </main>
  );
}

function PageTitle({ title, subtitle }) { return <div className="page-title"><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>; }

function Recommendations({ title, onPlay }) {
  const picks = [
    { title: "Morning Lift", description: "Bright pop and warm soul", songId: "golden-hour", image: seedSongs[0].cover },
    { title: "Night Signals", description: "Electronic songs after dark", songId: "neon-prayer", image: seedSongs[1].cover },
    { title: "Rhythm Atlas", description: "Percussion from across the map", songId: "rain-dance", image: seedSongs[2].cover },
  ];
  return <section className="section"><div className="section-head"><h2>{title}</h2></div><div className="recommend-grid">{picks.map((pick) => <button className="recommend-card" key={pick.title} onClick={() => onPlay(pick.songId)}><img src={pick.image} alt="" /><span><strong>{pick.title}</strong><small>{pick.description}</small></span><span className="recommend-play"><Play size={17} /></span></button>)}</div></section>;
}

function SongSection({ title, songs, onPlay, favorites, onFavorite, empty, trackLabel = "tracks" }) {
  return <section className="section"><div className="section-head"><h2>{title}</h2><span className="muted">{songs.length} {trackLabel}</span></div><div className="track-list">{songs.length === 0 && <div className="empty-state muted">{empty || "No songs found."}</div>}{songs.map((song, index) => { const artist = song.artistId ? getArtist(song.artistId)?.name : song.artist; return <div className="track-row" key={song.id}><span className="track-number">{String(index + 1).padStart(2, "0")}</span><button className="track-main" onClick={() => onPlay(song.id)}><img src={song.cover} alt="" /><span className="track-title"><strong>{song.title}</strong><small>{artist}</small></span></button><span className="muted hide-mobile">{song.album}</span><span className="muted hide-mobile">{secondsToTime(song.duration)}</span><button className={`bare-btn heart ${favorites.includes(song.id) ? "active" : ""}`} onClick={() => onFavorite(song.id)} title="Favorite"><Heart size={18} fill={favorites.includes(song.id) ? "currentColor" : "none"} /></button><button className="row-play" onClick={() => onPlay(song.id)} title={`Play ${song.title}`}><Play size={16} /></button></div>; })}</div></section>;
}

function Albums({ title = "Albums", onPlay }) { return <section className="section"><div className="section-head"><h2>{title}</h2><Disc3 size={20} /></div><div className="album-grid">{albums.map((album) => <article className="album-card" key={album.id}><button onClick={() => onPlay(album.songIds[0])}><img src={album.cover} alt="" /><h3>{album.title}</h3><p>{getArtist(album.artistId)?.name} · {album.year}</p></button></article>)}</div></section>; }
function Playlists({ onPlay }) { return <section className="section"><div className="section-head"><h2>Playlists</h2><Library size={20} /></div><div className="playlist-grid">{playlists.map((playlist) => <button className="playlist-card" key={playlist.id} onClick={() => onPlay(playlist.songIds[0])}><Library size={22} /><strong>{playlist.title}</strong><span>{playlist.description}</span><small>{playlist.songIds.length} songs</small></button>)}</div></section>; }
function Lyrics({ title, song, artist, activeIndex }) { return <section className="section lyrics-panel"><div className="section-head"><div><h2>{title}</h2><p className="muted">{song.title} · {artist?.name || song.artist}</p></div><Mic2 size={20} /></div><div className="lyrics">{(song.lyrics || []).map((line, index) => <button className={`lyric-line ${index === activeIndex ? "active" : ""}`} key={`${line.time}-${line.text}`}>{line.text}</button>)}</div></section>; }
function Artists({ selectedArtist, onSelect, onPlay }) { const artist = getArtist(selectedArtist) ?? artists[0]; const artistSongs = seedSongs.filter((song) => song.artistId === artist.id); return <><section className="section"><div className="artist-grid">{artists.map((item) => <button className={`artist-card ${item.id === artist.id ? "active" : ""}`} key={item.id} onClick={() => onSelect(item.id)}><img src={item.image} alt="" /><strong>{item.name}</strong><span>{item.genre}</span></button>)}</div></section><section className="section artist-profile"><img src={artist.image} alt="" /><div><p className="eyebrow">{artist.genre} · {artist.location}</p><h2>{artist.name}</h2><p>{artist.bio}</p><p className="muted">{artist.followers} followers</p><button className="primary-btn" onClick={() => onPlay(artistSongs[0]?.id)}><Play size={18} />Play artist</button></div></section></>; }
function Metric({ label, value }) { return <div className="metric"><span>{label}</span><strong>{value}</strong><BarChart3 size={20} /></div>; }
