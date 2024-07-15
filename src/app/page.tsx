'use client'

import { useState, useEffect, lazy, useRef } from 'react'
import Dots from '@/app/ui/backgrounds/dots'
import Memoji from '@/app/ui/title-section/memoji'
import { VanishingWords } from '@/app/ui/title-section/vanishing-words'
import ScrollPrompt from '@/app/ui/title-section/scroll-prompt'

export default function Home() {
    const mainRef = useRef(null)

    const descriptiveWords = [
        'Software Engineer',
        'Swimmer',
        'Software Architect',
    ]

    useEffect(() => {
        document.documentElement.classList.add('dark')
    }, [])

    return (
        <main
            className="h-screen w-screen snap-mandatory overflow-scroll hide-scrollbar"
            ref={mainRef}
        >
            <Dots>
                <section className="h-screen w-screen flex flex-col items-center mt-[10vh]">
                    <h1 className="header1">Ben Lewis-Jones</h1>
                    <Memoji className="w-52 sm:w-64 md:w-72 lg:w-96" />
                    <div className="secondary text-2xl sm:text-4xl">
                        Aspiring
                        <VanishingWords words={descriptiveWords} />
                    </div>
                    <ScrollPrompt
                        className={`mt-auto mb-52`}
                        textSize={`text-base`}
                        displayDelayMs={2500}
                        mainRef={mainRef}
                    />
                </section>
                <section className="h-screen w-screen snap-start">
                    <p className="header1">hello world</p>
                </section>
            </Dots>
        </main>
    )
}
