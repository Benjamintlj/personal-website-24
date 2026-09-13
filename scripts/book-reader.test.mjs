import { test } from 'node:test'
import assert from 'node:assert/strict'
import { BOOK, bookPage, adjacentPage, spreadPages } from '../src/app/ui/books/book-pages.mjs'

test('the preface is page 1 and Previous goes straight to the unnumbered front cover', () => {
    assert.equal(bookPage(1).image, `${BOOK.assetRoot}/page-001.webp`)
    assert.equal(bookPage(1).label, 'Page 1')
    assert.equal(bookPage(0).label, 'Front cover')
    for (const narrow of [false, true]) {
        assert.equal(adjacentPage(1, -1, narrow), 0)
        assert.equal(adjacentPage(0, 1, narrow), 1)
        assert.equal(adjacentPage(0, -1, narrow), 0)
    }
    assert.deepEqual(spreadPages(1, false), [null, 1])
})

test('forward and backward navigation reaches all 226 numbered pages without blank endpapers', () => {
    for (const narrow of [false, true]) {
        const visited = new Set()
        let cursor = 0
        while (true) {
            spreadPages(cursor, narrow).filter(page => page !== null).forEach(page => visited.add(page))
            const next = adjacentPage(cursor, 1, narrow)
            if (next === cursor) break
            assert.equal(adjacentPage(next, -1, narrow), cursor)
            cursor = next
        }
        assert.equal(cursor, BOOK.lastPage)
        assert.equal(visited.size, BOOK.pageCount + 2)
        for (let page = 1; page <= BOOK.pageCount; page++) {
            assert.ok(visited.has(page))
            assert.ok(bookPage(page).text)
        }
    }
})

test('page jumps preserve facing-page pairs and the last interior page', () => {
    for (let page = 2; page <= BOOK.lastContentPage; page++) {
        const spread = spreadPages(page, false)
        assert.ok(spread.includes(page))
        assert.equal(spread[0] % 2, 0)
        assert.ok(adjacentPage(page, 1, false) > Math.max(...spread.filter(value => value !== null)))
        assert.ok(adjacentPage(page, -1, false) < spread[0])
    }
    assert.deepEqual(spreadPages(226, false), [226, null])
    assert.equal(bookPage(226).image, `${BOOK.assetRoot}/page-226.webp`)
    assert.equal(bookPage(227).label, 'Back cover')
    for (const narrow of [false, true]) {
        assert.equal(adjacentPage(226, 1, narrow), BOOK.lastPage)
        assert.equal(adjacentPage(BOOK.lastPage, -1, narrow), 226)
    }
})
