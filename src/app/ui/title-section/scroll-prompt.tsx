'use client'

import { MdKeyboardArrowDown } from 'react-icons/md'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion'
import { cn } from '@/app/lib/utils'
import { clsx } from 'clsx'

export default function ScrollPrompt({ className, textSize, displayDelayMs }) {
    const [showPrompt, setShowPrompt] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowPrompt(true)
        }, displayDelayMs)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div className={cn(className, 'flex flex-col items-center')}>
            <AnimatePresence>
                {showPrompt && (
                    <>
                        <motion.div
                            initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{ duration: 0.4 }}
                            className={`${textSize} secondary mb-1`}
                        >
                            Scroll Down
                        </motion.div>
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
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
