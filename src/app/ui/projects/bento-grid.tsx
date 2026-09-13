import { cn } from '@/lib/utils'
import React from 'react'
import { useState, useRef, useId, useEffect } from 'react'
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
                'grid gap-4 mx-auto w-full',
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
    cardImage,
    descriptionImage,
    children,
    skills,
    className,
    gitHub,
    youtube,
    visibleOnMobile = true,
    interactive = false,
}: {
    title: string
    description: string
    cardImage?: string
    descriptionImage?: string
    className?: string
    skills?: Skills[]
    children: React.ReactNode | ((openDetails: () => void) => React.ReactNode)
    gitHub?: string
    youtube?: string
    visibleOnMobile?: boolean
    interactive?: boolean
}) => {
    const [active, setActive] = useState<boolean | null>(null)
    const ref = useRef<HTMLDivElement>(null)
    const id = useId()

    useOutsideClick(ref, () => setActive(null))

    useEffect(() => {
        if (!active) return
        const previousFocus = document.activeElement as HTMLElement | null
        const dialog = ref.current
        const focusableElements = () => Array.from(
            dialog?.querySelectorAll<HTMLElement>('button, a[href], [tabindex="0"]') ?? []
        ).filter((element) => element.getClientRects().length > 0)

        ;(focusableElements()[0] ?? dialog)?.focus({ preventScroll: true })
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setActive(null)
            if (e.key === 'Tab') {
                const elements = focusableElements()
                const first = elements[0]
                const last = elements[elements.length - 1]
                if (!first) {
                    e.preventDefault()
                    dialog?.focus()
                } else if (e.shiftKey && (document.activeElement === first || !dialog?.contains(document.activeElement))) {
                    e.preventDefault()
                    last.focus()
                } else if (!e.shiftKey && (document.activeElement === last || !dialog?.contains(document.activeElement))) {
                    e.preventDefault()
                    first.focus()
                }
            }
        }
        window.addEventListener('keydown', onKey)
        return () => {
            window.removeEventListener('keydown', onKey)
            previousFocus?.focus({ preventScroll: true })
        }
    }, [active])

    let visibility: string = ''
    if (!visibleOnMobile) visibility = 'hidden desktop:block'

    return (
        <div className={`${visibility} ${className}`}>
            <motion.div
                layoutId={`card-${id}`}
                key={`card-${id}`}
                onClick={interactive ? undefined : () => setActive(true)}
                role={interactive ? undefined : 'button'}
                tabIndex={interactive ? undefined : 0}
                aria-label={interactive ? undefined : `Read about ${title}`}
                aria-haspopup={interactive ? undefined : 'dialog'}
                onKeyDown={(event) => {
                    if (interactive) return
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        setActive(true)
                    }
                }}
                className={clsx(
                    `rounded-xl card-bg h-full ${interactive ? '' : 'cursor-pointer'} w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white`
                )}
            >
                <div
                    className={`w-full h-full bg-cover bg-center rounded-xl ${cardImage ? '' : 'bg-transparent'} border overflow-hidden border-transparent`}
                    style={{
                        backgroundImage: cardImage
                            ? `url(${cardImage})`
                            : 'none',
                    }}
                >
                    {typeof children === 'function' ? children(() => setActive(true)) : children}
                </div>
            </motion.div>
            <AnimatePresence>
                {active && (
                    <>
                        <div className="fixed inset-0 top-[56px] lg:top-0 grid place-items-center z-[100]">
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
                                role="dialog"
                                tabIndex={-1}
                                aria-modal="true"
                                aria-labelledby={`project-title-${id}`}
                                className={`relative w-full max-w-[700px] h-[calc(100vh-56px)] lg:[@media(min-height:900px)]:h-[50vh] lg:[@media(max-height:899px)]:h-[70vh] flex flex-col ${descriptionImage ? 'lg:flex-row' : ''} bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden z-[101] pb-[100px] desktop:pb-0`}
                            >
                                <CloseButton
                                    className="z-[102]"
                                    onClick={() => setActive(null)}
                                />
                                {descriptionImage && (
                                    <div className="w-full h-[30vh] lg:w-1/2 lg:h-full overflow-hidden flex-shrink-0 flex items-center">
                                        <motion.img
                                            src={descriptionImage}
                                            alt="Card Image"
                                            className="lg:h-full lg:w-auto w-full object-cover"
                                            initial={
                                                window.innerWidth >= 1024
                                                    ? { x: '-100%' }
                                                    : undefined
                                            }
                                            animate={
                                                window.innerWidth >= 1024
                                                    ? { x: '0%' }
                                                    : undefined
                                            }
                                            exit={
                                                window.innerWidth >= 1024
                                                    ? { x: '-100%' }
                                                    : undefined
                                            }
                                            transition={{ type: 'tween' }}
                                        />
                                    </div>
                                )}
                                <div
                                    className={`w-full ${descriptionImage ? 'lg:w-1/2' : 'w-full'} h-full p-5 flex flex-col justify-start`}
                                >
                                    <h3 id={`project-title-${id}`} className="header3 mb-3">{title}</h3>
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
                                            {!!skills?.length && <Break className={`mb-4`} />}
                                            <div className="flex flex-wrap justify-start">
                                                {skills &&
                                                    Object.entries(skills).map(
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
                                            <div
                                                className={`h-24 desktop:hidden`}
                                            />
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
