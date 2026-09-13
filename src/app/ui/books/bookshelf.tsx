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
            liftY: transform.m42, liftZ: transform.m43,
        }
    }, [])
    const title = storage ? STORAGE_BOOK.title : BOOK.title
    const Preview = storage ? StorageBookPreview : BookReader
    return <>
        <button ref={trigger} type="button" className={`${styles.bookButton} ${storage ? styles.secondBook : ''} ${open ? styles.away : ''}`}
            aria-label={`Open ${title}`} aria-haspopup="dialog"
            onClick={() => {
                setOrigin(getShelfOrigin())
                setOpen(true)
            }}>
            <span ref={book} className={styles.book} data-book-cover><BookFaces artwork={storage ? storageBookArtwork() : undefined} /></span>
        </button>
        <AnimatePresence onExitComplete={() => trigger.current?.focus({ preventScroll: true })}>
            {open && origin && <Preview origin={origin} getShelfOrigin={getShelfOrigin} onClose={() => setOpen(false)} />}
        </AnimatePresence>
    </>
}

export default function Bookshelf() {
    return <div className={styles.shelf}>
        <div className={styles.lighting} aria-hidden="true" />
        <ShelfBook />
        <ShelfBook storage />
        <div className={styles.plank} aria-hidden="true" />
        <div className={styles.shelfShadow} aria-hidden="true" />
    </div>
}
