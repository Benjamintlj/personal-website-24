'use client'

import React, { useEffect, useRef, Suspense } from 'react'
import Dots from '@/app/ui/backgrounds/dots'
import Memoji from '@/app/ui/title-section/memoji'
import { VanishingWords } from '@/app/ui/title-section/vanishing-words'
import { Break } from '@/app/ui/general/break'
import ContactButton from '@/app/ui/contact/contact-button'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { Menu } from '@/app/ui/navbar-menu'
import { Timeline } from '@/app/ui/work-experience/timeline'
const AllProjects = React.lazy(() => import('@/app/ui/projects/all-projects'))

export default function Home() {
    const mainRef = useRef(null)

    const descriptiveWords = ['Senior Engineer', 'Athlete', 'Founder']
    const relativeClause = 'Aspiring'

    const industryStart = new Date('2023-09-01')
    const yearsInIndustry = ((Date.now() - industryStart.getTime()) / (365.25 * 24 * 60 * 60 * 1000)).toFixed(1)

    const navLinks = [
        { label: 'Home', href: '#hero' },
        { label: 'Experience', href: '#experience' },
        { label: 'Projects', href: '#projects' },
        { label: 'Contact', href: '#contact' },
    ]

    useEffect(() => {
        document.documentElement.classList.add('dark')
    }, [])

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault()
        const id = href.replace('#', '')
        const el = document.getElementById(id)
        const container = mainRef.current as HTMLElement | null
        if (el && container) {
            container.scrollTo({ top: el.offsetTop, behavior: 'smooth' })
        }
    }

    return (
        <div className="h-screen w-screen bg-black overflow-hidden">
            {/* Floating navbar */}
            <div className="fixed top-6 inset-x-0 w-4/5 max-w-[1100px] mx-auto z-50">
                <div className="-mx-8">
                <Menu setActive={() => {}}>
                    <div className="flex items-center gap-6">
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
                    <motion.a
                        href="/cv.pdf"
                        download
                        className="flex items-center gap-2 text-neutral-200 hover:text-white text-sm whitespace-nowrap transition-colors duration-150"
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
                        <span className="hidden sm:inline">Download CV</span>
                    </motion.a>
                </Menu>
                </div>
            </div>
            <main
                className="h-full w-full snap-mandatory overflow-scroll hide-scrollbar"
                ref={mainRef}
            >
            <ContactButton mainRef={mainRef} />
            <Dots
                className={`w-full flex flex-col justify-center`}
            >
                {/*Title page*/}
                <section id="hero" className="h-[90vh] w-full flex flex-col justify-center relative">
                    <div className="w-4/5 max-w-[1100px] mx-auto">
                        {/* Left: text */}
                        <div className="flex flex-col gap-6 md:w-3/5">
                            <div>
                                <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 leading-tight pb-2">
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
                                    {yearsInIndustry} yrs industry exp
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
                    <Timeline data={[
                        {
                            title: 'Jun 2023',
                            content: (
                                <div>
                                    <p className="text-white font-semibold text-base mb-1">Dyson · Embedded Software</p>
                                    <p className="text-gray-500 text-sm mb-3">Jun 2023 – Sep 2023</p>
                                    <p className="text-gray-400 text-sm mb-4">Stub description for the first Dyson rotation in embedded software engineering.</p>
                                    <ul className="space-y-1">
                                        {['Stub achievement one.', 'Stub achievement two.', 'Stub achievement three.'].map((a) => (
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
                            title: 'Jan 2024',
                            content: (
                                <div>
                                    <p className="text-white font-semibold text-base mb-1">Dyson · Cloud Engineering</p>
                                    <p className="text-gray-500 text-sm mb-3">Jan 2024 – Jun 2024</p>
                                    <p className="text-gray-400 text-sm mb-4">Stub description for the second Dyson rotation in cloud engineering.</p>
                                    <ul className="space-y-1">
                                        {['Stub achievement one.', 'Stub achievement two.', 'Stub achievement three.'].map((a) => (
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
                                    <p className="text-white font-semibold text-base mb-1">AccessPay · Junior Software Engineer</p>
                                    <p className="text-gray-500 text-sm mb-3">Sep 2024 – Present</p>
                                    <p className="text-gray-400 text-sm mb-4">Stub description for the junior software engineer role at AccessPay.</p>
                                    <ul className="space-y-1">
                                        {['Stub achievement one.', 'Stub achievement two.', 'Stub achievement three.'].map((a) => (
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
                            title: '2026',
                            content: (
                                <div className="opacity-40">
                                    <p className="text-white font-semibold text-base mb-1">??? · Mid-Level Software Engineer</p>
                                    <p className="text-gray-500 text-sm mb-3">2026 onwards</p>
                                    <p className="text-gray-400 text-sm mb-4">???</p>
                                    <ul className="space-y-1">
                                        {['???', '???', '???'].map((a, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
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
                <section id="projects" className="w-4/5 max-w-[1100px] snap-start mx-auto mb-24">
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
                        <a href="mailto:ben@benlewisjones.com" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                            <span className="text-lg flex-shrink-0 leading-none">✉️</span>
                            <span className="text-sm">ben@benlewisjones.com</span>
                        </a>
                    </div>
                    <motion.a
                        href="/cv.pdf"
                        download
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
