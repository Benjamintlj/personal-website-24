#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
backup_directory="$project_root/../notion-backup"
bucket="benlewisjones.com"
notion_archive="${1:-}"

# Load credentials so the script works unattended (e.g. from cron).
if [[ -f /etc/personal-website-24/notion.env ]]; then
    # shellcheck source=/dev/null
    source /etc/personal-website-24/notion.env
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

if [[ -n "${NOTION_API_KEY:-}" ]]; then
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
printf '{"updatedAt":"%s"}\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > "$project_root/public/deployment.json"

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
