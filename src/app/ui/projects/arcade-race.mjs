export const HORSES = [
    { id: 'A', name: 'Gold Rush', silk: '#ffdf1b', coat: '#ab6738' },
    { id: 'B', name: 'Rose Rocket', silk: '#f7819a', coat: '#e8d8b8' },
    { id: 'C', name: 'Blue Bolt', silk: '#80c8ef', coat: '#936044' },
]
export const RETURN_SECONDS = 2.4
export const STARTING_BALANCE = 10000
export const MIN_STAKE = 100
export const STAKES = [100, 200, 500, 1000, 2000, 2500, 5000, 10000, 50000, 100000]

/** @param {number} stake */
export function stakeName(stake) {
    return ({ 100: 'A quid', 200: 'Two quid', 500: 'A fiver', 1000: 'A tenner', 2000: 'A score', 2500: 'A pony', 5000: 'A bullseye', 10000: 'A ton', 50000: 'A monkey', 100000: 'A grand' })[stake] ?? `${stake / 100} quid`
}

/** @param {number} width @param {number} lane */
export function trackGeometry(width, lane) {
    const trackWidth = Math.max(360, width)
    const clearance = width < 500 ? 84 : 94
    return {
        start: clearance,
        finish: trackWidth - 155,
        end: trackWidth - clearance,
        slotStart: 12,
        slotEnd: trackWidth - 12,
        slot: 82 + lane * 45,
        returnY: 172 + lane * 2,
    }
}

/** @param {number} choice @param {() => number} random */
export function createRace(choice, random = Math.random) {
    if (![0, 1, 2].includes(choice)) throw new RangeError('Choose a horse')
    const rivals = [0, 1, 2].filter(index => index !== choice)
    const winner = random() < 2 / 3 ? choice : rivals[Math.floor(random() * 2)]
    const finishTimes = [0, 1, 2].map(index =>
        index === winner ? 5.4 : 6 + rivals.concat(choice).indexOf(index) * .22 + random() * .2
    )
    return { choice, winner, finishTimes, duration: Math.max(...finishTimes) + RETURN_SECONDS }
}

/** The origin is the foot of the mounting rod. After the finish, the carrier
 * reaches the end roller and curves underneath; the horse stays rigid on its rod.
 * @param {number} progress @param {number} width @param {number} lane
 */
export function loopPosition(progress, width, lane) {
    const p = Math.min(1, Math.max(0, progress))
    const { start, finish, end, slot, returnY } = trackGeometry(width, lane)
    if (p <= .7) return { x: start + (finish - start) * p / .7, y: slot, angle: 0 }
    if (p <= .75) return { x: finish + (end - finish) * (p - .7) / .05, y: slot, angle: 0 }
    const middle = (slot + returnY) / 2, radius = (returnY - slot) / 2
    if (p <= .83) {
        const turn = (p - .75) / .08 * Math.PI
        return { x: end + 8 * Math.sin(turn), y: middle - radius * Math.cos(turn), angle: turn * 180 / Math.PI }
    }
    if (p <= .95) return { x: end - (end - start) * (p - .83) / .12, y: returnY, angle: 180 }
    const turn = (p - .95) / .05 * Math.PI
    return { x: start - 8 * Math.sin(turn), y: middle + radius * Math.cos(turn), angle: 180 + turn * 180 / Math.PI }
}

/** @param {number} elapsed @param {number} finishTime @param {number} lane */
export function raceProgress(elapsed, finishTime, lane) {
    if (elapsed >= finishTime + RETURN_SECONDS) return 1
    if (elapsed >= finishTime) return .7 + .3 * Math.min(1, (elapsed - finishTime) / RETURN_SECONDS)
    const t = Math.max(0, elapsed / finishTime)
    const paced = t + .07 * Math.sin(t * Math.PI * 2 + lane) * t * (1 - t)
    return .7 * Math.min(.9999, paced)
}

/** All amounts are integer pence. This is an in-page arcade balance.
 * @param {number} balance @param {number} stake
 */
export function placeStake(balance, stake) {
    if (!Number.isSafeInteger(balance) || !Number.isSafeInteger(stake) || stake < MIN_STAKE || stake > balance) {
        throw new RangeError('Choose a stake within the balance')
    }
    return balance - stake
}

/** The original stake has already been deducted; a win returns twice the stake.
 * @param {number} balance @param {number} stake @param {boolean} won
 */
export function settleStake(balance, stake, won) {
    return balance + (won ? stake * 2 : 0)
}
