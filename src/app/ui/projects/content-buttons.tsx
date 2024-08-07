import { FaGithub, FaYoutube } from 'react-icons/fa'
import React from 'react'

const GenericButton = ({
    link,
    children,
    className,
    spinnerColor1,
    spinnerColor2,
}: {
    link?: string
    children: React.ReactNode
    className: string
    spinnerColor1: string
    spinnerColor2: string
}) => {
    return (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
        >
            <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                <span
                    className="absolute inset-[-1000%] transition-[background] duration-1000 ease-in-out lg:paused-spinner"
                    style={{
                        background: `conic-gradient(from 180deg at 50% 50%, ${spinnerColor1} 0%, ${spinnerColor2} 50%, ${spinnerColor1} 100%)`,
                    }}
                />
                <span
                    className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 custom-backdrop-blur-40px header4"
                    style={{
                        position: 'relative',
                        zIndex: 1,
                    }}
                    onMouseEnter={(e) => {
                        const prevElement = e.currentTarget
                            .previousElementSibling as HTMLElement
                        if (prevElement) {
                            prevElement.style.animation =
                                'spin 2s linear infinite'
                            prevElement.style.animationPlayState = 'running'
                        }
                    }}
                    onMouseLeave={(e) => {
                        const prevElement = e.currentTarget
                            .previousElementSibling as HTMLElement
                        if (prevElement) {
                            prevElement.style.animationPlayState = 'paused'
                        }
                    }}
                >
                    {children}
                </span>
            </button>
        </a>
    )
}

export const GithubButton = ({ link }: { link?: string }) => {
    return (
        <GenericButton
            link={link}
            className={link ? '' : 'hidden'}
            spinnerColor1="#E2CBFF"
            spinnerColor2="#393BB2"
        >
            <FaGithub className="mr-2 text-xl" /> GitHub
        </GenericButton>
    )
}

export const YoutubeButton = ({ link }: { link?: string }) => {
    return (
        <GenericButton
            link={link}
            className={link ? '' : 'hidden'}
            spinnerColor1="#f87171"
            spinnerColor2="#991b1b"
        >
            <FaYoutube className="mr-2 text-xl text-red-600" /> YouTube
        </GenericButton>
    )
}
