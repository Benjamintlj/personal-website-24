'use client'

import { useId } from 'react'
import type { BookArtwork } from './book-model'
import styles from './storage-book.module.css'

export const STORAGE_BOOK = {
    title: 'Building a Storage Network',
    author: 'Ben Lewis-Jones',
    href: '/building-a-storage-network/index.html',
}

function Anchor({ stroke }: { stroke: string }) {
    return <g fill="none" stroke={stroke} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="215" cy="330" r="16" strokeWidth="6" />
        <path d="M215 346v128M179 368h72M147 406a68 68 0 0 0 136 0" strokeWidth="8" />
        <path d="m133 424 14-20 15 17m106 0 15-17 14 20" strokeWidth="7" />
    </g>
}

function StorageCover({ side }: { side: 'front' | 'back' | 'spine' }) {
    const id = useId().replace(/:/g, '')
    const gold = '#c6a15b'
    if (side === 'spine') return <svg className={styles.art} viewBox="0 0 28 594" preserveAspectRatio="none" aria-hidden="true">
        <path fill="#101111" d="M0 0h28v594H0z" />
        <path d="M4 14h20M4 580h20" stroke={gold} strokeWidth=".7" />
        <g transform="translate(14 35) rotate(90)" fill={gold} fontFamily="Georgia, 'Times New Roman', serif" fontSize="14">
            <text x="0" y="0" dominantBaseline="middle">Building a Storage Network</text>
            <text x="521" y="0" dominantBaseline="middle" textAnchor="end" fontSize="12">Ben Lewis-Jones</text>
        </g>
    </svg>
    return <svg className={styles.art} viewBox="0 0 430 560" preserveAspectRatio="none" role="img" aria-label={side === 'front' ? 'Building a Storage Network — Ben Lewis-Jones. Black cover with a gold anchor.' : 'Black back cover with a gold anchor'}>
        <defs>
            <linearGradient id={`${id}-cloth`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#171918" /><stop offset=".48" stopColor="#0c0e0e" /><stop offset="1" stopColor="#141615" /></linearGradient>
            <linearGradient id={`${id}-shine`} x1="0" y1="1" x2="1" y2="0"><stop stopColor="#fff" stopOpacity="0" /><stop offset=".35" stopColor="#fff" stopOpacity="0" /><stop offset=".5" stopColor="#fffbea" /><stop offset=".65" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
            <pattern id={`${id}-weave`} width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 0h4M0 0v4" stroke="#e2d7b9" strokeOpacity=".022" strokeWidth=".5" /></pattern>
            <mask id={`${id}-foil`}><Anchor stroke="white" /></mask>
        </defs>
        <path fill={`url(#${id}-cloth)`} d="M0 0h430v560H0z" />
        <path fill={`url(#${id}-weave)`} d="M0 0h430v560H0z" />
        <rect x="24" y="24" width="382" height="512" rx="1" fill="none" stroke="#b38c49" strokeOpacity=".26" strokeWidth=".7" />
        {side === 'front' ? <>
            <g fill="#e9ddc2" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="400" textAnchor="middle">
                <text x="215" y="76" fontSize="14" letterSpacing="1">Ben Lewis-Jones</text>
                <text x="215" y="177" fontSize="35">Building a</text>
                <text x="215" y="225" fontSize="37">Storage Network</text>
            </g>
            <Anchor stroke={gold} />
            <g mask={`url(#${id}-foil)`}><rect className={styles.gloss} x="-200" y="294" width="180" height="202" fill={`url(#${id}-shine)`} /></g>
        </> : <g transform="translate(107.5 31) scale(.5)"><Anchor stroke={gold} /></g>}
    </svg>
}

export function storageBookArtwork(): BookArtwork {
    return { front: <StorageCover side="front" />, back: <StorageCover side="back" />, spine: <StorageCover side="spine" /> }
}
