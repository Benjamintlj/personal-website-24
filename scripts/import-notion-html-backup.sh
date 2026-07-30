#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
backup_archive="${1:-$project_root/../notion-backup/30-07-2026}"
destination="$project_root/public/notes"
staging_directory="$(mktemp -d)"
trap 'rm -rf "$staging_directory"' EXIT

[[ -f "$backup_archive" ]] || { echo "Backup not found: $backup_archive" >&2; exit 1; }
bsdtar -xf "$backup_archive" -C "$staging_directory"
nested_archive="$(find "$staging_directory" -maxdepth 1 -name 'ExportBlock-*.zip' -type f -print -quit)"
[[ -n "$nested_archive" ]] || { echo "No Notion HTML export found." >&2; exit 1; }

if [[ -e "$destination" ]]; then
    find "$destination" -depth -delete
fi
mkdir -p "$destination"
bsdtar -xf "$nested_archive" -C "$destination"
find "$destination" -name '*.html' -type f -exec perl -0pi -e 's~</head>~<style>html{background:#000}body{background:#000!important;color:#e5e5e5!important}a,a.visited{color:#93c5fd!important}.source{background:#171717!important;border-color:#404040!important}.callout{background:#171717!important}.page-body table td,.page-body table th{border-color:#404040!important}pre,code{background:#171717!important;color:#e5e5e5!important}pre[class*="language-"],pre[class*="language-"] *,code[class*="language-"],code[class*="language-"] *{text-shadow:none!important}code[class*="language-"] span{background:transparent!important}hr{border-color:#404040!important}</style></head>~' {} +
echo "Imported Notion HTML into $destination"
