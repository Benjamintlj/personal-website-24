'use client'
import { useEffect, useRef, useMemo } from 'react'
import { cn } from '@/lib/utils'

type RGB = [number, number, number]

const DEFAULT_COLORS: RGB[] = [
    [139, 92, 246],
    [168, 85, 247],
    [217, 70, 239],
    [236, 72, 153],
    [244, 63, 94],
    [249, 115, 22],
    [251, 191, 36],
    [254, 240, 138],
]

interface LinesGradientShaderProps {
    className?: string
    speed?: number
    bandCount?: number
    bandSpacing?: number
    bandThickness?: number
    waveAmplitude?: number
    colors?: RGB[]
    targetFps?: number
    xOffset?: number
    yOffset?: number
    slopeMultiplier?: number
    rotationAngle?: number
}

export function LinesGradientShader({
    className,
    speed = 1,
    bandCount = 12,
    bandSpacing = 25,
    bandThickness = 60,
    waveAmplitude = 0.15,
    colors,
    targetFps = 30,
    xOffset = 0,
    yOffset = 0,
    slopeMultiplier = 1.2,
    rotationAngle,
}: LinesGradientShaderProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const animIdRef = useRef<number>(0)
    const startTimeRef = useRef<number>(0)
    const lastFrameRef = useRef<number>(0)
    const visibleRef = useRef<boolean>(true)

    const palette = useMemo(() => colors || DEFAULT_COLORS, [colors])

    const bandColors = useMemo(() => {
        const lerp = (a: RGB, b: RGB, t: number): string => {
            const r = Math.round(a[0] + (b[0] - a[0]) * t)
            const g = Math.round(a[1] + (b[1] - a[1]) * t)
            const bl = Math.round(a[2] + (b[2] - a[2]) * t)
            return `rgb(${r},${g},${bl})`
        }
        const sample = (t: number): string => {
            const clamped = Math.max(0, Math.min(1, t)) * (palette.length - 1)
            const i = Math.floor(clamped)
            return lerp(
                palette[Math.min(i, palette.length - 1)],
                palette[Math.min(i + 1, palette.length - 1)],
                clamped - i,
            )
        }
        const result = []
        for (let i = 0; i < bandCount; i++) {
            const t = i / (bandCount - 1)
            result.push({ start: sample(t - 0.02), end: sample(t + 0.08) })
        }
        return result
    }, [palette, bandCount])

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return

        const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true })
        if (!ctx) return

        let destroyed = false
        const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1))
        const interval = 1000 / targetFps
        let canvasW = 0
        let canvasH = 0

        const resize = () => {
            const { width, height } = container.getBoundingClientRect()
            canvasW = width
            canvasH = height
            canvas.width = Math.floor(width * dpr)
            canvas.height = Math.floor(height * dpr)
            canvas.style.width = `${Math.floor(width)}px`
            canvas.style.height = `${Math.floor(height)}px`
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        }

        const ro = new ResizeObserver(resize)
        ro.observe(container)
        resize()

        const io = new IntersectionObserver(
            (entries) => {
                visibleRef.current = entries[0]?.isIntersecting ?? true
            },
            { threshold: 0 },
        )
        io.observe(container)

        const onVisibility = () => {
            if (!document.hidden && visibleRef.current) {
                startTimeRef.current = 0
                lastFrameRef.current = 0
            }
        }
        document.addEventListener('visibilitychange', onVisibility)

        const lower: { x: number; y: number }[] = Array.from({ length: 41 }, () => ({ x: 0, y: 0 }))
        const upper: { x: number; y: number }[] = Array.from({ length: 41 }, () => ({ x: 0, y: 0 }))

        const draw = (ts: number) => {
            if (destroyed) return
            animIdRef.current = requestAnimationFrame(draw)
            if (!visibleRef.current || document.hidden) return

            const elapsed = ts - lastFrameRef.current
            if (elapsed < interval) return
            lastFrameRef.current = ts - (elapsed % interval)

            if (startTimeRef.current === 0) startTimeRef.current = ts
            const time = (ts - startTimeRef.current) * 0.001 * speed

            const W = canvasW
            const H = canvasH
            const amp = H * waveAmplitude
            const half = bandCount / 2
            const span = W + 400
            const effectiveSlope = rotationAngle !== undefined
                ? Math.tan(rotationAngle * Math.PI / 180) * span / H
                : slopeMultiplier

            ctx.clearRect(0, 0, W, H)

            for (let b = bandCount - 1; b >= 0; b--) {
                const { start, end } = bandColors[b]
                const grad = ctx.createLinearGradient(0.3 * W, 0, W, H)
                grad.addColorStop(0, start)
                grad.addColorStop(1, end)
                ctx.fillStyle = grad

                const p1 = 0.12 * time + 0.15 * b
                const p2 = 0.08 * time + 0.1 * b
                const p3 = 0.05 * time + 0.08 * b
                const center = (b - half) * bandSpacing

                ctx.beginPath()
                ctx.moveTo(-100, H + 200)

                for (let i = 0; i <= 40; i++) {
                    const t = i / 40
                    const x = -100 + span * t + xOffset
                    const baseY = 1.4 * H - t * H * effectiveSlope + center + yOffset
                    const wave =
                        Math.sin(2.5 * t + p1) * amp +
                        Math.sin(1.5 * t + p2) * amp * 0.4 +
                        Math.sin(4 * t + p3) * amp * 0.15
                    const halfThick = (bandThickness + 4 * Math.sin(2 * t + 0.3 * p1)) / 2
                    lower[i].x = x
                    lower[i].y = baseY + wave + halfThick
                    upper[i].x = x
                    upper[i].y = baseY + wave - halfThick
                }

                for (let i = 0; i <= 40; i++) ctx.lineTo(lower[i].x, lower[i].y)
                ctx.lineTo(W + 200, -100)
                for (let i = 40; i >= 0; i--) ctx.lineTo(upper[i].x, upper[i].y)
                ctx.lineTo(-100, H + 200)
                ctx.closePath()
                ctx.fill()
            }

            // Highlight strokes
            ctx.globalCompositeOperation = 'overlay'
            ctx.globalAlpha = 0.25
            ctx.strokeStyle = 'rgba(255,255,255,0.5)'
            ctx.lineWidth = 1

            for (let b = 0; b < bandCount; b++) {
                const p1 = 0.12 * time + 0.15 * b
                const p2 = 0.08 * time + 0.1 * b
                const p3 = 0.05 * time + 0.08 * b
                const center = (b - half) * bandSpacing

                ctx.beginPath()
                for (let i = 0; i <= 30; i++) {
                    const t = i / 30
                    const x = -100 + span * t + xOffset
                    const y =
                        1.4 * H -
                        t * H * effectiveSlope +
                        center +
                        Math.sin(2.5 * t + p1) * amp +
                        Math.sin(1.5 * t + p2) * amp * 0.4 +
                        Math.sin(4 * t + p3) * amp * 0.15
                    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
                }
                ctx.stroke()
            }

            ctx.globalCompositeOperation = 'source-over'
            ctx.globalAlpha = 1
        }

        animIdRef.current = requestAnimationFrame(draw)

        return () => {
            destroyed = true
            cancelAnimationFrame(animIdRef.current)
            document.removeEventListener('visibilitychange', onVisibility)
            ro.disconnect()
            io.disconnect()
        }
    }, [speed, bandCount, bandSpacing, bandThickness, waveAmplitude, bandColors, targetFps, xOffset, yOffset, slopeMultiplier, rotationAngle])

    return (
        <div ref={containerRef} className={cn('relative overflow-hidden', className)}>
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" style={{ display: 'block' }} />
        </div>
    )
}
