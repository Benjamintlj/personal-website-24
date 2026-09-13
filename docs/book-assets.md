# Final Year Project book

The shelf and reader use Benjamin Lewis-Jones's original front cover, 14 mm spine,
back cover, preface and project report from his supplied print proof. The source
order was inspected read-only. The original proof and order details are not
included in this repository.

The reader numbers the 226 interior pages from the preface (page 1). Both covers
are unnumbered; stock blank endpapers and the two trailing blank source pages
(227 and 228) are omitted from navigation. Previous from
the preface folds directly onto the front cover, and Next opens it back to page 1.
The shelf presents touching spines, with both covers turned fully into the shelf.
Hovering or keyboard focus pulls a book forward and turns its cover towards the
reader. The left book withdraws completely before rotating, and reverses that
same path when hover or focus leaves, including interrupted motions. Clicking it
before withdrawal finishes completes the slide before the reader's turn begins.
Returning from either cover aligns the closed book outside the shelf before
sliding it back. The right book retains its simultaneous pull-and-turn motion.
The shelf is a walnut cabinet with rounded mouldings, full sides, a
recessed back and a floor deeper than either book. Its furniture panels have a
separate, centred perspective and share the generated walnut material documented
in [bookshelf-material.md](bookshelf-material.md). Selecting a book lifts
the closed book from the far left to the centre, then opens it from the spine
into the preface in one continuous animation. The same book and page elements
remain mounted throughout, over the dimmed website. Closing uses that same hinge
in reverse, then moves the closed book back to its shelf position. The back cover
uses a mirrored hinge: Next from the final interior page closes it, and Previous
or clicking the back cover reopens that page. Both covers retain the same spread
geometry throughout; returning from the back turns the book towards its original
shelf orientation. The return measures the shelf's current layout and matches its
perspective, spine pivot, width, height and depth before the shelf book reappears.
The inside front cover stays plain.

The second book, *Building a Storage Network*, has original vector artwork: a
black cloth cover with a semicircular gold anchor and a moving foil sheen. Its
author, title and anchor are spaced down the front, with the title and Ben
Lewis-Jones's name also on the spine. It is slightly shorter and thicker than the
first book. The spine preserves its artwork's aspect ratio, with the title and
author centred together, so the lettering is never stretched to fill its width.
It uses the same flight and return geometry, including the current
pull-out angle, stopping at the closed front cover. The cover and the solid blue
Continue to site button both link to `/building-a-storage-network/index.html`.
The button sits halfway between the cover and the viewport bottom, aligned with
the floating contact icon. The Contact link
has been removed. `scripts/prepare-book.mjs` copies the portfolio's B favicon into
the generated standalone book site without changing the source submodule.

`python3 scripts/prepare-fyp-book.py /path/to/proof.pdf` regenerates the web assets.
The renderer uses the PDF TrimBox to remove production marks and separates the
444 mm outer cover spread into 215 mm back, 14 mm spine and 215 mm front artwork.
Only the visible pages and adjacent page images are loaded by the reader.

The bookshelf, page-turning interaction and reader are original site code. No
Mixam application code, order controls, account credentials or remote embeds are
used by the website.
