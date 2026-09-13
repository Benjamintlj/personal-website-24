'use client'

import { useId } from 'react'
import type { BookArtwork } from './book-model'
import styles from './storage-book.module.css'

export const STORAGE_BOOK = {
    title: 'Building a Storage Network',
    author: 'Ben Lewis-Jones',
    href: '/building-a-storage-network/index.html',
}

// Phosphor Icons' Anchor Simple: original geometry, recoloured matte gold.
function Anchor({ small = false }: { small?: boolean }) {
    return <image href="/books/icons/anchor-simple-light.svg" x={small ? 174 : 130} y={small ? 222 : 316} width={small ? 82 : 170} height={small ? 82 : 170} aria-hidden="true" />
}

function StorageCover({ side }: { side: 'front' | 'back' | 'spine' }) {
    const id = useId().replace(/:/g, '')
    const gold = '#c6a15b'
    if (side === 'spine') return <svg className={styles.art} style={{ background: '#101111' }} viewBox="0 0 44 548" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <path fill="#101111" d="M0 0h44v548H0z" />
        <g transform="translate(22 0) rotate(90)" fill={gold} fontSize="16" fontWeight="400">
            <text x="55" dominantBaseline="central">Building a Storage Network</text>
            <text x="493" textAnchor="end" dominantBaseline="central">Ben Lewis-Jones</text>
        </g>
    </svg>
    return <svg className={styles.art} viewBox="0 0 430 560" preserveAspectRatio="none" role="img" aria-label={side === 'front' ? 'Building a Storage Network — Ben Lewis-Jones. Black cover with a gold anchor.' : 'Black back cover with a gold anchor'}>
        <defs>
            <linearGradient id={`${id}-cloth`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#171918" /><stop offset=".48" stopColor="#0c0e0e" /><stop offset="1" stopColor="#141615" /></linearGradient>
            <pattern id={`${id}-weave`} width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 0h4M0 0v4" stroke="#e2d7b9" strokeOpacity=".022" strokeWidth=".5" /></pattern>
        </defs>
        <path fill={`url(#${id}-cloth)`} d="M0 0h430v560H0z" />
        <path fill={`url(#${id}-weave)`} d="M0 0h430v560H0z" />
        {side === 'front' ? <>
            <g fill="#e9ddc2" fontWeight="400" textAnchor="middle">
                <text x="215" y="76" fontSize="16">Ben Lewis-Jones</text>
                <text x="215" y="177" fontSize="40">Building a</text>
                <text x="215" y="225" fontSize="40">Storage Network</text>
            </g>
            <Anchor />
        </> : <Anchor small />}
    </svg>
}

export function storageBookArtwork(): BookArtwork {
    return { front: <StorageCover side="front" />, back: <StorageCover side="back" />, spine: <StorageCover side="spine" /> }
}
