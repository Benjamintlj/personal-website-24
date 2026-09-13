import Image from 'next/image'
import type { ReactNode } from 'react'
import { BOOK } from './book-pages.mjs'
import styles from './book-model.module.css'

export type ShelfOrigin = { left: number; top: number; height: number }

/** The cover is at z=0; the pages and spine sit behind it. */
export function BookFaces({ opening = false, inside, backCover = false }: { opening?: boolean; inside?: ReactNode; backCover?: boolean }) {
    return <>
        <span className={`${styles.back} ${opening ? styles.inside : ''}`}>
            {!opening && <Image src={`${BOOK.assetRoot}/back-cover.webp`} alt="" width={1440} height={1989} unoptimized />}
            {opening && inside}
        </span>
        {!opening && <>
            <span className={styles.paperEdge} />
            <span className={styles.topEdge} />
            <span className={styles.spine}><Image src={`${BOOK.assetRoot}/spine.webp`} alt="" width={94} height={1989} unoptimized /></span>
        </>}
        <span className={styles.front}><Image src={`${BOOK.assetRoot}/${backCover ? 'back' : 'front'}-cover.webp`} alt={backCover ? 'Back cover' : 'Final Year Project, NTU — Benjamin Lewis-Jones'} width={1440} height={1989} unoptimized /></span>
    </>
}
