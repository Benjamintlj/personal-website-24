'use client'
import { useEffect, useRef } from 'react'

// Gradient palette — blue/violet/cyan/emerald
const PALETTE: [number, number, number][] = [
    [99,  102, 241],  // indigo
    [139, 92,  246],  // violet
    [168, 85,  247],  // purple
    [59,  130, 246],  // blue
    [6,   182, 212],  // cyan
    [16,  185, 129],  // emerald
    [236, 72,  153],  // pink
]

const BAND_COUNT   = 7
const BAND_GAP     = 90   // px between band centres (logical)
const BAND_WIDTH   = 50   // px half-width of each band
const SPEED        = 0.4  // px offset per frame
const WAVE_AMP     = 18   // px wave amplitude along the band
const WAVE_FREQ    = 0.005 // wave cycles per px of band length

export function LinesGradientShader({ className }: { className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animId: number
        let t = 0
        let paused = false

        const resize = () => {
            const dpr = window.devicePixelRatio || 1
            canvas.width  = canvas.offsetWidth  * dpr
            canvas.height = canvas.offsetHeight * dpr
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        }

        const draw = () => {
            if (paused) return
            const W = canvas.offsetWidth
            const H = canvas.offsetHeight
            // diagonal length — the axis along which bands travel
            const D = Math.hypot(W, H)

            ctx.clearRect(0, 0, W, H)

            // We draw in a rotated coordinate system (45°) so bands are diagonal.
            // The "u" axis runs along the bands; "v" axis is perpendicular (travel direction).
            const cycle = BAND_GAP * BAND_COUNT

            for (let b = 0; b < BAND_COUNT + 2; b++) {
                const [r, g, bl] = PALETTE[b % PALETTE.length]

                // v position along the perpendicular axis
                const v0 = ((b * BAND_GAP - t) % cycle + cycle) % cycle - BAND_GAP

                // Build the wavy band as a polygon in rotated space,
                // then unrotate each point back to screen space.
                const cos45 = Math.SQRT1_2
                const sin45 = Math.SQRT1_2

                // Unrotate a (u,v) point (centred on canvas) back to screen (x,y)
                const toScreen = (u: number, v: number) => ({
                    x: (u * cos45 - v * sin45) + W / 2,
                    y: (u * sin45 + v * cos45) + H / 2,
                })

                // Number of steps along the band's length
                const STEPS = 80
                const uStart = -D / 2 - 20
                const uEnd   =  D / 2 + 20

                // Left edge (v = v0 - BAND_WIDTH + wave)
                const leftPts: {x:number,y:number}[] = []
                // Right edge (v = v0 + BAND_WIDTH + wave)
                const rightPts: {x:number,y:number}[] = []

                for (let s = 0; s <= STEPS; s++) {
                    const u = uStart + (s / STEPS) * (uEnd - uStart)
                    const wave = Math.sin(u * WAVE_FREQ + t * 0.03) * WAVE_AMP
                    leftPts.push(toScreen(u, v0 - BAND_WIDTH + wave))
                    rightPts.push(toScreen(u, v0 + BAND_WIDTH + wave))
                }

                // Draw the polygon
                ctx.beginPath()
                ctx.moveTo(leftPts[0].x, leftPts[0].y)
                for (let s = 1; s <= STEPS; s++) {
                    ctx.lineTo(leftPts[s].x, leftPts[s].y)
                }
                for (let s = STEPS; s >= 0; s--) {
                    ctx.lineTo(rightPts[s].x, rightPts[s].y)
                }
                ctx.closePath()

                // Gradient perpendicular to band (screen-space approximation)
                const midLeft  = leftPts[STEPS >> 1]
                const midRight = rightPts[STEPS >> 1]
                const grad = ctx.createLinearGradient(
                    midLeft.x, midLeft.y, midRight.x, midRight.y
                )
                grad.addColorStop(0,   `rgba(${r},${g},${bl},0)`)
                grad.addColorStop(0.25, `rgba(${r},${g},${bl},0.5)`)
                grad.addColorStop(0.5,  `rgba(${r},${g},${bl},0.75)`)
                grad.addColorStop(0.75, `rgba(${r},${g},${bl},0.5)`)
                grad.addColorStop(1,   `rgba(${r},${g},${bl},0)`)
                ctx.fillStyle = grad
                ctx.fill()
            }

            t += SPEED
            animId = requestAnimationFrame(draw)
        }

        resize()
        draw()

        const ro = new ResizeObserver(resize)
        ro.observe(canvas)

        const onVisibility = () => {
            paused = document.hidden
            if (!paused) draw()
        }
        document.addEventListener('visibilitychange', onVisibility)

        return () => {
            cancelAnimationFrame(animId)
            ro.disconnect()
            document.removeEventListener('visibilitychange', onVisibility)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={{ width: '100%', height: '100%', display: 'block' }}
        />
    )
}
