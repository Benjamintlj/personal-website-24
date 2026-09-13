'use client'

import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import Image from 'next/image'
import { useInView, useReducedMotion } from 'framer-motion'
import Racehorse from './arcade-horse'
import ArcadeMoney from './arcade-money'
import { HORSES, STARTING_BALANCE, MIN_STAKE, STAKES, stakeName, trackGeometry, createRace, loopPosition, raceProgress, placeStake, settleStake } from './arcade-race.mjs'
import styles from './arcade-race.module.css'

type RunningRace = ReturnType<typeof createRace> & { elapsed: number; announced: boolean; stake: number }

function MountedHorse({ silk, coat }: { silk: string; coat: string }) {
    return <>
        <rect x="-2.5" y="-32" width="5" height="32" fill="#94a08c" />
        <rect x="-1" y="-32" width="1.5" height="32" fill="#d2d6b9" />
        <g transform="translate(-44 -88)"><Racehorse silk={silk} coat={coat} /></g>
    </>
}

export default function Bet365Card({ onOpen }: { onOpen: () => void }) {
    const ref = useRef<HTMLDivElement>(null)
    const horseRefs = useRef<(SVGGElement | null)[]>([])
    const shadowRefs = useRef<(SVGGElement | null)[]>([])
    const race = useRef<RunningRace | null>(null)
    const wallet = useRef(STARTING_BALANCE)
    const [width, setWidth] = useState(1000)
    const [balance, setBalance] = useState(STARTING_BALANCE)
    const [stake, setStake] = useState(500)
    const [choice, setChoice] = useState<number | null>(null)
    const [winner, setWinner] = useState<number | null>(null)
    const [racing, setRacing] = useState(false)
    const [ready, setReady] = useState(false)
    const [status, setStatus] = useState('Set your stake, then choose a horse.')
    const visible = useInView(ref, { margin: '40px' })
    const reducedMotion = !!useReducedMotion()
    const id = useId().replace(/:/g, '')
    const validStake = stake >= MIN_STAKE && stake <= balance
    const lowerStake = [...STAKES].reverse().find(amount => amount < stake && amount <= balance)
    const higherStake = STAKES.find(amount => amount > stake && amount <= balance)

    useEffect(() => {
        setReady(true)
        const element = ref.current
        if (!element) return
        const resize = new ResizeObserver(([entry]) => setWidth(Math.max(360, entry.contentRect.width)))
        resize.observe(element)
        return () => resize.disconnect()
    }, [])

    useEffect(() => {
        let frame = 0
        let lastTime = 0
        const tick = (time: number) => {
            const delta = lastTime ? Math.min((time - lastTime) / 1000, .05) : 0
            lastTime = time
            const current = race.current
            if (current && visible && !document.hidden) current.elapsed += delta
            HORSES.forEach((_, index) => {
                let progress = current ? raceProgress(current.elapsed, current.finishTimes[index], index) : 0
                if (reducedMotion && current) progress = current.elapsed >= current.finishTimes[index] ? .7 : 0
                const position = loopPosition(progress, width, index)
                const transform = `translate(${position.x} ${position.y}) rotate(${position.angle}) scale(${width < 500 ? .64 : .72})`
                horseRefs.current[index]?.setAttribute('transform', transform)
                shadowRefs.current[index]?.setAttribute('transform', transform)
            })
            if (current && current.elapsed >= current.finishTimes[current.winner] && !current.announced) {
                current.announced = true
                const won = current.winner === current.choice
                wallet.current = settleStake(wallet.current, current.stake, won)
                setBalance(wallet.current)
                setWinner(current.winner)
                setStatus(`Horse ${HORSES[current.winner].id} wins. ${won ? `£${(current.stake * 2 / 100).toFixed(2)} returned.` : 'Stake lost.'} Balance £${(wallet.current / 100).toFixed(2)}.`)
            }
            if (current && current.elapsed >= current.duration) {
                race.current = null
                setRacing(false)
                setStake(previous => previous > wallet.current ? [...STAKES].reverse().find(amount => amount <= wallet.current) ?? MIN_STAKE : previous)
            }
            if (race.current) frame = requestAnimationFrame(tick)
        }
        tick(0)
        return () => cancelAnimationFrame(frame)
    }, [width, visible, reducedMotion, racing])

    const backHorse = (index: number) => {
        if (!ready || race.current || !validStake) return
        wallet.current = placeStake(wallet.current, stake)
        setBalance(wallet.current)
        race.current = { ...createRace(index), stake, elapsed: -.9, announced: false }
        setChoice(index)
        setWinner(null)
        setRacing(true)
        setStatus(`£${(stake / 100).toFixed(2)} on horse ${HORSES[index].id}. Racing.`)
    }

    const geometry = trackGeometry(width, 0)
    const horseScale = width < 500 ? .64 : .72
    const finishLine = geometry.finish + 32 * horseScale
    return <div ref={ref} className={styles.arcade}>
        <div className={styles.header}>
            <button type="button" onClick={onOpen} aria-label="Read about bet365" className={styles.logoButton}>
                <Image src="/images/bet365/wordmark.svg" alt="bet365" width={340} height={73} unoptimized className={styles.logo} />
            </button>
            <div className={styles.balance}>
                <span className={styles.label}>Balance</span>
                <ArcadeMoney amount={balance} reducedMotion={reducedMotion} />
            </div>
        </div>
        <button type="button" className={styles.preview} onClick={onOpen} aria-label="About my role at bet365">
            <svg className={styles.scene} viewBox={`0 0 ${width} 246`} aria-hidden="true">
                <defs>
                    <clipPath id={`${id}-cellar`}><rect y="193" width={width} height="53" /></clipPath>
                    {HORSES.map((horse, index) => <clipPath key={horse.id} id={`${id}-surface-${index}`}>
                        <rect width={width} height={trackGeometry(width, index).slot} />
                    </clipPath>)}
                    <linearGradient id={`${id}-turf`} gradientUnits="userSpaceOnUse" x1="0" y1="48" x2="0" y2="183"><stop stopColor="#26352a" /><stop offset="1" stopColor="#19201b" /></linearGradient>
                    <pattern id={`${id}-finish`} width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 0H4V4H0ZM4 4H8V8H4Z" fill="#a4ac94" /></pattern>
                </defs>
                <path d="M0 47V36H30V26H65V35H104V13H147V27H180V40H230V32H265V47Z" fill="#28362a" opacity=".5" />
                {/* The underfloor pass is behind the opaque deck, never visible through the turf. */}
                <g clipPath={`url(#${id}-cellar)`} className={styles.silhouette}>
                    {HORSES.map((horse, index) => <g key={horse.id} ref={node => { shadowRefs.current[index] = node }}>
                        <MountedHorse silk={horse.silk} coat={horse.coat} />
                    </g>)}
                </g>
                {HORSES.map((horse, index) => {
                    const { slot, start, slotStart, slotEnd } = trackGeometry(width, index)
                    return <g key={horse.id}>
                        {/* Each solid lane is a separate foreground piece of the cabinet. */}
                        <rect y={slot - 34} width={width} height="45" fill={`url(#${id}-turf)`} />
                        <rect x={finishLine} y={slot - 34} width="8" height="45" fill={`url(#${id}-finish)`} opacity=".4" />
                        <path d={`M${slotStart} ${slot}H${slotEnd}`} stroke="#080d0a" strokeWidth="5" />
                        <path d={`M${slotStart} ${slot + 3}H${slotEnd}`} stroke="#63715c" strokeWidth="1" opacity=".4" />
                        <g clipPath={`url(#${id}-surface-${index})`}>
                            <g ref={node => { horseRefs.current[index] = node }} transform={`translate(${start} ${slot}) scale(${horseScale})`}>
                                <MountedHorse silk={horse.silk} coat={horse.coat} />
                            </g>
                        </g>
                    </g>
                })}
                <path d={`M0 47H${width}`} stroke="#68775e" strokeWidth="3" />
                {Array.from({ length: Math.ceil(width / 75) }, (_, i) => <path key={i} d={`M${i * 75 + 12} 48v12`} stroke="#68775e" strokeWidth="2" />)}
                <rect y="183" width={width} height="10" fill="#11150f" />
                <path d={`M0 184H${width}`} stroke="#384031" strokeWidth="2" />
            </svg>
        </button>
        <div className={styles.controls}>
            <div className={styles.stake}>
                <span className={styles.label} id={`${id}-stake-label`}>Stake</span>
                <div className={styles.stakeControls}>
                    <button type="button" disabled={!ready || racing || lowerStake === undefined} onClick={() => lowerStake !== undefined && setStake(lowerStake)} aria-label="Decrease stake">−</button>
                    <output className={styles.stakeInput} aria-label={`Stake: ${stakeName(stake)}, £${stake / 100}`}>
                        {stakeName(stake)}
                    </output>
                    <button type="button" disabled={!ready || racing || higherStake === undefined} onClick={() => higherStake !== undefined && setStake(higherStake)} aria-label="Increase stake">+</button>
                </div>
            </div>
            <div className={styles.picks} role="group" aria-label="Bet on a horse">
                {HORSES.map((horse, index) => <button key={horse.id} type="button" disabled={!ready || racing || !validStake} aria-label={`Bet on horse ${horse.id}`} aria-pressed={choice === index} data-winner={winner === index} onClick={() => backHorse(index)} className={styles.pick} style={{ '--silk': horse.silk } as CSSProperties}>
                    <span className={styles.buttonHorse} aria-hidden="true"><Racehorse silk={horse.silk} coat={horse.coat} /></span>
                    <strong>{horse.id}</strong>
                </button>)}
            </div>
        </div>
        <p className="sr-only" role="status" aria-live="polite">{status}</p>
    </div>
}
