'use client'

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { BookFaces, type ShelfOrigin } from './book-model'
import styles from './book-reader.module.css'

type Flight = { x: number; y: number; scale: number; closedX: number }

/** One book assembly stays mounted from the shelf flight through normal reading. */
export default function BookPresentation({ origin, narrow, reducedMotion, active, onOpened, children }: {
    origin: ShelfOrigin; narrow: boolean; reducedMotion: boolean; active: boolean
    onOpened: () => void; children: ReactNode
}) {
    const mount = useRef<HTMLDivElement>(null)
    const [flight, setFlight] = useState<Flight | null>(null)
    const [opening, setOpening] = useState(false)
    useLayoutEffect(() => {
        const bounds = mount.current!.getBoundingClientRect()
        const hinge = narrow ? 0 : bounds.width / 2
        setFlight({
            x: origin.left - bounds.left - hinge,
            y: origin.top - bounds.top + (origin.height - bounds.height) / 2,
            scale: origin.height / bounds.height,
            closedX: narrow ? 0 : -bounds.width / 4,
        })
    }, [origin, narrow])
    useLayoutEffect(() => { if (reducedMotion && active) onOpened() }, [reducedMotion, active, onOpened])

    // Both the lift and the hinge use the same uninterrupted timeline.
    const transition = { duration: reducedMotion ? 0 : 1.65, times: [0, .48, 1], ease: [.3, .05, .3, 1] as [number, number, number, number] }
    return <div ref={mount} className={styles.presentationMount} data-book-state={active ? opening ? 'opening' : 'arriving' : 'reading'}>
        {flight && <motion.div className={`${styles.presentationAssembly} ${active ? styles.introAssembly : ''}`}
            style={{ transformOrigin: narrow ? 'left center' : 'center center' }}
            initial={reducedMotion ? false : { x: flight.x, y: flight.y, scale: flight.scale, rotateY: 86 }}
            animate={active ? {
                x: [flight.x, flight.closedX, 0], y: [flight.y, 0, 0],
                scale: [flight.scale, 1, 1], rotateY: [86, 0, 0],
            } : { x: 0, y: 0, scale: 1, rotateY: 0 }}
            transition={transition}>
            {/* Opacity keeps page textures ready during 3D turns; visibility can leave them blank in WebKit. */}
            <div className={styles.readerPages} style={{ opacity: active && !opening ? 0 : 1 }}>{children}</div>
            {active && <motion.div className={`${styles.presentationCover} ${narrow ? styles.mobileCover : ''}`}
                initial={{ rotateY: 0 }} animate={{ rotateY: [0, 0, -180] }} transition={transition}
                onUpdate={latest => { if (!opening && Number(latest.rotateY) < -.1) setOpening(true) }}
                onAnimationComplete={onOpened}>
                <BookFaces opening={opening} />
            </motion.div>}
        </motion.div>}
    </div>
}
