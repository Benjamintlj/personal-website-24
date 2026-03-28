'use client'

import { DottedGlowBackground } from '@/components/ui/dotted-glow-background'

const SUBTITLE = 'AutoFin automates money movement through programmable workflows.'

export default function AutoFinCard() {
    return (
        <main className="relative flex h-full overflow-hidden">
            {/* dotted glow background — always visible, Discord purple */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    maskImage:
                        'radial-gradient(ellipse 60% 60% at 50% 50%, black 40%, transparent 100%)',
                    WebkitMaskImage:
                        'radial-gradient(ellipse 60% 60% at 50% 50%, black 40%, transparent 100%)',
                }}
            >
                <DottedGlowBackground
                    opacity={1}
                    gap={10}
                    radius={1.6}
                    color="rgba(88, 101, 242, 0.5)"
                    glowColor="rgba(88, 101, 242, 0.9)"
                    backgroundOpacity={0}
                    speedMin={0.1}
                    speedMax={0.2}
                    speedScale={1}
                />
            </div>

            {/* title + subtitle — centered, subtitle left-aligns to title */}
            <div className="relative z-10 w-full flex flex-col justify-center items-center px-8">
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-neutral-900 dark:text-neutral-300">
                        Finance automation,{' '}
                        <span className="font-bold dark:text-white">reimagined.</span>
                    </h2>
                    <p className="text-base text-neutral-600 dark:text-neutral-400 max-w-xs">
                        {SUBTITLE}
                    </p>
                </div>
            </div>
        </main>
    )
}
