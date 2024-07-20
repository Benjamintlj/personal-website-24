'use client'
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion'
import { cn } from '@/app/lib/utils'
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

    useLayoutEffect(() => {
        setRelativeClauseSize(divRef.current.offsetWidth)
    }, [])

    const startAnimation = useCallback(() => {
        setCurrWord(words[(words.indexOf(currWord) + 1) % words.length])
        setCurrentWord(words[(words.indexOf(currentWord) + 1) % words.length])
        setIsAnimating(true)
    }, [currentWord])

    useEffect(() => {
        if (currDiv.current && relativeClauseSize !== 0) {
            // @prettier-ignore
            console.log(`current size: ${currDiv.current.offsetWidth}`)
            console.log(`clause size: ${relativeClauseSize}`)

            setCenterXOffSet(relativeClauseSize / 2)

            setPosX((-(currDiv.current.offsetWidth + relativeClauseSize) / 2) + centerXOffSet)
        }
    }, [currWord, relativeClauseSize])

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
                    ease: 'easeInOut',
                    when: 'beforeChildren',
                }}
                animate={{ x: posX }}
            >
                <div className={`${className} inline-block`}>
                    <p className="inline-block">{relativeClause}</p>
                    <p className={`inline-block w-1`}></p>
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
                        opacity: 0,
                        y: 10,
                        x: centerXOffSet
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        x: centerXOffSet
                    }}
                    transition={{
                        duration: 0.4,
                        ease: 'easeInOut',
                        type: 'spring',
                        stiffness: 100,
                        damping: 10,
                        delay: 1,
                    }}
                    exit={{
                        opacity: 0,
                        y: -40,
                        x: 40,
                        filter: 'blur(8px)',
                        scale: 2,
                        position: 'absolute',
                        transition: {
                            duration: 0.5,
                        },
                    }}
                    className={cn(
                        'z-10 inline-block relative text-left text-neutral-900 dark:text-neutral-100 px-2',
                        className
                    )}
                >
                    {currentWord.split('').map((letter, index) => (
                        <motion.span
                            key={currentWord + index}
                            initial={{
                                opacity: 0,
                                y: 10,
                                filter: 'blur(8px)',
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                filter: 'blur(0px)',
                            }}
                            transition={{
                                delay: index * 0.08,
                                duration: 0.3,
                            }}
                            className={clsx(
                                'inline-block z-10 relative text-left text-neutral-900 dark:text-neutral-100',
                                letter === ' ' && 'w-1'
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
                    top: '600px',
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

/**
 * export const VanishingWords = ({
 *     words,
 *     duration = 3000,
 *     relativeClause,
 *     className,
 * }: {
 *     words: string[]
 *     duration?: number
 *     relativeClause: string
 *     className?: string
 * }) => {
 *     const [currentWord, setCurrentWord] = useState(words[0])
 *     const [isAnimating, setIsAnimating] = useState<boolean>(false)
 *
 *     const startAnimation = useCallback(() => {
 *         const word = words[words.indexOf(currentWord) + 1] || words[0]
 *         setCurrentWord(word)
 *
 *         setIsAnimating(true)
 *     }, [currentWord, words])
 *
 *     useEffect(() => {
 *         if (!isAnimating) {
 *             const timeout = setTimeout(() => {
 *                 startAnimation()
 *             }, duration)
 *             return () => clearTimeout(timeout)
 *         }
 *     }, [isAnimating, startAnimation, duration])
 *
 *     return (
 *         <AnimatePresence
 *             onExitComplete={() => {
 *                 console.log('exit')
 *                 setIsAnimating(false)
 *             }}
 *         >
 *             <motion.div
 *                 key={`${currentWord}-1`}
 *                 className={cn(
 *                     'z-10 inline-block relative text-left text-neutral-900 dark:text-neutral-100 px-2'
 *                 )}
 *             >
 *                 <p className="inline-block">{relativeClause}</p>
 *                 {currentWord.split('').map((letter, index) => (
 *                     <motion.span
 *                         key={currentWord + index}
 *                         initial={{
 *                             opacity: 0,
 *                             y: 10,
 *                             filter: 'blur(8px)',
 *                         }}
 *                         animate={{
 *                             opacity: 1,
 *                             y: 0,
 *                             filter: 'blur(0px)',
 *                         }}
 *                         transition={{
 *                             delay: index * 0.08,
 *                             duration: 0.3,
 *                         }}
 *                         className={clsx(
 *                             'inline-block',
 *                             letter === ' ' && 'w-1'
 *                         )}
 *                     >
 *                         {letter}
 *                     </motion.span>
 *                 ))}
 *             </motion.div>
 *         </AnimatePresence>
 *     )
 * }
 */
