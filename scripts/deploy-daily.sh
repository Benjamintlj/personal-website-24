#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
backup_directory="$project_root/../notion-backup"
bucket="benlewisjones.com"
notion_archive="${1:-}"
book_if_changed=false
if [[ "$notion_archive" == --book-if-changed ]]; then
    book_if_changed=true
    notion_archive=""
elif [[ "$notion_archive" == --* ]]; then
    printf 'Usage: %s [--book-if-changed | notion-export.zip]\n' "$0" >&2
    exit 1
fi

# Load credentials so the script works unattended (e.g. from cron).
if [[ -f /etc/personal-website-24/notion.env ]]; then
    # shellcheck source=/dev/null
    source /etc/personal-website-24/notion.env
fi

# The nightly refresh and book polling must never build or sync concurrently.
state_directory="${DEPLOY_STATE_DIR:-${XDG_STATE_HOME:-$HOME/.local/state}/personal-website}"
mkdir -p "$state_directory"
if command -v flock >/dev/null; then
    exec 9>"$state_directory/deploy.lock"
    if $book_if_changed; then
        flock -n 9 || exit 0
    elif ! flock -w 1800 9; then
        printf 'Timed out waiting for the active website deployment.\n' >&2
        exit 1
    fi
elif [[ "$(uname -s)" == Linux ]]; then
    printf 'flock is required for safe unattended deployments.\n' >&2
    exit 1
fi

# Follow main even when the parent repository still records an older book commit.
# Fail instead of prompting for credentials in an unattended job.
export GIT_TERMINAL_PROMPT=0
export GIT_SSH_COMMAND="${GIT_SSH_COMMAND:-ssh -o BatchMode=yes -o ConnectTimeout=15}"
book_path="content/building-a-storage-network"
if [[ -e "$project_root/$book_path/.git" ]] &&
    [[ -n "$(git -C "$project_root/$book_path" status --porcelain)" ]]; then
    printf 'Book checkout has local edits; refusing to replace or publish them.\n' >&2
    exit 1
fi
git -C "$project_root" submodule sync --quiet --recursive
git -C "$project_root" submodule update --quiet --init --remote --recursive -- "$book_path"
book_revision="$(git -C "$project_root/$book_path" rev-parse HEAD)"
revision_file="$state_directory/published-book-revision"
if $book_if_changed && [[ -f "$revision_file" ]] &&
    [[ "$(cat "$revision_file")" == "$book_revision" ]]; then
    exit 0
fi

# ── Logging ───────────────────────────────────────────────────────────────────
# Primary log location for a system service; fall back to the XDG state dir
# if /var/log/personal-website/ is not writable (e.g. running as a non-root user).
LOG_DIR="${LOG_DIR:-/var/log/personal-website}"
if ! { [[ -d "$LOG_DIR" ]] || mkdir -p "$LOG_DIR" 2>/dev/null; } || ! [[ -w "$LOG_DIR" ]]; then
    LOG_DIR="${XDG_STATE_HOME:-$HOME/.local/state}/personal-website/logs"
    mkdir -p "$LOG_DIR"
fi
LOG_FILE="$LOG_DIR/deploy-$(date -u +%Y-%m-%d).log"

# Tee all output (stdout + stderr) to the log file for the rest of the script.
exec > >(tee -a "$LOG_FILE") 2>&1

log()   { printf '[%s] INFO  %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*"; }
warn()  { printf '[%s] WARN  %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*"; }
error() { printf '[%s] ERROR %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*"; }

DEPLOY_START=$SECONDS
trap '
    exit_code=$?
    elapsed=$((SECONDS - DEPLOY_START))
    if [[ $exit_code -ne 0 ]]; then
        error "Deploy FAILED (exit code $exit_code) after ${elapsed}s"
        error "Full log: $LOG_FILE"
    else
        log "Deploy completed successfully in ${elapsed}s"
        log "Full log: $LOG_FILE"
    fi
    # Remove log files older than 30 days.
    find "$LOG_DIR" -name "deploy-*.log" -mtime +30 -delete 2>/dev/null || true
' EXIT

log "════════════════════════════════════════════════════════════"
log "Deploy started — host: $(hostname -f 2>/dev/null || hostname), user: $(whoami)"
log "Project root: $project_root"
log "Log file: $LOG_FILE"
log "Book revision: $book_revision"
log "════════════════════════════════════════════════════════════"

# ── Select Notion content source ──────────────────────────────────────────────
if [[ -z "${NOTION_API_KEY:-}" && -z "$notion_archive" ]]; then
    for candidate in "$backup_directory"/*; do
        [[ -f "$candidate" ]] || continue
        [[ "$(basename "$candidate")" == .* ]] && continue
        if [[ -z "$notion_archive" || "$candidate" -nt "$notion_archive" ]]; then
            notion_archive="$candidate"
        fi
    done
fi

if $book_if_changed; then
    # A full-site sync must not remove Notes when starting from a fresh checkout.
    for required in notes-nav.json notes-search.json deployment.json; do
        if [[ ! -s "$project_root/public/$required" ]]; then
            error "Existing Notes export is missing. Run npm run deploy:daily once before enabling book updates."
            exit 1
        fi
    done
    for required in notes notes-md; do
        if [[ ! -d "$project_root/public/$required" ]] ||
            [[ -z "$(find "$project_root/public/$required" -type f -print -quit)" ]]; then
            error "Existing Notes export is missing. Run npm run deploy:daily once before enabling book updates."
            exit 1
        fi
    done
    log "Reusing the existing Notes export for this book update"
elif [[ -n "${NOTION_API_KEY:-}" ]]; then
    log "Fetching the Computer Science page from Notion API"
    node "$project_root/scripts/fetch-notion-notes.mjs"
    log "Notion fetch complete"
elif [[ -n "$notion_archive" && -f "$notion_archive" ]]; then
    log "Importing Notion export: $notion_archive"
    bash "$project_root/scripts/import-notion-html-backup.sh" "$notion_archive"
    log "Notion import complete"
else
    error "No Notion export archive found. Put it in $backup_directory or pass its path as the first argument."
    exit 1
fi

# ── Preflight checks ──────────────────────────────────────────────────────────
if ! command -v aws >/dev/null; then
    error "AWS CLI not found — install it or add it to PATH before deploying."
    exit 1
fi

# ── Build ──────────────────────────────────────────────────────────────────────
if ! $book_if_changed; then
    printf '{"updatedAt":"%s"}\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > "$project_root/public/deployment.json"
fi

log "Building static site"
build_start=$SECONDS
(
    cd "$project_root"
    npm run build
)
log "Build complete in $((SECONDS - build_start))s"

# ── Deploy to S3 ──────────────────────────────────────────────────────────────
log "Syncing changed files to s3://$bucket"
sync_start=$SECONDS
aws s3 sync "$project_root/out/" "s3://$bucket/" --delete --exact-timestamps --only-show-errors
log "S3 sync complete in $((SECONDS - sync_start))s"

# Failed builds/uploads leave the previous revision here, so the next poll retries.
printf '%s\n' "$book_revision" > "$revision_file.tmp"
mv "$revision_file.tmp" "$revision_file"
