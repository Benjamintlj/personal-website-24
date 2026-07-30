# Personal Website

My personal website to show who i am.

## Updating the Notes export

The Notes button serves Notion's exported HTML directly from `public/notes`. The generated export files stay local and are intentionally ignored by Git.

When a new Notion HTML export is available, save the outer ZIP in the sibling `notion-backup` folder as `30-07-2026`, then run:

```bash
bash scripts/import-notion-html-backup.sh
```

The importer extracts Notion's nested ZIP into `public/notes` and adds the shared dark theme to every exported HTML page. This preserves the dark background, light text, blue links, syntax highlighting, and the code-block fixes for Prism's light text shadow and token backgrounds.

Build the static site for S3 with:

```bash
npm run build
```

Upload the contents of `out` to the root of the S3 bucket.
