# Personal Website

My personal website to show who i am.

## Building a Storage Network

The button below Notes opens `/building-a-storage-network/index.html`. The book is
included as a Git submodule in `content/building-a-storage-network`, pinned to a
specific revision of `Benjamintlj/building-a-storage-network`.

Clone with `git clone --recurse-submodules`, or initialise an existing checkout:

```bash
git submodule update --init --recursive
```

Both `npm run dev` and `npm run build` copy the book's committed `Book/index.html`,
`Book/assets/` and `Book/companion/` into `public/building-a-storage-network/`.
The generated copy is ignored by Git. Chapters, illustrations, interactive examples
and companion downloads are served together; no book authoring tools are needed.
The daily deployment initialises the submodule before building. The Pi needs Git
access to the private book repository as well as this website repository.

To publish a newer book revision, update and commit the submodule pointer in this
repository, push it, then pull and run the deployment on the Pi:

```bash
git submodule update --remote content/building-a-storage-network
git add content/building-a-storage-network
git commit -m "Update Building a Storage Network"
```

## Updating the Notes export

The Notes button serves Notion's exported HTML directly from `public/notes`. The generated export files stay local and are intentionally ignored by Git.

When a new Notion HTML export is available, save the outer ZIP in the sibling `notion-backup` folder as `30-07-2026`, then run:

```bash
bash scripts/import-notion-html-backup.sh
```

The importer extracts Notion's nested ZIP into `public/notes` and adds the shared dark theme to every exported HTML page. This preserves the dark background, light text, blue links, syntax highlighting, and the code-block fixes for Prism's light text shadow and token backgrounds.

Run the complete daily deployment after the Notion export has been downloaded into the sibling `notion-backup` folder:

```bash
npm run deploy:daily
```

When `NOTION_API_KEY` is set, the deployment fetches the shared Computer Science page directly from Notion, renders it with the dark theme, builds the static site, and syncs it to the `benlewisjones.com` S3 bucket. The S3 sync transfers only changed files and removes objects that are no longer generated locally. Without the key, it falls back to the newest ZIP export in the sibling `notion-backup` folder.

To deploy a particular export instead, pass its path through to the script:

```bash
bash scripts/deploy-daily.sh /path/to/notion-export.zip
```

## Raspberry Pi setup

Copy this repository and its sibling `notion-backup` folder to the Pi, then install the project dependencies with `npm ci`. The Pi also needs the AWS CLI configured with credentials that can list, upload, and delete objects in the `benlewisjones.com` bucket. For API-based publishing, set `NOTION_API_KEY` in the Pi job's environment and share the Computer Science page with that Notion connection. For ZIP-export fallback, install either `bsdtar` or `unzip`.

The daily job only needs to run `npm run deploy:daily` from the project folder. With the API key it fetches Notion directly; otherwise it finds the newest ZIP export automatically. The script is independent of the laptop's paths and dates.
