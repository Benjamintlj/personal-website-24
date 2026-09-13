'use client'

import { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { BOOK } from './book-pages.mjs'
import { BookFaces, type ShelfOrigin } from './book-model'
import styles from './bookshelf.module.css'

const BookReader = dynamic(() => import('./book-reader'), { ssr: false })

export default function Bookshelf() {
    const [open, setOpen] = useState(false)
    const trigger = useRef<HTMLButtonElement>(null)
    const book = useRef<HTMLSpanElement>(null)
    const [origin, setOrigin] = useState<ShelfOrigin>({ left: 0, top: 0, height: 297 })
    const reducedMotion = useReducedMotion()
    return <>
        <div className={styles.shelf}>
            <div className={styles.lighting} aria-hidden="true" />
            <motion.button ref={trigger} type="button" className={styles.bookButton}
                aria-label={`Open ${BOOK.title}`} aria-haspopup="dialog"
                onClick={() => {
                    const bounds = book.current!.getBoundingClientRect()
                    setOrigin({ left: bounds.left, top: bounds.top, height: bounds.height })
                    setOpen(true)
                }} animate={{ opacity: open ? 0 : 1 }}
                transition={{ duration: reducedMotion ? 0 : .35 }}>
                <span ref={book} className={styles.book}><BookFaces /></span>
            </motion.button>
            <div className={styles.plank} aria-hidden="true" />
            <div className={styles.shelfShadow} aria-hidden="true" />
        </div>
        <AnimatePresence onExitComplete={() => trigger.current?.focus({ preventScroll: true })}>
            {open && <BookReader origin={origin} onClose={() => setOpen(false)} />}
        </AnimatePresence>
    </>
}
