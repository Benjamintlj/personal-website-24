'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'
import { useOutsideClick } from '@/hooks/use-outside-click'

// Evenly spaced at ~35° apart, all arcing left and upward so they stay in-viewport
const satellites = [
    {
        href: 'https://github.com/Benjamintlj',
        icon: FaGithub,
        x: -85,
        y: -22,
        label: 'GitHub',
    },
    {
        href: 'https://www.linkedin.com/in/benjamin-lewis-jones/',
        icon: FaLinkedin,
        x: -57,
        y: -67,
        label: 'LinkedIn',
    },
    {
        copyText: 'ben@benlewisjones.com',
        icon: FaEnvelope,
        x: -8,
        y: -88,
        label: 'Copy to clipboard',
    },
] as const

// 5 particles evenly spaced at 72° — minimum for a full radial burst
const PARTICLES = [
    { angle: 0 },
    { angle: 72 },
    { angle: 144 },
    { angle: 216 },
    { angle: 288 },
]

export default function ContactButton({
    mainRef,
}: {
    mainRef: React.RefObject<HTMLElement>
}) {
    const [visible, setVisible] = useState(false)
    const [open, setOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useOutsideClick(containerRef, () => setOpen(false))

    useEffect(() => {
        const el = mainRef.current
        if (!el) return

        const handleScroll = () => {
            setVisible(el.scrollTop > window.innerHeight * 0.5)
        }

        el.addEventListener('scroll', handleScroll, { passive: true })
        return () => el.removeEventListener('scroll', handleScroll)
    }, [mainRef])

    const handleCopyClick = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            // Clipboard write failed — fail silently
        }
    }

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="fixed bottom-6 right-6 z-[200]"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                >
                    <div ref={containerRef} className="relative">
                        {/* Click wrapper — no bob */}
                        <div
                            className="relative w-[96px] h-[96px] cursor-pointer"
                            onClick={() => setOpen((o) => !o)}
                        >
                            {/* Spinning circular text — r=42, fontSize 10, 3 repeats fills circumference */}
                            <motion.svg
                                viewBox="0 0 100 100"
                                className="absolute inset-0 w-full h-full"
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 20,
                                    repeat: Infinity,
                                    ease: 'linear',
                                }}
                            >
                                <defs>
                                    <path
                                        id="contact-circle-path"
                                        d="M 50,50 m -42,0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0"
                                    />
                                </defs>
                                <text
                                    fontSize="10"
                                    fill="white"
                                    letterSpacing="1.5"
                                    fontWeight="500"
                                    style={{ userSelect: 'none' }}
                                >
                                    <textPath href="#contact-circle-path" textLength="258" lengthAdjust="spacing">
                                        {'Contact Me • Contact Me • Contact Me •'}
                                    </textPath>
                                </text>
                            </motion.svg>

                            {/* Memoji video circle — inset-[12px] aligns inner edge with text ring */}
                            <div className="absolute inset-[12px] rounded-full overflow-hidden bg-white">
                                <video
                                    className="w-full h-full object-cover"
                                    style={{ objectPosition: 'center 15%' }}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                >
                                    <source
                                        src="/videos/memoji-hevc.mov"
                                        type='video/mp4; codecs="hvc1"'
                                    />
                                    <source
                                        src="/videos/memoji.webm"
                                        type="video/webm"
                                    />
                                </video>
                            </div>
                        </div>

                        {/* Satellite links */}
                        <AnimatePresence>
                            {open &&
                                satellites.map((sat, i) => {
                                    if ('copyText' in sat) {
                                        // Copy-to-clipboard satellite — pill morph + celebration
                                        return (
                                            <motion.button
                                                key={sat.label}
                                                aria-label={sat.label}
                                                className="absolute flex items-center justify-center rounded-full shadow-lg overflow-hidden"
                                                style={{
                                                    top: 'calc(50% - 20px)',
                                                    left: 'calc(50% - 20px)',
                                                    height: 40,
                                                }}
                                                initial={{
                                                    x: 0,
                                                    y: 0,
                                                    opacity: 0,
                                                    scale: 0,
                                                    width: 40,
                                                    backgroundColor: '#ffffff',
                                                    paddingLeft: 0,
                                                    paddingRight: 0,
                                                }}
                                                animate={{
                                                    x: sat.x,
                                                    y: sat.y,
                                                    opacity: 1,
                                                    scale: 1,
                                                    width: copied ? 100 : 40,
                                                    backgroundColor: copied ? '#22c55e' : '#ffffff',
                                                    paddingLeft: copied ? 12 : 0,
                                                    paddingRight: copied ? 12 : 0,
                                                }}
                                                exit={{
                                                    x: 0,
                                                    y: 0,
                                                    opacity: 0,
                                                    scale: 0,
                                                }}
                                                whileHover={{ scale: copied ? 1 : 1.15 }}
                                                transition={{
                                                    type: 'spring',
                                                    stiffness: 300,
                                                    damping: 25,
                                                    delay: i * 0.06,
                                                }}
                                                onClick={() => handleCopyClick(sat.copyText)}
                                            >
                                                <sat.icon className={copied ? 'text-white flex-shrink-0' : 'text-black flex-shrink-0'} />
                                                <AnimatePresence>
                                                    {copied && (
                                                        <motion.span
                                                            initial={{ opacity: 0, width: 0 }}
                                                            animate={{ opacity: 1, width: 'auto' }}
                                                            exit={{ opacity: 0, width: 0 }}
                                                            className="ml-2 text-xs font-medium text-white whitespace-nowrap overflow-hidden"
                                                        >
                                                            Copied!
                                                        </motion.span>
                                                    )}
                                                </AnimatePresence>
                                            </motion.button>
                                        )
                                    }

                                    // Standard link satellite
                                    return (
                                        <motion.a
                                            key={sat.label}
                                            href={sat.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={sat.label}
                                            className="absolute flex items-center justify-center w-10 h-10 rounded-full bg-white text-black text-lg shadow-lg"
                                            style={{
                                                top: 'calc(50% - 20px)',
                                                left: 'calc(50% - 20px)',
                                            }}
                                            initial={{
                                                x: 0,
                                                y: 0,
                                                opacity: 0,
                                                scale: 0,
                                            }}
                                            animate={{
                                                x: sat.x,
                                                y: sat.y,
                                                opacity: 1,
                                                scale: 1,
                                            }}
                                            exit={{
                                                x: 0,
                                                y: 0,
                                                opacity: 0,
                                                scale: 0,
                                            }}
                                            whileHover={{ scale: 1.15 }}
                                            transition={{
                                                type: 'spring',
                                                stiffness: 300,
                                                damping: 25,
                                                delay: i * 0.06,
                                            }}
                                        >
                                            <sat.icon />
                                        </motion.a>
                                    )
                                })}
                        </AnimatePresence>

                        {/* Particle dots — rendered relative to containerRef, at email satellite position */}
                        {open && copied && PARTICLES.map((p, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1.5 h-1.5 rounded-full bg-green-400 pointer-events-none"
                                style={{
                                    // Email satellite: x=-8, y=-88 from center (50% - 20px)
                                    // Center of satellite = (50% - 20px + -8px + 20px, 50% - 20px + -88px + 20px)
                                    //                     = (50% - 8px, 50% - 88px)
                                    top: 'calc(50% - 88px)',
                                    left: 'calc(50% - 8px)',
                                }}
                                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                                animate={{
                                    x: Math.cos(p.angle * Math.PI / 180) * 35,
                                    y: Math.sin(p.angle * Math.PI / 180) * 35,
                                    opacity: 0,
                                    scale: 0,
                                }}
                                transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.02 }}
                            />
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
