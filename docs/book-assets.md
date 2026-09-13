# Final Year Project book

The shelf and reader use Benjamin Lewis-Jones's original front cover, 14 mm spine,
back cover, preface and project report from his supplied print proof. The source
order was inspected read-only. The original proof and order details are not
included in this repository.

The reader preserves the 228 interior pages and the six stock-white endpaper
positions shown by the print preview, plus both covers (236 physical page faces).
The shelf presents the spine with a small glimpse of the front. Selecting it lifts
the closed book to the centre, pauses on its front cover, then opens it from the
spine into the preface. The inside cover stays plain. Earlier endpapers and both
covers remain reachable using page navigation. No storage-network book has been
added to this shelf.

`python3 scripts/prepare-fyp-book.py /path/to/proof.pdf` regenerates the web assets.
The renderer uses the PDF TrimBox to remove production marks and separates the
444 mm outer cover spread into 215 mm back, 14 mm spine and 215 mm front artwork.
Only the visible pages and adjacent page images are loaded by the reader.

The bookshelf, page-turning interaction and reader are original site code. No
Mixam application code, order controls, account credentials or remote embeds are
used by the website.
