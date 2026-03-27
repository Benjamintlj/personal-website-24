'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import SparklesCanvas from '@/app/ui/projects/sparkles-canvas'
import MetaballCanvas from '@/app/ui/projects/metaball-canvas'

const SUBTITLE = 'Your finances, automated'

export default function AutoFinCard() {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <main
            className="relative flex h-full overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* sparkles — behind everything */}
            <SparklesCanvas className="z-0" />

            {/* tree — left half */}
            <div className="relative z-10 w-1/2 h-full">
                <MetaballCanvas className="w-full h-full" />
            </div>

            {/* title + subtitle — right half */}
            <div className="relative z-10 w-1/2 flex flex-col justify-center items-start px-8 gap-2">
                <h2 className="header2-gradient">AutoFin</h2>

                {/* subtitle always in DOM — only opacity/blur animates to prevent layout shift */}
                <p className="flex flex-wrap secondary text-sm">
                    {SUBTITLE.split('').map((char, i) => (
                        <motion.span
                            key={i}
                            animate={{
                                opacity: isHovered ? 1 : 0,
                                filter: isHovered ? 'blur(0px)' : 'blur(8px)',
                            }}
                            transition={{
                                delay: i * 0.04,
                                duration: isHovered ? 0.35 : 0.2,
                                ease: 'easeOut',
                            }}
                            className={char === ' ' ? 'w-2 inline-block' : 'inline-block'}
                        >
                            {char}
                        </motion.span>
                    ))}
                </p>
            </div>
        </main>
    )
}
