import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createRace, loopPosition, trackGeometry, raceProgress, placeStake, settleStake, STARTING_BALANCE } from '../src/app/ui/projects/arcade-race.mjs'

test('the selected horse wins two thirds of the probability range', () => {
    for (const choice of [0, 1, 2]) {
        let wins = 0
        for (let i = 0; i < 300; i++) {
            let calls = 0
            const race = createRace(choice, () => calls++ === 0 ? (i + .5) / 300 : .5)
            if (race.winner === choice) wins++
            assert.equal(race.finishTimes.indexOf(Math.min(...race.finishTimes)), race.winner)
            assert.equal(raceProgress(race.finishTimes[race.winner], race.finishTimes[race.winner], race.winner), .7)
            for (const [lane, time] of race.finishTimes.entries()) assert.equal(raceProgress(race.duration, time, lane), 1)
        }
        assert.equal(wins, 200)
    }
})

test('both rival horses can win a losing round', () => {
    for (const choice of [0, 1, 2]) {
        const winners = [0, .99].map(pick => { let calls = 0; return createRace(choice, () => [ .9, pick, .5, .5 ][calls++]).winner })
        assert.deepEqual(winners.sort(), [0, 1, 2].filter(index => index !== choice))
    }
})

test('mounted horses cross the finish before curving around the rod foot and returning beneath the deck', () => {
    for (const width of [360, 720, 1100]) for (const lane of [0, 1, 2]) {
        const geometry = trackGeometry(width, lane)
        const start = loopPosition(0, width, lane), end = loopPosition(1, width, lane)
        assert.ok(Math.abs(start.x - end.x) < .001 && Math.abs(start.y - end.y) < .001)
        const finish = loopPosition(.7, width, lane), runout = loopPosition(.74, width, lane)
        assert.equal(finish.x, geometry.finish)
        assert.ok(runout.x > finish.x)
        assert.equal(runout.y, geometry.slot)
        assert.equal(runout.angle, 0)
        const turn = loopPosition(.79, width, lane)
        assert.ok(turn.x > geometry.end)
        assert.ok(turn.y > geometry.slot && turn.y < geometry.returnY)
        assert.ok(Math.abs(turn.angle - 90) < .001)
        const under = loopPosition(.88, width, lane)
        assert.equal(under.angle, 180)
        assert.equal(under.y, geometry.returnY)
        assert.ok(under.y >= 172 && under.y <= 176)
        assert.ok(loopPosition(.92, width, lane).x < under.x)
        for (const boundary of [.7, .75, .83, .95]) {
            const a = loopPosition(boundary - 1e-7, width, lane), b = loopPosition(boundary + 1e-7, width, lane)
            assert.ok(Math.hypot(a.x - b.x, a.y - b.y) < .01)
            assert.ok(Math.abs(a.angle - b.angle) < .01)
        }
    }
})

test('both turns keep the complete mounted horse within the slot ends and close beneath the turf', () => {
    for (const width of [360, 720, 1100]) for (const lane of [0, 1, 2]) {
        const geometry = trackGeometry(width, lane)
        const scale = width < 500 ? .64 : .72
        for (let p = .75; p <= 1; p += .001) {
            const position = loopPosition(p, width, lane)
            const radians = position.angle * Math.PI / 180
            for (const [x, y] of [[-44, -88], [44, -88], [-44, 0], [44, 0]]) {
                const paintedX = position.x + scale * (x * Math.cos(radians) - y * Math.sin(radians))
                assert.ok(paintedX >= geometry.slotStart && paintedX <= geometry.slotEnd)
            }
        }
        assert.ok(geometry.returnY + 88 * scale < 241)
    }
})

test('race progress remains forward until the finish and stops after returning', () => {
    for (const lane of [0, 1, 2]) {
        let previous = 0
        for (let t = 0; t < 5.4; t += .01) {
            const progress = raceProgress(t, 5.4, lane)
            assert.ok(progress >= previous && progress < .7)
            previous = progress
        }
        assert.equal(raceProgress(100, 5.4, lane), 1)
    }
})

test('stakes debit the balance and wins return twice the locked stake in integer pence', () => {
    const afterBet = placeStake(STARTING_BALANCE, 500)
    assert.equal(afterBet, 9500)
    assert.equal(settleStake(afterBet, 500, true), 10500)
    assert.equal(settleStake(afterBet, 500, false), 9500)
    assert.equal(settleStake(placeStake(10000, 101), 101, true), 10101)
    assert.equal(settleStake(placeStake(10000, 10000), 10000, false), 0)
    for (const stake of [0, -100, 99, 10001, NaN, 100.1]) assert.throws(() => placeStake(10000, stake), RangeError)
    assert.throws(() => createRace(3), RangeError)
})
