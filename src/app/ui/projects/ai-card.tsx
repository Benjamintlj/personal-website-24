'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BackgroundBeams } from '@/app/ui/projects/background-beams'

export default function AiCard() {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <main
            className="relative flex flex-col items-center justify-center h-full gap-2 overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                className="absolute inset-0"
                animate={{ opacity: isHovered ? 1 : 0.35 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
            >
                <BackgroundBeams />
            </motion.div>
            <h2 className="relative z-10 bento-title text-7xl py-0">AI</h2>
            <p className="relative z-10 secondary text-center">Chat Bot & CNN</p>
        </main>
    )
}
