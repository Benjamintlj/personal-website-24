'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { motion, useReducedMotion } from 'framer-motion'
import BookPresentation, { type BookPhase } from './book-presentation'
import type { ShelfOrigin } from './book-model'
import { STORAGE_BOOK, storageBookArtwork } from './storage-book-art'
import styles from './book-reader.module.css'
import coverStyles from './storage-book.module.css'

export default function StorageBookPreview({ origin, getShelfOrigin, onClose }: {
    origin: ShelfOrigin; getShelfOrigin: () => ShelfOrigin; onClose: () => void
}) {
    const [phase, setPhase] = useState<BookPhase>('arriving')
    const reducedMotion = !!useReducedMotion()
    const dialog = useRef<HTMLDivElement>(null)
    const closeButton = useRef<HTMLButtonElement>(null)
    const close = useCallback(() => setPhase('returning'), [])
    const onCloseRef = useRef(onClose)
    onCloseRef.current = onClose
    const completed = useCallback((finished: BookPhase) => {
        if (finished === 'returning') onCloseRef.current()
        else setPhase('front-cover')
    }, [])

    useEffect(() => {
        const previous = document.activeElement as HTMLElement | null
        const background = Array.from(document.querySelectorAll<HTMLElement>('main, nav'))
        const inert = background.map(element => element.inert)
        background.forEach(element => { element.inert = true })
        const overflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        closeButton.current?.focus({ preventScroll: true })
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') { event.preventDefault(); close() }
            if (event.key !== 'Tab') return
            const elements = Array.from(dialog.current?.querySelectorAll<HTMLElement>('button, a[href]') ?? [])
                .filter(element => element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden')
            const first = elements[0], last = elements[elements.length - 1]
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
        }
        document.addEventListener('keydown', onKey)
        return () => {
            document.removeEventListener('keydown', onKey)
            document.body.style.overflow = overflow
            background.forEach((element, index) => { element.inert = inert[index] })
            previous?.focus({ preventScroll: true })
        }
    }, [close])

    return createPortal(<motion.div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="storage-preview-title"
        className={`${styles.reader} ${phase !== 'front-cover' ? styles.presenting : ''} ${phase === 'returning' ? styles.returning : ''}`}
        initial={false} exit={{ opacity: 0 }} transition={{ duration: 0 }}
        onClick={event => { if (event.target === event.currentTarget) close() }}>
        <motion.div className={styles.backdrop} aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: phase === 'returning' ? 0 : 1 }} transition={{ duration: reducedMotion ? 0 : .8 }} />
        <header className={styles.header}>
            <h2 id="storage-preview-title" className="sr-only">{STORAGE_BOOK.title}</h2>
            <button ref={closeButton} className={styles.close} type="button" onClick={close} aria-label="Close book">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
        </header>
        <div className={`${styles.viewport} ${coverStyles.previewViewport}`} onClick={event => { if (event.target === event.currentTarget) close() }}>
            <div className={`${styles.stage} ${styles.single} ${coverStyles.previewStage}`} style={{ '--zoom': 1 } as CSSProperties}>
                <BookPresentation origin={origin} getShelfOrigin={getShelfOrigin} narrow reducedMotion={reducedMotion} phase={phase} backCover={false}
                    onComplete={completed} artwork={storageBookArtwork()} siteHref={STORAGE_BOOK.href} />
            </div>
        </div>
        <footer className={coverStyles.siteToolbar} style={{ visibility: phase === 'front-cover' ? 'visible' : 'hidden' }}>
            <a className={coverStyles.openSite} href={STORAGE_BOOK.href}>Continue to site</a>
        </footer>
    </motion.div>, document.body)
}
