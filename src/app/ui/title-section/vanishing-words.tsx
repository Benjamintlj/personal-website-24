'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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
    const [isAnimating, setIsAnimating] = useState(false)
    const [currentWord, setCurrentWord] = useState(words[0])

    useEffect(() => {
        if (!isAnimating) {
            const timeout = setTimeout(() => {
                setCurrentWord(words[(words.indexOf(currentWord) + 1) % words.length])
                setIsAnimating(true)
            }, duration)
            return () => clearTimeout(timeout)
        }
    }, [isAnimating, currentWord])

    return (
        <div className="inline-flex items-center">
            <span className={cn('text-neutral-900 dark:text-neutral-500', className)}>
                {relativeClause}
            </span>
            <span aria-hidden="true" className="inline-block w-3 shrink-0" />
            <div className="relative">
                <AnimatePresence onExitComplete={() => setIsAnimating(false)}>
                    <motion.div
                        key={currentWord}
                        exit={{
                            position: 'absolute' as const,
                            transition: { duration: 0.3 },
                        }}
                        className={cn(
                            'z-10 inline-block relative whitespace-nowrap text-neutral-900 dark:text-neutral-100',
                            className
                        )}
                    >
                        {currentWord.split('').map((letter, index) => (
                            <motion.span
                                key={currentWord + index}
                                initial={{ opacity: 0, y: 10, x: -5, filter: 'blur(8px)' }}
                                animate={{ opacity: 1, y: 0, x: 0, filter: 'blur(0px)' }}
                                transition={{
                                    delay: index * 0.08 + 0.3,
                                    type: 'spring',
                                    stiffness: 100,
                                    damping: 10,
                                    filter: {
                                        type: 'tween',
                                        duration: 0.4,
                                        ease: 'easeOut',
                                        delay: index * 0.08 + 0.3,
                                    },
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
                                    'inline-block z-10 relative',
                                    letter === ' ' && 'w-2.5'
                                )}
                            >
                                {letter}
                            </motion.span>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
