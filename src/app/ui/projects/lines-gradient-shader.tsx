'use client'
import { useEffect, useRef } from 'react'

const LINE_SPACING = 7    // px between line centres
const LINE_WIDTH   = 3    // px stroke width
const SPEED        = 0.6  // px per frame (scroll direction)
const HUE_SPAN     = 200  // degrees of hue covered across all visible lines

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
            const D = Math.hypot(W, H) + LINE_SPACING * 4

            ctx.clearRect(0, 0, W, H)
            ctx.lineWidth = LINE_WIDTH

            // Work in a 45°-rotated space centred on the canvas.
            // Horizontal lines here become diagonal lines on screen.
            ctx.save()
            ctx.translate(W / 2, H / 2)
            ctx.rotate(Math.PI / 4)

            const totalLines = Math.ceil(D / LINE_SPACING) + 2
            const cycleLength = LINE_SPACING * totalLines
            // scrolling offset — cycles through one full period seamlessly
            const scrollOffset = (t * SPEED) % LINE_SPACING

            for (let i = 0; i < totalLines; i++) {
                // position in rotated space (perpendicular to the diagonal)
                const y = -D / 2 + i * LINE_SPACING - scrollOffset

                // hue shifts gradually across lines and also drifts over time
                const hue = (240 + (i / totalLines) * HUE_SPAN + t * 0.15) % 360

                ctx.beginPath()
                ctx.moveTo(-D / 2, y)
                ctx.lineTo( D / 2, y)
                ctx.strokeStyle = `hsl(${hue}, 80%, 62%)`
                ctx.stroke()
            }

            ctx.restore()

            t += 1
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
