'use client'

import { useEffect, useRef } from 'react'

type Particle = {
    x: number
    y: number
    size: number
    speed: number
    opacity: number
    drift: number
}

export default function SparklesCanvas({ className, isHovered }: { className?: string; isHovered?: boolean }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const stageRef = useRef<HTMLDivElement>(null)
    const isHoveredRef = useRef(false)

    useEffect(() => {
        isHoveredRef.current = isHovered ?? false
    }, [isHovered])

    useEffect(() => {
        const stage = stageRef.current
        const canvas = canvasRef.current
        if (!stage || !canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let rafId: number
        let particles: Particle[] = []
        let canvasWidth = 0
        let canvasHeight = 0

        const dpr = Math.min(1.35, Math.max(1, window.devicePixelRatio || 1))
        const BASE_COUNT = 80
        const HOVER_COUNT = 160

        function resize() {
            const bounds = stage!.getBoundingClientRect()
            canvasWidth = Math.max(1, Math.floor(bounds.width * dpr))
            canvasHeight = Math.max(1, Math.floor(bounds.height * dpr))
            canvas!.width = canvasWidth
            canvas!.height = canvasHeight
        }

        function createParticle(spreadY = false): Particle {
            return {
                x: Math.random() * canvasWidth,
                y: spreadY ? Math.random() * canvasHeight : canvasHeight + Math.random() * 20 * dpr,
                size: (Math.random() * 1.5 + 0.8) * dpr,
                speed: (Math.random() * 0.5 + 0.3) * dpr,
                opacity: Math.random() * 0.35 + 0.1,
                drift: (Math.random() - 0.5) * 0.3 * dpr,
            }
        }

        function init() {
            particles = []
            for (let i = 0; i < BASE_COUNT; i++) {
                particles.push(createParticle(true))
            }
        }

        function animate() {
            ctx!.clearRect(0, 0, canvasWidth, canvasHeight)

            // Grow pool on hover
            if (isHoveredRef.current && particles.length < HOVER_COUNT) {
                particles.push(createParticle(false))
            }

            const alphaMultiplier = isHoveredRef.current ? 2.2 : 1.0
            const isDraining = !isHoveredRef.current && particles.length > BASE_COUNT

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i]

                // move upward
                p.y -= p.speed
                p.x += p.drift

                // expanded death boundary when draining excess particles (~2.5s to drain 160→80)
                const recycleThreshold = isDraining ? canvasHeight * 0.35 : -p.size * 2

                if (p.y < recycleThreshold) {
                    if (isDraining) {
                        particles.splice(i, 1)
                        i--
                    } else {
                        particles[i] = createParticle(false)
                    }
                    continue
                }

                // alpha fades as particle rises (full at bottom, 0 at top)
                const progress = 1 - p.y / canvasHeight
                const alpha = p.opacity * (1 - Math.min(1, progress * 1.2)) * alphaMultiplier

                if (alpha <= 0) continue

                ctx!.beginPath()
                ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx!.fillStyle = `rgba(96, 165, 250, ${alpha})`
                ctx!.fill()
            }

            rafId = requestAnimationFrame(animate)
        }

        window.addEventListener('resize', resize)
        resize()
        init()
        rafId = requestAnimationFrame(animate)

        return () => {
            cancelAnimationFrame(rafId)
            window.removeEventListener('resize', resize)
        }
    }, [])

    return (
        <div ref={stageRef} className={`absolute inset-0 ${className ?? ''}`}>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                aria-hidden="true"
            />
        </div>
    )
}
