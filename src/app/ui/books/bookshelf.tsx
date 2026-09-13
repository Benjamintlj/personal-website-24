'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import BookReader from './book-reader'
import StorageBookPreview from './storage-book-preview'
import { STORAGE_BOOK, storageBookArtwork } from './storage-book-art'
import { AnimatePresence, animate, motion, useMotionTemplate, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { BOOK } from './book-pages.mjs'
import { BookFaces, type ShelfOrigin } from './book-model'
import styles from './bookshelf.module.css'

const easeSegment = (value: number) => {
    const t = Math.max(0, Math.min(1, value))
    return t * t * (3 - 2 * t)
}

function ShelfBook({ storage = false }: { storage?: boolean }) {
    const [open, setOpen] = useState(false)
    const [pulled, setPulled] = useState(false)
    const reducedMotion = useReducedMotion()
    // One reversible path keeps the left book clear even when hover is interrupted.
    const travel = useMotionValue(0)
    const withdrawal = useTransform(travel, value => easeSegment(value / .55))
    const turn = useTransform(travel, value => easeSegment((value - .55) / .45))
    const angle = useTransform(turn, [0, 1], [90, 8])
    const leftTransform = useMotionTemplate`translate3d(calc(8px * ${turn}), calc(-8px * ${withdrawal}), calc(var(--pull-depth) * ${withdrawal})) rotateY(${angle}deg)`
    useEffect(() => {
        if (storage) return
        const target = pulled && !open ? 1 : 0
        if (open || reducedMotion) { travel.set(target); return }
        const animation = animate(travel, target, { duration: 1.05 * Math.abs(target - travel.get()), ease: 'linear' })
        return () => animation.stop()
    }, [storage, pulled, open, reducedMotion, travel])
    const returningFocus = useRef(false)
    const trigger = useRef<HTMLButtonElement>(null)
    const book = useRef<HTMLSpanElement>(null)
    const [origin, setOrigin] = useState<ShelfOrigin | null>(null)
    const getShelfOrigin = useCallback((): ShelfOrigin => {
        const bounds = trigger.current!.getBoundingClientRect()
        const style = getComputedStyle(book.current!)
        const transform = new DOMMatrixReadOnly(style.transform)
        return {
            left: bounds.left + book.current!.offsetLeft, top: bounds.top,
            width: parseFloat(style.width), height: parseFloat(style.height), depth: parseFloat(style.getPropertyValue('--depth')),
            cameraX: bounds.left + bounds.width / 2, cameraY: bounds.top + bounds.height / 2,
            liftX: transform.m41, liftY: transform.m42, liftZ: transform.m43,
            rotation: Math.atan2(-transform.m13, transform.m11) * 180 / Math.PI,
            restRotation: parseFloat(style.getPropertyValue('--rest-angle')),
            clearance: storage ? 0 : parseFloat(style.getPropertyValue('--pull-depth')),
        }
    }, [storage])
    const title = storage ? STORAGE_BOOK.title : BOOK.title
    const Preview = storage ? StorageBookPreview : BookReader
    const close = () => { returningFocus.current = true; setPulled(false); setOpen(false) }
    return <>
        <button ref={trigger} type="button" className={`${styles.bookButton} ${storage ? styles.secondBook : styles.firstBook} ${pulled ? styles.pulled : ''} ${open ? styles.away : ''}`}
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
            <motion.span ref={book} className={styles.book} style={storage ? undefined : { transform: leftTransform }} data-book-cover><BookFaces artwork={storage ? storageBookArtwork() : undefined} /></motion.span>
        </button>
        <AnimatePresence onExitComplete={() => trigger.current?.focus({ preventScroll: true })}>
            {open && origin && <Preview origin={origin} getShelfOrigin={getShelfOrigin} onClose={close} />}
        </AnimatePresence>
    </>
}

export default function Bookshelf() {
    return <div className={styles.shelf}>
        <div className={styles.cabinet} aria-hidden="true">
            <div className={styles.backPanel} />
            <div className={styles.floor} />
            <div className={styles.ceiling} />
            <div className={`${styles.side} ${styles.leftSide}`} />
            <div className={`${styles.side} ${styles.rightSide}`} />
            <div className={`${styles.sideCap} ${styles.leftCap}`} />
            <div className={`${styles.sideCap} ${styles.rightCap}`} />
            <div className={styles.topRail} />
        </div>
        <ShelfBook />
        <ShelfBook storage />
        <div className={styles.plank} aria-hidden="true" />
        <div className={styles.shelfShadow} aria-hidden="true" />
    </div>
}
