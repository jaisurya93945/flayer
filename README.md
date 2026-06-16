# Aurora Music Player

A cinematic, 3D music player powered by Three.js, React, and your Supabase storage bucket.

---

## Features

- Live **3D aurora rings, star field, and waveform** visualization (Three.js + react-three/fiber)
- **3D tilt album art** with parallax shine effect on hover
- **Full playback engine** via Howler.js — reliable cross-browser HTML5 audio
- Animated waveform bars synced to playback state
- **Seek bar** with drag support (mouse + touch)
- **Volume control** with mute toggle
- **Shuffle, Repeat One, Repeat All**
- Previous/Next with "restart if >3s played" behavior
- **Library panel** with live search (title, artist, album)
- **Queue panel** with remove support
- **Mini player** persistent bar in Library and Queue views
- **Keyboard shortcuts**: Space, Shift+←→, ↑↓ volume, M mute
- Fully responsive — phones, tablets, desktops
- Dark glass-morphism UI, Space Grotesk + Inter typography
- Reduced motion respected (`prefers-reduced-motion`)
- Zero authentication required

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 18 + Vite 5 |
| 3D | Three.js + @react-three/fiber + @react-three/drei |
| Animation | Framer Motion |
| Audio | Howler.js |
| State | Zustand |
| Storage | Supabase Storage |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Deploy | Vercel |

---

## Setup (5 minutes)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Supabase

**A. Create storage buckets**

In your Supabase dashboard → Storage:
1. Create a bucket called `songs` — set to **Public**
2. Create a bucket called `covers` — set to **Public**

**B. Upload your files**

- Upload audio files to the `songs` bucket (mp3, flac, wav, ogg, m4a, aac)
- Upload cover images to the `covers` bucket as JPG

**File naming convention:**
```
songs/Daft Punk - Get Lucky.mp3
covers/Daft Punk - Get Lucky.jpg   ← same base name, .jpg extension
```

The player auto-parses `Artist - Title` from filenames. If there's no ` - ` separator, the whole filename becomes the title.

**C. Set storage policies (allow public read)**

In Supabase → Storage → your bucket → Policies:
- Add a policy: `SELECT` for `anon` role with condition `true`

**D. Copy credentials**

```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SONGS_BUCKET=songs
VITE_COVERS_BUCKET=covers
```

Find your URL and anon key in: Supabase Dashboard → Settings → API

### 3. Run locally

```bash
npm run dev
```

Open http://localhost:5173

---

## Deploy to Vercel

### One-command deploy

```bash
# Install Vercel CLI (once)
npm i -g vercel

# Deploy
vercel

# Set environment variables when prompted, or add them in vercel.com dashboard
```

### Or via Vercel dashboard

1. Push to GitHub
2. Import repo at vercel.com/new
3. Add environment variables in Settings → Environment Variables
4. Deploy

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `Shift + →` | Next track |
| `Shift + ←` | Previous track |
| `↑` | Volume +5% |
| `↓` | Volume -5% |
| `M` | Toggle mute |

---

## Customizing

### Change accent color

Search and replace `#7c3aed` / `#a855f7` in the source with your hex colors.

### Change bucket names

Set `VITE_SONGS_BUCKET` and `VITE_COVERS_BUCKET` in your `.env`.

### Cover images in formats other than JPG

In `src/utils/supabase.js`, change:
```js
const coverUrl = supabase.storage.from(COVERS_BUCKET).getPublicUrl(`${baseName}.jpg`)
```
to `.png`, `.webp`, etc.

### Add metadata (artist, album, year)

You can store a `metadata.json` in your Supabase bucket and fetch it alongside the file list — the store and UI are structured to accept those fields.

---

## Project Structure

```
src/
  components/
    Scene3D.jsx       ← Three.js 3D background
    AlbumArt.jsx      ← Tilt + glow album card
    Controls.jsx      ← Play/Pause, Skip, Shuffle, Repeat
    SeekBar.jsx       ← Draggable progress bar
    VolumeControl.jsx ← Volume slider + mute
    TrackInfo.jsx     ← Animated title + artist
    WaveformBars.jsx  ← Animated bars visualizer
    Library.jsx       ← Searchable track list
    Queue.jsx         ← Playback queue
    NavTabs.jsx       ← Player / Library / Queue tabs
  hooks/
    useSeekPoller.js        ← 250ms seek update interval
    useKeyboardShortcuts.js ← Global hotkeys
  store/
    playerStore.js    ← Zustand global state + Howler integration
  utils/
    supabase.js       ← Supabase client + library fetcher
  App.jsx             ← Layout + view switching
  main.jsx            ← Entry point
  index.css           ← Tailwind + global styles
```
