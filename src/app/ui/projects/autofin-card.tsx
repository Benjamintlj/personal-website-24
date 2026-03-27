'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { DottedGlowBackground } from '@/components/ui/dotted-glow-background'

const SUBTITLE = 'Your finances, automated'

export default function AutoFinCard() {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <main
            className="relative flex h-full overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* dotted glow background — Discord purple glow */}
            <DottedGlowBackground
                className="pointer-events-none"
                opacity={isHovered ? 1 : 0.35}
                gap={10}
                radius={1.6}
                color="rgba(88, 101, 242, 0.5)"
                glowColor="rgba(88, 101, 242, 0.9)"
                backgroundOpacity={0}
                speedMin={isHovered ? 0.6 : 0.2}
                speedMax={isHovered ? 2.0 : 0.8}
                speedScale={1}
            />

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
