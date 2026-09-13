'use client'

import { useCallback, useRef, useState } from 'react'
import BookReader from './book-reader'
import StorageBookPreview from './storage-book-preview'
import { STORAGE_BOOK, storageBookArtwork } from './storage-book-art'
import { AnimatePresence } from 'framer-motion'
import { BOOK } from './book-pages.mjs'
import { BookFaces, type ShelfOrigin } from './book-model'
import styles from './bookshelf.module.css'

function ShelfBook({ storage = false }: { storage?: boolean }) {
    const [open, setOpen] = useState(false)
    const [pulled, setPulled] = useState(false)
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
        }
    }, [])
    const title = storage ? STORAGE_BOOK.title : BOOK.title
    const Preview = storage ? StorageBookPreview : BookReader
    const close = () => { returningFocus.current = true; setPulled(false); setOpen(false) }
    return <>
        <button ref={trigger} type="button" className={`${styles.bookButton} ${storage ? styles.secondBook : ''} ${pulled ? styles.pulled : ''} ${open ? styles.away : ''}`}
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
            <span ref={book} className={styles.book} data-book-cover><BookFaces artwork={storage ? storageBookArtwork() : undefined} /></span>
        </button>
        <AnimatePresence onExitComplete={() => trigger.current?.focus({ preventScroll: true })}>
            {open && origin && <Preview origin={origin} getShelfOrigin={getShelfOrigin} onClose={close} />}
        </AnimatePresence>
    </>
}

export default function Bookshelf() {
    return <div className={styles.shelf}>
        <div className={styles.lighting} aria-hidden="true" />
        <div className={styles.backPanel} aria-hidden="true" />
        <div className={styles.floor} aria-hidden="true" />
        <ShelfBook />
        <ShelfBook storage />
        <div className={`${styles.side} ${styles.leftSide}`} aria-hidden="true" />
        <div className={`${styles.side} ${styles.rightSide}`} aria-hidden="true" />
        <div className={`${styles.sideCap} ${styles.leftCap}`} aria-hidden="true" />
        <div className={`${styles.sideCap} ${styles.rightCap}`} aria-hidden="true" />
        <div className={styles.plank} aria-hidden="true" />
        <div className={styles.shelfShadow} aria-hidden="true" />
    </div>
}
