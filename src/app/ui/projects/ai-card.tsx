'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import SparklesCanvas from '@/app/ui/projects/sparkles-canvas'

export default function AiCard() {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <main
            className="relative flex flex-col items-center justify-center h-full gap-2 overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <SparklesCanvas className="z-0" particleCount={120} color="139, 92, 246" />

            {/* radial glow from bottom on hover */}
            <motion.div
                className="absolute inset-0 z-[1] pointer-events-none"
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{
                    background:
                        'radial-gradient(ellipse 140% 100% at 50% 120%, rgba(139, 92, 246, 0.5) 0%, transparent 70%)',
                }}
            />

            <h2 className="relative z-10 bento-title text-7xl py-0">AI</h2>
            <p className="relative z-10 secondary text-center">Chat Bot & CNN</p>
        </main>
    )
}
