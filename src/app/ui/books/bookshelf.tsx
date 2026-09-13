'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import BookReader from './book-reader'
import StorageBookPreview from './storage-book-preview'
import { STORAGE_BOOK, storageBookArtwork } from './storage-book-art'
import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform, type MotionStyle } from 'framer-motion'
import { BOOK } from './book-pages.mjs'
import { BookFaces, type ShelfOrigin } from './book-model'
import { shelfPose } from './book-motion'
import styles from './bookshelf.module.css'

function ShelfBook({ storage = false }: { storage?: boolean }) {
    const [open, setOpen] = useState(false)
    const [pulled, setPulled] = useState(false)
    const reducedMotion = useReducedMotion()
    const [raised, setRaised] = useState(false)
    // Keep both the pose and drawing order continuous throughout an interrupted return.
    const travel = useMotionValue(0)
    const bookHeight = useMotionValue(297)
    const clearance = useMotionValue(245)
    const pose = useTransform([travel, bookHeight, clearance], values => {
        const [progress, height, distance] = values as number[]
        return shelfPose(progress, height, distance, !storage)
    })
    const transform = useTransform(pose, value => `translate3d(${value.x}px, ${value.y}px, ${value.z}px) rotateX(${value.pitch}deg) rotateY(${value.rotation}deg)`)
    const layer = useTransform(pose, value => value.z > .001 ? 10 + Math.round(value.z) : 3)
    useMotionValueEvent(travel, 'change', value => setRaised(value > .00001))
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
        }
        measure()
        const resize = new ResizeObserver(measure)
        resize.observe(book.current!)
        return () => resize.disconnect()
    }, [bookHeight, clearance])
    const getShelfOrigin = useCallback((): ShelfOrigin => {
        const bounds = trigger.current!.getBoundingClientRect()
        const style = getComputedStyle(book.current!)
        const transform = new DOMMatrixReadOnly(style.transform)
        return {
            left: bounds.left + book.current!.offsetLeft, top: bounds.top,
            width: parseFloat(style.width), height: parseFloat(style.height), depth: parseFloat(style.getPropertyValue('--depth')),
            cameraX: bounds.left + bounds.width / 2, cameraY: bounds.top + bounds.height / 2,
            liftX: transform.m41, liftY: transform.m42, liftZ: transform.m43,
            rotation: Math.atan2(transform.m31, transform.m11) * 180 / Math.PI,
            pitch: Math.atan2(transform.m23, transform.m22) * 180 / Math.PI,
            progress: parseFloat(style.getPropertyValue('--pickup-progress')) || 0,
            restRotation: parseFloat(style.getPropertyValue('--rest-angle')),
            clearance: parseFloat(style.getPropertyValue('--pull-depth')),
            withdrawFirst: !storage,
        }
    }, [storage])
    const title = storage ? STORAGE_BOOK.title : BOOK.title
    const Preview = storage ? StorageBookPreview : BookReader
    const close = () => { returningFocus.current = true; setPulled(false); setOpen(false) }
    return <>
        <motion.button ref={trigger} type="button" style={{ zIndex: layer }} className={`${styles.bookButton} ${storage ? styles.secondBook : ''} ${raised || pulled ? styles.raised : ''} ${open ? styles.away : ''}`}
            aria-label={`Open ${title}`} aria-haspopup="dialog"
            onPointerEnter={event => { if (event.pointerType !== 'touch' && !open) { returningFocus.current = false; setPulled(true) } }}
            onPointerLeave={() => setPulled(false)}
            onFocus={event => { if (!returningFocus.current && event.currentTarget.matches(':focus-visible')) setPulled(true) }}
            onBlur={() => { returningFocus.current = false; setPulled(false) }}
            onClick={() => {
                setOrigin(getShelfOrigin())
                setPulled(false)
                setOpen(true)
            }}>
            <motion.span ref={book} className={styles.book} style={{ transform, '--pickup-progress': travel } as MotionStyle} data-book-cover><BookFaces artwork={storage ? storageBookArtwork() : undefined} /></motion.span>
        </motion.button>
        <AnimatePresence onExitComplete={() => trigger.current?.focus({ preventScroll: true })}>
            {open && origin && <Preview origin={origin} getShelfOrigin={getShelfOrigin} onClose={close} />}
        </AnimatePresence>
    </>
}

export default function Bookshelf() {
    return <div className={styles.shelf}>
        <ShelfBook />
        <ShelfBook storage />
        <div className={styles.plank} aria-hidden="true" />
        <div className={styles.shelfShadow} aria-hidden="true" />
    </div>
}
