#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
backup_directory="$project_root/../notion-backup"
bucket="benlewisjones.com"
notion_archive="${1:-}"

if [[ -z "${NOTION_API_KEY:-}" && -z "$notion_archive" ]]; then
    for candidate in "$backup_directory"/*; do
        [[ -f "$candidate" ]] || continue
        [[ "$(basename "$candidate")" == .* ]] && continue
        if [[ -z "$notion_archive" || "$candidate" -nt "$notion_archive" ]]; then
            notion_archive="$candidate"
        fi
    done
fi

if [[ -n "${NOTION_API_KEY:-}" ]]; then
    echo "Fetching the Computer Science page from Notion"
    node "$project_root/scripts/fetch-notion-notes.mjs"
elif [[ -n "$notion_archive" && -f "$notion_archive" ]]; then
    echo "Importing Notion export: $notion_archive"
    bash "$project_root/scripts/import-notion-html-backup.sh" "$notion_archive"
else
    echo "No Notion export archive found. Put it in $backup_directory or pass its path as the first argument." >&2
    exit 1
fi

command -v aws >/dev/null || {
    echo "AWS CLI is required to deploy to S3." >&2
    exit 1
}

echo "Building static site"
(
    cd "$project_root"
    npm run build
)

echo "Syncing changed files to s3://$bucket"
aws s3 sync "$project_root/out/" "s3://$bucket/" --delete --only-show-errors
echo "Deployment complete"
