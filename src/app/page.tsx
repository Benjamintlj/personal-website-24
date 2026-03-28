'use client'

import React, { useState, useEffect, lazy, useRef, Suspense } from 'react'
import Dots from '@/app/ui/backgrounds/dots'
import Memoji from '@/app/ui/title-section/memoji'
import { VanishingWords } from '@/app/ui/title-section/vanishing-words'
import ScrollPrompt from '@/app/ui/title-section/scroll-prompt'
import { Break } from '@/app/ui/general/break'
import ContactButton from '@/app/ui/contact/contact-button'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { motion } from 'framer-motion'
const AllProjects = React.lazy(() => import('@/app/ui/projects/all-projects'))
import LoadingSkeleton from '@/app/ui/loading/loading-skeleton'

export default function Home() {
    const mainRef = useRef(null)

    const descriptiveWords = ['Senior Engineer', 'Athlete', 'Founder']
    const relativeClause = 'Aspiring'

    const industryStart = new Date('2023-09-01')
    const yearsInIndustry = ((Date.now() - industryStart.getTime()) / (365.25 * 24 * 60 * 60 * 1000)).toFixed(1)

    useEffect(() => {
        document.documentElement.classList.add('dark')
    }, [])

    return (
        <main
            className="h-screen w-screen snap-mandatory overflow-scroll hide-scrollbar bg-black"
            ref={mainRef}
        >
            <ContactButton mainRef={mainRef} />
            <Dots
                className={`desktop:min-w-[1500px] desktop:max-w-[2000px] w-full flex flex-col justify-center`}
            >
                {/*Title page*/}
                <section className="h-screen w-full flex flex-col items-center mt-[10vh]">
                    <h1 className="header1">Ben Lewis-Jones</h1>
                    <Memoji className="w-52 sm:w-64 md:w-72 lg:w-96" />
                    <VanishingWords
                        className="secondary text-2xl sm:text-4xl"
                        relativeClause={relativeClause}
                        words={descriptiveWords}
                    />
                    <ScrollPrompt
                        className={`mt-auto mb-auto`}
                        textSize={`text-base`}
                        displayDelayMs={2500}
                        mainRef={mainRef}
                    />
                </section>

                {/*Work Experience*/}
                <section className="w-4/5 desktop:w-3/5 snap-start mx-auto">
                    <h2 className="header2 text-3xl mb-4">Work Experience</h2>
                    <Break />
                    <p className="text-gray-400 text-base mt-6 mb-12">
                        Over the past <span className="text-white font-semibold">{yearsInIndustry} years</span>, I have had the opportunity to work with some of the most <span className="text-white font-semibold">amazing people</span>, on some <span className="text-white font-semibold">amazing projects</span>, affecting millions of people and at the time of writing <span className="text-white font-semibold">1 in 20 payments in the UK</span>.
                    </p>
                    <ol className="relative mt-6 border-s border-gray-700 ml-4 mb-24">
                        <li className="mb-10 ms-6">
                            <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-900 rounded-full -start-3 ring-8 ring-black">
                                <svg className="w-2.5 h-2.5 text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                </svg>
                            </span>
                            <h3 className="flex items-center mb-1 text-lg font-semibold text-white">
                                Dyson · Embedded Software
                            </h3>
                            <time className="block mb-2 text-sm font-normal leading-none text-gray-500">Jun 2023 – Sep 2023</time>
                            <p className="mt-2 mb-3 text-sm text-gray-400">Stub description for the first Dyson rotation in embedded software engineering.</p>
                            <ul className="mt-2 space-y-1">
                                {['Stub achievement one.', 'Stub achievement two.', 'Stub achievement three.'].map((a) => (
                                    <li key={a} className="flex items-start gap-2 text-sm text-gray-400">
                                        <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                        {a}
                                    </li>
                                ))}
                            </ul>
                        </li>
                        <li className="mb-10 ms-6">
                            <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-900 rounded-full -start-3 ring-8 ring-black">
                                <svg className="w-2.5 h-2.5 text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                </svg>
                            </span>
                            <h3 className="flex items-center mb-1 text-lg font-semibold text-white">
                                Dyson · Cloud Engineering
                            </h3>
                            <time className="block mb-2 text-sm font-normal leading-none text-gray-500">Jan 2024 – Jun 2024</time>
                            <p className="mt-2 mb-3 text-sm text-gray-400">Stub description for the second Dyson rotation in cloud engineering.</p>
                            <ul className="mt-2 space-y-1">
                                {['Stub achievement one.', 'Stub achievement two.', 'Stub achievement three.'].map((a) => (
                                    <li key={a} className="flex items-start gap-2 text-sm text-gray-400">
                                        <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                        {a}
                                    </li>
                                ))}
                            </ul>
                        </li>
                        <li className="mb-10 ms-6">
                            <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-900 rounded-full -start-3 ring-8 ring-black">
                                <svg className="w-2.5 h-2.5 text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                </svg>
                            </span>
                            <h3 className="flex items-center mb-1 text-lg font-semibold text-white">
                                AccessPay · Junior Software Engineer
                            </h3>
                            <time className="block mb-2 text-sm font-normal leading-none text-gray-500">Sep 2024 – Present</time>
                            <p className="mt-2 mb-3 text-sm text-gray-400">Stub description for the junior software engineer role at AccessPay.</p>
                            <ul className="mt-2 space-y-1">
                                {['Stub achievement one.', 'Stub achievement two.', 'Stub achievement three.'].map((a) => (
                                    <li key={a} className="flex items-start gap-2 text-sm text-gray-400">
                                        <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                        {a}
                                    </li>
                                ))}
                            </ul>
                        </li>
                        <li className="mb-10 ms-6">
                            <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-900 rounded-full -start-3 ring-8 ring-black">
                                <svg className="w-2.5 h-2.5 text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                </svg>
                            </span>
                            <h3 className="flex items-center mb-1 text-lg font-semibold text-white opacity-50">
                                ??? · Mid-Level Software Engineer
                            </h3>
                            <time className="block mb-2 text-sm font-normal leading-none text-gray-500 opacity-50">2026 onwards</time>
                            <p className="mt-2 mb-3 text-sm text-gray-400 opacity-50">???</p>
                            <ul className="mt-2 space-y-1 opacity-50">
                                {['???', '???', '???'].map((a, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                                        <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                        {a}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    </ol>
                </section>

                {/*Projects*/}
                <section className="w-4/5 desktop:w-3/5 snap-start mx-auto">
                    <h2 className="header2 text-3xl mb-4">Projects</h2>

                    <Break />
                    <Suspense fallback={<div>Loading All Projects...</div>}>
                        <AllProjects />
                    </Suspense>
                </section>

                {/*Contact*/}
                <section className="w-4/5 desktop:w-3/5 snap-start mx-auto">
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

                <section className="w-4/5 desktop:w-3/5 snap-start mx-auto h-24"></section>
            </Dots>
        </main>
    )
}
