'use client'

import { MdKeyboardArrowDown } from 'react-icons/md'
import React, {
    MutableRefObject,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react'
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion'
import { cn } from '@/app/lib/utils'
import { clsx } from 'clsx'

export default function ScrollPrompt({
    className,
    textSize,
    displayDelayMs,
    mainRef,
}: {
    className: string
    textSize: string
    displayDelayMs: number
    mainRef: MutableRefObject<any>
}) {
    const [showPrompt, setShowPrompt] = useState(false)
    const [hasScrolled, setHasScrolled] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!hasScrolled) {
                setShowPrompt(true)
            }
        }, displayDelayMs)

        const onScroll = () => {
            setHasScrolled(true)
            setShowPrompt(false)
        }

        const mainElement = mainRef.current
        if (mainElement) {
            mainElement.addEventListener('scroll', onScroll, { passive: true })
        }

        return () => {
            if (mainElement) {
                window.removeEventListener('scroll', onScroll)
            }
            clearTimeout(timer)
        }
    }, [displayDelayMs])

    return (
        <div className={cn(className, 'flex flex-col items-center')}>
            <AnimatePresence>
                {showPrompt && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{
                            opacity: 0,
                            y: -10,
                            x: 10,
                            filter: 'blur(16px)',
                            scale: 1.5,
                            position: 'absolute',
                        }}
                        transition={{ duration: 0.4 }}
                        className="flex flex-col items-center"
                    >
                        <div className={`${textSize} secondary mb-1`}>
                            Scroll Down
                        </div>
                        {[...Array(2)].map((_, index) => (
                            <motion.div
                                key={index}
                                initial={{ y: 0 }}
                                animate={{ y: [0, 10, 0] }}
                                transition={{
                                    delay: index * 0.3,
                                    duration: 1,
                                    repeat: Infinity,
                                    repeatDelay: 1,
                                }}
                                className={`${textSize} inline-block secondary -mt-1`}
                            >
                                <MdKeyboardArrowDown />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
