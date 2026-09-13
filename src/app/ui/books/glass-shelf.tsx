'use client'

import { useId, useLayoutEffect, useRef, useState } from 'react'
import styles from './bookshelf.module.css'

/** A glass surface with a shallow front lip. */
export default function GlassShelf() {
    const element = useRef<HTMLDivElement>(null)
    const [width, setWidth] = useState(1100)
    const id = useId().replace(/:/g, '')
    useLayoutEffect(() => {
        const measure = () => setWidth(element.current!.clientWidth)
        measure()
        const resize = new ResizeObserver(measure)
        resize.observe(element.current!)
        return () => resize.disconnect()
    }, [])
    const mobile = width <= 600
    const depth = mobile ? 235 : 270
    const camera = mobile ? 1400 : 2000
    const elevation = mobile ? 230 : 320
    const radius = mobile ? 18 : 26
    const front = 46
    const lip = mobile ? 3 : 4
    const point = (x: number, z: number) => `${width / 2 + (x - width / 2) * camera / (camera + z)},${front - elevation * z / (camera + z)}`
    const p = point
    const k = .55228475 * radius
    const top = `M${p(radius, depth)} L${p(width - radius, depth)} C${p(width - radius + k, depth)} ${p(width, depth - radius + k)} ${p(width, depth - radius)} L${p(width, radius)} C${p(width, radius - k)} ${p(width - radius + k, 0)} ${p(width - radius, 0)} L${p(radius, 0)} C${p(radius - k, 0)} ${p(0, radius - k)} ${p(0, radius)} L${p(0, depth - radius)} C${p(0, depth - radius + k)} ${p(radius - k, depth)} ${p(radius, depth)} Z`
    return <div ref={element} className={styles.glassShelf} aria-hidden="true">
        <div className={styles.glassFrost} style={{ clipPath: `path('${top}')` }} />
        <svg className={styles.glassSlab} width="100%" height="80" viewBox={`0 0 ${width} 80`}>
            <defs>
                <linearGradient id={`${id}-surface`} x1="0" y1="0" x2=".4" y2="1">
                    <stop stopColor="#d9f4f5" stopOpacity=".05" />
                    <stop offset=".65" stopColor="#aac7cf" stopOpacity=".1" />
                    <stop offset="1" stopColor="#e5ffff" stopOpacity=".2" />
                </linearGradient>
                <linearGradient id={`${id}-rim`}>
                    <stop stopColor="#e7ffff" stopOpacity=".42" />
                    <stop offset=".28" stopColor="#d7eeef" stopOpacity=".16" />
                    <stop offset=".7" stopColor="#d7eeef" stopOpacity=".12" />
                    <stop offset="1" stopColor="#e7ffff" stopOpacity=".42" />
                </linearGradient>
                <radialGradient id={`${id}-light`} cx=".2" cy="1" r=".65">
                    <stop stopColor="#eefeff" stopOpacity=".13" />
                    <stop offset="1" stopColor="#eefeff" stopOpacity="0" />
                </radialGradient>
            </defs>
            <path d={`M${radius},${front} H${width - radius} V${front + lip - 1} q0,1 -1,1 H${radius + 1} q-1,0 -1,-1 Z`} fill="#b8d1d5" fillOpacity=".18" />
            <path d={top} fill={`url(#${id}-surface)`} />
            <path d={top} fill={`url(#${id}-light)`} />
            <path d={top} fill="none" stroke={`url(#${id}-rim)`} strokeWidth=".75" />
        </svg>
    </div>
}
