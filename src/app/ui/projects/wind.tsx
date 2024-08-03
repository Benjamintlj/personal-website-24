'use client'
import React from 'react'
import { motion } from 'framer-motion'

const paths = [
    'M1.8147 69.7638C1.8147 69.7638 -41.8099 66.05 288.052 67.5275C617.915 69.005 724.236 67.5075 970.103 67.5275C1215.97 67.5475 1728.18 2.67682 1728.18 2.67682',
]

export const Wind = ({ className }: { className: string }) => {
    return (
        <svg
            width="100%"
            height="100%"
            viewBox="-52 -8 1790 88"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <motion.linearGradient
                    id="gradient"
                    key="gradient"
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
            </defs>
            <path
                key={1}
                d={paths[0]}
                stroke="url(#gradient)"
                strokeOpacity="0.4"
                strokeWidth="10"
            />
        </svg>
    )
}
