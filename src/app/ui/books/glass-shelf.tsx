'use client'

import { useId, useLayoutEffect, useRef, useState } from 'react'
import styles from './bookshelf.module.css'

type Point = [number, number]
const mix = (a: Point, b: Point, t: number): Point => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]

/** Split the projected corner at its leftmost tangent, where the visible lip begins. */
function frontCorner([p0, p1, p2, p3]: [Point, Point, Point, Point]) {
    const a = -p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]
    const b = 2 * (p0[0] - 2 * p1[0] + p2[0])
    const c = p1[0] - p0[0]
    const roots = Math.abs(a) < 1e-9 ? [-c / b] : [(-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a), (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a)]
    const t = roots.find(value => value >= 0 && value <= 1) ?? 0
    const q0 = mix(p0, p1, t), q1 = mix(p1, p2, t), q2 = mix(p2, p3, t)
    const r0 = mix(q0, q1, t), r1 = mix(q1, q2, t)
    return [mix(r0, r1, t), r1, q2, p3]
}

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
    const project = (x: number, z: number): Point => [width / 2 + (x - width / 2) * camera / (camera + z), front - elevation * z / (camera + z)]
    const p = (x: number, z: number) => project(x, z).join(',')
    const k = .55228475 * radius
    const top = `M${p(radius, depth)} L${p(width - radius, depth)} C${p(width - radius + k, depth)} ${p(width, depth - radius + k)} ${p(width, depth - radius)} L${p(width, radius)} C${p(width, radius - k)} ${p(width - radius + k, 0)} ${p(width - radius, 0)} L${p(radius, 0)} C${p(radius - k, 0)} ${p(0, radius - k)} ${p(0, radius)} L${p(0, depth - radius)} C${p(0, depth - radius + k)} ${p(radius - k, depth)} ${p(radius, depth)} Z`
    const corner = frontCorner([project(0, radius), project(0, radius - k), project(radius - k, 0), project(radius, 0)])
    const left = (index: number, drop = 0) => `${corner[index][0]},${corner[index][1] + drop}`
    const right = (index: number, drop = 0) => `${width - corner[index][0]},${corner[index][1] + drop}`
    // The outside joins are vertical tangents, not two offset rounded tips.
    // Both faces share this exact curve, without an inset or an overlapping outline.
    const edge = `M${left(0)} C${left(1)} ${left(2)} ${left(3)} L${right(3)} C${right(2)} ${right(1)} ${right(0)} L${right(0, lip)} C${right(1, lip)} ${right(2, lip)} ${right(3, lip)} L${left(3, lip)} C${left(2, lip)} ${left(1, lip)} ${left(0, lip)} Z`
    return <div ref={element} className={styles.glassShelf} aria-hidden="true">
        <div className={styles.glassFrost} style={{ clipPath: `path('${top}')` }} />
        <svg className={styles.glassSlab} width="100%" height="80" viewBox={`0 0 ${width} 80`}>
            <defs>
                <linearGradient id={`${id}-surface`} x1="0" y1="0" x2=".4" y2="1">
                    <stop stopColor="#d9f4f5" stopOpacity=".05" />
                    <stop offset=".65" stopColor="#aac7cf" stopOpacity=".1" />
                    <stop offset="1" stopColor="#e5ffff" stopOpacity=".2" />
                </linearGradient>
                <radialGradient id={`${id}-light`} cx=".2" cy="1" r=".65">
                    <stop stopColor="#eefeff" stopOpacity=".13" />
                    <stop offset="1" stopColor="#eefeff" stopOpacity="0" />
                </radialGradient>
            </defs>
            <path d={edge} fill="#d8f2f4" fillOpacity=".3" />
            <path d={top} fill={`url(#${id}-surface)`} />
            <path d={top} fill={`url(#${id}-light)`} />
        </svg>
    </div>
}
