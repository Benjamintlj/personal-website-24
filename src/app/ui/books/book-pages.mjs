export const BOOK = {
    title: 'Final Year Project — NTU',
    author: 'Benjamin Lewis-Jones',
    pageCount: 236,
    firstContentPage: 4,
    lastPage: 235,
    assetRoot: '/books/final-year-project',
}

/** Zero-based physical page index, including the covers and white endpapers.
 * @param {number} index
 */
export function bookPage(index) {
    if (index === 0) return { image: `${BOOK.assetRoot}/front-cover.webp`, label: 'Front cover', text: null }
    if (index === BOOK.lastPage) return { image: `${BOOK.assetRoot}/back-cover.webp`, label: 'Back cover', text: null }
    if (index >= 4 && index <= 231) {
        const page = String(index - 3).padStart(3, '0')
        return { image: `${BOOK.assetRoot}/page-${page}.webp`, label: `Book page ${index - 3}`, text: `${BOOK.assetRoot}/page-${page}.json` }
    }
    return { image: null, label: 'White endpaper', text: null }
}

/** @param {number} index @param {boolean} narrow */
export function spreadPages(index, narrow) {
    if (narrow || index === 0 || index === BOOK.lastPage) return [index]
    const left = index % 2 ? index : index - 1
    return [left, left + 1]
}

/** @param {number} index @param {number} direction @param {boolean} narrow */
export function adjacentPage(index, direction, narrow) {
    if (narrow) return Math.max(0, Math.min(BOOK.lastPage, index + direction))
    if (direction > 0) return Math.min(BOOK.lastPage, index === 0 ? 2 : Math.ceil(index / 2) * 2 + 2)
    return Math.max(0, index === BOOK.lastPage ? 234 : Math.ceil(index / 2) * 2 - 2)
}
