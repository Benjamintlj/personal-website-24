'use client'

import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { BookFaces, type ShelfOrigin } from './book-model'
import styles from './book-reader.module.css'

type Flight = { x: number; y: number; scale: number; rotateY: number }

export default function BookPresentation({ origin, narrow, reducedMotion, opening, onArrived, onOpened, onOpen, children }: {
    origin: ShelfOrigin; narrow: boolean; reducedMotion: boolean; opening: boolean
    onArrived: () => void; onOpened: () => void; onOpen: () => void; children: ReactNode
}) {
    const stage = useRef<HTMLDivElement>(null)
    const [flight, setFlight] = useState<Flight | null>(null)
    const [arrived, setArrived] = useState(reducedMotion)
    useLayoutEffect(() => { if (reducedMotion) onArrived() }, [reducedMotion, onArrived])
    useLayoutEffect(() => {
        const bounds = stage.current!.getBoundingClientRect()
        const coverLeft = bounds.left + (narrow ? 0 : bounds.width / 4)
        setFlight({ x: origin.left - coverLeft, y: origin.top - bounds.top + (origin.height - bounds.height) / 2, scale: origin.height / bounds.height, rotateY: 86 })
    }, [origin, narrow])

    const duration = reducedMotion ? 0 : opening ? 1.1 : .85
    return <div ref={stage} className={`${styles.stage} ${narrow ? styles.single : ''}`} style={{ '--zoom': 1 } as CSSProperties} data-book-state={opening ? 'opening' : arrived ? 'closed' : 'arriving'}>
        <motion.div className={styles.presentationAssembly}
            initial={false} animate={{ x: narrow || opening ? '0%' : '-25%' }}
            transition={{ duration, ease: [.35, .05, .3, 1] }}>
            {opening && <div className={`${styles.closedPages} ${narrow ? styles.mobileCover : ''}`}>{children}</div>}
            {flight && <motion.div className={`${styles.presentationCover} ${narrow ? styles.mobileCover : ''}`}
                initial={reducedMotion ? false : flight} animate={{ x: 0, y: 0, scale: 1, rotateY: opening ? -180 : 0 }}
                transition={{ duration, ease: [.35, .05, .3, 1] }}
                onAnimationComplete={() => {
                    if (opening) onOpened()
                    else if (!arrived) { setArrived(true); onArrived() }
                }}>
                <BookFaces opening={opening} />
                {arrived && !opening && <button className={styles.coverOpen} type="button" aria-label="Open front cover" onClick={onOpen} />}
            </motion.div>}
        </motion.div>
    </div>
}
