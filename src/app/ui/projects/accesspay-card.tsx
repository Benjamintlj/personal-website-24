'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { LinesGradientShader } from '@/app/ui/projects/lines-gradient-shader'

const ROTATION_STEP = 360 / 8

export default function AccessPayCard() {
    const [isHovered, setIsHovered] = useState(false)
    const [rotation, setRotation] = useState(0)

    return (
        <main
            className="relative flex flex-col items-center justify-center h-full gap-5 overflow-hidden"
            onMouseEnter={() => {
                setIsHovered(true)
                setRotation((r) => r + ROTATION_STEP)
            }}
            onMouseLeave={() => setIsHovered(false)}
        >
            <LinesGradientShader className="absolute inset-0" bandCount={8} bandSpacing={18} xOffset={-128} yOffset={-30} rotationAngle={20} />

            {/* radial glow from bottom on hover */}
            <motion.div
                className="absolute inset-0 z-[1] pointer-events-none"
                animate={{
                    opacity: isHovered ? 1 : 0,
                }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{
                    background:
                        'radial-gradient(ellipse 140% 100% at 50% 120%, rgba(245, 167, 35, 0.5) 0%, transparent 70%)',
                }}
            />

            <motion.img
                src="/images/accesspay-logo.png"
                alt="AccessPay logo"
                className="relative z-10 w-36 h-36 object-contain"
                animate={{ rotate: rotation }}
                transition={{ type: 'spring', stiffness: 180, damping: 12 }}
            />
            <h2 className="relative z-10 bento-title">AccessPay</h2>
        </main>
    )
}
