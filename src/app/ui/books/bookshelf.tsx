'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import BookReader from './book-reader'
import StorageBookPreview from './storage-book-preview'
import GlassShelf from './glass-shelf'
import { STORAGE_BOOK, storageBookArtwork } from './storage-book-art'
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform, type MotionStyle } from 'framer-motion'
import { BOOK } from './book-pages.mjs'
import { BookFaces, type ShelfOrigin } from './book-model'
import { bookRotation, SHELF_REST_ANGLE, shelfPose } from './book-motion'
import styles from './bookshelf.module.css'

function ShelfBook({ storage = false }: { storage?: boolean }) {
    const [open, setOpen] = useState(false)
    const [pulled, setPulled] = useState(false)
    const [returningOnShelf, setReturningOnShelf] = useState(false)
    const reducedMotion = useReducedMotion()
    // Both books share one 3D scene so their actual surfaces determine occlusion.
    const travel = useMotionValue(0)
    const bookHeight = useMotionValue(297)
    const clearance = useMotionValue(245)
    const cameraHeight = useMotionValue(148.5)
    const pose = useTransform([travel, bookHeight, clearance, cameraHeight], values => {
        const [progress, height, distance, elevation] = values as number[]
        return shelfPose(progress, height, distance, !storage, elevation)
    })
    const transform = useTransform(pose, value => `translate3d(${value.x}px, ${value.y}px, ${value.z}px) ${bookRotation(value.rotation, value.pitch)}`)
    useEffect(() => {
        const target = pulled && !open ? 1 : 0
        if (open || reducedMotion) { travel.set(target); return }
        const animation = animate(travel, target, { duration: 1.15 * Math.abs(target - travel.get()), ease: 'linear' })
        return () => animation.stop()
    }, [storage, pulled, open, reducedMotion, travel])
    const returningFocus = useRef(false)
    const trigger = useRef<HTMLButtonElement>(null)
    const book = useRef<HTMLSpanElement>(null)
    const [origin, setOrigin] = useState<ShelfOrigin | null>(null)
    useLayoutEffect(() => {
        const measure = () => {
            const style = getComputedStyle(book.current!)
            bookHeight.set(parseFloat(style.height))
            clearance.set(parseFloat(style.getPropertyValue('--pull-depth')))
            cameraHeight.set(parseFloat(style.getPropertyValue('--camera-height')))
        }
        measure()
        const resize = new ResizeObserver(measure)
        resize.observe(book.current!)
        return () => resize.disconnect()
    }, [bookHeight, clearance, cameraHeight])
    const getShelfOrigin = useCallback((): ShelfOrigin => {
        const bounds = trigger.current!.getBoundingClientRect()
        const style = getComputedStyle(book.current!)
        const scene = trigger.current!.closest<HTMLElement>('[data-book-scene]')!
        const sceneBounds = scene.getBoundingClientRect()
        const [cameraX, cameraY] = getComputedStyle(scene).perspectiveOrigin.split(' ').map(parseFloat)
        const elevation = bounds.bottom - sceneBounds.top - cameraY
        const transform = new DOMMatrixReadOnly(style.transform)
        const progress = parseFloat(style.getPropertyValue('--pickup-progress')) || 0
        const renderedPose = shelfPose(progress, parseFloat(style.height), parseFloat(style.getPropertyValue('--pull-depth')), !storage, elevation)
        return {
            left: bounds.left + parseFloat(style.left), top: bounds.top,
            width: parseFloat(style.width), height: parseFloat(style.height), depth: parseFloat(style.getPropertyValue('--depth')),
            cameraX: sceneBounds.left + cameraX, cameraY: sceneBounds.top + cameraY,
            cameraHeight: elevation,
            liftX: transform.m41, liftY: transform.m42, liftZ: transform.m43,
            rotation: renderedPose.rotation,
            pitch: renderedPose.pitch,
            progress,
            restRotation: SHELF_REST_ANGLE,
            clearance: parseFloat(style.getPropertyValue('--pull-depth')),
            withdrawFirst: !storage,
        }
    }, [storage])
    const title = storage ? STORAGE_BOOK.title : BOOK.title
    const Preview = storage ? StorageBookPreview : BookReader
    const onShelfReturn = useCallback((progress: number) => {
        travel.set(progress)
        setReturningOnShelf(true)
    }, [travel])
    const close = () => { returningFocus.current = true; setPulled(false); setOpen(false); setReturningOnShelf(false) }
    return <>
        <motion.button ref={trigger} type="button" className={`${styles.bookButton} ${storage ? styles.secondBook : ''} ${open && !returningOnShelf ? styles.away : ''}`}
            aria-label={`Open ${title}`} aria-haspopup="dialog"
            onPointerEnter={event => { if (event.pointerType !== 'touch' && !open) { returningFocus.current = false; setPulled(true) } }}
            onPointerLeave={() => setPulled(false)}
            onFocus={event => { if (!returningFocus.current && event.currentTarget.matches(':focus-visible')) setPulled(true) }}
            onBlur={() => { returningFocus.current = false; setPulled(false) }}
            onClick={() => {
                setOrigin(getShelfOrigin())
                setReturningOnShelf(false)
                setPulled(false)
                setOpen(true)
            }}>
            <motion.span ref={book} className={styles.book} style={{ transform, '--pickup-progress': travel } as MotionStyle} data-book-cover><BookFaces artwork={storage ? storageBookArtwork() : undefined} /></motion.span>
        </motion.button>
        <AnimatePresence onExitComplete={() => trigger.current?.focus({ preventScroll: true })}>
            {open && origin && <Preview origin={origin} getShelfOrigin={getShelfOrigin} onShelfReturn={onShelfReturn} onClose={close} />}
        </AnimatePresence>
    </>
}

export default function Bookshelf() {
    return <div className={styles.shelf}>
        <div className={styles.bookScene} data-book-scene>
            <div className={styles.bookSpace}>
                <ShelfBook />
                <ShelfBook storage />
            </div>
        </div>
        <GlassShelf />
    </div>
}
