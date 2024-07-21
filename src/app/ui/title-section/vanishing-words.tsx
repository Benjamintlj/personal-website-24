'use client'
import React, {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react'
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion'
import { cn } from '@/lib/utils'
import { clsx } from 'clsx'

export const VanishingWords = ({
    words,
    duration = 3000,
    relativeClause,
    className,
}: {
    words: string[]
    duration?: number
    relativeClause: string
    className?: string
}) => {
    const [relativeClauseSize, setRelativeClauseSize] = useState(0)

    const divRef = useRef(null)
    const currDiv = useRef(null)

    const [isAnimating, setIsAnimating] = useState<boolean>(false)

    const [currWord, setCurrWord] = useState(words[0])
    const [currentWord, setCurrentWord] = useState(words[0])

    const [centerXOffSet, setCenterXOffSet] = useState(0)
    const [posX, setPosX] = useState(0)

    useEffect(() => {
        if (!isAnimating && relativeClauseSize !== 0) {
            const timeout = setTimeout(() => {
                startAnimation()
            }, duration)
            return () => clearTimeout(timeout)
        }
    }, [isAnimating, relativeClauseSize])

    const updateSize = () => {
        if (divRef.current) {
            setRelativeClauseSize(divRef.current.offsetWidth)
        }
    }

    useLayoutEffect(() => {
        updateSize()
    }, [])

    useEffect(() => {
        updateSize()
        window.addEventListener('resize', updateSize)

        return () => {
            window.removeEventListener('resize', updateSize)
        }
    }, [])

    useEffect(() => {
        setCenterXOffSet(relativeClauseSize / 2)
    }, [relativeClauseSize])

    const startAnimation = useCallback(() => {
        setCurrWord(words[(words.indexOf(currWord) + 1) % words.length])
        setCurrentWord(words[(words.indexOf(currentWord) + 1) % words.length])
        setIsAnimating(true)
    }, [currentWord])

    useEffect(() => {
        if (currDiv.current) {
            // @prettier-ignore
            setPosX(
                -(currDiv.current.offsetWidth + relativeClauseSize) / 2 +
                    centerXOffSet
            )
        }
    }, [currWord])

    return (
        <div className="flex items-center justify-center relative">
            <motion.div
                className={`${className} inline-block absolute transform -translate-x-1/2`}
                key={`${currentWord}-relativeClause`}
                ref={divRef}
                initial={{
                    x: posX,
                }}
                transition={{
                    duration: 1,
                    delay: 0.6,
                    ease: 'easeInOut',
                    type: 'spring',
                    stiffness: 100,
                    damping: 15,
                }}
                animate={{ x: posX }}
            >
                <div className={`${className} inline-block`}>
                    <p className="inline-block">{relativeClause}</p>
                    <p className={`inline-block w-4`}></p>
                </div>
            </motion.div>

            <AnimatePresence
                onExitComplete={() => {
                    setIsAnimating(false)
                }}
            >
                <motion.div
                    key={`${currentWord}-carousel`}
                    initial={{
                        x: centerXOffSet,
                    }}
                    animate={{
                        x: centerXOffSet,
                    }}
                    transition={{
                        duration: 1,
                        delay: 0.3,
                        ease: 'easeInOut',
                        type: 'spring',
                        stiffness: 100,
                        damping: 10,
                    }}
                    exit={{
                        x: centerXOffSet,
                        position: 'absolute',
                        transition: {
                            duration: 0.6,
                        },
                    }}
                    className={cn(
                        'z-10 inline-block relative text-left text-neutral-900 dark:text-neutral-100 px-1 whitespace-nowrap',
                        className
                    )}
                >
                    {currentWord.split('').map((letter, index) => (
                        <motion.span
                            key={currentWord + index}
                            initial={{
                                opacity: 0,
                                y: 10,
                                x: -5,
                                filter: 'blur(8px)',
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                filter: 'blur(0px)',
                            }}
                            transition={{
                                delay: index * 0.08 + 1,
                                duration: 0.2,
                                ease: 'easeInOut',
                                type: 'spring',
                                stiffness: 100,
                                damping: 10,
                            }}
                            exit={{
                                opacity: 0,
                                y: -10,
                                x: 5,
                                filter: 'blur(8px)',
                                transition: {
                                    delay: index * 0.08,
                                    duration: 0.2,
                                },
                            }}
                            className={clsx(
                                'inline-block z-10 relative text-left text-neutral-900 dark:text-neutral-100',
                                letter === ' ' && 'w-2.5'
                            )}
                        >
                            {letter}
                        </motion.span>
                    ))}
                </motion.div>
            </AnimatePresence>

            <div
                style={{
                    position: 'absolute',
                    top: '-999999px',
                }}
                className={`${className}`}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                    }}
                    ref={currDiv}
                >
                    <div>{currWord}</div>
                </div>
            </div>
        </div>
    )
}
