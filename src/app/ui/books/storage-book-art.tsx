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
        <circle cx="215" cy="344" r="18" strokeWidth="7" />
        <path d="M215 363v143M169 386h92M125 438c0 47 38 56 90 77 52-21 90-30 90-77" strokeWidth="10" />
        <path d="m108 457 17-25 21 20m138 0 21-20 17 25" strokeWidth="8" />
    </g>
}

function StorageCover({ side }: { side: 'front' | 'back' | 'spine' }) {
    const id = useId().replace(/:/g, '')
    const gold = `url(#${id}-gold)`
    if (side === 'spine') return <svg className={styles.art} viewBox="0 0 28 594" preserveAspectRatio="none" aria-hidden="true">
        <defs><linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#bb914b" /><stop offset=".45" stopColor="#f2d69a" /><stop offset="1" stopColor="#ac803d" /></linearGradient></defs>
        <path fill="#101111" d="M0 0h28v594H0z" />
        <path d="M4 14h20M4 580h20" stroke={gold} strokeWidth=".7" />
        <g transform="translate(14 35) rotate(90)" fill={gold} fontFamily="Georgia, 'Times New Roman', serif" fontSize="14">
            <text x="0" y="0" dominantBaseline="middle">Building a Storage Network</text>
            <text x="521" y="0" dominantBaseline="middle" textAnchor="end" fontSize="12">Ben Lewis-Jones</text>
        </g>
    </svg>
    return <svg className={styles.art} viewBox="0 0 430 594" preserveAspectRatio="none" role="img" aria-label={side === 'front' ? 'Building a Storage Network — Ben Lewis-Jones. Black cover with a gold anchor.' : 'Black back cover with a gold anchor'}>
        <defs>
            <linearGradient id={`${id}-cloth`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#171918" /><stop offset=".48" stopColor="#0c0e0e" /><stop offset="1" stopColor="#141615" /></linearGradient>
            <linearGradient id={`${id}-gold`} x1="0" y1="1" x2="1" y2="0"><stop stopColor="#805322" /><stop offset=".22" stopColor="#d7ad61" /><stop offset=".43" stopColor="#faf0c7" /><stop offset=".51" stopColor="#c39950" /><stop offset=".72" stopColor="#e2c480" /><stop offset="1" stopColor="#93703a" /></linearGradient>
            <linearGradient id={`${id}-shine`}><stop stopColor="#fff5cd" stopOpacity="0" /><stop offset=".46" stopColor="#fff5cd" stopOpacity="0" /><stop offset=".5" stopColor="#fff9e5" stopOpacity=".9" /><stop offset=".54" stopColor="#fff5cd" stopOpacity="0" /><stop offset="1" stopColor="#fff5cd" stopOpacity="0" /></linearGradient>
            <pattern id={`${id}-weave`} width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 0h4M0 0v4" stroke="#e2d7b9" strokeOpacity=".022" strokeWidth=".5" /></pattern>
            <mask id={`${id}-foil`}><Anchor stroke="white" /></mask>
        </defs>
        <path fill={`url(#${id}-cloth)`} d="M0 0h430v594H0z" />
        <path fill={`url(#${id}-weave)`} d="M0 0h430v594H0z" />
        <rect x="22" y="22" width="386" height="550" rx="1" fill="none" stroke="#b38c49" strokeOpacity=".26" strokeWidth=".7" />
        {side === 'front' ? <>
            <g fill="#e9ddc2" fontFamily="Georgia, 'Times New Roman', serif" textAnchor="middle">
                <text x="215" y="120" fontSize="30">Building a</text>
                <text x="215" y="174" fontSize="47">Storage</text>
                <text x="215" y="226" fontSize="47">Network</text>
                <text x="215" y="552" fontSize="14" letterSpacing="1">Ben Lewis-Jones</text>
            </g>
            <path d="M182 268h66" stroke={gold} strokeWidth="1" />
            <Anchor stroke={gold} />
            <g mask={`url(#${id}-foil)`}><rect className={styles.gloss} x="-430" y="295" width="860" height="240" fill={`url(#${id}-shine)`} /></g>
        </> : <g transform="translate(107.5 31) scale(.5)"><Anchor stroke={gold} /></g>}
    </svg>
}

export function storageBookArtwork(): BookArtwork {
    return { front: <StorageCover side="front" />, back: <StorageCover side="back" />, spine: <StorageCover side="spine" /> }
}
