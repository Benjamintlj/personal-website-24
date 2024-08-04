'use client'
import React from 'react'
import { motion } from 'framer-motion'

export const Wind = ({ className }: { className: string }) => {
    const paths = [
        'M1.8147 170L1728.18 170.01',
        'M1.8147 150L1728.18 150.01',
        'M1.8147 130L1728.18 130.01',
        'M1.8147 110L1728.18 110.01',
        'M1.8147 90L1728.18 90.01',
        'M1.8147 70L1728.18 70.01',
        'M1.8147 50L1728.18 50.01',
        'M1.8147 30L1728.18 30.01',
        'M1.8147 10L1728.18 10.01',
        'M1.8147 -10L1728.18 -10.01',
        'M1.8147 -30L1728.18 -30.01',
        'M1.8147 -50L1728.18 -50.01',
        'M1.8147 -70L1728.18 -70.01',
        'M1.8147 -90L1728.18 -90.01',
        'M1.8147 -110L1728.18 -110.01',
        'M1.8147 -130L1728.18 -130.01',
    ]

    return (
        <svg
            width="100%"
            height="100%"
            viewBox="-52 -8 1790 250"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                {paths.map((d, index) => (
                    <motion.linearGradient
                        id={`gradient-${index}`}
                        key={`gradient-${index}`}
                        initial={{
                            x1: '0%',
                            x2: '0%',
                            y1: '0%',
                            y2: '0%',
                        }}
                        animate={{
                            x1: ['0%', '90%'],
                            x2: ['10%', '100%'],
                            y1: ['0%', '0%'],
                            y2: ['0%', '0%'],
                        }}
                        transition={{
                            duration: 5,
                            ease: 'easeInOut',
                            repeat: Infinity,
                            delay: Math.random() * 10,
                        }}
                    >
                        <stop
                            offset="0%"
                            stopColor="#AE48FF"
                            stopOpacity="0"
                        ></stop>
                        <stop offset="67.5%" stopColor="#6344F5"></stop>
                        <stop offset="100%" stopColor="#18CCFC"></stop>
                        <stop
                            offset="100%"
                            stopColor="#18CCFC"
                            stopOpacity="0"
                        ></stop>
                    </motion.linearGradient>
                ))}
            </defs>
            {paths.map((d, index) => (
                <path
                    key={`path-${index}`}
                    d={d}
                    stroke={`url(#gradient-${index})`}
                    strokeOpacity="0.4"
                    strokeWidth="10"
                />
            ))}
        </svg>
    )
}
