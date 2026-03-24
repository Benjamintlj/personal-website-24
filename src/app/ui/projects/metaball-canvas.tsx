'use client'

import { useEffect, useRef } from 'react'
import { initMetaball } from './metaball-logic'

export default function MetaballCanvas({ className }: { className?: string }) {
    const stageRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const stage = stageRef.current
        const canvas = canvasRef.current
        if (!stage || !canvas) return

        const { cleanup } = initMetaball(stage, canvas)
        return cleanup
    }, [])

    return (
        <div ref={stageRef} className={`relative overflow-hidden ${className ?? ''}`}>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full block"
                aria-hidden="true"
            />
        </div>
    )
}
