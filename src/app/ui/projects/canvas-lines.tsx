'use client'

import { useEffect, useRef } from 'react'

interface CanvasLinesProps {
    hovered?: boolean
    curveIntensity?: number
    className?: string
}

// Slow cycle at rest (80s), slightly faster on hover (45s)
const DURATION_REST = 80
const DURATION_HOVER = 45

// Discord purple
const WAVE_COLOR = '88, 101, 242'

export function CanvasLines({
    hovered = false,
    curveIntensity = 0.72,
    className,
}: CanvasLinesProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const hoveredRef = useRef(hovered)

    useEffect(() => {
        hoveredRef.current = hovered
    }, [hovered])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animFrameId: number
        let lastTime = performance.now()
        let phase = 0

        const resize = () => {
            const dpr = window.devicePixelRatio || 1
            const { width, height } = canvas.getBoundingClientRect()
            canvas.width = width * dpr
            canvas.height = height * dpr
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        }

        resize()
        const ro = new ResizeObserver(resize)
        ro.observe(canvas)

        const animate = (now: number) => {
            const delta = now - lastTime
            lastTime = now

            // Phase accumulator — speed changes without position jump
            const duration = hoveredRef.current ? DURATION_HOVER : DURATION_REST
            phase += (delta / 1000 / duration) * Math.PI * 2

            const { width, height } = canvas.getBoundingClientRect()
            ctx.clearRect(0, 0, width, height)

            // Single filled wave — large amplitude, fills the card
            const amplitude = height * curveIntensity
            const midY = height * 0.5

            const cp1y = midY + Math.sin(phase) * amplitude
            const cp2y = midY + Math.sin(phase + 1.4) * amplitude * 0.7

            ctx.beginPath()
            ctx.moveTo(-10, height + 10)
            ctx.lineTo(-10, midY + Math.sin(phase - 0.3) * amplitude * 0.4)
            ctx.bezierCurveTo(
                width * 0.33, cp1y,
                width * 0.66, cp2y,
                width + 10, midY + Math.sin(phase + 2.8) * amplitude * 0.5,
            )
            ctx.lineTo(width + 10, height + 10)
            ctx.closePath()

            ctx.fillStyle = `rgba(${WAVE_COLOR}, 0.85)`
            ctx.fill()

            animFrameId = requestAnimationFrame(animate)
        }

        animFrameId = requestAnimationFrame(animate)

        return () => {
            cancelAnimationFrame(animFrameId)
            ro.disconnect()
        }
    }, [curveIntensity])

    return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
