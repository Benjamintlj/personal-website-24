'use client'
import { cn } from '@/lib/utils'
import React, { useEffect, useRef, useState } from 'react'
import { createNoise3D } from 'simplex-noise'

export default function CirclesBackground({
    children,
    className,
    containerClassName,
    colors = ['#e74c3c', '#e67e22', '#f1c40f'],
    waveWidth,
    backgroundFill = 'transparent',
    circleSize = 150,
    waveSize = 25,
    blur = 5,
    speed = 0.002,
    waveOpacity = 0.7,
    width,
    height,
    ...props
}: {
    children?: any
    className?: string
    containerClassName?: string
    colors?: string[]
    waveWidth?: number
    backgroundFill?: string
    circleSize?: number
    waveSize?: number
    blur?: number
    speed?: number
    waveOpacity?: number
    width?: number
    height?: number
    [key: string]: any
}) {
    const noise = createNoise3D()
    let w: number,
        h: number,
        nt: number,
        i: number,
        x: number,
        ctx: any,
        canvas: any
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const init = () => {
        canvas = canvasRef.current
        ctx = canvas.getContext('2d')
        w = width || canvas.parentElement.offsetWidth
        h = height || canvas.parentElement.offsetHeight
        ctx.canvas.width = w
        ctx.canvas.height = h
        ctx.filter = `blur(${blur}px)`
        nt = 0
        window.onresize = function () {
            w = width || canvas.parentElement.offsetWidth
            h = height || canvas.parentElement.offsetHeight
            ctx.canvas.width = w
            ctx.canvas.height = h
            ctx.filter = `blur(${blur}px)`
        }
        render()
    }

    const drawWave = (n: number) => {
        nt += speed
        const centerX = w / 2
        const centerY = h / 2
        for (i = 0; i < n; i++) {
            ctx.beginPath()
            ctx.lineWidth = waveWidth || 25
            ctx.strokeStyle = colors[i % colors.length]
            for (let angle = 0; angle < Math.PI * 2; angle += 0.05) {
                const radius =
                    noise(
                        Math.cos(angle) + 0.3 * i,
                        Math.sin(angle) + 0.3 * i,
                        nt
                    ) *
                        waveSize +
                    circleSize
                const x = centerX + radius * Math.cos(angle)
                const y = centerY + radius * Math.sin(angle)
                if (angle === 0) {
                    ctx.moveTo(x, y)
                } else {
                    ctx.lineTo(x, y)
                }
            }
            ctx.closePath()
            ctx.stroke()
        }
    }

    let animationId: number
    const render = () => {
        ctx.clearRect(0, 0, w, h)
        ctx.fillStyle = backgroundFill
        ctx.globalAlpha = waveOpacity || 0.5
        ctx.fillRect(0, 0, w, h)
        drawWave(3)
        animationId = requestAnimationFrame(render)
    }

    useEffect(() => {
        init()
        return () => {
            cancelAnimationFrame(animationId)
        }
    }, [width, height])

    const [isSafari, setIsSafari] = useState(false)
    useEffect(() => {
        setIsSafari(
            typeof window !== 'undefined' &&
                navigator.userAgent.includes('Safari') &&
                !navigator.userAgent.includes('Chrome')
        )
    }, [])

    return (
        <div
            className={cn(
                'h-full flex flex-col items-center justify-center relative overflow-hidden',
                containerClassName
            )}
        >
            <canvas
                className="absolute inset-0 z-0"
                ref={canvasRef}
                id="canvas"
                style={{
                    ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
                }}
            ></canvas>
            <div className={cn('relative z-10', className)} {...props}>
                {children}
            </div>
        </div>
    )
}
