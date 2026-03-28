'use client'

import { useEffect, useRef } from 'react'

type SwirlParticle = {
    x: number
    y: number
    spawnX: number
    spawnY: number
    orbitAngle: number
    orbitRadiusScale: number
    incomingProgress: number
    incomingSpeed: number
    angularVel: number
    orbitTime: number
    orbitDuration: number
    size: number
    opacity: number
    phase: 'incoming' | 'orbiting'
}

export default function SwirlCanvas({
    className,
    particleCount = 80,
    color = '139, 92, 246',
    orbitRadiusFraction = 0.28,
}: {
    className?: string
    particleCount?: number
    color?: string
    orbitRadiusFraction?: number
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const stageRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const stage = stageRef.current
        const canvas = canvasRef.current
        if (!stage || !canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let rafId: number
        let particles: SwirlParticle[] = []
        let W = 0
        let H = 0
        const dpr = Math.min(1.35, Math.max(1, window.devicePixelRatio || 1))

        function resize() {
            const bounds = stage!.getBoundingClientRect()
            W = Math.max(1, Math.floor(bounds.width * dpr))
            H = Math.max(1, Math.floor(bounds.height * dpr))
            canvas!.width = W
            canvas!.height = H
        }

        function spawnParticle(spreadAcrossCanvas = false): SwirlParticle {
            const fromLeft = Math.random() < 0.5
            const spawnX = fromLeft ? Math.random() * W * 0.15 : W - Math.random() * W * 0.15
            const spawnY = Math.random() * H
            // Left particles enter upper-right arc, right particles enter lower-left arc
            const orbitAngle = fromLeft
                ? Math.random() * Math.PI * 0.8 - Math.PI * 0.6   // ~-108° to +36° (upper-right)
                : Math.random() * Math.PI * 0.8 + Math.PI * 0.4   // ~+72° to +216° (lower-left)
            const incomingProgress = spreadAcrossCanvas ? Math.random() : 0
            const phase: 'incoming' | 'orbiting' =
                spreadAcrossCanvas && Math.random() < 0.4 ? 'orbiting' : 'incoming'
            return {
                x: spawnX,
                y: spawnY,
                spawnX,
                spawnY,
                orbitAngle,
                orbitRadiusScale: 0.85 + Math.random() * 0.2,
                incomingProgress,
                incomingSpeed: Math.random() * 0.002 + 0.001,
                angularVel: Math.random() * 0.002 + 0.002,
                orbitTime: spreadAcrossCanvas ? Math.random() * 120 : 0,
                orbitDuration: 150 + Math.random() * 200,
                size: (Math.random() * 2.5 + 1.5) * dpr,
                opacity: Math.random() * 0.5 + 0.3,
                phase,
            }
        }

        function init() {
            particles = []
            for (let i = 0; i < particleCount; i++) {
                particles.push(spawnParticle(true))
            }
        }

        function animate() {
            ctx!.clearRect(0, 0, W, H)

            const cx = W / 2
            const cy = H / 2
            const radius = Math.min(W, H) * orbitRadiusFraction

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i]
                let alpha: number

                const r = radius * p.orbitRadiusScale

                // Orbit angle advances every frame regardless of phase —
                // so the target on the ring is always moving in the orbit direction.
                p.orbitAngle += p.angularVel

                const targetX = cx + r * Math.cos(p.orbitAngle)
                const targetY = cy + r * Math.sin(p.orbitAngle)

                if (p.phase === 'incoming') {
                    p.incomingProgress += p.incomingSpeed

                    // Pull strength increases as particle approaches — starts gentle,
                    // ramps up so the particle swings into orbit rather than stopping.
                    const pull = 0.02 + Math.min(1, p.incomingProgress) * 0.12
                    p.x += (targetX - p.x) * pull
                    p.y += (targetY - p.y) * pull

                    alpha = p.opacity * Math.min(1, p.incomingProgress * 4)

                    if (p.incomingProgress >= 1) {
                        p.phase = 'orbiting'
                        p.orbitTime = 0
                    }
                } else {
                    p.orbitTime++
                    p.x = targetX
                    p.y = targetY

                    const fadeProgress = p.orbitTime / p.orbitDuration
                    alpha = p.opacity * (1 - Math.max(0, (fadeProgress - 0.65) / 0.35))

                    if (p.orbitTime >= p.orbitDuration) {
                        particles[i] = spawnParticle(false)
                        continue
                    }
                }

                if (alpha <= 0.01) continue

                ctx!.beginPath()
                ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx!.fillStyle = `rgba(${color}, ${alpha})`
                ctx!.fill()
            }

            rafId = requestAnimationFrame(animate)
        }

        const ro = new ResizeObserver(resize)
        ro.observe(stage)
        resize()
        init()
        rafId = requestAnimationFrame(animate)

        return () => {
            cancelAnimationFrame(rafId)
            ro.disconnect()
        }
    }, [particleCount, color, orbitRadiusFraction])

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
