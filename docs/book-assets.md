# Final Year Project book

The shelf and reader use Benjamin Lewis-Jones's original front cover, 14 mm spine,
back cover, preface and project report from his supplied print proof. The source
order was inspected read-only. The original proof and order details are not
included in this repository.

The reader numbers the 226 interior pages from the preface (page 1). Both covers
are unnumbered; stock blank endpapers and the two trailing blank source pages
(227 and 228) are omitted from navigation. Previous from
the preface folds directly onto the front cover, and Next opens it back to page 1.
The shelf presents the spine with a small glimpse of the front. Selecting it lifts
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
black cloth cover with a gold anchor, a moving foil highlight, and a title and
Ben Lewis-Jones's name on the spine. It uses the same flight and return geometry,
stopping at the closed front cover. The cover and the blue-outlined Open Site
button both link to `/building-a-storage-network/index.html`. The Contact link
has been removed. `scripts/prepare-book.mjs` copies the portfolio's B favicon into
the generated standalone book site without changing the source submodule.

`python3 scripts/prepare-fyp-book.py /path/to/proof.pdf` regenerates the web assets.
The renderer uses the PDF TrimBox to remove production marks and separates the
444 mm outer cover spread into 215 mm back, 14 mm spine and 215 mm front artwork.
Only the visible pages and adjacent page images are loaded by the reader.

The bookshelf, page-turning interaction and reader are original site code. No
Mixam application code, order controls, account credentials or remote embeds are
used by the website.
