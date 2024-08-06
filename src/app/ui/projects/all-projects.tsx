import { BentoGrid, BentoGridItem } from '@/app/ui/projects/bento-grid'
import { Skills } from '@/app/ui/projects/skill-circle'
import { FaDiscord } from 'react-icons/fa'
import CirclesBackground from '@/app/ui/projects/circles-background'
import { WifiCircles } from '@/app/ui/projects/circle'
import { Wind } from '@/app/ui/projects/wind'
import { useEffect, useRef, useState } from 'react'

export const AllProjects = () => {
    const fypDivRef = useRef(null)

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
    const [fypHovered, setFypHovered] = useState(false)

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
        <BentoGrid className={`mt-5`} numOfGridCols={3} rowHeight={'32rem'}>
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
                            <h1 className="header1 text-7xl py-0">AI</h1>
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
                        <div className={`flex flex-row justify-evenly mb-5`}>
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
                    <main className="flex flex-col justify-evenly items-center h-full">
                        <img
                            className="w-[210px]"
                            src="images/dyson/dyson-vis-nav-title.png"
                            alt="Dyson 360 vis nav"
                        />
                        <img
                            className="w-2/5"
                            src="images/dyson/dyson-vis-nav.png"
                            alt="Dyson 360 vis nav"
                        />
                    </main>
                </BentoGridItem>
            </BentoGrid>
            <BentoGrid numOfGridCols={1} rowHeight={'10rem'}>
                <BentoGridItem
                    title={'1'}
                    description={'2'}
                    width={1}
                    descriptionImage={'asdf'}
                >
                    <main className={`group h-full relative flex items-center`}>
                        <WifiCircles />

                        <h2 className="header2-gradient ml-5">HTTP</h2>
                    </main>
                </BentoGridItem>
                <BentoGridItem
                    title={'1'}
                    description={'2'}
                    width={1}
                    descriptionImage={'asdf'}
                >
                    <main
                        className={`h-full relative flex items-center justify-center`}
                    >
                        <h2 className="header2-gradient">Coming Soon...</h2>
                    </main>
                </BentoGridItem>
            </BentoGrid>
            <BentoGrid className={`col-span-2`} rowHeight={'21rem'}>
                <BentoGridItem
                    title={'1'}
                    description={'2'}
                    width={1}
                    descriptionImage={'asdf'}
                    className={`group`}
                >
                    <main className={`h-full relative`}>
                        <div className={`h-full relative mt-10`}>
                            <img
                                className="absolute top-0 left-0 object-contain w-1/2 h-full z-30"
                                src={'images/dyson/purifier-1.png'}
                                alt={'Dyson Purifier'}
                            />
                            <Wind className="absolute top-0 -left-[20%] object-contain w-[140%] h-full z-20 opacity-35 group-hover:opacity-100 transition-opacity duration-1000" />
                            <img
                                className="absolute top-0 left-0 object-contain w-1/2 h-full z-10"
                                src={'images/dyson/purifier-0.png'}
                                alt={'Dyson Purifier'}
                            />
                            <img
                                className="absolute top-[-10%] right-0 object-contain w-[140px] h-full z-30 mr-[15%] opacity-75 group-hover:opacity-100 transition-opacity duration-1000"
                                src={'images/dyson/dyson-purifier-title.png'}
                                alt={'Dyson Purifier'}
                            />
                        </div>
                    </main>
                </BentoGridItem>
            </BentoGrid>
        </BentoGrid>
    )
}
