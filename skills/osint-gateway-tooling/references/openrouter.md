# OpenRouter-Compatible Gateway Reference

Use this reference when a project needs a provider-neutral chat completion endpoint with optional access to free models.

## Configuration

Set these values outside source control:

```bash
export OPENROUTER_API_KEY='your-user-created-key'
export OPENROUTER_BASE_URL='https://openrouter.ai/api/v1'
export OPENROUTER_MODEL='openrouter/free'
```

OpenRouter documents an OpenAI-compatible API and the `openrouter/free` router. Free availability, model selection, throughput, and rate limits can change, so applications should treat the provider as best-effort rather than guaranteed capacity.

## Generic request

```bash
curl -fsS --max-time 30 \
  "$OPENROUTER_BASE_URL/chat/completions" \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -d "$(jq -n --arg model "${OPENROUTER_MODEL:-openrouter/free}" \
    '{model:$model,messages:[{role:"user",content:"health check: reply with OK"}],max_tokens:8}')"
```

Do not echo the key, include it in a URL, or put it in a committed file. Use `set +x` around commands that handle credentials and redact response logs if provider metadata could contain sensitive prompts or content.

## Vercel AI SDK pattern

For an application using the Vercel AI SDK, configure the provider explicitly rather than relying on a model string that may not exist in the selected environment:

```ts
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { streamText } from "ai";

const gateway = createOpenAICompatible({
  name: "openrouter",
  baseURL: process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const result = streamText({
  model: gateway(process.env.OPENROUTER_MODEL ?? "openrouter/free"),
  prompt: "Why is the sky blue?",
});
```

Install the provider package only if the project does not already provide an equivalent. Keep gateway calls server-side and apply authentication, quotas, request validation, and timeout handling before exposing them through an application route.

## Source of truth

Read the current provider documentation and model catalog before changing the endpoint or model slug:

- https://openrouter.ai/docs/quickstart
- https://openrouter.ai/openrouter/free
- https://openrouter.ai/docs/api/api-reference/models/list-all-models-and-their-properties
