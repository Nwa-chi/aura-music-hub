"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  BarChart3,
  Disc3,
  Download,
  Heart,
  Home,
  Library,
  LogIn,
  Mic2,
  Moon,
  Music2,
  Pause,
  Play,
  Search,
  Shield,
  SkipBack,
  SkipForward,
  Sun,
  UploadCloud,
  User,
  Volume2,
  X,
} from "lucide-react";
import { albums, artists, getArtist, playlists, secondsToTime, songs as seedSongs } from "../lib/music";

const storageKeys = {
  favorites: "auralyn:favorites",
  uploads: "auralyn:uploads",
  user: "auralyn:user",
};

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "library", label: "Library", icon: Library },
  { id: "artists", label: "Artists", icon: Mic2 },
  { id: "upload", label: "Upload", icon: UploadCloud },
  { id: "admin", label: "Admin", icon: Shield },
];

function loadJson(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export default function HomePage() {
  const audioRef = useRef(null);
  const [view, setView] = useState("home");
  const [query, setQuery] = useState("");
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
  const [uploadForm, setUploadForm] = useState({
    title: "",
    artist: "",
    album: "",
    audio: "",
    cover: "",
    lyrics: "",
  });

  useEffect(() => {
    setFavorites(loadJson(storageKeys.favorites, []));
    setUploads(loadJson(storageKeys.uploads, []));
    setUser(loadJson(storageKeys.user, null));
  }, []);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
    setIsInstalled(standalone);

    function handleInstallPrompt(event) {
      event.preventDefault();
      setInstallPrompt(event);
    }

    function handleInstalled() {
      setInstallPrompt(null);
      setIsInstalled(true);
    }

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem(storageKeys.favorites, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    window.localStorage.setItem(storageKeys.uploads, JSON.stringify(uploads));
  }, [uploads]);

  useEffect(() => {
    if (user) window.localStorage.setItem(storageKeys.user, JSON.stringify(user));
    else window.localStorage.removeItem(storageKeys.user);
  }, [user]);

  const allSongs = useMemo(() => [...uploads, ...seedSongs], [uploads]);
  const currentSong = allSongs.find((song) => song.id === currentId) ?? allSongs[0];
  const currentArtist = currentSong.artistId ? getArtist(currentSong.artistId) : { name: currentSong.artist };

  const filteredSongs = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return allSongs;
    return allSongs.filter((song) => {
      const artist = song.artistId ? getArtist(song.artistId)?.name : song.artist;
      return [song.title, artist, song.album].some((value) => value?.toLowerCase().includes(term));
    });
  }, [allSongs, query]);

  const activeLyricIndex = useMemo(() => {
    const lyrics = currentSong.lyrics ?? [];
    return lyrics.reduce((active, line, index) => (currentTime >= line.time ? index : active), 0);
  }, [currentSong, currentTime]);

  function playSong(id) {
    setCurrentId(id);
    setIsPlaying(true);
    setTimeout(() => audioRef.current?.play().catch(() => setIsPlaying(false)), 50);
  }

  function togglePlay() {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }

  function nextSong(direction = 1) {
    const index = allSongs.findIndex((song) => song.id === currentSong.id);
    const nextIndex = (index + direction + allSongs.length) % allSongs.length;
    playSong(allSongs[nextIndex].id);
  }

  function toggleFavorite(id) {
    setFavorites((items) => (items.includes(id) ? items.filter((item) => item !== id) : [...items, id]));
  }

  async function installApp() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  }

  function submitAccount(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setUser({
      name: form.get("name") || "Music fan",
      email: form.get("email") || "listener@example.com",
      role: "Creator",
    });
    setShowAccount(false);
  }

  function parseLyrics(text) {
    return text
      .split("\n")
      .map((line, index) => {
        const match = line.match(/^\[(\d+):(\d+)]\s*(.+)$/);
        if (match) return { time: Number(match[1]) * 60 + Number(match[2]), text: match[3] };
        return { time: index * 15, text: line.trim() };
      })
      .filter((line) => line.text);
  }

  function submitUpload(event) {
    event.preventDefault();
    const id = `upload-${Date.now()}`;
    const song = {
      id,
      title: uploadForm.title || "Untitled song",
      artist: uploadForm.artist || user?.name || "Independent artist",
      album: uploadForm.album || "Uploads",
      duration: 180,
      plays: 0,
      color: "#38bdf8",
      cover:
        uploadForm.cover ||
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=900&q=80",
      audio: uploadForm.audio || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      lyrics: parseLyrics(uploadForm.lyrics || "Your first uploaded lyric line\nAdd timestamps like [0:15] Chorus begins"),
      uploadedAt: new Date().toISOString(),
    };
    setUploads((items) => [song, ...items]);
    setCurrentId(id);
    setUploadForm({ title: "", artist: "", album: "", audio: "", cover: "", lyrics: "" });
    setView("library");
  }

  const favoriteSongs = allSongs.filter((song) => favorites.includes(song.id));
  const totalPlays = allSongs.reduce((sum, song) => sum + (song.plays || 0), 0);

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark"><Music2 size={22} /></span>
          AURA
        </div>
        <nav className="nav" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.id} className={view === item.id ? "active" : ""} onClick={() => setView(item.id)}>
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <section className="main">
        <header className="topbar">
          <label className="search">
            <Search size={20} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search songs, artists, albums" />
          </label>
          <div className="top-actions">
            {installPrompt && !isInstalled && (
              <button className="icon-btn" onClick={installApp} title="Install AURA" aria-label="Install AURA">
                <Download size={20} />
              </button>
            )}
            <button className="icon-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title="Toggle dark mode">
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="pill-btn secondary" onClick={() => setShowAccount(true)}>
              <User size={18} />
              {user ? user.name : "Sign in"}
            </button>
          </div>
        </header>

        {view === "home" && (
          <>
            <section className="hero">
              <div>
                <p>AI-built streaming workspace</p>
                <h1>Music, lyrics, uploads, profiles, and admin tools in one app.</h1>
                <div className="top-actions">
                  <button className="pill-btn" onClick={() => playSong(currentSong.id)}><Play size={18} /> Play featured</button>
                  <button className="pill-btn secondary" onClick={() => setView("upload")}><UploadCloud size={18} /> Upload</button>
                </div>
              </div>
              <div className="now-card">
                <img className="cover" src={currentSong.cover} alt="" />
                <h3>{currentSong.title}</h3>
                <p className="muted">{currentArtist?.name || currentSong.artist}</p>
              </div>
            </section>
            <SongSection title={query ? "Search results" : "Trending songs"} songs={filteredSongs} onPlay={playSong} favorites={favorites} onFavorite={toggleFavorite} />
            <Albums onPlay={playSong} />
          </>
        )}

        {view === "library" && (
          <>
            <SongSection title="Your library" songs={filteredSongs} onPlay={playSong} favorites={favorites} onFavorite={toggleFavorite} />
            <SongSection title="Favorites" songs={favoriteSongs} onPlay={playSong} favorites={favorites} onFavorite={toggleFavorite} empty="Tap the heart beside a song to save it here." />
            <Playlists onPlay={playSong} />
          </>
        )}

        {view === "artists" && (
          <Artists selectedArtist={selectedArtist} onSelect={setSelectedArtist} onPlay={playSong} />
        )}

        {view === "upload" && (
          <section className="section panel">
            <div className="section-head">
              <div>
                <h2>Upload songs and lyrics</h2>
                <p className="muted">Use URLs for this Cloudflare Pages prototype. Production can move audio to Cloudflare R2.</p>
              </div>
            </div>
            <form className="form-grid" onSubmit={submitUpload}>
              {["title", "artist", "album", "audio", "cover"].map((field) => (
                <label className={field === "audio" || field === "cover" ? "field full" : "field"} key={field}>
                  <span>{field === "audio" ? "Audio URL" : field === "cover" ? "Cover image URL" : field}</span>
                  <input value={uploadForm[field]} onChange={(event) => setUploadForm({ ...uploadForm, [field]: event.target.value })} />
                </label>
              ))}
              <label className="field full">
                <span>Synchronized lyrics</span>
                <textarea value={uploadForm.lyrics} onChange={(event) => setUploadForm({ ...uploadForm, lyrics: event.target.value })} placeholder="[0:00] First lyric&#10;[0:15] Second lyric" />
              </label>
              <button className="pill-btn" type="submit"><UploadCloud size={18} /> Publish upload</button>
            </form>
          </section>
        )}

        {view === "admin" && (
          <section className="section">
            <div className="section-head">
              <div>
                <h2>Admin dashboard</h2>
                <p className="muted">Catalog, listening, and creator metrics for the platform.</p>
              </div>
            </div>
            <div className="dashboard">
              <Metric label="Songs" value={allSongs.length} />
              <Metric label="Artists" value={artists.length + uploads.length} />
              <Metric label="Plays" value={totalPlays.toLocaleString()} />
              <Metric label="Uploads" value={uploads.length} />
            </div>
            <SongSection title="Moderation queue" songs={uploads.length ? uploads : allSongs.slice(0, 3)} onPlay={playSong} favorites={favorites} onFavorite={toggleFavorite} />
          </section>
        )}

        <section className="section panel">
          <div className="section-head">
            <div>
              <h2>Lyrics</h2>
              <p className="muted">{currentSong.title} by {currentArtist?.name || currentSong.artist}</p>
            </div>
          </div>
          <div className="lyrics">
            {(currentSong.lyrics || []).map((line, index) => (
              <div className={`lyric-line ${index === activeLyricIndex ? "active" : ""}`} key={`${line.time}-${line.text}`}>
                {line.text}
              </div>
            ))}
          </div>
        </section>
      </section>

      <footer className="player">
        <audio
          ref={audioRef}
          src={currentSong.audio}
          onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || currentSong.duration)}
          onEnded={() => nextSong(1)}
          volume={volume}
        />
        <div className="mini">
          <img src={currentSong.cover} alt="" />
          <div className="track-title">
            <strong>{currentSong.title}</strong>
            <span className="muted">{currentArtist?.name || currentSong.artist}</span>
          </div>
        </div>
        <div className="controls">
          <div className="control-buttons">
            <button className="icon-btn" onClick={() => nextSong(-1)} title="Previous"><SkipBack size={18} /></button>
            <button className="play" onClick={togglePlay} title="Play or pause">{isPlaying ? <Pause size={22} /> : <Play size={22} />}</button>
            <button className="icon-btn" onClick={() => nextSong(1)} title="Next"><SkipForward size={18} /></button>
          </div>
          <div className="progress">
            <span>{secondsToTime(currentTime)}</span>
            <input type="range" min="0" max={duration || 0} value={Math.min(currentTime, duration || 0)} onChange={(event) => {
              const value = Number(event.target.value);
              if (audioRef.current) audioRef.current.currentTime = value;
              setCurrentTime(value);
            }} />
            <span>{secondsToTime(duration)}</span>
          </div>
        </div>
        <label className="volume">
          <Volume2 size={18} />
          <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(event) => {
            const value = Number(event.target.value);
            setVolume(value);
            if (audioRef.current) audioRef.current.volume = value;
          }} />
        </label>
      </footer>

      {showAccount && (
        <div className="overlay">
          <div className="modal">
            <div className="modal-head">
              <h2>{user ? "Account" : "Sign in"}</h2>
              <button className="icon-btn" onClick={() => setShowAccount(false)}><X size={18} /></button>
            </div>
            {user ? (
              <>
                <p><strong>{user.name}</strong></p>
                <p className="muted">{user.email} · {user.role}</p>
                <button className="pill-btn secondary" onClick={() => setUser(null)}>Sign out</button>
              </>
            ) : (
              <form className="form-grid" onSubmit={submitAccount}>
                <label className="field full"><span>Name</span><input name="name" required /></label>
                <label className="field full"><span>Email</span><input name="email" type="email" required /></label>
                <button className="pill-btn" type="submit"><LogIn size={18} /> Continue</button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function SongSection({ title, songs, onPlay, favorites, onFavorite, empty }) {
  return (
    <section className="section">
      <div className="section-head">
        <h2>{title}</h2>
        <span className="muted">{songs.length} tracks</span>
      </div>
      <div className="track-list">
        {songs.length === 0 && <div className="panel muted">{empty || "No songs found."}</div>}
        {songs.map((song) => {
          const artist = song.artistId ? getArtist(song.artistId)?.name : song.artist;
          return (
            <div className="track-row" key={song.id}>
              <button className="play" onClick={() => onPlay(song.id)} title={`Play ${song.title}`}><Play size={17} /></button>
              <div className="mini">
                <img src={song.cover} alt="" />
                <div className="track-title">
                  <strong>{song.title}</strong>
                  <span className="muted">{artist}</span>
                </div>
              </div>
              <span className="muted hide-mobile">{song.album}</span>
              <span className="muted hide-mobile">{secondsToTime(song.duration)}</span>
              <button className={`icon-btn heart ${favorites.includes(song.id) ? "active" : ""}`} onClick={() => onFavorite(song.id)} title="Favorite">
                <Heart size={18} fill={favorites.includes(song.id) ? "currentColor" : "none"} />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Albums({ onPlay }) {
  return (
    <section className="section">
      <div className="section-head"><h2>Albums</h2><Disc3 size={22} /></div>
      <div className="grid">
        {albums.map((album) => (
          <article className="album-card" key={album.id}>
            <button onClick={() => onPlay(album.songIds[0])}>
              <img className="cover" src={album.cover} alt="" />
              <h3>{album.title}</h3>
              <p className="muted">{getArtist(album.artistId)?.name} · {album.year}</p>
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function Playlists({ onPlay }) {
  return (
    <section className="section">
      <div className="section-head"><h2>Playlists</h2><Library size={22} /></div>
      <div className="grid">
        {playlists.map((playlist) => (
          <article className="album-card" key={playlist.id}>
            <button onClick={() => onPlay(playlist.songIds[0])}>
              <h3>{playlist.title}</h3>
              <p className="muted">{playlist.description}</p>
              <p>{playlist.songIds.length} songs</p>
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function Artists({ selectedArtist, onSelect, onPlay }) {
  const artist = getArtist(selectedArtist) ?? artists[0];
  const artistSongs = seedSongs.filter((song) => song.artistId === artist.id);

  return (
    <>
      <section className="section">
        <div className="grid">
          {artists.map((item) => (
            <article className="artist-card" key={item.id}>
              <button onClick={() => onSelect(item.id)}>
                <img className="avatar" src={item.image} alt="" />
                <h3>{item.name}</h3>
                <p className="muted">{item.genre}</p>
              </button>
            </article>
          ))}
        </div>
      </section>
      <section className="section panel">
        <div className="section-head">
          <div>
            <h2>{artist.name}</h2>
            <p className="muted">{artist.genre} · {artist.location} · {artist.followers} followers</p>
          </div>
          <button className="pill-btn" onClick={() => onPlay(artistSongs[0]?.id)}><Play size={18} /> Play</button>
        </div>
        <p>{artist.bio}</p>
      </section>
    </>
  );
}

function Metric({ label, value }) {
  return (
    <div className="panel metric">
      <strong>{value}</strong>
      <span className="muted">{label}</span>
      <BarChart3 size={20} />
    </div>
  );
}
