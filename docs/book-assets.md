# Books and reader

The first book uses Benjamin Lewis-Jones's original front cover, spine, back
cover, preface and project report from his supplied print proof. The source order
was inspected read-only. The original proof and order details are not included
in this repository.

The reader numbers 226 interior pages from the preface (page 1). Both covers are
unnumbered; blank endpapers and the trailing blank source pages 227 and 228 are
omitted from navigation. Previous from the preface folds directly onto the front
cover. Next from page 226 closes the back cover; opening it returns to page 226.
The cover hinges and page elements remain mounted throughout those transitions.

## Glass ledge and motion

The books rest at an 86-degree angle with touching spines on a rounded glass
shelf. Its top and cut edge are projected from the same centred camera, with
symmetric depth, softly rounded corners, frosted transmission, a refracting edge
and book contact shadows. There is no decorative divider across the glass and
no cabinet, back or walls. The depth accommodates the whole book footprint.
Both books tip forward from their
bottom edge as though pulled from the top, lift clear, and turn towards the
reader. The left book clears its neighbour before turning; the right can turn
earlier. A shared reversible path handles hover, focus, early clicks and return
from either reader cover.

Each cover has a solid board, inner lining and top, bottom and fore-edge faces,
with the pages inset between them. The white and black bindings remain visible
at grazing angles instead of exposing a page block with missing covers. The
original matte artwork is unchanged.

The pickup follows the angled book's own slot and pivots about its bottom edge.
The path compensates for perspective so the book's projected bottom stays above
the ledge. Drawing order follows each book's depth, including when switching
between books during a return, and stays raised until the return finishes.
The modal keeps the original camera, pivot, dimensions, depth, pitch and current
pickup progress for a continuous handoff. The back cover uses the opposite edge
of the spine and the corresponding rotated depth offset. Fractional shelf
coordinates are retained for the mobile handoff. Reduced-motion settings
skip the flight. Escape, the close button and clicking outside close the book.

## Building a Storage Network

The second book is slightly shorter and thicker. Its black cover and spine use
Cormorant Garamond Regular copied from the owner's installed font:
`public/fonts/CormorantGaramond-Regular.ttf`. The font is served locally so visitors
see the same typography. The title and author have the same 16-unit size on the
spine, with the title near the top and author near the bottom, following the
original book's spacing. Aspect-ratio-preserving rendering prevents stretching.

There are no spine rules, cover border, moving foil highlight or glossy strips.
The matte-gold anchor is Phosphor Icons' **Anchor Simple, Light**, with the
original geometry and only its fill changed:

- Source: https://github.com/phosphor-icons/core/blob/main/assets/light/anchor-simple-light.svg
- Local asset: `public/books/icons/anchor-simple-light.svg`
- MIT licence: `public/books/icons/LICENSE.txt`
- Cormorant licence: `public/fonts/OFL-CormorantGaramond.txt`
- Font upstream: https://github.com/CatharsisFonts/Cormorant

Selecting this book stops at its closed cover. The cover and solid-blue
Continue to site button link to `/building-a-storage-network/index.html`. The
button sits halfway between the cover and viewport bottom, aligned with the
floating contact icon. The redundant Contact link is removed.
`scripts/prepare-book.mjs` copies the portfolio's B favicon to the generated
standalone book site without changing the source submodule.

## Original print assets

`python3 scripts/prepare-fyp-book.py /path/to/proof.pdf` regenerates the web assets.
The renderer uses the PDF TrimBox to remove production marks and separates the
444 mm outer cover spread into 215 mm back, 14 mm spine and 215 mm front artwork.
Only the visible pages and adjacent page images are loaded by the reader.

The bookshelf, page-turning interaction and reader are original site code. No
Mixam application code, order controls, credentials or remote embeds are used.
