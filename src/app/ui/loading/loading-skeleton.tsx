'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function LoadingSkeleton() {
    const [text, setText] = useState('loading...')
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % text.length)
        }, 300)

        return () => clearInterval(interval)
    }, [text.length])

    return (
        <div className="flex space-x-1">
            {text.split('').map((letter, i) => (
                <motion.span
                    key={i}
                    initial={{ y: 0, opacity: 1 }}
                    animate={{
                        y: i === index ? -10 : 0,
                        opacity: i === index ? 1 : 0.5,
                        // scale: i === index ? 1.2 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                    className={`header1 inline-block flex justify-center items-center ${i === index ? 'font-bold' : ''}`}
                    style={{ width: '1ch', height: '2em' }}
                >
                    {i === index ? letter.toUpperCase() : letter}
                </motion.span>
            ))}
        </div>
    )
}
