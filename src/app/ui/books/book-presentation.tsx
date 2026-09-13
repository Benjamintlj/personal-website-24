'use client'

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { animate, motion, useMotionTemplate, useMotionValue, useMotionValueEvent, useTransform, type AnimationPlaybackControls, type MotionStyle } from 'framer-motion'
import { BookFaces, type BookArtwork, type ShelfOrigin } from './book-model'
import styles from './book-reader.module.css'

export type BookPhase = 'arriving' | 'reading' | 'closing-cover' | 'front-cover' | 'back-cover' | 'opening-cover' | 'returning'
type Flight = {
    x: number; y: number; z: number; scaleX: number; scaleY: number; closedX: number
    cameraX: number; cameraY: number; centerX: number; centerY: number; depth: number; rotation: number
}

/** The same cover, hinge and book assembly handle opening, closing and returning. */
export default function BookPresentation({ origin, getShelfOrigin, narrow, reducedMotion, phase, backCover, onComplete, onOpen, inside, children, artwork, siteHref }: {
    origin: ShelfOrigin; getShelfOrigin: () => ShelfOrigin; narrow: boolean; reducedMotion: boolean; phase: BookPhase; backCover: boolean
    onComplete: (phase: BookPhase) => void; onOpen?: () => void; inside?: ReactNode; children?: ReactNode
    artwork?: BookArtwork; siteHref?: string
}) {
    const mount = useRef<HTMLDivElement>(null)
    const [flight, setFlight] = useState<Flight | null>(null)
    const initialized = useRef(false)
    const [hinged, setHinged] = useState(false)
    const x = useMotionValue(0), y = useMotionValue(0), z = useMotionValue(0)
    const scaleX = useMotionValue(1), scaleY = useMotionValue(1)
    const rotation = useMotionValue(86), openness = useMotionValue(0)
    const cameraX = useMotionValue(0), cameraY = useMotionValue(0), perspective = useMotionValue(1200)
    // Scale depth as well as the two visible dimensions, then project only once.
    const transform = useMotionTemplate`translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotation}deg) scale3d(${scaleX}, ${scaleY}, ${scaleX})`
    const perspectiveOrigin = useMotionTemplate`${cameraX}px ${cameraY}px`
    const coverAngle = useTransform(openness, [0, 1], [0, backCover ? 180 : -180])
    const paperOpacity = useTransform(openness, [0, .005], [0, 1])
    useMotionValueEvent(openness, 'change', value => setHinged(value > .001))
    const returning = phase === 'returning'

    useLayoutEffect(() => {
        const measure = () => {
            const bounds = mount.current!.getBoundingClientRect()
            const shelf = getShelfOrigin()
            const hinge = narrow ? (backCover ? bounds.width : 0) : bounds.width / 2
            const pageWidth = narrow ? bounds.width : bounds.width / 2
            const angle = shelf.restRotation * Math.PI / 180
            // The reverse cover pivots about the other edge of the spine.
            const next: Flight = {
                x: shelf.left - bounds.left - hinge - (backCover ? shelf.depth * Math.sin(angle) : 0),
                y: shelf.top - bounds.top + (shelf.height - bounds.height) / 2,
                z: backCover ? -shelf.depth * Math.cos(angle) : 0,
                scaleX: shelf.width / pageWidth, scaleY: shelf.height / bounds.height,
                closedX: narrow ? 0 : bounds.width / 4 * (backCover ? 1 : -1),
                cameraX: shelf.cameraX - bounds.left, cameraY: shelf.cameraY - bounds.top,
                centerX: bounds.width / 2, centerY: bounds.height / 2,
                depth: pageWidth * shelf.depth / shelf.width,
                rotation: shelf.restRotation - (backCover ? 180 : 0),
            }
            if (!initialized.current) {
                x.set(origin.left - bounds.left - hinge + origin.liftX)
                y.set(origin.top - bounds.top + (origin.height - bounds.height) / 2 + origin.liftY)
                z.set(origin.liftZ)
                rotation.set(origin.rotation)
                scaleX.set(origin.width / pageWidth); scaleY.set(origin.height / bounds.height)
                cameraX.set(origin.cameraX - bounds.left); cameraY.set(origin.cameraY - bounds.top)
                initialized.current = true
            }
            setFlight(previous => previous && Object.keys(next).every(key => previous[key as keyof Flight] === next[key as keyof Flight]) ? previous : next)
        }
        measure()
        const resize = new ResizeObserver(measure)
        resize.observe(mount.current!)
        return () => resize.disconnect()
    }, [origin, getShelfOrigin, narrow, backCover, returning, x, y, z, scaleX, scaleY, cameraX, cameraY, rotation])

    useEffect(() => {
        if (!flight) return
        if (phase === 'reading') {
            x.set(0); y.set(0); z.set(0); scaleX.set(1); scaleY.set(1); rotation.set(0); openness.set(1)
            cameraX.set(flight.centerX); cameraY.set(flight.centerY); perspective.set(2200)
            return
        }
        const ease = [.3, .05, .3, 1] as [number, number, number, number]
        const duration = reducedMotion ? 0 : phase === 'arriving' ? (siteHref ? 1 : 1.65) : phase === 'returning' ? 1 : .8
        const transition = { duration, ease }
        const animations: AnimationPlaybackControls[] = []
        if (phase === 'arriving' && siteHref) {
            animations.push(animate(x, flight.closedX, transition), animate(y, 0, transition), animate(z, 0, transition),
                animate(scaleX, 1, transition), animate(scaleY, 1, transition), animate(rotation, 0, transition),
                animate(cameraX, flight.centerX, transition), animate(cameraY, flight.centerY, transition), animate(perspective, 2200, transition))
        } else if (phase === 'arriving') {
            const timeline = { ...transition, times: [0, .48, 1] }
            animations.push(animate(x, [x.get(), flight.closedX, 0], timeline), animate(y, [y.get(), 0, 0], timeline), animate(z, 0, transition),
                animate(scaleX, [scaleX.get(), 1, 1], timeline), animate(scaleY, [scaleY.get(), 1, 1], timeline),
                animate(rotation, [rotation.get(), 0, 0], timeline), animate(openness, [0, 0, 1], timeline),
                animate(cameraX, flight.centerX, transition), animate(cameraY, flight.centerY, transition), animate(perspective, 2200, transition))
        } else if (phase === 'closing-cover' || phase === 'opening-cover') {
            const closing = phase === 'closing-cover'
            animations.push(animate(x, closing ? flight.closedX : 0, transition), animate(y, 0, transition), animate(z, 0, transition),
                animate(scaleX, 1, transition), animate(scaleY, 1, transition), animate(rotation, 0, transition), animate(openness, closing ? 0 : 1, transition))
        } else if (phase === 'returning') {
            animations.push(animate(x, flight.x, transition), animate(y, flight.y, transition), animate(z, flight.z, transition),
                animate(scaleX, flight.scaleX, transition), animate(scaleY, flight.scaleY, transition),
                animate(rotation, flight.rotation, transition), animate(openness, 0, transition),
                animate(cameraX, flight.cameraX, transition), animate(cameraY, flight.cameraY, transition), animate(perspective, 1200, transition))
        } else {
            x.set(flight.closedX); y.set(0); z.set(0); scaleX.set(1); scaleY.set(1); rotation.set(0); openness.set(0)
            return
        }
        let cancelled = false
        Promise.all(animations).then(() => { if (!cancelled) onComplete(phase) })
        return () => { cancelled = true; animations.forEach(animation => animation.stop()) }
    }, [flight, phase, backCover, reducedMotion, onComplete, siteHref, x, y, z, scaleX, scaleY, rotation, openness, cameraX, cameraY, perspective])

    const covering = phase !== 'reading'
    const closed = phase === 'front-cover' || phase === 'back-cover'
    return <motion.div ref={mount} className={styles.presentationMount} data-book-state={phase} style={{ perspective, perspectiveOrigin }}>
        {flight && <motion.div className={`${styles.presentationAssembly} ${covering ? styles.introAssembly : ''} ${backCover ? styles.backAssembly : ''}`}
            style={{ transformOrigin: narrow ? (backCover ? 'right center' : 'left center') : 'center center', transform }}>
            {/* Keep page textures composited during 3D turns to avoid blank pages in WebKit. */}
            <motion.div className={styles.readerPages} style={{ opacity: covering ? paperOpacity : 1 }} aria-hidden={phase === 'front-cover' || phase === 'back-cover' || phase === 'returning' || undefined}>{children}</motion.div>
            <motion.div data-book-cover className={`${styles.presentationCover} ${backCover ? styles.backCover : ''} ${narrow ? styles.mobileCover : ''}`}
                style={{ '--depth': `${flight.depth}px`, rotateY: coverAngle, opacity: covering ? 1 : 0, pointerEvents: closed ? 'auto' : 'none' } as MotionStyle} aria-hidden={!closed || undefined}>
                <BookFaces opening={hinged} inside={inside} backCover={backCover} artwork={artwork} />
                {closed && (siteHref ? <a className={styles.closedCoverOpen} href={siteHref} aria-label="Open Building a Storage Network site" /> : <button type="button" className={styles.closedCoverOpen} onClick={onOpen} aria-label={`Open ${backCover ? 'back' : 'front'} cover`} />)}
            </motion.div>
        </motion.div>}
    </motion.div>
}
