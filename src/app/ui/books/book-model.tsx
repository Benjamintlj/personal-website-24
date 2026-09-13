import Image from 'next/image'
import type { ReactNode } from 'react'
import { BOOK } from './book-pages.mjs'
import styles from './book-model.module.css'

export type ShelfOrigin = {
    left: number; top: number; width: number; height: number; depth: number
    cameraX: number; cameraY: number; liftX: number; liftY: number; liftZ: number
    rotation: number; restRotation: number
    clearance: number
    pitch: number; progress: number; withdrawFirst: boolean
}
export type BookArtwork = { front: ReactNode; back: ReactNode; spine: ReactNode }

/** Inner linings and three cut edges give each cover board a solid thickness. */
function CoverBoard({ rear = false, dark = false, reverse = false }: { rear?: boolean; dark?: boolean; reverse?: boolean }) {
    return <span className={`${styles.board} ${rear ? styles.rearBoard : ''} ${dark ? styles.darkBoard : ''} ${reverse ? styles.reverseBoard : ''}`} aria-hidden="true">
        <span className={styles.lining} />
        <span className={styles.boardTop} />
        <span className={styles.boardBottom} />
        <span className={styles.boardForeEdge} />
    </span>
}

/** The cover is at z=0; the pages and spine sit behind it. */
export function BookFaces({ opening = false, inside, backCover = false, artwork }: { opening?: boolean; inside?: ReactNode; backCover?: boolean; artwork?: BookArtwork }) {
    return <>
        <span className={`${styles.back} ${opening ? styles.inside : ''}`} aria-hidden="true">
            {!opening && (artwork ? (backCover ? artwork.front : artwork.back) : <Image src={`${BOOK.assetRoot}/${backCover ? 'front' : 'back'}-cover.webp`} alt="" width={1440} height={1989} unoptimized />)}
            {opening && inside}
        </span>
        {!opening && <>
            <CoverBoard dark={!!artwork} reverse={backCover} />
            <CoverBoard rear dark={!!artwork} reverse={backCover} />
            <span className={`${styles.paperEdge} ${backCover ? styles.reversePaperEdge : ''}`} />
            <span className={styles.topEdge} />
            <span className={styles.bottomEdge} />
            <span className={`${styles.spine} ${backCover ? styles.reverseSpine : ''}`}>{artwork?.spine ?? <Image src={`${BOOK.assetRoot}/spine.webp`} alt="" width={94} height={1989} unoptimized />}</span>
        </>}
        <span className={`${styles.front} ${backCover ? styles.reverseFront : ''}`}>{artwork ? (backCover ? artwork.back : artwork.front) : <Image src={`${BOOK.assetRoot}/${backCover ? 'back' : 'front'}-cover.webp`} alt={backCover ? 'Back cover' : 'Final Year Project, NTU — Benjamin Lewis-Jones'} width={1440} height={1989} unoptimized />}</span>
    </>
}
