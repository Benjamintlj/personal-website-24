'use client'

import { useId, useRef, type CSSProperties } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import styles from './storage-network.module.css'

const peers = [[360, 82], [580, 78], [658, 190], [532, 272], [300, 253], [258, 153]]
const center = [460, 176]

function StorageCube({ main = false }: { main?: boolean }) {
    return <g transform={main ? 'scale(1.4)' : undefined}>
        <path d="M0 -23L31 -7L0 10L-31 -7Z" fill="#33475d" stroke="#7599b9" />
        <path d="M-31 -7L0 10V42L-31 25Z" fill="#172538" stroke="#42617f" />
        <path d="M0 10L31 -7V25L0 42Z" fill="#213d52" stroke="#5589a6" />
        <path d="M-24 4L-7 13M-24 13L-7 22M8 19L24 10" stroke="#6ad9ee" strokeWidth="2" opacity=".75" />
        <circle cx="21" cy="22" r="2" fill="#8df9c5" />
        {main && <g transform="translate(0 -9)"><rect x="-8" y="-4" width="16" height="13" rx="3" fill="#bef0ff" /><path d="M-5 -4V-8a5 5 0 0 1 10 0v4" fill="none" stroke="#bef0ff" strokeWidth="2.5" /><circle r="1.8" cy="2" fill="#214359" /></g>}
    </g>
}

export default function StorageNetworkCard() {
    const ref = useRef<HTMLDivElement>(null)
    const visible = useInView(ref, { margin: '80px' })
    const reducedMotion = useReducedMotion()
    const id = useId().replace(/:/g, '')
    return <div ref={ref} className={styles.card} data-running={visible && !reducedMotion}>
        <div className={styles.copy}>
            <h3>Peer-to-peer<br />{' '}storage</h3>
        </div>
        <svg className={styles.network} viewBox="180 0 550 330" aria-hidden="true">
            <defs>
                <radialGradient id={`${id}-glow`}><stop stopColor="#2a7ca2" stopOpacity=".24" /><stop offset="1" stopColor="#141414" stopOpacity="0" /></radialGradient>
            </defs>
            <ellipse cx="465" cy="190" rx="230" ry="145" fill={`url(#${id}-glow)`} />
            <g className={styles.connections}>
                {peers.map(([x, y], i) => <g key={i}>
                    <path d={`M${center[0]} ${center[1]} Q${(center[0] + x) / 2} ${y - 20} ${x} ${y}`} fill="none" stroke="#365168" />
                    <path className={styles.packet} style={{ animationDelay: `${-i * .8}s` }} d={`M${center[0]} ${center[1]} Q${(center[0] + x) / 2} ${y - 20} ${x} ${y}`} pathLength="100" fill="none" stroke="#8be8ff" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 97" />
                </g>)}
                <path d="M360 82L580 78L658 190L532 272L300 253L258 153Z" fill="none" stroke="#37586a" strokeDasharray="3 7" opacity=".5" />
            </g>
            {peers.map(([x, y], i) => <g key={i} transform={`translate(${x} ${y})`}><g className={styles.peer} style={{ '--delay': `${-i * .7}s` } as CSSProperties}><ellipse cy="42" rx="35" ry="10" fill="#000" opacity=".3" /><StorageCube /></g></g>)}
            <g transform={`translate(${center[0]} ${center[1]})`}><g className={styles.peer}><StorageCube main /></g></g>
        </svg>
    </div>
}
