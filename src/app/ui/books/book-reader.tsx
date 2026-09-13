'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { BOOK, adjacentPage, bookPage, spreadPages } from './book-pages.mjs'
import BookPresentation from './book-presentation'
import type { ShelfOrigin } from './book-model'
import styles from './book-reader.module.css'

type Flip = { from: number; to: number; direction: number }

function Page({ index, decorative = false }: { index: number | null; decorative?: boolean }) {
    const page = index === null ? { image: null, text: null, label: 'White endpaper' } : bookPage(index)
    const [text, setText] = useState('')
    useEffect(() => {
        setText('')
        if (!page.text || decorative) return
        const abort = new AbortController()
        fetch(page.text, { signal: abort.signal }).then(response => response.ok ? response.json() : null)
            .then(content => { if (content) setText(content.text) }).catch(() => {})
        return () => abort.abort()
    }, [page.text, decorative])
    return <div className={styles.page} aria-hidden={decorative || undefined}>
        {page.image && <Image src={page.image} alt={decorative ? '' : page.label} width={1440} height={2037} unoptimized loading="eager" draggable={false} />}
        {!page.image && <span className="sr-only">{page.label}</span>}
        {!!text && <span className="sr-only">{text}</span>}
    </div>
}

function Arrow({ direction }: { direction: 'left' | 'right' }) {
    return <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d={direction === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} /></svg>
}

export default function BookReader({ origin, onClose }: { origin: ShelfOrigin; onClose: () => void }) {
    const reducedMotion = !!useReducedMotion()
    const [narrow, setNarrow] = useState(() => window.matchMedia('(max-width: 760px)').matches)
    const [page, setPage] = useState(BOOK.firstContentPage)
    const [draft, setDraft] = useState(String(BOOK.firstContentPage + 1))
    const [flip, setFlip] = useState<Flip | null>(null)
    const [presenting, setPresenting] = useState(true)
    const [zoomed, setZoomed] = useState(false)
    const [closing, setClosing] = useState(false)
    const dialog = useRef<HTMLDivElement>(null)
    const closeButton = useRef<HTMLButtonElement>(null)
    const touch = useRef<{ x: number; y: number } | null>(null)
    const busy = useRef(true)
    const closeCallback = useRef(onClose)
    closeCallback.current = onClose

    const close = useCallback(() => {
        if (closing) return
        busy.current = true
        setClosing(true)
        setFlip(null)
        if (reducedMotion || presenting) closeCallback.current()
    }, [closing, reducedMotion, presenting])

    const opened = useCallback(() => { setPresenting(false); busy.current = false }, [])

    const goTo = useCallback((target: number) => {
        if (busy.current || closing) return
        const next = Math.max(0, Math.min(BOOK.lastPage, Math.round(target)))
        if (!Number.isFinite(next) || next === page) return
        if (reducedMotion || zoomed) { setPage(next); return }
        busy.current = true
        setFlip({ from: page, to: next, direction: next > page ? 1 : -1 })
    }, [page, closing, reducedMotion, zoomed])

    const turn = useCallback((direction: number) => goTo(adjacentPage(page, direction, narrow)), [goTo, page, narrow])
    const actions = useRef({ close, turn, goTo })
    actions.current = { close, turn, goTo }

    useEffect(() => {
        const media = window.matchMedia('(max-width: 760px)')
        const resize = () => setNarrow(media.matches)
        media.addEventListener('change', resize)
        return () => media.removeEventListener('change', resize)
    }, [])

    useEffect(() => {
        const previous = document.activeElement as HTMLElement | null
        const background = Array.from(document.querySelectorAll<HTMLElement>('main, nav'))
        const inert = background.map(element => element.inert)
        background.forEach(element => { element.inert = true })
        const oldOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        closeButton.current?.focus({ preventScroll: true })
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') { event.preventDefault(); actions.current.close(); return }
            if (event.key === 'Tab') {
                const elements = Array.from(dialog.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input, [tabindex="0"]') ?? []).filter(element => element.tabIndex >= 0 && element.getClientRects().length > 0)
                const first = elements[0], last = elements[elements.length - 1]
                if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
                else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
                return
            }
            if ((event.target as HTMLElement)?.tagName === 'INPUT') return
            if (['ArrowLeft', 'PageUp', 'ArrowRight', 'PageDown', 'Home', 'End'].includes(event.key)) event.preventDefault()
            if (event.key === 'ArrowLeft' || event.key === 'PageUp') actions.current.turn(-1)
            if (event.key === 'ArrowRight' || event.key === 'PageDown') actions.current.turn(1)
            if (event.key === 'Home') actions.current.goTo(0)
            if (event.key === 'End') actions.current.goTo(BOOK.lastPage)
        }
        document.addEventListener('keydown', onKey)
        return () => {
            document.removeEventListener('keydown', onKey)
            document.body.style.overflow = oldOverflow
            background.forEach((element, index) => { element.inert = inert[index] })
            previous?.focus({ preventScroll: true })
        }
    }, [])

    useEffect(() => {
        setDraft(String(page + 1))
        const nearby = [...spreadPages(adjacentPage(page, 1, narrow), narrow), ...spreadPages(adjacentPage(page, -1, narrow), narrow)]
        nearby.forEach(index => { const source = bookPage(index).image; if (source) { const image = new window.Image(); image.src = source } })
    }, [page, narrow])

    const commitDraft = () => {
        const value = Number(draft)
        if (draft.trim() && Number.isFinite(value)) {
            const next = Math.max(0, Math.min(BOOK.lastPage, Math.round(value) - 1))
            setDraft(String(next + 1))
            goTo(next)
        } else setDraft(String(page + 1))
    }
    const current = spreadPages(page, narrow)
    const from = spreadPages(flip?.from ?? page, narrow)
    const to = spreadPages(flip?.to ?? page, narrow)
    const forward = !flip || flip.direction > 0
    const single = narrow || (!flip && !closing && current.length === 1)
    let base: (number | null)[] = current
    if (flip) {
        if (narrow) base = to
        else if (forward) base = [from.length === 2 ? from[0] : null, to.length === 2 ? to[1] : null]
        else base = [to.length === 2 ? to[0] : null, from.length === 2 ? from[1] : null]
    }
    if (closing && !narrow && base.length === 1) base = [null, ...base]
    const frontIndex = flip ? (forward ? from[from.length - 1] : from[0]) : null
    const backIndex = flip ? (forward ? to[0] : to[to.length - 1]) : null

    return createPortal(<motion.div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="fyp-reader-title"
        className={`${styles.reader} ${zoomed ? styles.zoomed : ''} ${presenting ? styles.presenting : ''}`} initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .25 }}
        onClick={event => { if (event.target === event.currentTarget) close() }}>
        <motion.div className={styles.backdrop} aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reducedMotion ? 0 : .6 }} />
        <header className={styles.header}>
            <h2 id="fyp-reader-title" className="sr-only">{BOOK.title}</h2>
            <button ref={closeButton} type="button" className={styles.close} onClick={close} aria-label="Close book">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
        </header>
        <div className={styles.viewport} onClick={event => { if (event.target === event.currentTarget) close() }}>
            <motion.div layout className={`${styles.stage} ${single ? styles.single : ''}`}
                style={{ '--zoom': zoomed ? 1.8 : 1 } as CSSProperties}
                initial={false}
                animate={{ y: 0, scale: 1, rotateX: 0 }} exit={{ y: reducedMotion ? 0 : 65, scale: reducedMotion ? 1 : .65, opacity: 0 }}
                transition={{ duration: reducedMotion ? 0 : .45, ease: [.2, .8, .2, 1] }}
                onPointerDown={event => { if (!zoomed && event.pointerType !== 'mouse') touch.current = { x: event.clientX, y: event.clientY } }}
                onPointerUp={event => {
                    const start = touch.current
                    touch.current = null
                    if (start && Math.abs(event.clientX - start.x) > 45 && Math.abs(event.clientY - start.y) < 80) turn(event.clientX < start.x ? 1 : -1)
                }}>
                <BookPresentation origin={origin} narrow={narrow} reducedMotion={reducedMotion} active={presenting} onOpened={opened}>
                    <div className={styles.spread}>
                        {base.map((index, side) => <div key={side} className={`${styles.pageSlot} ${side === 0 ? styles.left : styles.right}`}><Page index={index} /></div>)}
                    </div>
                    {!single && <div className={styles.gutter} aria-hidden="true" />}
                    {flip && <motion.div key={`${flip.from}-${flip.to}`} className={`${styles.turnSheet} ${forward ? styles.forward : styles.backward} ${narrow ? styles.wholeSheet : ''}`}
                        initial={{ rotateY: 0 }} animate={{ rotateY: forward ? -180 : 180 }}
                        transition={{ duration: reducedMotion ? 0 : .65, ease: [.35, .05, .3, 1] }}
                        onAnimationComplete={() => { setPage(flip.to); setFlip(null); busy.current = false }}>
                        <div className={styles.sheetFront}><Page index={frontIndex} decorative /></div>
                        <div className={styles.sheetBack}><Page index={backIndex} decorative /></div>
                    </motion.div>}
                    {closing && <motion.div className={`${styles.turnSheet} ${styles.forward} ${narrow ? styles.wholeSheet : ''}`}
                        initial={{ rotateY: narrow ? -90 : -180 }} animate={{ rotateY: 0 }} transition={{ duration: .5, ease: [.3, .1, .4, 1] }} onAnimationComplete={() => closeCallback.current()}>
                        <div className={styles.sheetFront}><Page index={0} decorative /></div>
                        <div className={styles.sheetBack}><Page index={null} decorative /></div>
                    </motion.div>}
                    {!zoomed && !flip && !closing && <>
                        <button className={`${styles.pageEdge} ${styles.previousEdge}`} tabIndex={-1} aria-hidden="true" disabled={page === 0} onClick={() => turn(-1)} />
                        <button className={`${styles.pageEdge} ${styles.nextEdge}`} tabIndex={-1} aria-hidden="true" disabled={page === BOOK.lastPage} onClick={() => turn(1)} />
                    </>}
                </BookPresentation>
            </motion.div>
        </div>
        <footer className={styles.toolbar}>
            {presenting ? <span className={styles.closedControls} aria-hidden="true" /> : <>
            <button type="button" onClick={() => turn(-1)} disabled={page === 0 || !!flip || closing} aria-label="Previous page"><Arrow direction="left" /></button>
            <label className={styles.pageCounter}><span>Page</span><input aria-label="Go to page" type="number" inputMode="numeric" min="1" max={BOOK.pageCount} value={draft} onChange={event => setDraft(event.target.value)} onBlur={commitDraft} onKeyDown={event => { if (event.key === 'Enter') { commitDraft(); event.currentTarget.blur() } }} disabled={!!flip || closing} /><span>of {BOOK.pageCount}</span></label>
            <button type="button" onClick={() => turn(1)} disabled={page === BOOK.lastPage || !!flip || closing} aria-label="Next page"><Arrow direction="right" /></button>
            <span className={styles.divider} aria-hidden="true" />
            <button type="button" onClick={() => setZoomed(value => !value)} disabled={!!flip || closing} aria-label={zoomed ? 'Fit book to screen' : 'Zoom into book'} aria-pressed={zoomed}>
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="10" cy="10" r="6.5" /><path d="M15 15l6 6M7 10h6" />{!zoomed && <path d="M10 7v6" />}</svg>
            </button>
            </>}
        </footer>
        <p className="sr-only" aria-live="polite">{!presenting ? `${bookPage(page).label}. Page ${page + 1} of ${BOOK.pageCount}.` : 'Front cover. Open the book to read.'}</p>
    </motion.div>, document.body)
}
