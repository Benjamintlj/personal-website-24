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
        href: 'mailto:ben@benlewisjones.com',
        icon: FaEnvelope,
        x: -8,
        y: -88,
        label: 'Email',
    },
]

export default function ContactButton({
    mainRef,
}: {
    mainRef: React.RefObject<HTMLElement>
}) {
    const [visible, setVisible] = useState(false)
    const [open, setOpen] = useState(false)
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
                                    <textPath href="#contact-circle-path">
                                        Contact Me • Contact Me • Contact Me •
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
                                satellites.map((sat, i) => (
                                    <motion.a
                                        key={sat.label}
                                        href={sat.href}
                                        target={
                                            sat.href.startsWith('mailto')
                                                ? undefined
                                                : '_blank'
                                        }
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
                                ))}
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
