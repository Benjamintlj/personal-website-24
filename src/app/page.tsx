'use client'

import React, { useEffect, useRef, Suspense, useState } from 'react'
import Dots from '@/app/ui/backgrounds/dots'
import Memoji from '@/app/ui/title-section/memoji'
import { VanishingWords } from '@/app/ui/title-section/vanishing-words'
import { Break } from '@/app/ui/general/break'
import ContactButton from '@/app/ui/contact/contact-button'
import { FaGithub, FaLinkedin, FaPython, FaAws } from 'react-icons/fa'
import { PiFileSql } from 'react-icons/pi'
import {
    SiDocker,
    SiTypescript,
    SiReact,
    SiGo,
    SiLinux,
    SiAzuredevops,
    SiDotnet,
    SiPostgresql,
    SiMicrosoftsqlserver,
    SiRabbitmq,
    SiGooglecloud,
    SiWindows,
} from 'react-icons/si'
import { GiKite } from 'react-icons/gi'
import { motion, AnimatePresence } from 'framer-motion'
import { Timeline } from '@/app/ui/work-experience/timeline'
import { ToolLogos } from '@/app/ui/work-experience/tool-logos'
const AllProjects = React.lazy(() => import('@/app/ui/projects/all-projects'))

export default function Home() {
    const mainRef = useRef(null)
    const [emailCopied, setEmailCopied] = useState(false)
    const [burgerOpen, setBurgerOpen] = useState(false)

    const copyEmail = () => {
        navigator.clipboard.writeText('ben@benlewisjones.com')
        setEmailCopied(true)
        setTimeout(() => setEmailCopied(false), 1500)
    }

    const descriptiveWords = ['Senior Engineer', 'Athlete', 'Founder']
    const relativeClause = 'Aspiring'

    const industryStart = new Date('2023-09-01')
    const rawYears = (Date.now() - industryStart.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    const wholeYears = Math.floor(rawYears)
    const hasHalf = rawYears - wholeYears >= 0.5
    const yearsInIndustry = hasHalf ? `${wholeYears} and a half` : `${wholeYears}`
    const yearsShort = hasHalf ? `${wholeYears}½` : `${wholeYears}`

    const navLinks = [
        { label: 'Home', href: '#hero' },
        { label: 'Experience', href: '#experience' },
        { label: 'Projects', href: '#projects' },
        { label: 'Contact', href: '#contact' },
    ]

    const accessPayTools = [
        { name: '.NET Framework / Core', icon: <SiDotnet className="text-purple-500 text-xs" /> },
        { name: 'Postgres', icon: <SiPostgresql className="text-sky-400 text-xs" /> },
        { name: 'Microsoft SQL', icon: <SiMicrosoftsqlserver className="text-red-400 text-xs" /> },
        { name: 'RabbitMQ', icon: <SiRabbitmq className="text-orange-500 text-xs" /> },
        { name: 'Docker', icon: <SiDocker className="text-blue-400 text-xs" /> },
        { name: 'Azure DevOps Pipelines', icon: <SiAzuredevops className="text-blue-600 text-xs" /> },
        { name: 'AWS', icon: <FaAws className="text-orange-400 text-xs" /> },
        { name: 'GCP', icon: <SiGooglecloud className="text-blue-400 text-xs" /> },
        { name: 'Linux', icon: <SiLinux className="text-white text-xs" /> },
        { name: 'Windows Servers', icon: <SiWindows className="text-sky-400 text-xs" /> },
    ]

    useEffect(() => {
        document.documentElement.classList.add('dark')
    }, [])

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault()
        const id = href.replace('#', '')
        const el = document.getElementById(id)
        const container = mainRef.current as HTMLElement | null
        const nav = document.querySelector('nav')
        const navHeight = nav ? nav.getBoundingClientRect().height : 0
        if (el && container) {
            container.scrollTo({ top: el.offsetTop - navHeight - 10, behavior: 'smooth' })
        }
    }

    return (
        <div className="h-screen w-screen bg-black overflow-hidden">
            {/* Fixed full-width navbar */}
            <nav className="fixed top-0 inset-x-0 z-50 bg-neutral-900/70 backdrop-blur-md">
                <div className="w-4/5 max-w-[1100px] mx-auto flex justify-between items-center py-4">
                    {/* Nav links — hidden below 464px */}
                    <div className="hidden nav:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={(e) => scrollToSection(e, link.href)}
                                className="text-neutral-200 hover:text-white text-sm cursor-pointer transition-colors duration-150 whitespace-nowrap"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Burger button — visible below 464px */}
                    <button
                        className="nav:hidden flex flex-col justify-center gap-[5px] w-6 h-6"
                        onClick={() => setBurgerOpen(o => !o)}
                        aria-label="Menu"
                    >
                        <motion.span animate={{ rotate: burgerOpen ? 45 : 0, y: burgerOpen ? 7 : 0 }} className="block h-0.5 w-6 bg-neutral-200 origin-center" />
                        <motion.span animate={{ opacity: burgerOpen ? 0 : 1 }} className="block h-0.5 w-6 bg-neutral-200" />
                        <motion.span animate={{ rotate: burgerOpen ? -45 : 0, y: burgerOpen ? -7 : 0 }} className="block h-0.5 w-6 bg-neutral-200 origin-center" />
                    </button>

                    <motion.a
                        href="/cv.pdf" download="ben lewis-jones CV.pdf"
                        className="hidden nav:flex items-center gap-2 text-neutral-200 hover:text-white text-sm whitespace-nowrap transition-colors duration-150"
                        initial="rest"
                        whileHover="hover"
                    >
                        <div className="relative shrink-0" style={{ width: 20, height: 16, perspective: '60px' }}>
                            <div className="absolute inset-0 rounded bg-gradient-to-b from-amber-400 to-amber-500">
                                <div className="absolute left-1 rounded-t-sm bg-gradient-to-b from-amber-300 to-amber-400" style={{ top: -4, width: 8, height: 4 }} />
                            </div>
                            <motion.div
                                className="absolute bg-white rounded-sm"
                                style={{ width: 10, height: 12, left: '50%', zIndex: 10 }}
                                variants={{ rest: { x: '-50%', y: -4, rotate: 0 }, hover: { x: '-40%', y: -7, rotate: 8 } }}
                                transition={{ duration: 0.25, ease: 'easeOut' }}
                            />
                            <motion.div
                                className="absolute inset-x-0 bottom-0 rounded bg-gradient-to-b from-amber-300 to-amber-500"
                                style={{ height: '85%', zIndex: 20, transformOrigin: 'bottom', transformStyle: 'preserve-3d' }}
                                variants={{ rest: { rotateX: -20 }, hover: { rotateX: -45 } }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="absolute inset-x-1 top-1 h-px bg-amber-200/50" />
                            </motion.div>
                        </div>
                        <span className="hidden nav:inline sm:hidden">CV</span>
                        <span className="hidden sm:inline">Download CV</span>
                    </motion.a>
                </div>

                {/* Dropdown menu for mobile */}
                <AnimatePresence>
                    {burgerOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="nav:hidden overflow-hidden border-t border-neutral-700/50"
                        >
                            <div className="flex flex-col py-2 w-4/5 mx-auto">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        onClick={(e) => { scrollToSection(e, link.href); setBurgerOpen(false) }}
                                        className="text-neutral-200 hover:text-white text-sm py-3 cursor-pointer transition-colors duration-150"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                                <div className="py-3" />
                                <a
                                    href="/cv.pdf" download="ben lewis-jones CV.pdf"
                                    className="flex items-center gap-2 text-neutral-200 hover:text-white text-sm py-3 transition-colors duration-150"
                                    onClick={() => setBurgerOpen(false)}
                                >
                                    <div className="relative shrink-0" style={{ width: 20, height: 16, perspective: '60px' }}>
                                        <div className="absolute inset-0 rounded bg-gradient-to-b from-amber-400 to-amber-500">
                                            <div className="absolute left-1 rounded-t-sm bg-gradient-to-b from-amber-300 to-amber-400" style={{ top: -4, width: 8, height: 4 }} />
                                        </div>
                                        <div className="absolute bg-white rounded-sm" style={{ width: 10, height: 12, left: '50%', transform: 'translateX(-50%) translateY(-4px)', zIndex: 10 }} />
                                        <div className="absolute inset-x-0 bottom-0 rounded bg-gradient-to-b from-amber-300 to-amber-500" style={{ height: '85%', zIndex: 20 }}>
                                            <div className="absolute inset-x-1 top-1 h-px bg-amber-200/50" />
                                        </div>
                                    </div>
                                    Download CV
                                </a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
            <main
                className="h-full w-full snap-mandatory overflow-scroll hide-scrollbar"
                ref={mainRef}
            >
            <ContactButton mainRef={mainRef} />
            <Dots
                className={`w-full flex flex-col justify-center`}
            >
                {/*Title page*/}
                <section id="hero" className="h-[70vh] w-full flex flex-col justify-center relative">
                    <div className="w-4/5 max-w-[1100px] mx-auto">
                        {/* Left: text */}
                        <div className="flex flex-col gap-6 md:w-3/5">
                            <div>
                                <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold text-white leading-tight pb-2">
                                    Ben Lewis-Jones
                                </h1>
                                <div className="mt-4">
                                    <VanishingWords
                                        className="secondary text-xl sm:text-2xl"
                                        relativeClause={relativeClause}
                                        words={descriptiveWords}
                                    />
                                </div>
                            </div>

                            <p className="text-neutral-500 text-sm leading-relaxed max-w-sm">
                                {yearsInIndustry} years shipping production software — high-volume payment systems at AccessPay, and embedded to cloud development at Dyson.
                            </p>

                            <div className="flex flex-wrap gap-2">
                                <span className="text-xs px-3 py-1.5 rounded-full border border-neutral-700 text-neutral-400 bg-neutral-900/50">
                                    Mid-Level SE · AccessPay
                                </span>
                                <span className="text-xs px-3 py-1.5 rounded-full border border-neutral-700 text-neutral-400 bg-neutral-900/50">
                                    {yearsShort} yrs industry exp
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Memoji: center aligned to right edge of max-w-5xl */}
                    <div
                        className="absolute top-1/2 hidden sm:block"
                        style={{
                            right: 'max(10%, calc((100vw - 1100px) / 2))',
                            transform: 'translate(25%, -50%)',
                            maskImage: 'linear-gradient(to right, black 55%, transparent 85%)',
                            WebkitMaskImage: 'linear-gradient(to right, black 55%, transparent 85%)',
                        }}
                    >
                        <Memoji className="w-64 md:w-80 xl:w-96" />
                    </div>


                </section>

                {/*Work Experience*/}
                <section id="experience" className="w-4/5 max-w-[1100px] snap-start mx-auto">
                    <h2 className="header2 text-3xl mb-4">Work Experience</h2>
                    <Break />
                    <p className="text-gray-400 text-base mt-6 mb-8">
                        Over the past <span className="text-white font-semibold">{yearsInIndustry} years</span>, I have had the opportunity to work with some of the most <span className="text-white font-semibold">amazing people</span>, on some <span className="text-white font-semibold">amazing projects</span>, affecting millions of people and at the time of writing <span className="text-white font-semibold">1 in 20 payments in the UK</span>.
                    </p>
                    <Timeline scrollContainer={mainRef} data={[
                        {
                            title: 'Sep 2022',
                            content: (
                                <div>
                                    <p className="text-white font-bold text-xl mb-4">Dyson</p>

                                    <p className="text-gray-300 font-semibold text-sm mb-1">Embedded Software • Internship</p>
                                    <p className="text-gray-500 text-xs mb-3">Sep 2022 – Mar 2023</p>
                                    <ToolLogos tools={[
                                        { name: 'C', icon: <span className="text-blue-400 text-[10px] font-bold">C</span> },
                                        { name: 'Python', icon: <FaPython className="text-yellow-400 text-xs" /> },
                                        { name: 'FreeRTOS', icon: <span className="text-green-400 text-[8px] font-bold leading-none">fRTOS</span> },
                                        { name: 'Zephyr', icon: <GiKite className="text-purple-400 text-xs" /> },
                                        { name: 'Linux', icon: <SiLinux className="text-white text-xs" /> },
                                    ]} />
                                    <p className="text-gray-400 text-sm mb-4">I started my time at Dyson by joining an embedded team working on what was then the next generation of purifiers, which has since become the current line. I had to learn quickly and was trusted with a lot of responsibility, culminating in the delivery of several key features.</p>
                                    <ul className="space-y-1 mb-8">
                                        {['Shipped production features', 'Created I2C test tool', 'Practiced agile methods'].map((a) => (
                                            <li key={a} className="flex items-start gap-2 text-sm text-gray-400">
                                                <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                                {a}
                                            </li>
                                        ))}
                                    </ul>

                                    <p className="text-gray-300 font-semibold text-sm mb-1">Cloud Engineering • Internship</p>
                                    <p className="text-gray-500 text-xs mb-3">Apr 2023 – Sep 2023</p>
                                    <ToolLogos tools={[
                                        { name: 'AWS', icon: <FaAws className="text-orange-400 text-xs" /> },
                                        { name: 'TypeScript', icon: <SiTypescript className="text-blue-400 text-xs" /> },
                                        { name: 'Python', icon: <FaPython className="text-yellow-400 text-xs" /> },
                                        { name: '.NET Core', icon: <SiDotnet className="text-purple-500 text-xs" /> },
                                        { name: 'SQL', icon: <PiFileSql className="text-sky-300 text-xs" /> },
                                        { name: 'Docker', icon: <SiDocker className="text-blue-400 text-xs" /> },
                                        { name: 'Azure DevOps', icon: <SiAzuredevops className="text-blue-600 text-xs" /> },
                                    ]} />
                                    <p className="text-gray-400 text-sm mb-4">I joined Dyson’s Cloud Robot team and shipped live backend services for the 360VisNav, across a diverse stack, delivering analytics and DevOps improvements across AWS. My work earned a recommendation to return.</p>
                                    <ul className="space-y-1">
                                        {['Shipped live services', 'Earned return recommendation', 'Enhanced AWS pipelines'].map((a) => (
                                            <li key={a} className="flex items-start gap-2 text-sm text-gray-400">
                                                <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                                {a}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ),
                        },
                        {
                            title: 'Sep 2024',
                            content: (
                                <div>
                                    <p className="text-white font-bold text-xl mb-4">AccessPay</p>

                                    <p className="text-gray-300 font-semibold text-sm mb-1">Junior Software Engineer</p>
                                    <p className="text-gray-500 text-xs mb-3">Sep 2024 – Mar 2026</p>
                                    <ToolLogos tools={accessPayTools} />
                                    <p className="text-gray-400 text-sm mb-4">I joined AccessPay as a junior engineer on a high‑throughput payments and cash management platform. Navigating legacy code, inconsistent banking standards and ambiguous user inputs, I helped keep critical services running while adapting to its demanding uptime and legacy challenges.</p>
                                    <ul className="space-y-1 mb-8">
                                        {['Handled time-sensitive production incidents', 'Won company Go-Getter award and nominated for 2 others', 'Delivered across products'].map((a) => (
                                            <li key={a} className="flex items-start gap-2 text-sm text-gray-400">
                                                <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                                {a}
                                            </li>
                                        ))}
                                    </ul>

                                    <p className="text-gray-300 font-semibold text-sm mb-1">Mid-Level Software Engineer</p>
                                    <p className="text-gray-500 text-xs mb-3">Mar 2026 – Present</p>
                                    <ToolLogos tools={accessPayTools} />
                                    <p className="text-gray-400 text-sm mb-4">I have recently been promoted to Mid-Level Engineer. Let&apos;s see what the future holds!</p>
                                    <ul className="space-y-1">
                                        {[].map((a) => (
                                            <li key={a} className="flex items-start gap-2 text-sm text-gray-400">
                                                <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                                {a}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ),
                        },
                    ]} />
                </section>

                {/*Projects*/}
                <section id="projects" className="w-4/5 max-w-[1100px] snap-start mx-auto mb-[5.75rem] desktop:mb-0">
                    <h2 className="header2 text-3xl mb-4">Projects</h2>

                    <Break />
                    <Suspense fallback={<div>Loading All Projects...</div>}>
                        <AllProjects />
                    </Suspense>
                </section>

                {/*Contact*/}
                <section id="contact" className="w-4/5 max-w-[1100px] snap-start mx-auto">
                    <h2 className="header2 text-3xl mb-4">Contact</h2>
                    <Break />
                    <div className="mt-8 flex flex-col gap-4">
                        <a href="https://github.com/Benjamintlj" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                            <FaGithub className="text-xl flex-shrink-0 text-white" />
                            <span className="text-sm">github.com/Benjamintlj</span>
                        </a>
                        <a href="https://www.linkedin.com/in/benjamin-lewis-jones/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                            <FaLinkedin className="text-xl flex-shrink-0 text-[#60a5fa]" />
                            <span className="text-sm">linkedin.com/in/benjamin-lewis-jones</span>
                        </a>
                        <button onClick={copyEmail} className="relative flex items-center gap-3 text-gray-400 hover:text-white transition-colors cursor-pointer">
                            <span className="text-lg flex-shrink-0 leading-none">✉️</span>
                            <AnimatePresence mode="wait">
                                {emailCopied ? (
                                    <motion.span
                                        key="copied"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                        className="text-sm text-green-400 relative"
                                    >
                                        Copied!
                                        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                                            <motion.div
                                                key={i}
                                                className="absolute w-1.5 h-1.5 rounded-full bg-green-400 pointer-events-none"
                                                style={{ top: '50%', left: '50%' }}
                                                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                                                animate={{
                                                    x: Math.cos(angle * Math.PI / 180) * 28,
                                                    y: Math.sin(angle * Math.PI / 180) * 28,
                                                    opacity: 0,
                                                    scale: 0,
                                                }}
                                                transition={{ duration: 0.55, ease: 'easeOut', delay: i * 0.02 }}
                                            />
                                        ))}
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="email"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                        className="text-sm"
                                    >
                                        ben@benlewisjones.com
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                    <motion.a
                        href="/cv.pdf" download="ben lewis-jones CV.pdf"
                        className="mt-8 flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                        initial="rest"
                        whileHover="hover"
                    >
                        <div className="relative flex-shrink-0" style={{ width: 20, height: 16, perspective: '60px' }}>
                            {/* Folder back */}
                            <div className="absolute inset-0 rounded bg-gradient-to-b from-amber-400 to-amber-500">
                                <div className="absolute left-1 rounded-t-sm bg-gradient-to-b from-amber-300 to-amber-400" style={{ top: -4, width: 8, height: 4 }} />
                            </div>
                            {/* Document — slides up on hover */}
                            <motion.div
                                className="absolute bg-white rounded-sm"
                                style={{ width: 10, height: 12, left: '50%', zIndex: 10 }}
                                variants={{ rest: { x: '-50%', y: -4, rotate: 0 }, hover: { x: '-40%', y: -7, rotate: 8 } }}
                                transition={{ duration: 0.25, ease: 'easeOut' }}
                            />
                            {/* Folder front flap — opens on hover */}
                            <motion.div
                                className="absolute inset-x-0 bottom-0 rounded bg-gradient-to-b from-amber-300 to-amber-500"
                                style={{ height: '85%', zIndex: 20, transformOrigin: 'bottom', transformStyle: 'preserve-3d' }}
                                variants={{ rest: { rotateX: -20 }, hover: { rotateX: -45 } }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="absolute inset-x-1 top-1 h-px bg-amber-200/50" />
                            </motion.div>
                        </div>
                        <span className="text-sm">Download CV</span>
                    </motion.a>
                </section>

                <section className="w-4/5 max-w-[1100px] snap-start mx-auto h-24"></section>
            </Dots>
            </main>
        </div>
    )
}
