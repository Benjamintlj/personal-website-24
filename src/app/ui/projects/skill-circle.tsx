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
} from 'react-icons/si'

import { GiKite } from 'react-icons/gi'

import { motion } from 'framer-motion'

export enum Categories {
    CloudServices = 'bg-red-500',
    ProgrammingLanguages = 'bg-blue-500',
    FrontEndFrameworks = 'bg-purple-500',
    DevOpsTools = 'bg-green-800',
    EmbeddedSystems = 'bg-pink-700',
    Ai = 'bg-rose-500',
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
}

export const skillCategoryMap: { [key in Skills]: Categories } = {
    [Skills.AWS]: Categories.CloudServices,
    [Skills.DynamoDB]: Categories.CloudServices,
    [Skills.Lambda]: Categories.CloudServices,
    [Skills.S3]: Categories.CloudServices,
    [Skills.ECS]: Categories.CloudServices,
    [Skills.EC2]: Categories.CloudServices,
    [Skills.SQS]: Categories.CloudServices,
    [Skills.SES]: Categories.CloudServices,
    [Skills.CDK]: Categories.CloudServices,
    [Skills.Route53]: Categories.CloudServices,
    [Skills.Java]: Categories.ProgrammingLanguages,
    [Skills.C]: Categories.ProgrammingLanguages,
    [Skills.Python]: Categories.ProgrammingLanguages,
    [Skills.TypeScript]: Categories.ProgrammingLanguages,
    [Skills.JavaScript]: Categories.ProgrammingLanguages,
    [Skills.React]: Categories.FrontEndFrameworks,
    [Skills.Next]: Categories.FrontEndFrameworks,
    [Skills.DotNetCore]: Categories.ProgrammingLanguages,
    [Skills.SQL]: Categories.ProgrammingLanguages,
    [Skills.Docker]: Categories.DevOpsTools,
    [Skills.Postman]: Categories.DevOpsTools,
    [Skills.Git]: Categories.DevOpsTools,
    [Skills.Atlassian]: Categories.DevOpsTools,
    [Skills.Azure]: Categories.DevOpsTools,
    [Skills.Android]: Categories.FrontEndFrameworks,
    [Skills.FreeRTOS]: Categories.EmbeddedSystems,
    [Skills.Linux]: Categories.EmbeddedSystems,
    [Skills.Zephyr]: Categories.EmbeddedSystems,
    [Skills.JLink]: Categories.EmbeddedSystems,
    [Skills.I2C]: Categories.EmbeddedSystems,
    [Skills.Scikit]: Categories.Ai,
    [Skills.Nltk]: Categories.Ai,
    [Skills.Aiml]: Categories.Ai,
    [Skills.Numpy]: Categories.Ai,
    [Skills.Scipy]: Categories.Ai,
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
                        }}
                        animate={{
                            y: [window.innerHeight, -100, -200],
                            opacity: [1, 1, 0],
                            filter: ['blur(0px)', 'blur(0px)', 'blur(10px)'],
                        }}
                        transition={{
                            duration: duration,
                            times: [0, 0.9, 1],
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
