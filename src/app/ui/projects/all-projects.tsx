import { BentoGrid, BentoGridItem } from '@/app/ui/projects/bento-grid'
import { Skills } from '@/app/ui/projects/skill-circle'
import { FaDiscord } from 'react-icons/fa'
import CirclesBackground from '@/app/ui/projects/circles-background'
import { WifiCircles } from '@/app/ui/projects/circle'
import { Wind } from '@/app/ui/projects/wind'
import { useEffect, useRef, useState } from 'react'

const AllProjects = () => {
    const fypDivRef = useRef(null)

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
    const [fypHovered, setFypHovered] = useState(false)
    const [isDesktop, setIsDesktop] = useState(false)

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

    useEffect(() => {
        const checkScreenSize = () => {
            setIsDesktop(window.innerWidth >= 900)
        }

        checkScreenSize()

        window.addEventListener('resize', checkScreenSize)

        return () => {
            window.removeEventListener('resize', checkScreenSize)
        }
    }, [])

    const items = [
        {
            // 0
            title: 'Final Year Project',
            description:
                'With the rise of short-form content platforms such as TikTok, student attention spans have decreased. This has reached the point where the average person has an attention span shorter than a goldfish. \n' +
                'This e-learning app, offers a short-form gamified experience for learners, to improve their attention and content retention.',
            descriptionImage: '/images/stock/students-on-phones.jpg',
            skills: [
                Skills.AWS,
                Skills.DynamoDB,
                Skills.Lambda,
                Skills.S3,
                Skills.ECS,
                Skills.CDK,
                Skills.Route53,
                Skills.Java,
                Skills.Python,
                Skills.TypeScript,
                Skills.Docker,
                Skills.Postman,
                Skills.Git,
                Skills.Android,
            ],
            github: 'https://www.google.com',
            youtube: 'https://www.youtube.com',
            content: (
                <main
                    className={`h-full w-full flex flex-col xsm:flex-row desktop:flex-row justify-end xsm:justify-evenly desktop:justify-center relative overflow-hidden`}
                    onMouseEnter={() => setFypHovered(true)}
                    onMouseLeave={() => setFypHovered(false)}
                >
                    <h2 className="header2-gradient text-3xl text-center xsm:text-left desktop:text-center mt-auto xsm:mt-10 desktop:mt-auto mb-5">
                        Final Year Project
                    </h2>
                    <div
                        ref={fypDivRef}
                        className="absolute flex justify-between transform rotate-[315deg] xsm:hidden desktop:flex"
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
                    <img
                        src="/images/fyp-compete.png"
                        className={`absolute hidden xsm:block desktop:hidden -mt-16 500px:-mt-32 700px:-mt-40`}
                        style={{ width: '110vw', maxWidth: 'none' }}
                        alt="FYP Compete"
                    />
                </main>
            ),
        },
        {
            // 1
            title: 'AI',
            description:
                'This project involved creating a chatbot that handles first-order logic and answers or proves simple questions based on its knowledge base. The tone of the chatbot’s responses depends on the user’s emotional tone and adjusts accordingly. The chatbot can also accept image input, and using a CNN model with hyperparameter tuning, it identifies the image from a selection of fruits.',
            skills: [
                Skills.Python,
                Skills.Scikit,
                Skills.Nltk,
                Skills.Aiml,
                Skills.Numpy,
                Skills.Scipy,
            ],
            github: 'https://www.google.com',
            youtube: 'https://www.youtube.com',
            visibleOnMobile: false,
            content: (
                <main className="flex flex-col justify-center items-center h-full mb-4">
                    <h1 className="header1 text-7xl py-0">AI</h1>
                    <p className="secondary text-center">Chat Bot & CNN</p>
                </main>
            ),
        },
        {
            // 2
            title: 'Discord',
            description:
                'This project is currently in development (besides this website), and is acting as a music player. Future developments will include voice commands from within calls, allowing users to ask for helpful functions such as clipping.',
            skills: [Skills.AWS, Skills.ECS, Skills.TypeScript, Skills.Docker],
            github: 'https://www.google.com',
            content: (
                <main
                    className={`flex flex-row desktop:flex-col desktop:justify-center justify-evenly items-center h-full group`}
                >
                    <FaDiscord
                        className={`text-8xl group-hover:text-blue-500 text-blue-400 transition transform duration-500 group-hover:translate-y-[5%]`}
                    />
                    <h2 className="header2-gradient text-3xl text-center desktop:hidden">
                        Discord
                    </h2>
                </main>
            ),
        },
        {
            // 3
            title: 'Gym NFC Scanner',
            description:
                'This Android application allows users to scan machines within gyms and stream videos. It also enables gym owners to create and manage content that can be viewed after scanning an NFC tag.',
            descriptionImage: '/images/stock/mobile-app-ss.png',
            skills: [
                Skills.AWS,
                Skills.DynamoDB,
                Skills.Lambda,
                Skills.S3,
                Skills.CDK,
                Skills.TypeScript,
                Skills.Python,
                Skills.Java,
                Skills.Android,
            ],
            github: 'https://www.google.com',
            youtube: 'https://www.youtube.com',
            visibleOnMobile: false,
            content: (
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
            ),
        },
        {
            // 4
            title: 'Cloud & Distributed Systems',
            description:
                'Within this project, I created a trip management app. This project was heavly focused on the infrastructure and the backend, with a fully fleshed-out AWS architecture, it was designed to be serverless and highly scalable.',
            skills: [
                Skills.AWS,
                Skills.DynamoDB,
                Skills.Lambda,
                Skills.S3,
                Skills.ECS,
                Skills.SQS,
                Skills.CDK,
                Skills.Python,
                Skills.TypeScript,
                Skills.Java,
                Skills.Postman,
            ],
            github: 'https://www.google.com',
            youtube: 'https://www.youtube.com',
            content: (
                <main
                    className={`h-full overflow-hidden relative flex flex-col justify-evenly`}
                >
                    <h2 className="header2-gradient text-3xl text-center">
                        Cloud & Distributed Systems
                    </h2>
                    <div
                        className={`flex flex-row justify-evenly mb-5 max-w-[500px] mx-auto`}
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
            ),
        },
        {
            // 5
            title: '360 Vis Nav',
            description:
                'During my second rotation at Dyson, I joined the Cloud Robot team, where I contributed to the development of several backend features for the (at the time) unreleased Dyson 360 Vis Nav. I took responsibility for several key components, gaining valuable experience along the way.',
            descriptionImage: '/images/stock/dyson-vis-nav.jpeg',
            skills: [
                Skills.AWS,
                Skills.DynamoDB,
                Skills.Lambda,
                Skills.S3,
                Skills.ECS,
                Skills.EC2,
                Skills.SQS,
                Skills.SES,
                Skills.Route53,
                Skills.DotNetCore,
                Skills.TypeScript,
                Skills.Python,
                Skills.SQL,
                Skills.Git,
                Skills.Azure,
                Skills.Atlassian,
                Skills.Postman,
                Skills.Docker,
            ],
            youtube: 'https://www.youtube.com',
            content: (
                <main className="flex flex-row desktop:flex-col justify-evenly items-center h-full">
                    <img
                        className="w-[210px]"
                        src="images/dyson/dyson-vis-nav-title.png"
                        alt="Dyson 360 vis nav"
                    />
                    <img
                        className="desktop:w-2/5 w-1/5"
                        src="images/dyson/dyson-vis-nav.png"
                        alt="Dyson 360 vis nav"
                    />
                </main>
            ),
        },
        {
            // 6
            title: 'HTTP',
            description:
                "After a challenging final year at university, I decided to unwind by brushing up on the C programming language. With a strong interest in networking and cloud computing, I took a friend's suggestion and decided to recreate HTTP 1.1, specifically focusing on the GET request method.",
            skills: [Skills.C],
            github: 'https://www.google.com',
            visibleOnMobile: false,
            content: (
                <main className={`group h-full relative flex items-center`}>
                    <WifiCircles />

                    <h2 className="header2-gradient ml-5">HTTP</h2>
                </main>
            ),
        },
        {
            // 7
            title: 'Projects Coming Soon',
            description:
                "That wraps up the projects I've completed over the past year. So, what's next? I have a few ideas for personal projects, and I hope to see you on the battlefield—perhaps we'll be working together soon!",
            descriptionImage: '/images/lakes.png',
            skills: [
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
            ],
            github: 'https://www.google.com',
            youtube: 'https://www.youtube.com',
            visibleOnMobile: false,
            content: (
                <main
                    className={`h-full relative flex items-center justify-center`}
                >
                    <h2 className="header2-gradient">Coming Soon...</h2>
                </main>
            ),
        },
        {
            // 8
            title: 'Purifier',
            description:
                'During my first rotation at Dyson, I joined one of the embedded teams, where I worked on the next generation of purifiers, now the current generation. I was expected to learn quickly and was given considerable responsibility, ultimately implementing several key features.',
            descriptionImage: '/images/stock/hullavington.jpg',
            skills: [
                Skills.C,
                Skills.Python,
                Skills.Git,
                Skills.Atlassian,
                Skills.FreeRTOS,
                Skills.Zephyr,
                Skills.Linux,
                Skills.JLink,
                Skills.I2C,
            ],
            github: 'https://www.google.com',
            youtube: 'https://www.youtube.com',
            className: 'group',
            content: (
                <main className={`h-full relative`}>
                    <div className={`h-full relative mt-10`}>
                        <img
                            className="absolute top-0 left-0 object-contain w-1/2 h-full z-30"
                            src={'images/dyson/purifier-1.png'}
                            alt={'Dyson Purifier'}
                        />
                        <Wind className="hidden desktop:block absolute top-0 -left-[20%] object-contain w-[140%] h-full z-20 opacity-35 group-hover:opacity-100 transition-opacity duration-1000" />
                        <img
                            className="absolute top-0 left-0 object-contain w-1/2 h-full z-10"
                            src={'images/dyson/purifier-0.png'}
                            alt={'Dyson Purifier'}
                        />
                        <img
                            className="absolute top-[-10%] right-0 object-contain w-[120px] desktop:w-[130px] h-full z-30 mr-[15%] opacity-100 transition-opacity duration-1000"
                            src={'images/dyson/dyson-purifier-title.png'}
                            alt={'Dyson Purifier'}
                        />
                    </div>
                </main>
            ),
        },
    ]

    return (
        <main>
            {isDesktop ? (
                // desktop view
                <BentoGrid
                    className={`mt-5`}
                    numOfGridCols={3}
                    rowHeight={'32rem'}
                >
                    <BentoGridItem
                        title={items[0].title}
                        description={items[0].description}
                        descriptionImage={items[0].descriptionImage}
                        skills={items[0].skills}
                        gitHub={items[0].github}
                        youtube={items[0].youtube}
                    >
                        {items[0].content}
                    </BentoGridItem>
                    <BentoGrid numOfGridCols={1} rowHeight={'10rem'}>
                        <BentoGrid numOfGridCols={2} rowHeight={'10rem'}>
                            <BentoGridItem
                                title={items[1].title}
                                description={items[1].description}
                                descriptionImage={items[1].descriptionImage}
                                skills={items[1].skills}
                                gitHub={items[1].github}
                                youtube={items[1].youtube}
                            >
                                {items[1].content}
                            </BentoGridItem>
                            <BentoGridItem
                                title={items[2].title}
                                description={items[2].description}
                                descriptionImage={items[2].descriptionImage}
                                skills={items[2].skills}
                                gitHub={items[2].github}
                                youtube={items[2].youtube}
                            >
                                {items[2].content}
                            </BentoGridItem>
                        </BentoGrid>
                        <BentoGrid numOfGridCols={1} rowHeight={'21rem'}>
                            <BentoGridItem
                                title={items[3].title}
                                description={items[3].description}
                                descriptionImage={items[3].descriptionImage}
                                skills={items[3].skills}
                                gitHub={items[3].github}
                                youtube={items[3].youtube}
                            >
                                {items[3].content}
                            </BentoGridItem>
                        </BentoGrid>
                    </BentoGrid>
                    <BentoGrid numOfGridCols={1} rowHeight={'15.5rem'}>
                        <BentoGridItem
                            title={items[4].title}
                            description={items[4].description}
                            descriptionImage={items[4].descriptionImage}
                            skills={items[4].skills}
                            gitHub={items[4].github}
                            youtube={items[4].youtube}
                        >
                            {items[4].content}
                        </BentoGridItem>
                        <BentoGridItem
                            title={items[5].title}
                            description={items[5].description}
                            descriptionImage={items[5].descriptionImage}
                            skills={items[5].skills}
                            gitHub={items[5].github}
                            youtube={items[5].youtube}
                        >
                            {items[5].content}
                        </BentoGridItem>
                    </BentoGrid>
                    <BentoGrid numOfGridCols={1} rowHeight={'10rem'}>
                        <BentoGridItem
                            title={items[6].title}
                            description={items[6].description}
                            descriptionImage={items[6].descriptionImage}
                            skills={items[6].skills}
                            gitHub={items[6].github}
                            youtube={items[6].youtube}
                        >
                            {items[6].content}
                        </BentoGridItem>
                        <BentoGridItem
                            title={items[7].title}
                            description={items[7].description}
                            descriptionImage={items[7].descriptionImage}
                            skills={items[7].skills}
                            gitHub={items[7].github}
                            youtube={items[7].youtube}
                        >
                            {items[7].content}
                        </BentoGridItem>
                    </BentoGrid>
                    <BentoGrid className={`col-span-2`} rowHeight={'21rem'}>
                        <BentoGridItem
                            title={items[8].title}
                            description={items[8].description}
                            descriptionImage={items[8].descriptionImage}
                            skills={items[8].skills}
                            className={items[8].className}
                            gitHub={items[8].github}
                            youtube={items[8].youtube}
                        >
                            {items[8].content}
                        </BentoGridItem>
                    </BentoGrid>
                </BentoGrid>
            ) : (
                // mobile view
                <BentoGrid className="mt-5" rowHeight="16rem">
                    {items
                        .filter((item) => item.visibleOnMobile !== false)
                        .map((item, index) => (
                            <BentoGridItem
                                key={index}
                                title={item.title}
                                description={item.description}
                                descriptionImage={item.descriptionImage}
                                skills={item.skills}
                                gitHub={item.github}
                                youtube={item.youtube}
                            >
                                {item.content}
                            </BentoGridItem>
                        ))}
                </BentoGrid>
            )}
        </main>
    )
}

export default AllProjects
