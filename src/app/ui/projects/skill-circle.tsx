import {
    FaAws,
    FaAndroid,
    FaJava,
    FaPython,
    FaJs,
    FaReact,
    FaDocker,
    FaGit,
    FaAtlassian,
} from 'react-icons/fa'

import { PiFileSql } from 'react-icons/pi'

import {
    SiAmazonroute53,
    SiNumpy,
    SiScikitlearn,
    SiScipy,
} from 'react-icons/si'

import {
    SiTypescript,
    SiNextdotjs,
    SiDotnet,
    SiPostman,
    SiLinux,
    SiAzuredevops,
    SiAmazondynamodb,
    SiAwslambda,
    SiAmazons3,
    SiAmazonecs,
    SiAmazonec2,
    SiAmazonsqs,
    SiAmazonsimpleemailservice,
    SiPostgresql,
    SiRabbitmq,
    SiGooglecloud,
    SiWindows,
} from 'react-icons/si'

import { GiKite } from 'react-icons/gi'

import { motion } from 'framer-motion'

export enum Categories {
    Languages = 'bg-violet-700',
    Cloud = 'bg-purple-900',
    Databases = 'bg-fuchsia-700',
    Frontend = 'bg-pink-900',
    DevOps = 'bg-rose-700',
    Systems = 'bg-red-500',
}

export enum Skills {
    AWS = 'AWS',
    DynamoDB = 'DynamoDB',
    Lambda = 'Lambda',
    S3 = 'S3',
    ECS = 'ECS',
    EC2 = 'EC2',
    SQS = 'SQS',
    SES = 'SES',
    CDK = 'CDK',
    Route53 = 'Route53',
    Java = 'Java',
    C = 'C',
    Python = 'Python',
    TypeScript = 'TypeScript',
    JavaScript = 'JavaScript',
    React = 'React',
    Next = 'Next',
    DotNetCore = '.NET Core',
    SQL = 'SQL',
    Docker = 'Docker',
    Postman = 'Postman',
    Git = 'Git',
    Atlassian = 'Atlassian',
    Azure = 'Azure DevOps',
    Android = 'Android',
    FreeRTOS = 'FreeRTOS',
    Linux = 'Linux',
    Zephyr = 'Zephyr',
    JLink = 'JLink',
    I2C = 'I2C',
    Scikit = 'Scikit learn',
    Nltk = 'nltk',
    Aiml = 'aiml',
    Numpy = 'Numpy',
    Scipy = 'Scipy',
    Postgres = 'Postgres',
    RabbitMQ = 'RabbitMQ',
    GCP = 'GCP',
    WindowsServer = 'Windows Server',
}

export const skillCategoryMap: { [key in Skills]: Categories } = {
    // Cloud
    [Skills.AWS]: Categories.Cloud,
    [Skills.GCP]: Categories.Cloud,
    [Skills.DynamoDB]: Categories.Cloud,
    [Skills.Lambda]: Categories.Cloud,
    [Skills.S3]: Categories.Cloud,
    [Skills.ECS]: Categories.Cloud,
    [Skills.EC2]: Categories.Cloud,
    [Skills.SQS]: Categories.Cloud,
    [Skills.SES]: Categories.Cloud,
    [Skills.CDK]: Categories.Cloud,
    [Skills.Route53]: Categories.Cloud,
    // Languages (violet)
    [Skills.Java]: Categories.Languages,
    [Skills.C]: Categories.Languages,
    [Skills.Python]: Categories.Languages,
    [Skills.TypeScript]: Categories.Languages,
    [Skills.JavaScript]: Categories.Languages,
    [Skills.DotNetCore]: Categories.Languages,
    [Skills.Scikit]: Categories.Languages,
    [Skills.Nltk]: Categories.Languages,
    [Skills.Aiml]: Categories.Languages,
    [Skills.Numpy]: Categories.Languages,
    [Skills.Scipy]: Categories.Languages,
    // Databases (fuchsia)
    [Skills.SQL]: Categories.Databases,
    [Skills.Postgres]: Categories.Databases,
    // Frontend (pink)
    [Skills.React]: Categories.Frontend,
    [Skills.Next]: Categories.Frontend,
    [Skills.Android]: Categories.Frontend,
    // DevOps (rose)
    [Skills.Docker]: Categories.DevOps,
    [Skills.Git]: Categories.DevOps,
    [Skills.Atlassian]: Categories.DevOps,
    [Skills.Azure]: Categories.DevOps,
    [Skills.Postman]: Categories.DevOps,
    [Skills.RabbitMQ]: Categories.DevOps,
    // Systems (orange)
    [Skills.FreeRTOS]: Categories.Systems,
    [Skills.Zephyr]: Categories.Systems,
    [Skills.JLink]: Categories.Systems,
    [Skills.I2C]: Categories.Systems,
    [Skills.Linux]: Categories.Systems,
    [Skills.WindowsServer]: Categories.Systems,
}

const skillIcons = {
    [Skills.AWS]: <FaAws />,
    [Skills.DynamoDB]: <SiAmazondynamodb />,
    [Skills.Lambda]: <SiAwslambda />,
    [Skills.S3]: <SiAmazons3 />,
    [Skills.ECS]: <SiAmazonecs />,
    [Skills.EC2]: <SiAmazonec2 />,
    [Skills.SQS]: <SiAmazonsqs />,
    [Skills.SES]: <SiAmazonsimpleemailservice />,
    [Skills.Route53]: <SiAmazonroute53 />,
    [Skills.Java]: <FaJava />,
    [Skills.C]: <p className="text-2xl">C</p>,
    [Skills.Python]: <FaPython />,
    [Skills.TypeScript]: <SiTypescript className="text-2xl" />,
    [Skills.JavaScript]: <FaJs />,
    [Skills.React]: <FaReact />,
    [Skills.Next]: <SiNextdotjs />,
    [Skills.DotNetCore]: <SiDotnet />,
    [Skills.SQL]: <PiFileSql />,
    [Skills.Docker]: <FaDocker />,
    [Skills.Postman]: <SiPostman />,
    [Skills.Git]: <FaGit className="text-2xl" />,
    [Skills.Atlassian]: <FaAtlassian className="text-2xl" />,
    [Skills.Azure]: <SiAzuredevops className="text-2xl" />,
    [Skills.Android]: <FaAndroid />,
    [Skills.FreeRTOS]: <p className="text-base">fRTOS</p>,
    [Skills.Linux]: <SiLinux />,
    [Skills.Zephyr]: <GiKite />,
    [Skills.JLink]: <p className="text-base">jLink</p>,
    [Skills.I2C]: <p className="text-base">I²C</p>,
    [Skills.Scikit]: <SiScikitlearn />,
    [Skills.Numpy]: <SiNumpy />,
    [Skills.Scipy]: <SiScipy />,
    [Skills.Postgres]: <SiPostgresql />,
    [Skills.RabbitMQ]: <SiRabbitmq />,
    [Skills.GCP]: <SiGooglecloud />,
    [Skills.WindowsServer]: <SiWindows />,
}

export const SkillCircle = ({
    skills,
    className,
}: {
    skills?: Skills[]
    className: string
}) => {
    return (
        <div className={className}>
            {skills?.map((skill) => {
                const duration = Math.random() * 7 + 12

                const randomYOffsetEnd =
                    Math.random() * window.innerHeight - Math.random() * 500

                const getRandomX = window.innerWidth * Math.random()

                return skillIcons[skill as keyof typeof skillIcons] ? (
                    <motion.div
                        key={skill}
                        className="h-16 w-16 rounded-full flex items-center justify-center bg-[rgba(248,248,248,0.01)] shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)] circle-2 text-3xl text-white"
                        initial={{
                            x: getRandomX,
                            y: window.innerHeight,
                            opacity: 0,
                            filter: 'blur(0px)',
                        }}
                        animate={{
                            y: [window.innerHeight + 50, window.innerHeight, -100, -200],
                            opacity: [0, 1, 1, 0],
                            filter: ['blur(0px)', 'blur(0px)', 'blur(0px)', 'blur(10px)'],
                        }}
                        transition={{
                            duration: duration,
                            times: [0, 0.05, 0.9, 1],
                            ease: 'linear',
                            repeat: Infinity,
                            delay: Math.random() * 5,
                        }}
                        exit={{
                            filter: 'blur(10px)',
                            opacity: 0,
                            y: -window.innerHeight - 100,
                            transition: {
                                duration: 1,
                            },
                        }}
                    >
                        {skillIcons[skill as keyof typeof skillIcons]}
                    </motion.div>
                ) : null
            })}
        </div>
    )
}
