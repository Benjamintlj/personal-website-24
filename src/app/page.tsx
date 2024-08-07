'use client'

import React, { useState, useEffect, lazy, useRef, Suspense } from 'react'
import Dots from '@/app/ui/backgrounds/dots'
import Memoji from '@/app/ui/title-section/memoji'
import { VanishingWords } from '@/app/ui/title-section/vanishing-words'
import ScrollPrompt from '@/app/ui/title-section/scroll-prompt'
import { Break } from '@/app/ui/general/break'
const AllProjects = React.lazy(() => import('@/app/ui/projects/all-projects'))
import LoadingSkeleton from '@/app/ui/loading/loading-skeleton'

export default function Home() {
    const mainRef = useRef(null)

    const descriptiveWords = [
        'Software Engineer',
        'Swimmer',
        'Software Architect',
    ]
    const relativeClause = 'Aspiring'

    useEffect(() => {
        document.documentElement.classList.add('dark')
    }, [])

    return (
        <main
            className="h-screen w-screen snap-mandatory overflow-scroll hide-scrollbar bg-black"
            ref={mainRef}
        >
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
                        className={`mt-auto mb-52`}
                        textSize={`text-base`}
                        displayDelayMs={2500}
                        mainRef={mainRef}
                    />
                </section>

                {/*Projects*/}
                <section className="w-4/5 desktop:w-3/5 snap-start mx-auto">
                    <h2 className="header2 mb-4">Projects</h2>

                    <Break />
                    <Suspense fallback={<div>Loading All Projects...</div>}>
                        <AllProjects />
                    </Suspense>
                </section>
            </Dots>
        </main>
    )
}
