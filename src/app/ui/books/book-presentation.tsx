'use client'

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform, type AnimationPlaybackControls } from 'framer-motion'
import { BookFaces, type ShelfOrigin } from './book-model'
import styles from './book-reader.module.css'

export type BookPhase = 'arriving' | 'reading' | 'closing-cover' | 'front-cover' | 'back-cover' | 'opening-cover' | 'returning'
type Flight = { x: number; y: number; scale: number; closedX: number }

/** The same cover, hinge and book assembly handle opening, closing and returning. */
export default function BookPresentation({ origin, narrow, reducedMotion, phase, backCover, onComplete, onOpen, inside, children }: {
    origin: ShelfOrigin; narrow: boolean; reducedMotion: boolean; phase: BookPhase; backCover: boolean
    onComplete: (phase: BookPhase) => void; onOpen: () => void; inside: ReactNode; children: ReactNode
}) {
    const mount = useRef<HTMLDivElement>(null)
    const [flight, setFlight] = useState<Flight | null>(null)
    const initialized = useRef(false)
    const [hinged, setHinged] = useState(false)
    const x = useMotionValue(0), y = useMotionValue(0), scale = useMotionValue(1)
    const rotation = useMotionValue(86), openness = useMotionValue(0)
    const coverAngle = useTransform(openness, [0, 1], [0, backCover ? 180 : -180])
    const paperOpacity = useTransform(openness, [0, .005], [0, 1])
    useMotionValueEvent(openness, 'change', value => setHinged(value > .001))

    useLayoutEffect(() => {
        const measure = () => {
            const bounds = mount.current!.getBoundingClientRect()
            const hinge = narrow ? (backCover ? bounds.width : 0) : bounds.width / 2
            const next = {
                x: origin.left - bounds.left - hinge,
                y: origin.top - bounds.top + (origin.height - bounds.height) / 2,
                scale: origin.height / bounds.height,
                closedX: narrow ? 0 : bounds.width / 4 * (backCover ? 1 : -1),
            }
            if (!initialized.current) {
                x.set(next.x); y.set(next.y); scale.set(next.scale)
                initialized.current = true
            }
            setFlight(previous => previous && Object.keys(next).every(key => previous[key as keyof Flight] === next[key as keyof Flight]) ? previous : next)
        }
        measure()
        const resize = new ResizeObserver(measure)
        resize.observe(mount.current!)
        return () => resize.disconnect()
    }, [origin, narrow, backCover, x, y, scale])

    useEffect(() => {
        if (!flight) return
        if (phase === 'reading') {
            x.set(0); y.set(0); scale.set(1); rotation.set(0); openness.set(1)
            return
        }
        const ease = [.3, .05, .3, 1] as [number, number, number, number]
        const duration = reducedMotion ? 0 : phase === 'arriving' ? 1.65 : .8
        const transition = { duration, ease }
        const animations: AnimationPlaybackControls[] = []
        if (phase === 'arriving') {
            const timeline = { ...transition, times: [0, .48, 1] }
            animations.push(animate(x, [x.get(), flight.closedX, 0], timeline), animate(y, [y.get(), 0, 0], timeline),
                animate(scale, [scale.get(), 1, 1], timeline), animate(rotation, [rotation.get(), 0, 0], timeline), animate(openness, [0, 0, 1], timeline))
        } else if (phase === 'closing-cover' || phase === 'opening-cover') {
            const closing = phase === 'closing-cover'
            animations.push(animate(x, closing ? flight.closedX : 0, transition), animate(y, 0, transition),
                animate(scale, 1, transition), animate(rotation, 0, transition), animate(openness, closing ? 0 : 1, transition))
        } else if (phase === 'returning') {
            animations.push(animate(x, flight.x, transition), animate(y, flight.y, transition),
                animate(scale, flight.scale, transition), animate(rotation, backCover ? -94 : 86, transition), animate(openness, 0, transition))
        } else {
            x.set(flight.closedX); y.set(0); scale.set(1); rotation.set(0); openness.set(0)
            return
        }
        let cancelled = false
        Promise.all(animations).then(() => { if (!cancelled) onComplete(phase) })
        return () => { cancelled = true; animations.forEach(animation => animation.stop()) }
    }, [flight, phase, backCover, reducedMotion, onComplete, x, y, scale, rotation, openness])

    const covering = phase !== 'reading'
    const closed = phase === 'front-cover' || phase === 'back-cover'
    return <div ref={mount} className={styles.presentationMount} data-book-state={phase}>
        {flight && <motion.div className={`${styles.presentationAssembly} ${covering ? styles.introAssembly : ''} ${backCover ? styles.backAssembly : ''}`}
            style={{ transformOrigin: narrow ? (backCover ? 'right center' : 'left center') : 'center center', x, y, scale, rotateY: rotation }}>
            {/* Keep page textures composited during 3D turns to avoid blank pages in WebKit. */}
            <motion.div className={styles.readerPages} style={{ opacity: covering ? paperOpacity : 1 }} aria-hidden={phase === 'front-cover' || phase === 'back-cover' || phase === 'returning' || undefined}>{children}</motion.div>
            <motion.div className={`${styles.presentationCover} ${backCover ? styles.backCover : ''} ${narrow ? styles.mobileCover : ''}`}
                style={{ rotateY: coverAngle, opacity: covering ? 1 : 0, pointerEvents: closed ? 'auto' : 'none' }} aria-hidden={!closed || undefined}>
                <BookFaces opening={hinged} inside={inside} backCover={backCover} />
                {closed && <button type="button" className={styles.closedCoverOpen} onClick={onOpen} aria-label={`Open ${backCover ? 'back' : 'front'} cover`} />}
            </motion.div>
        </motion.div>}
    </div>
}
