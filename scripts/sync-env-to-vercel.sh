#!/usr/bin/env bash
# Syncs env vars to Vercel from local env files.
#
#   .env.local              → preview
#   .env.production.local   → production
#
# Usage: bash scripts/sync-env-to-vercel.sh
# Requires: vercel CLI logged in and `vercel link` already run.

push_env() {
  local file="$1"
  local env="$2"

  if [[ ! -f "$file" ]]; then
    echo "  Skipping $file (not found)"
    return
  fi

  echo ""
  echo "── $file → $env ──────────────────────────────"

  while IFS= read -r line || [[ -n "$line" ]]; do
    [[ -z "$line" || "$line" == \#* ]] && continue

    local key="${line%%=*}"
    local value="${line#*=}"
    value="${value%\"}"
    value="${value#\"}"
    value="${value%\'}"
    value="${value#\'}"

    # Skip Vercel system variables — injected automatically at build time
    if [[ "$key" == VERCEL_* || "$key" == NEXT_RUNTIME* ]]; then
      echo "  $key ... skipped (system variable)"
      continue
    fi

    echo -n "  $key ... "
    vercel env rm "$key" "$env" --yes 2>/dev/null || true
    if echo "$value" | vercel env add "$key" "$env" --yes > /dev/null 2>&1; then
      echo "ok"
    else
      echo "FAILED — $(echo "$value" | vercel env add "$key" "$env" --yes 2>&1 | tail -2)"
    fi
  done < "$file"
}

push_env ".env.local"            "preview"
push_env ".env.production.local" "production"

echo ""
echo "Done. Run \`vercel env ls\` to verify."
