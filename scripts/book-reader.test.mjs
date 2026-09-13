import { test } from 'node:test'
import assert from 'node:assert/strict'
import { BOOK, bookPage, adjacentPage, spreadPages } from '../src/app/ui/books/book-pages.mjs'

test('the physical book includes both covers, six endpapers and every interior page in order', () => {
    const faces = Array.from({ length: BOOK.pageCount }, (_, index) => bookPage(index))
    assert.equal(faces[0].label, 'Front cover')
    assert.equal(faces.at(-1).label, 'Back cover')
    assert.equal(faces.filter(face => !face.image).length, 6)
    const pages = faces.filter(face => face.text)
    assert.equal(pages.length, 228)
    assert.equal(pages[0].image, `${BOOK.assetRoot}/page-001.webp`)
    assert.equal(pages.at(-1).image, `${BOOK.assetRoot}/page-228.webp`)
})

test('forward and backward navigation reaches every page without skipping or duplicating a spread', () => {
    for (const narrow of [false, true]) {
        const visited = new Set()
        let cursor = 0
        while (true) {
            spreadPages(cursor, narrow).forEach(page => visited.add(page))
            const next = adjacentPage(cursor, 1, narrow)
            if (next === cursor) break
            assert.equal(adjacentPage(next, -1, narrow), cursor)
            cursor = next
        }
        assert.equal(cursor, BOOK.lastPage)
        assert.equal(visited.size, BOOK.pageCount)
        assert.equal(adjacentPage(0, -1, narrow), 0)
    }
})

test('jumping to either side of a spread retains the selected page and correct facing page', () => {
    for (let page = 1; page < BOOK.lastPage; page++) {
        const spread = spreadPages(page, false)
        assert.ok(spread.includes(page))
        assert.equal(spread[0] % 2, 1)
        assert.equal(spread[1], spread[0] + 1)
        assert.ok(adjacentPage(page, 1, false) > spread[1])
        assert.ok(adjacentPage(page, -1, false) < spread[0])
    }
})
