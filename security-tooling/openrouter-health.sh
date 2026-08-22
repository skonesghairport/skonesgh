#!/usr/bin/env bash
set -euo pipefail

: "${OPENROUTER_API_KEY:?Set OPENROUTER_API_KEY in the environment before running this check}"
BASE_URL="${OPENROUTER_BASE_URL:-https://openrouter.ai/api/v1}"
MODEL="${OPENROUTER_MODEL:-openrouter/free}"

payload="$(jq -n --arg model "$MODEL" '{model:$model,messages:[{role:"user",content:"Reply with exactly OK."}],max_tokens:8}')"
response="$(curl --fail --silent --show-error --max-time 30 \
  "$BASE_URL/chat/completions" \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -d "$payload")"

printf '%s\n' "$response" | jq '{model, choices: [.choices[]? | {finish_reason, message: {role: .message.role, content: .message.content}}], error}'
