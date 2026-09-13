export const SHELF_PERSPECTIVE = 1200

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
    return {
        x: 8 * turn,
        // Pivot at the bottom edge and keep its projected position above the ledge.
        y: height / 2 * (1 - Math.cos(radians)) - height / 2 * forward / SHELF_PERSPECTIVE - lift * (1 - forward / SHELF_PERSPECTIVE),
        z: forward - height / 2 * Math.sin(radians),
        pitch,
        rotation: 90 - 82 * turn,
    }
}
