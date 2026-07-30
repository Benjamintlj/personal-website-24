#!/usr/bin/env bash

set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
backup_archive="${1:-$project_root/../notion-backup/30-07-2026}"
destination="$project_root/content/notion"
staging_directory="$(mktemp -d)"

cleanup() {
    rm -rf "$staging_directory"
}
trap cleanup EXIT

if [[ ! -f "$backup_archive" ]]; then
    echo "Notion backup archive not found: $backup_archive" >&2
    exit 1
fi

unzip -qq "$backup_archive" -d "$staging_directory"

nested_archives=("$staging_directory"/ExportBlock-*.zip)
if [[ ${#nested_archives[@]} -ne 1 || ! -f "${nested_archives[0]}" ]]; then
    echo "Expected exactly one Notion export archive inside the backup." >&2
    exit 1
fi

rm -rf "$destination"
mkdir -p "$destination"
unzip -qq "${nested_archives[0]}" -d "$destination"

echo "Imported Notion export into $destination"
