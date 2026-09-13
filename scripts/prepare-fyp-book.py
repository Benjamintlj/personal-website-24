"""Render the author's print proof into trimmed website assets.
Usage: python3 scripts/prepare-fyp-book.py /path/to/proof.pdf
Requires pypdf, Pillow and pdftoppm. Does not change the source proof.
"""
import concurrent.futures
import json
from pathlib import Path
import subprocess
import sys
import tempfile
from PIL import Image
from pypdf import PdfReader

source = Path(sys.argv[1]).resolve()
output = Path(__file__).resolve().parent.parent / 'public/books/final-year-project'
output.mkdir(parents=True, exist_ok=True)
reader = PdfReader(source)
if len(reader.pages) != 229:
    raise ValueError('Expected one outer cover spread followed by 228 interior pages')
media_tops = [float(page.mediabox.top) for page in reader.pages]
trim_boxes = [list(page.trimbox) for page in reader.pages]


def render(number, bounds, name, width=1440):
    left, bottom, right, top = map(float, bounds)
    density = width / (right - left)
    height = round((top - bottom) * density)
    with tempfile.TemporaryDirectory() as directory:
        prefix = Path(directory) / name
        subprocess.run([
            'pdftoppm', '-f', str(number), '-l', str(number), '-singlefile',
            '-r', str(72 * density), '-x', str(round(left * density)),
            '-y', str(round((media_tops[number - 1] - top) * density)),
            '-W', str(width), '-H', str(height), '-png', str(source), str(prefix),
        ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
        with Image.open(prefix.with_suffix('.png')) as image:
            image.convert('RGB').save(output / f'{name}.webp', 'WEBP', quality=88, method=6)

cover = list(map(float, reader.pages[0].trimbox))
spine_width = 14 / 25.4 * 72
cover_width = (cover[2] - cover[0] - spine_width) / 2
render(1, [cover[0], cover[1], cover[0] + cover_width, cover[3]], 'back-cover')
render(1, [cover[0] + cover_width, cover[1], cover[0] + cover_width + spine_width, cover[3]], 'spine', 94)
render(1, [cover[0] + cover_width + spine_width, cover[1], cover[2], cover[3]], 'front-cover')
print('Rendered front cover, spine and back cover.', flush=True)


# Extract text sequentially: PdfReader shares a seekable stream across pages.
for number in range(1, 229):
    text = reader.pages[number].extract_text().split('mixam - Assets Server')[0].strip()
    (output / f'page-{number:03}.json').write_text(json.dumps({'text': text}, ensure_ascii=False))

def render_body(number):
    render(number + 1, trim_boxes[number], f'page-{number:03}')
    return number

with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    for count, number in enumerate(pool.map(render_body, range(1, 229)), 1):
        if count % 20 == 0 or count == 228:
            print(f'Rendered {count}/228 interior pages.', flush=True)

print(f'Website assets: {output}', flush=True)
