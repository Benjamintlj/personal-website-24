'use client'

import { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { BOOK } from './book-pages.mjs'
import styles from './bookshelf.module.css'

const BookReader = dynamic(() => import('./book-reader'), { ssr: false })

export default function Bookshelf() {
    const [open, setOpen] = useState(false)
    const trigger = useRef<HTMLButtonElement>(null)
    const reducedMotion = useReducedMotion()
    return <>
        <div className={styles.shelf}>
            <div className={styles.lighting} aria-hidden="true" />
            <motion.button ref={trigger} type="button" className={styles.bookButton}
                aria-label={`Open ${BOOK.title}`} aria-haspopup="dialog"
                onClick={() => setOpen(true)} animate={{ opacity: open ? .18 : 1 }}
                transition={{ duration: reducedMotion ? 0 : .35 }}>
                <span className={styles.book}>
                    <span className={styles.back}><Image src={`${BOOK.assetRoot}/back-cover.webp`} alt="" width={1440} height={1989} unoptimized /></span>
                    <span className={styles.paperEdge} />
                    <span className={styles.topEdge} />
                    <span className={styles.spine}><Image src={`${BOOK.assetRoot}/spine.webp`} alt="" width={94} height={1989} unoptimized /></span>
                    <span className={styles.front}><Image src={`${BOOK.assetRoot}/front-cover.webp`} alt="Final Year Project, NTU — Benjamin Lewis-Jones" width={1440} height={1989} unoptimized /></span>
                </span>
            </motion.button>
            <div className={styles.plank} aria-hidden="true" />
            <div className={styles.shelfShadow} aria-hidden="true" />
        </div>
        <AnimatePresence onExitComplete={() => trigger.current?.focus({ preventScroll: true })}>
            {open && <BookReader onClose={() => setOpen(false)} />}
        </AnimatePresence>
    </>
}
