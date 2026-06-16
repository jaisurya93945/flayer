import { useEffect, Suspense, lazy } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePlayerStore } from './store/playerStore'
import { fetchLibrary } from './utils/supabase'
import { useSeekPoller } from './hooks/useSeekPoller'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'

import AlbumArt from './components/AlbumArt'
import Controls from './components/Controls'
import TrackInfo from './components/TrackInfo'
import NavTabs from './components/NavTabs'
import Library from './components/Library'
import Queue from './components/Queue'
import WaveformBars from './components/WaveformBars'

// Lazy-load the heavy 3D scene
const Scene3D = lazy(() => import('./components/Scene3D'))

export default function App() {
  const {
    setLibrary, currentTrack, isPlaying,
    activeView, setActiveView,
  } = usePlayerStore()

  // Start polling seek
  useSeekPoller()
  useKeyboardShortcuts()

  // Load library on mount
  useEffect(() => {
    fetchLibrary().then(setLibrary)
  }, [setLibrary])

  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center"
      style={{ background: '#02020d', minHeight: '100dvh' }}
    >
      {/* ── 3D Background ── */}
      <Suspense fallback={null}>
        <Scene3D isPlaying={isPlaying} />
      </Suspense>

      {/* ── Radial gradient accent from current track ── */}
      <motion.div
        className="absolute inset-0 z-[1] pointer-events-none"
        animate={{
          opacity: isPlaying ? 0.6 : 0.3,
        }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(109,40,217,0.25) 0%, transparent 70%)',
        }}
      />

      {/* ── Top bar ── */}
      <div
        className="relative z-20 w-full flex items-center justify-center px-4 py-3 flex-shrink-0"
        style={{ maxWidth: 520 }}
      >
        <div className="flex items-center justify-between w-full">
          {/* Wordmark */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span
              className="text-white/80 font-semibold tracking-widest text-sm uppercase"
              style={{ fontFamily: 'Space Grotesk', letterSpacing: '0.2em' }}
            >
              Aurora
            </span>
          </motion.div>

          <NavTabs />
        </div>
      </div>

      {/* ── Main content area ── */}
      <div
        className="relative z-10 w-full flex-1 overflow-hidden"
        style={{ maxWidth: 520 }}
      >
        <AnimatePresence mode="wait">

          {/* ── NOW PLAYING VIEW ── */}
          {activeView === 'player' && (
            <motion.div
              key="player"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col items-center justify-center px-6 gap-6"
            >
              {/* Album Art */}
              <AlbumArt track={currentTrack} isPlaying={isPlaying} />

              {/* Waveform */}
              <WaveformBars isPlaying={isPlaying} />

              {/* Track info */}
              <div className="w-full" style={{ maxWidth: 360 }}>
                <TrackInfo />
              </div>

              {/* Controls */}
              <div className="w-full" style={{ maxWidth: 360 }}>
                <Controls />
              </div>

              {/* Keyboard hint */}
              <p
                className="text-white/15 text-xs pb-4 hidden sm:block"
                style={{ fontFamily: 'Space Grotesk' }}
              >
                Space · Play/Pause &nbsp; Shift+← → · Prev/Next &nbsp; ↑↓ · Volume &nbsp; M · Mute
              </p>
            </motion.div>
          )}

          {/* ── LIBRARY VIEW ── */}
          {activeView === 'library' && (
            <motion.div
              key="library"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
              className="h-full flex flex-col px-4 pt-2 pb-4"
              style={{ maxHeight: 'calc(100dvh - 120px)' }}
            >
              {/* Glass card */}
              <div
                className="flex-1 flex flex-col rounded-2xl overflow-hidden p-4"
                style={{
                  background: 'rgba(10,5,30,0.75)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(139,92,246,0.15)',
                  maxHeight: '100%',
                }}
              >
                <Library />
              </div>

              {/* Mini player bar at bottom when in library */}
              {currentTrack && (
                <MiniPlayer />
              )}
            </motion.div>
          )}

          {/* ── QUEUE VIEW ── */}
          {activeView === 'queue' && (
            <motion.div
              key="queue"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="h-full flex flex-col px-4 pt-2 pb-4"
              style={{ maxHeight: 'calc(100dvh - 120px)' }}
            >
              <div
                className="flex-1 flex flex-col rounded-2xl overflow-hidden p-4"
                style={{
                  background: 'rgba(10,5,30,0.75)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(139,92,246,0.15)',
                  maxHeight: '100%',
                }}
              >
                <Queue />
              </div>

              {currentTrack && <MiniPlayer />}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}

// Mini player shown at bottom of library/queue views
function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlay, nextTrack, setActiveView } = usePlayerStore()

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 60, opacity: 0 }}
      className="mt-3 flex items-center gap-3 rounded-2xl px-4 py-3 flex-shrink-0 cursor-pointer"
      style={{
        background: 'rgba(20,10,50,0.9)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(139,92,246,0.25)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
      onClick={() => setActiveView('player')}
    >
      {/* Cover */}
      <div className="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden" style={{ background: 'rgba(139,92,246,0.2)' }}>
        {currentTrack?.coverUrl && (
          <img src={currentTrack.coverUrl} alt="" className="w-full h-full object-cover" onError={e=>e.target.style.display='none'} />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white/90 text-sm font-medium truncate" style={{ fontFamily: 'Space Grotesk' }}>
          {currentTrack?.title}
        </p>
        <p className="text-white/40 text-xs truncate">{currentTrack?.artist}</p>
      </div>

      {/* Mini waveform */}
      <div className="flex-shrink-0">
        <WaveformBars isPlaying={isPlaying} barCount={12} />
      </div>

      {/* Play/Pause */}
      <motion.button
        onClick={e => { e.stopPropagation(); togglePlay() }}
        whileTap={{ scale: 0.9 }}
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
      >
        {isPlaying
          ? <svg viewBox="0 0 20 20" width={14} fill="white"><rect x="4" y="3" width="4" height="14" rx="1"/><rect x="12" y="3" width="4" height="14" rx="1"/></svg>
          : <svg viewBox="0 0 20 20" width={14} fill="white"><path d="M5 3l12 7-12 7V3z"/></svg>
        }
      </motion.button>

      <motion.button
        onClick={e => { e.stopPropagation(); nextTrack() }}
        whileTap={{ scale: 0.9 }}
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white/50 hover:text-white/90"
      >
        <svg viewBox="0 0 20 20" width={16} fill="currentColor">
          <path d="M5 4l9 6-9 6V4zm10 0h2v12h-2z"/>
        </svg>
      </motion.button>
    </motion.div>
  )
}
