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

export default function Home() {
    const fypDivRef = useRef(null)
    const mainRef = useRef(null)

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
    const [fypHovered, setFypHovered] = useState(false)

    const descriptiveWords = [
        'Software Engineer',
        'Swimmer',
        'Software Architect',
    ]
    const relativeClause = 'Aspiring'

    useEffect(() => {
        document.documentElement.classList.add('dark')
    }, [])

    useEffect(() => {
        const updateDimensions = () => {
            if (fypDivRef.current) {
                const { offsetWidth, offsetHeight } = fypDivRef.current
                setDimensions({ width: offsetWidth, height: offsetHeight })
            }
        }

        const observer = new ResizeObserver(updateDimensions)
        if (fypDivRef.current) {
            observer.observe(fypDivRef.current)
        }

        return () => {
            if (fypDivRef.current) {
                observer.unobserve(fypDivRef.current)
            }
        }
    }, [fypDivRef])

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

                    <BentoGrid
                        className={`mt-5 mr-4 ml-4`}
                        numOfGridCols={3}
                        rowHeight={'32rem'}
                    >
                        <BentoGridItem
                            title={'Final Year Project'}
                            description={'hello'}
                            width={1}
                            descriptionImage={'/images/lakes.png'}
                            skills={[
                                Skills.AWS,
                                Skills.DynamoDB,
                                Skills.Lambda,
                                Skills.S3,
                                Skills.ECS,
                                Skills.EC2,
                                Skills.SQS,
                                Skills.SES,
                                Skills.CDK,
                                Skills.Route53,
                            ]}
                            gitHub={'https://www.google.com'}
                            youtube={'https://www.youtube.com'}
                        >
                            <main
                                className={`h-full w-full flex flex-col justify-end relative overflow-hidden`}
                                onMouseEnter={() => setFypHovered(true)}
                                onMouseLeave={() => setFypHovered(false)}
                            >
                                <div
                                    ref={fypDivRef}
                                    className="absolute flex justify-between transform rotate-[315deg]"
                                    style={{
                                        width: '80%',
                                        top: `calc(50% - ${dimensions.height / 2}px)`,
                                        left: `calc(50% - ${dimensions.width / 0.9}px)`,
                                    }}
                                >
                                    <img
                                        src="/images/fyp-compete.png"
                                        className={`transform transition-transform duration-300 rotate-180 mr-5 ${fypHovered ? 'translate-y-[5%]' : ''}`}
                                        alt="FYP Compete"
                                    />
                                    <img
                                        src="/images/fyp-homepage.png"
                                        className={`transform transition-transform duration-300 ${fypHovered ? 'translate-y-[45%]' : 'translate-y-[50%]'}`}
                                        alt="FYP Homepage"
                                    />
                                </div>
                                <h2 className="header2-gradient text-center mt-auto mb-5">
                                    Final Year Project
                                </h2>
                            </main>
                        </BentoGridItem>
                        <BentoGrid numOfGridCols={1} rowHeight={'10rem'}>
                            <BentoGrid numOfGridCols={2} rowHeight={'10rem'}>
                                <BentoGridItem
                                    title={'1'}
                                    description={'2'}
                                    width={1}
                                    descriptionImage={'asdf'}
                                >
                                    <main className="flex flex-col justify-center items-center h-full mb-4">
                                        <h1 className="header1 text-7xl py-0">
                                            AI
                                        </h1>
                                        <p className="secondary text-center">
                                            Chat Bot & CNN
                                        </p>
                                    </main>
                                </BentoGridItem>
                                <BentoGridItem
                                    title={'1'}
                                    description={'2'}
                                    width={1}
                                    descriptionImage={'asdf'}
                                >
                                    <main
                                        className={`flex flex-col justify-center items-center h-full group`}
                                    >
                                        <FaDiscord
                                            className={`text-8xl group-hover:text-blue-500 text-blue-400 transition transform duration-500 group-hover:translate-y-[5%]`}
                                        />
                                    </main>
                                </BentoGridItem>
                            </BentoGrid>
                            <BentoGrid numOfGridCols={1} rowHeight={'21rem'}>
                                <BentoGridItem
                                    title={'1'}
                                    description={'2'}
                                    width={1}
                                    descriptionImage={'asdf'}
                                    style={{
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <main className="h-full w-full flex flex-col justify-end">
                                        <CirclesBackground
                                            circleSize={70}
                                            waveSize={10}
                                            blur={2}
                                            height={250}
                                            waveWidth={15}
                                        />
                                        <h2 className="header2-gradient text-center mt-auto mb-5">
                                            Mobile Dev
                                        </h2>
                                    </main>
                                </BentoGridItem>
                            </BentoGrid>
                        </BentoGrid>
                        <BentoGrid numOfGridCols={1} rowHeight={'15.5rem'}>
                            <BentoGridItem
                                title={'1'}
                                description={'2'}
                                width={1}
                                descriptionImage={'asdf'}
                            >
                                <main
                                    className={`h-full overflow-hidden relative flex flex-col justify-evenly`}
                                >
                                    <h2 className="header2-gradient text-3xl text-center">
                                        Cloud & Distributed Systems
                                    </h2>
                                    <div
                                        className={`flex flex-row justify-evenly mb-5`}
                                    >
                                        <img
                                            className={`rounded-xl w-[25%] transition-transform hover:translate-y-[-5%] ease-in-out`}
                                            src={`/images/aws/ecs.png`}
                                            alt={'ECS icon'}
                                        />
                                        <img
                                            className={`rounded-xl w-[25%] transition-transform hover:translate-y-[-5%] ease-in-out`}
                                            src={`/images/aws/lambda.png`}
                                            alt={'ECS icon'}
                                        />
                                        <img
                                            className={`rounded-xl w-[25%] transition-transform hover:translate-y-[-5%] ease-in-out`}
                                            src={`/images/aws/dynamodb.png`}
                                            alt={'ECS icon'}
                                        />
                                    </div>
                                </main>
                            </BentoGridItem>
                            <BentoGridItem
                                title={'1'}
                                description={'2'}
                                width={1}
                                descriptionImage={'asdf'}
                            >
                                <main className={``}></main>
                            </BentoGridItem>
                        </BentoGrid>
                        <BentoGrid numOfGridCols={1} rowHeight={'10rem'}>
                            <BentoGridItem
                                title={'1'}
                                description={'2'}
                                width={1}
                                descriptionImage={'asdf'}
                            >
                                <main
                                    className={`group h-full relative flex items-center`}
                                >
                                    <WifiCircles />

                                    <h2 className="header2-gradient ml-5">
                                        HTTP
                                    </h2>
                                </main>
                            </BentoGridItem>
                            <BentoGridItem
                                title={'1'}
                                description={'2'}
                                width={1}
                                descriptionImage={'asdf'}
                            >
                                <main></main>
                            </BentoGridItem>
                        </BentoGrid>
                        <BentoGrid className={`col-span-2`} rowHeight={'21rem'}>
                            <BentoGridItem
                                title={'1'}
                                description={'2'}
                                width={1}
                                descriptionImage={'asdf'}
                            >
                                <main></main>
                            </BentoGridItem>
                        </BentoGrid>
                    </BentoGrid>
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
