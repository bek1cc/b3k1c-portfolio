'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'

/* ─── floating particles (deterministic positions for SSR) ─── */
function Particles() {
  const particles = Array.from({ length: 30 }, (_, i) => {
    const seed = (i * 7 + 13) % 100
    return {
      id: i,
      left: ((seed * 37 + 53) % 100),
      delay: (seed * 0.13) % 10,
      duration: 8 + (seed % 12),
      size: 1 + (seed % 3),
      color: ['#00ff88', '#00aaff', '#aa44ff', '#ff0066'][i % 4] as string,
    }
  })

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: 0.4,
          }}
        />
      ))}
    </div>
  )
}

/* ─── section component ─── */
function PortfolioSection({
  number,
  title,
  color,
  children,
}: {
  number: string
  title: string
  color: string
  children: React.ReactNode
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      className="relative py-16 md:py-24"
    >
      {/* section header */}
      <div className="flex items-center gap-4 md:gap-6 mb-10 md:mb-14">
        <span className="section-number">[{number}]</span>
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: 40 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-[2px]"
            style={{ background: color }}
          />
          <h2
            className="text-3xl md:text-5xl font-bold tracking-tight"
            style={{
              color,
              textShadow: `0 0 20px ${color}44`,
            }}
          >
            {title}
          </h2>
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: '100%' } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-[1px] max-w-[200px]"
            style={{ background: `${color}44` }}
          />
        </div>
      </div>

      {/* content */}
      {children}
    </motion.section>
  )
}

/* ─── lightbox modal ─── */
function Lightbox({
  images,
  titles,
  initialIndex,
  onClose,
}: {
  images: string[]
  titles: string[]
  initialIndex: number
  onClose: () => void
}) {
  const [current, setCurrent] = useState(initialIndex)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setCurrent(c => Math.min(c + 1, images.length - 1))
      if (e.key === 'ArrowLeft') setCurrent(c => Math.max(c - 1, 0))
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [images.length, onClose])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-[#0a0a0f]/95 backdrop-blur-xl flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all z-10"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* counter */}
        <div className="absolute top-6 left-6 font-mono text-xs text-white/30 tracking-widest">
          [{current + 1}/{images.length}]
        </div>

        {/* image */}
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-5xl w-full max-h-[80vh] relative"
          onClick={e => e.stopPropagation()}
        >
          <img
            src={images[current]}
            alt={titles[current]}
            className="w-full h-full object-contain rounded-lg"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0a0f] to-transparent rounded-b-lg">
            <p className="font-mono text-sm text-white/60">{titles[current]}</p>
          </div>
        </motion.div>

        {/* nav buttons */}
        {current > 0 && (
          <button
            onClick={(e) => { e.stopPropagation(); setCurrent(c => c - 1) }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-white hover:border-[#00aaff] transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
        {current < images.length - 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); setCurrent(c => c + 1) }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-white hover:border-[#00aaff] transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

/* ─── portfolio card - can show image, video, or placeholder ─── */
function PortfolioCard({
  title,
  subtitle,
  color,
  index,
  image,
  videoSrc,
  galleryImages,
  galleryTitles,
  onClick,
}: {
  title: string
  subtitle: string
  color: string
  index: number
  image?: string
  videoSrc?: string
  galleryImages?: string[]
  galleryTitles?: string[]
  onClick?: () => void
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const hasMedia = image || videoSrc
  const hasGallery = galleryImages && galleryImages.length > 0

  // Build full images list for lightbox
  const allImages = [
    ...(image ? [image] : []),
    ...(galleryImages || []),
  ]
  const allTitles = [
    ...(image ? [title] : []),
    ...(galleryTitles || []),
  ]

  const handleClick = () => {
    if (hasGallery) {
      setLightboxIndex(0)
    } else if (onClick) {
      onClick()
    }
  }

  return (
    <>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.6, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
        className="portfolio-item corner-decor rounded-lg group cursor-pointer"
        onClick={handleClick}
      >
        {/* media area */}
        <div
          className="aspect-[4/3] relative overflow-hidden"
          style={!hasMedia ? { background: `linear-gradient(135deg, ${color}11, ${color}05)` } : undefined}
        >
          {videoSrc ? (
            <>
              <video
                src={videoSrc}
                className="w-full h-full object-cover object-top"
                autoPlay
                loop
                muted
                playsInline
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-50" />
              {/* video indicator */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded bg-[#0a0a0f]/70 backdrop-blur-sm border border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[9px] font-mono text-white/50 tracking-widest">REC</span>
              </div>
              {/* gallery count badge */}
              {hasGallery && (
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded bg-[#0a0a0f]/70 backdrop-blur-sm border border-white/10">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span className="text-[9px] font-mono tracking-wider" style={{ color }}>{galleryImages!.length + 1}</span>
                </div>
              )}
              {/* click to expand overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="px-4 py-2 rounded-lg bg-[#0a0a0f]/80 backdrop-blur-sm border border-white/10 flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
                    <polyline points="15 3 21 3 21 9" />
                    <polyline points="9 21 3 21 3 15" />
                    <line x1="21" y1="3" x2="14" y2="10" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                  <span className="text-[10px] font-mono tracking-[0.15em]" style={{ color }}>POGLEDAJ VIŠE</span>
                </div>
              </div>
            </>
          ) : image ? (
            <>
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-60" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 cyber-grid opacity-40" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <div
                  className="w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{ borderColor: `${color}66` }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>
                <span className="text-xs tracking-widest uppercase" style={{ color: `${color}88` }}>
                  Upload Content
                </span>
              </div>
            </>
          )}

          {/* hover glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `linear-gradient(180deg, transparent 40%, ${color}15 100%)`,
            }}
          />
        </div>

        {/* card info */}
        <div className="p-4 md:p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: color }} />
              <h3 className="font-semibold text-sm md:text-base tracking-wide">{title}</h3>
            </div>
            {hasGallery && (
              <span className="text-[10px] font-mono tracking-wider" style={{ color: `${color}88` }}>
                +{galleryImages!.length} slika
              </span>
            )}
          </div>
          <p className="text-xs md:text-sm text-white/40 pl-4 mt-0.5">{subtitle}</p>
        </div>
      </motion.div>

      {/* lightbox */}
      {lightboxIndex !== null && allImages.length > 0 && (
        <Lightbox
          images={allImages}
          titles={allTitles}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  )
}

/* ─── b3k1c LOGO (AI generated image) ─── */
function B3k1cLogo() {
  return (
    <div className="logo-img-wrapper">
      <img
        src="/b3k1c-logo.png"
        alt="b3k1c logo"
        className="w-full h-full object-contain logo-hologram"
      />
    </div>
  )
}

/* ─── hero section ─── */
function Hero() {
  const [displayText, setDisplayText] = useState('')
  const fullText = '> initializing b3k1c.exe...'
  const [showSubtext, setShowSubtext] = useState(false)

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setDisplayText(fullText.slice(0, i))
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => setShowSubtext(true), 300)
      }
    }, 60)
    return () => clearInterval(interval)
  }, [])

  const { scrollYProgress } = useScroll()
  const logoY = useTransform(scrollYProgress, [0, 0.3], [0, -100])
  const logoOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const logoScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #00ff8815 0%, transparent 70%)' }}
      />

      {/* logo */}
      <motion.div
        style={{ y: logoY, opacity: logoOpacity, scale: logoScale }}
        className="relative z-10 mb-8"
      >
        <div className="relative logo-ring p-3">
          <B3k1cLogo />
        </div>
      </motion.div>

      {/* main title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative z-10 text-center"
      >
        <h1
          className="glitch-text text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter"
          data-text="b3k1c.exe"
          style={{
            fontFamily: 'var(--font-geist-mono)',
            background: 'linear-gradient(135deg, #00ff88, #00aaff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          b3k1c.exe
        </h1>

        {/* typing subtitle */}
        <div className="mt-6 h-8 flex items-center justify-center">
          <span
            className="font-mono text-sm md:text-base tracking-widest"
            style={{ color: '#00ff8888' }}
          >
            {displayText}
          </span>
          {displayText.length <= fullText.length && (
            <span className="cursor-blink ml-0.5" />
          )}
        </div>

        {/* secondary subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={showSubtext ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="mt-4 text-white/30 text-xs md:text-sm tracking-[0.3em] uppercase font-mono"
        >
          {'// digital creative portfolio'}
        </motion.p>
      </motion.div>

      {/* scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-10 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.4em] text-white/20 uppercase font-mono">scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-[1px] h-8"
          style={{ background: 'linear-gradient(180deg, #00ff8866, transparent)' }}
        />
      </motion.div>
    </section>
  )
}

/* ─── nav bar ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const sections = [
    { label: 'DESIGNS', href: '#designs', color: '#00ff88' },
    { label: 'WEB SITES', href: '#websites', color: '#00aaff' },
    { label: 'GAME DEV', href: '#games', color: '#ff0066' },
  ]

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, delay: 2.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-[#00ff8815]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <a href="#" className="font-mono text-sm tracking-widest" style={{ color: '#00ff88' }}>
          b3k1c.exe
        </a>
        <div className="hidden md:flex items-center gap-8">
          {sections.map(s => (
            <a
              key={s.href}
              href={s.href}
              className="font-mono text-xs tracking-[0.2em] text-white/40 hover:text-white transition-colors duration-300 relative group"
            >
              {s.label}
              <span
                className="absolute -bottom-1 left-0 w-0 h-[1px] group-hover:w-full transition-all duration-300"
                style={{ background: s.color }}
              />
            </a>
          ))}
        </div>
        {/* mobile menu dots */}
        <div className="flex md:hidden gap-2">
          {sections.map(s => (
            <a
              key={s.href}
              href={s.href}
              className="w-2 h-2 rounded-full transition-all duration-300 hover:scale-150"
              style={{ background: s.color + '66' }}
            />
          ))}
        </div>
      </div>
    </motion.nav>
  )
}

/* ─── footer ─── */
function Footer() {
  return (
    <footer className="relative py-12 border-t border-[#00ff8815]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-mono text-sm text-white/20">
            <span style={{ color: '#00ff8866' }}>b3k1c.exe</span>{' // all rights reserved'}
          </div>
          <div className="flex items-center gap-6">
            {['Instagram', 'Behance', 'GitHub', 'Dribbble'].map(social => (
              <a
                key={social}
                href="#"
                className="font-mono text-xs tracking-widest text-white/20 hover:text-[#00ff88] transition-colors duration-300"
              >
                {social}
              </a>
            ))}
          </div>
          <div className="font-mono text-xs text-white/10">
            v1.0.0 // built with passion
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ═══════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════ */
export default function Home() {
  const containerRef = useRef(null)

  /* Tomek Instalacije project data */
  const tomekImages = [
    '/portfolio/tomek-instalacije/section-1.png',
    '/portfolio/tomek-instalacije/section-2.png',
    '/portfolio/tomek-instalacije/section-3.png',
    '/portfolio/tomek-instalacije/section-4.png',
    '/portfolio/tomek-instalacije/section-5.png',
    '/portfolio/tomek-instalacije/section-6.png',
    '/portfolio/tomek-instalacije/section-7.png',
  ]
  const tomekTitles = [
    'Hero Section',
    'Landing Page',
    'Stats & Services',
    'Process Steps',
    'Project Gallery',
    'Services Detail',
    'Contact Page',
  ]

  /* WEB SITES section cards */
  const websiteCards = [
    {
      title: 'Tomek Instalacije',
      subtitle: 'Plumbing & heating company website',
      videoSrc: '/portfolio/tomek-instalacije/tomekinstalacije.mp4',
      galleryImages: tomekImages,
      galleryTitles: tomekTitles,
    },
    { title: 'Web Project 2', subtitle: 'Coming Soon' },
    { title: 'Web Project 3', subtitle: 'Coming Soon' },
  ]

  /* DESIGNS section cards */
  const designCards = [
    {
      title: 'Unicate OGC Logo',
      subtitle: 'Logo Design',
      image: '/portfolio/unicate-ogc/logo.jpg',
    },
    { title: 'Brand Identity', subtitle: 'Logo & Visual System' },
    { title: 'UI/UX Concept', subtitle: 'Mobile & Web' },
    { title: 'Illustration', subtitle: 'Digital Art & Vector' },
    { title: 'Typography', subtitle: 'Custom Type Design' },
    { title: 'Packaging', subtitle: 'Product Design' },
  ]

  /* GAME DEV section cards */
  const gameCards = [
    {
      title: 'SA:MP Phone System',
      subtitle: 'v0.1',
      videoSrc: '/portfolio/samp-phone/sampphone.mp4',
    },
    {
      title: 'SA:MP Case System',
      subtitle: 'Game Feature',
      image: '/portfolio/samp-case/klasikcase.png',
    },
    { title: 'Game Project 3', subtitle: 'Coming Soon' },
  ]

  return (
    <div ref={containerRef} className="scanlines noise-bg relative bg-[#0a0a0f] min-h-screen">
      <Particles />
      <Navbar />
      <Hero />

      {/* ─── MAIN CONTENT ─── */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">

        {/* SECTION 01 — DESIGNS */}
        <div id="designs" className="scroll-mt-24">
          <PortfolioSection number="01" title="DESIGNS" color="#00ff88">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {designCards.map((card, i) => (
                <PortfolioCard key={card.title} {...card} color="#00ff88" index={i} />
              ))}
            </div>
          </PortfolioSection>
        </div>

        {/* SECTION 02 — WEB SITES */}
        <div id="websites" className="scroll-mt-24">
          <PortfolioSection number="02" title="WEB SITES" color="#00aaff">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {websiteCards.map((card, i) => (
                <PortfolioCard key={card.title} {...card} color="#00aaff" index={i} />
              ))}
            </div>
          </PortfolioSection>
        </div>

        {/* SECTION 03 — GAME DEVELOPING */}
        <div id="games" className="scroll-mt-24">
          <PortfolioSection number="03" title="GAME DEVELOPING" color="#ff0066">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
              {gameCards.map((card, i) => (
                <PortfolioCard key={card.title} {...card} color="#ff0066" index={i} />
              ))}
            </div>
          </PortfolioSection>
        </div>

        {/* ─── CONTACT / CTA ─── */}
        <PortfolioSection number="04" title="CONTACT" color="#00ff88">
          <div className="max-w-2xl">
            <p className="text-white/40 text-base md:text-lg mb-8 leading-relaxed">
              Interested in working together? Let&apos;s create something extraordinary.
              Drop me a message and let&apos;s bring your vision to life.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="mailto:hello@b3k1c.exe"
                className="inline-flex items-center gap-3 px-6 py-3 rounded border font-mono text-sm tracking-widest transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,136,0.2)]"
                style={{ borderColor: '#00ff8866', color: '#00ff88' }}
              >
                <span className="w-2 h-2 rounded-full bg-[#00ff88]" />
                GET IN TOUCH
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-3 px-6 py-3 rounded border font-mono text-sm tracking-widest text-white/30 border-white/10 transition-all duration-300 hover:border-white/30 hover:text-white/60"
              >
                <span className="w-2 h-2 rounded-full bg-white/20" />
                DOWNLOAD CV
              </a>
            </div>
          </div>
        </PortfolioSection>
      </main>

      <Footer />
    </div>
  )
}
