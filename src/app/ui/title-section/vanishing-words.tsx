'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
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
    const divRef = useRef(null)
    const prevDiv = useRef(null)
    const currDiv = useRef(null)

    const [currentWord, setCurrentWord] = useState(words[0])
    const [isAnimating, setIsAnimating] = useState<boolean>(false)

    const [prevWord, setPrevWord] = useState(words[0])
    const [currWord, setCurrWord] = useState(words[1])

    const [prevWordSize, setPrevWordSize] = useState(0)
    const [currWordSize, setCurrWordSize] = useState(0)
    const [xOffSet, setXOffSet] = useState(0)

    const startAnimation = useCallback(() => {
        setPrevWord(words[(words.indexOf(prevWord) + 1) % words.length])
        setCurrWord(words[(words.indexOf(currWord) + 1) % words.length])

        const word = words[words.indexOf(currentWord) + 1] || words[0]
        setCurrentWord(word)

        setIsAnimating(true)
    }, [currentWord, prevWord, currWord, words])

    useEffect(() => {
        if (prevDiv.current && currDiv.current) {
            setPrevWordSize(prevDiv.current.offsetWidth)
            setCurrWordSize(currDiv.current.offsetWidth)
            setXOffSet(currWordSize / 2 - prevWordSize / 2)
        }
    }, [prevWord, currWord])

    useEffect(() => {
        if (!isAnimating) {
            const timeout = setTimeout(() => {
                startAnimation()
            }, duration)
            return () => clearTimeout(timeout)
        }
    }, [isAnimating, startAnimation, duration])

    return (
        <div
            className={`${className} relative w-full flex items-center justify-center`}
        >
            <AnimatePresence
                onExitComplete={() => {
                    console.log('exit')
                    setIsAnimating(false)
                }}
            >
                <motion.div
                    key={`${currentWord}-${xOffSet}`}
                    ref={divRef}
                    transition={{ duration: 1 }}
                    initial={{ x: xOffSet }}
                    animate={{ x: 0 }}
                >
                    <p className="inline-block">{relativeClause}</p>
                    <motion.div
                        key={currentWord}
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
                                    'inline-block',
                                    letter === ' ' && 'w-1'
                                )}
                            >
                                {letter}
                            </motion.span>
                        ))}
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            <div
                style={{
                    position: 'absolute',
                    left: '-10000px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                        ref={prevDiv}
                    >
                        <div>{prevWord}</div>
                    </div>
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
        </div>
    )
}
