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
              textShadow: `0 0 10px ${color}66, 0 0 30px ${color}33`,
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

/* ─── portfolio card with optional image ─── */
function PortfolioCard({
  title,
  subtitle,
  color,
  index,
  image,
  onClick,
}: {
  title: string
  subtitle: string
  color: string
  index: number
  image?: string
  onClick?: () => void
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
      className="portfolio-item corner-decor rounded-lg group cursor-pointer"
      onClick={onClick}
    >
      {/* image area */}
      <div
        className="aspect-[4/3] relative overflow-hidden"
        style={!image ? { background: `linear-gradient(135deg, ${color}11, ${color}05)` } : undefined}
      >
        {image ? (
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

        {/* hover overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(180deg, transparent 40%, ${color}15 100%)`,
          }}
        />
      </div>

      {/* card info */}
      <div className="p-4 md:p-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: color }} />
          <h3 className="font-semibold text-sm md:text-base tracking-wide">{title}</h3>
        </div>
        <p className="text-xs md:text-sm text-white/40 pl-4">{subtitle}</p>
      </div>
    </motion.div>
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

/* ─── project showcase (1 main image + 5 thumbnails) ─── */
function ProjectShowcase({
  title,
  description,
  tags,
  images,
  imageTitles,
  color,
  liveUrl,
}: {
  title: string
  description: string
  tags: string[]
  images: string[]
  imageTitles: string[]
  color: string
  liveUrl?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [mainImage, setMainImage] = useState(0)

  // Show up to 6 images (1 main + 5 thumbnails)
  const displayImages = images.slice(0, 6)
  const displayTitles = imageTitles.slice(0, 6)
  const thumbs = displayImages.slice(1) // 5 thumbnails

  return (
    <>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="relative"
      >
        {/* project info bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color }}>
              {title}
            </h3>
            <p className="text-white/40 text-sm mt-1">{description}</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-mono tracking-wider border"
                style={{ borderColor: `${color}44`, color: `${color}aa`, background: `${color}08` }}
              >
                {tag}
              </span>
            ))}
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1.5 rounded-full text-xs font-mono tracking-wider border transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,170,255,0.3)]"
                style={{ borderColor: `${color}66`, color }}
              >
                LIVE →
              </a>
            )}
          </div>
        </div>

        {/* main image + thumbnails layout */}
        <div className="flex flex-col lg:flex-row gap-3">
          {/* main image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="relative group cursor-pointer overflow-hidden rounded-lg border border-white/5 flex-1"
            onClick={() => setLightboxIndex(mainImage)}
          >
            <img
              src={displayImages[mainImage]}
              alt={displayTitles[mainImage]}
              className="w-full h-[250px] sm:h-[350px] lg:h-[400px] object-cover object-top transition-all duration-700 group-hover:scale-[1.03] group-hover:brightness-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="font-mono text-sm" style={{ color }}>{displayTitles[mainImage]}</p>
              <p className="font-mono text-xs text-white/30 mt-1">Click to view full size</p>
            </div>
            {/* glow on hover */}
            <div
              className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ boxShadow: `inset 0 0 30px ${color}22, 0 0 20px ${color}11` }}
            />
          </motion.div>

          {/* thumbnails column */}
          <div className="flex flex-row lg:flex-col gap-2 lg:w-[200px] xl:w-[240px]">
            {thumbs.map((thumb, i) => {
              const realIndex = i + 1 // offset by 1 since main is 0
              const isActive = mainImage === realIndex
              return (
                <motion.div
                  key={realIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
                  className={`relative group cursor-pointer overflow-hidden rounded-lg border flex-1 transition-all duration-300 ${
                    isActive ? `border-[${color}88]` : 'border-white/5 hover:border-white/20'
                  }`}
                  style={isActive ? { borderColor: `${color}88`, boxShadow: `0 0 15px ${color}22` } : undefined}
                  onClick={() => setMainImage(realIndex)}
                >
                  <img
                    src={thumb}
                    alt={displayTitles[realIndex]}
                    className="w-full h-[70px] sm:h-[80px] lg:h-[70px] object-cover object-top transition-all duration-500 group-hover:brightness-125"
                    style={isActive ? { filter: 'brightness(1.2)' } : undefined}
                  />
                  <div className="absolute inset-0 bg-[#0a0a0f]/30 group-hover:bg-transparent transition-all duration-300" />
                  {/* active indicator dot */}
                  {isActive && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={displayImages}
          titles={displayTitles}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
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
          <img
            src="/b3k1c-logo.png"
            alt="b3k1c.exe logo"
            className="w-32 h-32 md:w-48 md:h-48 object-contain logo-hologram rounded-full"
          />
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
    { label: 'FOTO / VIDEO', href: '#foto', color: '#aa44ff' },
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

  /* placeholder cards data */
  const designCards = [
    { title: 'Brand Identity', subtitle: 'Logo & Visual System' },
    { title: 'Poster Design', subtitle: 'Print & Digital' },
    { title: 'UI/UX Concept', subtitle: 'Mobile & Web' },
    { title: 'Illustration', subtitle: 'Digital Art & Vector' },
    { title: 'Typography', subtitle: 'Custom Type Design' },
    { title: 'Packaging', subtitle: 'Product Design' },
  ]

  const fotoCards = [
    { title: 'Street Photography', subtitle: 'Urban Exploration' },
    { title: 'Product Shoot', subtitle: 'Studio Setup' },
    { title: 'Music Video', subtitle: 'Directing & Editing' },
    { title: 'Short Film', subtitle: 'Cinematography' },
    { title: 'Motion Graphics', subtitle: 'After Effects' },
  ]

  const gameCards = [
    { title: 'Indie Game', subtitle: 'Unity / Unreal' },
    { title: 'Game Concept', subtitle: 'Level Design' },
    { title: '3D Assets', subtitle: 'Blender & ZBrush' },
    { title: 'Game UI', subtitle: 'HUD & Menus' },
  ]

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
            {/* Featured project: Tomek Instalacije */}
            <ProjectShowcase
              title="Tomek Instalacije"
              description="Full website for plumbing & heating company — dark theme, responsive design, gallery, contact form"
              tags={['Next.js', 'TypeScript', 'Tailwind', 'Responsive']}
              images={tomekImages}
              imageTitles={tomekTitles}
              color="#00aaff"
            />
          </PortfolioSection>
        </div>

        {/* SECTION 03 — FOTO / VIDEO */}
        <div id="foto" className="scroll-mt-24">
          <PortfolioSection number="03" title="FOTO / VIDEO" color="#aa44ff">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {fotoCards.map((card, i) => (
                <PortfolioCard key={card.title} {...card} color="#aa44ff" index={i} />
              ))}
            </div>
          </PortfolioSection>
        </div>

        {/* SECTION 04 — GAME DEVELOPING */}
        <div id="games" className="scroll-mt-24">
          <PortfolioSection number="04" title="GAME DEVELOPING" color="#ff0066">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
              {gameCards.map((card, i) => (
                <PortfolioCard key={card.title} {...card} color="#ff0066" index={i} />
              ))}
            </div>
          </PortfolioSection>
        </div>

        {/* ─── CONTACT / CTA ─── */}
        <PortfolioSection number="05" title="CONTACT" color="#00ff88">
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
