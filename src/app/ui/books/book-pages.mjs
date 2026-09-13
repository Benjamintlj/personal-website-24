export const BOOK = {
    title: 'Final Year Project — NTU',
    author: 'Benjamin Lewis-Jones',
    pageCount: 228,
    firstContentPage: 1,
    lastContentPage: 228,
    lastPage: 229,
    assetRoot: '/books/final-year-project',
}

/** Numbered interior pages, with unnumbered covers at either end.
 * @param {number | null} index
 */
export function bookPage(index) {
    if (index === 0) return { image: `${BOOK.assetRoot}/front-cover.webp`, label: 'Front cover', text: null }
    if (index === BOOK.lastPage) return { image: `${BOOK.assetRoot}/back-cover.webp`, label: 'Back cover', text: null }
    if (index !== null && index >= 1 && index <= BOOK.lastContentPage) {
        const page = String(index).padStart(3, '0')
        return { image: `${BOOK.assetRoot}/page-${page}.webp`, label: `Page ${index}`, text: `${BOOK.assetRoot}/page-${page}.json` }
    }
    return { image: null, label: 'Inside cover', text: null }
}

/** @param {number} index @param {boolean} narrow @returns {(number | null)[]} */
export function spreadPages(index, narrow) {
    if (narrow || index === 0 || index === BOOK.lastPage) return [index]
    if (index === 1) return [null, 1]
    const left = index % 2 ? index - 1 : index
    return [left, left < BOOK.lastContentPage ? left + 1 : null]
}

/** @param {number} index @param {number} direction @param {boolean} narrow */
export function adjacentPage(index, direction, narrow) {
    if (narrow) return Math.max(0, Math.min(BOOK.lastPage, index + direction))
    if (direction > 0) {
        if (index === 0) return 1
        if (index >= BOOK.lastContentPage) return BOOK.lastPage
        const right = index % 2 ? index : index + 1
        return Math.min(BOOK.lastContentPage, right + 2)
    }
    if (index === BOOK.lastPage) return BOOK.lastContentPage
    if (index <= 1) return 0
    const left = index % 2 ? index - 1 : index
    return left - 1
}
