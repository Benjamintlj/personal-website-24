'use client'

import { useEffect, useRef } from 'react'

interface CanvasLinesProps {
    hovered?: boolean
    className?: string
}

const DURATION_REST = 80   // seconds per cycle at rest
const DURATION_HOVER = 45  // seconds per cycle on hover

// Discord purple
const WAVE_COLOR = '88, 101, 242'

export function CanvasLines({ hovered = false, className }: CanvasLinesProps) {
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

            const lineGap = 4
            const numLines = Math.floor(height / lineGap) + 10
            // Big amplitude — wave spans most of the card height
            const amplitude = height * 0.7
            // One full sine wave across the card width, traveling left to right
            const waveFreq = Math.PI * 2

            ctx.strokeStyle = `rgba(${WAVE_COLOR}, 0.45)`
            ctx.lineWidth = 2

            for (let i = 0; i < numLines; i++) {
                const y = i * lineGap

                ctx.beginPath()
                ctx.moveTo(0, y + Math.sin(phase) * amplitude)

                // Step across the card — sine wave rippling left to right
                for (let x = 3; x <= width; x += 3) {
                    ctx.lineTo(x, y + Math.sin(phase + (x / width) * waveFreq) * amplitude)
                }

                ctx.stroke()
            }

            animFrameId = requestAnimationFrame(animate)
        }

        animFrameId = requestAnimationFrame(animate)

        return () => {
            cancelAnimationFrame(animFrameId)
            ro.disconnect()
        }
    }, [])

    return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
