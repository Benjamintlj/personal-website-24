export const SHELF_PERSPECTIVE = 1200
export const SHELF_REST_ANGLE = 86
export const SHELF_AXIS_ANGLE = SHELF_REST_ANGLE - 90
const axis = SHELF_AXIS_ANGLE * Math.PI / 180

/** Tilt around the book's own bottom edge, even when it is angled in its slot. */
export function bookRotation(rotation: number, pitch: number) {
    return `rotateY(${SHELF_AXIS_ANGLE}deg) rotateX(${pitch}deg) rotateY(${rotation - SHELF_AXIS_ANGLE}deg)`
}

export function coverNormal(rotation: number, pitch: number) {
    const yaw = (rotation - SHELF_AXIS_ANGLE) * Math.PI / 180
    const tilt = pitch * Math.PI / 180
    return {
        x: Math.cos(axis) * Math.sin(yaw) + Math.sin(axis) * Math.cos(tilt) * Math.cos(yaw),
        y: -Math.sin(tilt) * Math.cos(yaw),
        z: -Math.sin(axis) * Math.sin(yaw) + Math.cos(axis) * Math.cos(tilt) * Math.cos(yaw),
    }
}

const smooth = (value: number) => {
    const t = Math.max(0, Math.min(1, value))
    return t * t * (3 - 2 * t)
}

/** A top-first pickup, shared by hover and the reader's flight back to the shelf. */
export function shelfPose(progress: number, height: number, clearance: number, withdrawFirst: boolean) {
    const withdrawal = smooth((progress - .08) / .56)
    const turn = smooth((progress - (withdrawFirst ? .6 : .28)) / (withdrawFirst ? .4 : .72))
    const pitch = -12 * smooth(progress / .18) * (1 - smooth((progress - .4) / .6))
    const radians = pitch * Math.PI / 180
    const forward = clearance * withdrawal
    const lift = 12 * smooth(progress / .16)
    const across = 8 * turn
    const towards = forward - height / 2 * Math.sin(radians)
    const bottomForward = -across * Math.sin(axis) + forward * Math.cos(axis)
    return {
        x: across * Math.cos(axis) + towards * Math.sin(axis),
        // Pivot at the bottom edge and keep its projected position above the ledge.
        y: height / 2 * (1 - Math.cos(radians)) - height / 2 * bottomForward / SHELF_PERSPECTIVE - lift * (1 - bottomForward / SHELF_PERSPECTIVE),
        z: -across * Math.sin(axis) + towards * Math.cos(axis),
        pitch,
        rotation: SHELF_REST_ANGLE + (8 - SHELF_REST_ANGLE) * turn,
    }
}
