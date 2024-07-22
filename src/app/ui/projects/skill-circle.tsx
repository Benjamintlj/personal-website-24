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
    FaMicrosoft,
    FaDatabase,
} from 'react-icons/fa'
import {
    SiTypescript,
    SiNextdotjs,
    SiDotnet,
    SiPostman,
    SiAzure,
    SiLinux,
    SiFreertos,
    SiZephyrproject,
    SiJlink,
    SiI2c,
} from 'react-icons/si'

enum Skills {
    AWS,
    AndroidJava,
    C,
    Python,
    TypeScript,
    JavaScript,
    React,
    Next,
    DotNetCore,
    SQL,
    Docker,
    Postman,
    Git,
    Atlassian,
    Azure,
    Android,
    FreeRTOS,
    Linux,
    Zephyr,
    JLink,
    I2C,
}

const skillIcons = {
    [Skills.AWS]: <FaAws className="text-3xl text-white" />,
    [Skills.AndroidJava]: <FaJava className="text-3xl text-white" />,
    [Skills.C]: <FaJava className="text-3xl text-white" />, // You might want to replace this with an appropriate icon
    [Skills.Python]: <FaPython className="text-3xl text-white" />,
    [Skills.TypeScript]: <SiTypescript className="text-3xl text-white" />,
    [Skills.JavaScript]: <FaJs className="text-3xl text-white" />,
    [Skills.React]: <FaReact className="text-3xl text-white" />,
    [Skills.Next]: <SiNextdotjs className="text-3xl text-white" />,
    [Skills.DotNetCore]: <SiDotnet className="text-3xl text-white" />,
    [Skills.SQL]: <FaDatabase className="text-3xl text-white" />, // You might want to import and use an appropriate icon for SQL
    [Skills.Docker]: <FaDocker className="text-3xl text-white" />,
    [Skills.Postman]: <SiPostman className="text-3xl text-white" />,
    [Skills.Git]: <FaGit className="text-3xl text-white" />,
    [Skills.Atlassian]: <FaAtlassian className="text-3xl text-white" />,
    [Skills.Azure]: <FaMicrosoft className="text-3xl text-white" />,
    [Skills.Android]: <FaAndroid className="text-3xl text-white" />,
    [Skills.FreeRTOS]: <SiFreertos className="text-3xl text-white" />,
    [Skills.Linux]: <SiLinux className="text-3xl text-white" />,
    [Skills.Zephyr]: <SiZephyrproject className="text-3xl text-white" />,
    [Skills.JLink]: <SiJlink className="text-3xl text-white" />,
    [Skills.I2C]: <SiI2c className="text-3xl text-white" />,
}

export const SkillCircle = ({
    children,
    skills,
}: {
    children?: React.ReactNode
    skills: Skills[]
}) => {
    return (
        <>
            {skills?.map((skill) => (
                <div
                    className="h-16 w-16 rounded-full flex items-center justify-center bg-[rgba(248,248,248,0.01)]
    shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)] h-8 w-8 circle-2"
                >
                    skillIcons[skill]
                </div>
            ))}
        </>
    )
}
