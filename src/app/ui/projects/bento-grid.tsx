import { cn } from '@/lib/utils'
import React from 'react'
import { useState, useRef, useId } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useOutsideClick } from '@/hooks/use-outside-click'
import { GithubButton, YoutubeButton } from '@/app/ui/projects/content-buttons'
import { clsx } from 'clsx'
import {
    Categories,
    skillCategoryMap,
    SkillCircle,
    Skills,
} from '@/app/ui/projects/skill-circle'
import { Break } from '@/app/ui/general/break'
import { CloseButton } from '@/app/ui/projects/close-button'

const gridColsClass = (numOfGridCols: number) => {
    switch (numOfGridCols) {
        case 1:
            return 'grid-cols-1'
        case 2:
            return 'grid-cols-2'
        case 3:
            return 'grid-cols-3'
        default:
            return 'grid-cols-1'
    }
}

export const BentoGrid = ({
    className,
    children,
    numOfGridCols = 1,
    rowHeight = 'auto',
}: {
    className?: string
    children?: React.ReactNode
    numOfGridCols?: number
    rowHeight?: string
}) => {
    return (
        <div
            className={clsx(
                'grid gap-4 max-w-7xl mx-auto w-full',
                `grid-cols-${numOfGridCols}`,
                className
            )}
            style={{ gridAutoRows: rowHeight }}
        >
            {children}
        </div>
    )
}

export const BentoGridItem = ({
    title,
    description,
    width,
    cardImage,
    descriptionImage,
    children,
    skills,
    className,
    gitHub,
    youtube,
    visibleOnMobile = true,
}: {
    title: string
    description: string
    width: number
    cardImage?: string
    descriptionImage: string
    className?: string
    skills?: Skills[]
    children: React.ReactNode
    gitHub?: string
    youtube?: string
    visibleOnMobile?: boolean
}) => {
    const [active, setActive] = useState<boolean | null>(null)
    const ref = useRef<HTMLDivElement>(null)
    const id = useId()

    useOutsideClick(ref, () => setActive(null))

    if (width > 2)
        throw new Error('Invalid input: width should not be greater than 2.')

    let visibility: string
    if (!visibleOnMobile) visibility = 'hidden lg:block'

    return (
        <div className={`${visibility} ${className}`}>
            <motion.div
                layoutId={`card-${id}`}
                key={`card-${id}`}
                onClick={() => setActive(true)}
                className={clsx(
                    `rounded-xl card-bg h-full cursor-pointer w-full`
                )}
                style={{ gridColumn: `span ${width}` }}
            >
                <div
                    className={`w-full h-full bg-cover bg-center rounded-xl ${cardImage ? '' : 'bg-transparent'} border overflow-hidden border-transparent`}
                    style={{
                        backgroundImage: cardImage
                            ? `url(${cardImage})`
                            : 'none',
                    }}
                >
                    {children}
                </div>
            </motion.div>
            <AnimatePresence>
                {active && (
                    <>
                        <div className="fixed inset-0 grid place-items-center z-[100]">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 custom-backdrop-blur-10px h-full w-full z-10"
                            />
                            <SkillCircle
                                skills={skills}
                                className={`fixed inset-0 z-[99] hidden lg:block`}
                            />
                            <motion.div
                                layoutId={`card-${id}`}
                                ref={ref}
                                className="relative w-full max-w-[700px] h-[100vh] lg:h-[50vh] flex flex-col lg:flex-row bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden z-[101]"
                            >
                                <CloseButton
                                    className="z-[102]"
                                    onClick={() => setActive(null)}
                                />
                                <div className="w-full h-[30vh] lg:w-1/2 lg:h-full overflow-hidden flex-shrink-0 flex items-center">
                                    <motion.img
                                        src={descriptionImage}
                                        alt="Card Image"
                                        className="lg:h-full lg:w-auto w-full object-cover"
                                        initial={
                                            window.innerWidth >= 1024
                                                ? { x: '-100%' }
                                                : false
                                        }
                                        animate={
                                            window.innerWidth >= 1024
                                                ? { x: '0%' }
                                                : false
                                        }
                                        exit={
                                            window.innerWidth >= 1024
                                                ? { x: '-100%' }
                                                : false
                                        }
                                        transition={{ type: 'tween' }}
                                    />
                                </div>
                                <div className="w-full lg:w-1/2 h-full p-5 flex flex-col justify-start">
                                    <h3 className="header3 mb-3">{title}</h3>
                                    <Break />
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-4 overflow-y-auto scrollbar-hide">
                                        {description}
                                    </p>
                                    <div className="mt-auto">
                                        <motion.div
                                            initial={{ y: '100%' }}
                                            animate={{ y: '0%' }}
                                            exit={{ y: '100%' }}
                                            transition={{ type: 'tween' }}
                                            className="bg-white dark:bg-neutral-900 rounded-t-lg"
                                        >
                                            {/*TODO: remove the break if no skills*/}
                                            <Break className={`mb-4`} />
                                            <div className="flex flex-wrap justify-start">
                                                {/*TODO: make sure this can handle no skills*/}
                                                {Object.entries(skills).map(
                                                    ([key, value]) => (
                                                        <p
                                                            key={key}
                                                            className={`paragraph text-white ${skillCategoryMap[value]} rounded px-1 mr-1`}
                                                        >
                                                            {value}
                                                        </p>
                                                    )
                                                )}
                                            </div>

                                            <div
                                                className={
                                                    gitHub || youtube
                                                        ? ''
                                                        : 'hidden'
                                                }
                                            >
                                                <Break
                                                    className={'mt-4 mb-4'}
                                                />
                                                <div
                                                    className={`flex justify-evenly flex-row`}
                                                >
                                                    <GithubButton
                                                        link={gitHub}
                                                    />
                                                    <YoutubeButton
                                                        link={youtube}
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
