'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

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

/* ─── portfolio card ─── */
function PortfolioCard({
  title,
  subtitle,
  color,
  index,
}: {
  title: string
  subtitle: string
  color: string
  index: number
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
    >
      {/* placeholder image area */}
      <div
        className="aspect-[4/3] relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${color}11, ${color}05)` }}
      >
        {/* grid overlay */}
        <div className="absolute inset-0 cyber-grid opacity-40" />

        {/* centered upload hint */}
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

  const webCards = [
    { title: 'E-Commerce Platform', subtitle: 'Full-Stack Web App' },
    { title: 'SaaS Dashboard', subtitle: 'React + TypeScript' },
    { title: 'Portfolio Site', subtitle: 'Next.js + Framer' },
    { title: 'Landing Page', subtitle: 'Conversion Optimized' },
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
              {webCards.map((card, i) => (
                <PortfolioCard key={card.title} {...card} color="#00aaff" index={i} />
              ))}
            </div>
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
