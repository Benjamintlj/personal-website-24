'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CanvasLines } from '@/app/ui/projects/canvas-lines'

const SUBTITLE = 'Your finances, automated'

export default function AutoFinCard() {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <main
            className="relative flex h-full overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* animated bezier wave — dimmed at rest, brighter on hover */}
            <div className={`absolute inset-0 z-0 transition-opacity duration-700 ${isHovered ? 'opacity-70' : 'opacity-25'}`}>
                <CanvasLines hovered={isHovered} className="w-full h-full" />
            </div>

            {/* title + subtitle — centered over full card */}
            <div className="relative z-10 w-full flex flex-col justify-center items-center gap-2">
                <h2 className="header2-gradient">AutoFin</h2>

                {/* subtitle always in DOM — only opacity/blur animates to prevent layout shift */}
                <p className="flex flex-wrap secondary">
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
