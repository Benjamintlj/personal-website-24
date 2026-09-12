# Personal Website

My personal website to show who i am.

## Building a Storage Network

The button below Notes opens `/building-a-storage-network/index.html`. The book is
included as a Git submodule in `content/building-a-storage-network` from
`Benjamintlj/building-a-storage-network`. Local builds use the checked-out revision;
Pi deployments follow the book's `main` branch.

Clone with `git clone --recurse-submodules`, or initialise an existing checkout:

```bash
git submodule update --init --recursive
```

Both `npm run dev` and `npm run build` copy the book's committed `Book/index.html`,
`Book/assets/` and `Book/companion/` into `public/building-a-storage-network/`.
The generated copy is ignored by Git. Chapters, illustrations, interactive examples
and companion downloads are served together; no book authoring tools are needed.
Every deployment fetches the latest book from `main` before building. The Pi needs Git
access to the private book repository as well as this website repository.

The Pi checks for a new book commit every minute. Push to the book's `main` branch
to publish an update automatically; no commit to this website repository is needed.
After detecting a change, it rebuilds and uploads the entire site using the existing
Notes export. The nightly job still refreshes Notes. Book-only updates preserve
the Notes timestamp shown on the homepage.

The polling command is:

```bash
bash scripts/deploy-daily.sh --book-if-changed
```

It stays quiet when the last successfully published book revision is unchanged.
Failures are retried on the next check. A shared `flock` lock on the Pi prevents
the nightly job, polling and manual deployments from overlapping. Polling skips a
busy deployment; the nightly refresh waits so it is not lost at the minute boundary. Successful book
revisions and the lock are stored in `~/.local/state/personal-website/` (or
`DEPLOY_STATE_DIR` when set). A missing Notes export stops book-only deployment;
run the full daily deployment once to initialise it.

To update the book revision recorded for local development as well:

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

The Pi also runs the following crontab entry as `ben`. `timeout` bounds a stuck
polling run; the next minute retries once its lock is released. Keep the existing
daily entry alongside it. Output from changed revisions and failures goes to the
book-updates log and normal deployment logs.

```cron
* * * * * /usr/bin/timeout 30m /bin/bash /opt/personal-website-24/scripts/deploy-daily.sh --book-if-changed >> /var/log/personal-website/book-updates.log 2>&1
```
