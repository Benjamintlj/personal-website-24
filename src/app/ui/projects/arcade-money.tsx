'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './arcade-race.module.css'

function Digit({ value, direction, reducedMotion }: { value: number; direction: number; reducedMotion: boolean }) {
    const previous = useRef(value)
    const [reel, setReel] = useState({ position: 10 + value, rolling: false })

    useEffect(() => {
        if (previous.current === value) return
        previous.current = value
        setReel({ position: reducedMotion ? 10 + value : (direction > 0 ? 20 : 0) + value, rolling: !reducedMotion })
    }, [value, direction, reducedMotion])

    return <span className={styles.digit}>
        <span className={styles.reel} data-rolling={reel.rolling}
            style={{ transform: `translateY(${-reel.position}em)` }}
            onTransitionEnd={() => setReel({ position: 10 + value, rolling: false })}>
            {Array.from({ length: 30 }, (_, index) => <span key={index}>{index % 10}</span>)}
        </span>
    </span>
}

export default function ArcadeMoney({ amount, reducedMotion }: { amount: number; reducedMotion: boolean }) {
    const previous = useRef(amount)
    const direction = amount >= previous.current ? 1 : -1
    useEffect(() => { previous.current = amount }, [amount])
    const digits = (amount / 100).toFixed(2).padStart(6, '0')
    return <span className={styles.money} role="img" aria-label={`Balance £${(amount / 100).toFixed(2)}`}>
        <span aria-hidden="true" className={styles.currency}>£</span>
        <span aria-hidden="true" className={styles.number}>
            {digits.split('').map((digit, index) => digit === '.'
                ? <span key={`decimal-${digits.length - index}`} className={styles.decimal}>.</span>
                : <Digit key={digits.length - index} value={Number(digit)} direction={direction} reducedMotion={reducedMotion} />)}
        </span>
    </span>
}
