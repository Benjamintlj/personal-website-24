'use client'

import { useState, useEffect, lazy, useRef } from 'react'
import Dots from '@/app/ui/backgrounds/dots'
import Memoji from '@/app/ui/title-section/memoji'
import { VanishingWords } from '@/app/ui/title-section/vanishing-words'
import ScrollPrompt from '@/app/ui/title-section/scroll-prompt'
import { TitleCards } from '@/app/ui/title-section/title-cards'
import { BentoGrid, BentoGridItem } from '@/app/ui/projects/bento-grid'
import { Skills } from '@/app/ui/projects/skill-circle'
import { Break } from '@/app/ui/general/break'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FaDiscord } from 'react-icons/fa'
import { SiAiohttp } from 'react-icons/si'
import CirclesBackground from '@/app/ui/projects/circles-background'
import { GoCircle } from 'react-icons/go'
import { Circle, WifiCircles } from '@/app/ui/projects/circle'
import { Wind } from '@/app/ui/projects/wind'
import { AllProjects } from '@/app/ui/projects/all-projects'

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
            className="h-screen w-screen snap-mandatory overflow-scroll hide-scrollbar"
            ref={mainRef}
        >
            <Dots>
                {/*TODO: add max width*/}
                {/*TODO: handle wide screen with low height*/}
                <section className="h-screen w-3/5 snap-start mx-auto">
                    <h2 className="header2 mb-4">Projects</h2>

                    {/*TODO: fix line, since the bento grid goes out further*/}
                    <Break />
                    <AllProjects />
                </section>

                {/*Floating images*/}
                {/*<section>*/}
                {/*    <TitleCards*/}
                {/*        title={'Lake District'}*/}
                {/*        description={*/}
                {/*            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'*/}
                {/*        }*/}
                {/*        imageSrc={'/images/lakes.png'}*/}
                {/*        className={'absolute top-[10vw] left-[5vw]'}*/}
                {/*    />*/}
                {/*    <TitleCards*/}
                {/*        title={'Graduation'}*/}
                {/*        description={*/}
                {/*            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'*/}
                {/*        }*/}
                {/*        imageSrc={'/images/lakes.png'}*/}
                {/*        className={'absolute top-[30vw] left-[5vw]'}*/}
                {/*    />*/}
                {/*    <TitleCards*/}
                {/*        title={'Cotswold'}*/}
                {/*        description={*/}
                {/*            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'*/}
                {/*        }*/}
                {/*        imageSrc={'/images/lakes.png'}*/}
                {/*        className={'absolute top-[10vw] left-[70vw]'}*/}
                {/*    />*/}
                {/*    <TitleCards*/}
                {/*        title={'Peak District'}*/}
                {/*        description={*/}
                {/*            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'*/}
                {/*        }*/}
                {/*        imageSrc={'/images/lakes.png'}*/}
                {/*        className={'absolute top-[30vw] left-[70vw]'}*/}
                {/*    />*/}
                {/*</section>*/}

                {/*Title page*/}
                <section className="h-screen w-screen flex flex-col items-center mt-[10vh]">
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
            </Dots>
        </main>
    )
}
