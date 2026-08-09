import type { Express } from "express";
import { ENV } from "./env";

export function registerStorageProxy(app: Express) {
  app.get("/manus-storage/*", async (req, res) => {
    const key = (req.params as Record<string, string>)[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }

    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }

    try {
      // Build URL safely
      const base = ENV.forgeApiUrl.replace(/\/+$/g, "");
      const forgeUrl = new URL(`/v1/storage/presign/get`, base);
      forgeUrl.searchParams.set("path", key);

      // add a short timeout so requests to the backend don't hang forever
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const forgeResp = await fetch(forgeUrl.toString(), {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` },
        signal: controller.signal,
      }).finally(() => clearTimeout(timeout));

      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body.slice(0,200)}`);
        res.status(502).send("Storage backend error");
        return;
      }

      const json = await forgeResp.json().catch(() => null);
      const url = json && typeof json.url === "string" ? json.url : null;
      if (!url) {
        console.error("[StorageProxy] invalid response from storage backend", json);
        res.status(502).send("Empty signed URL from backend");
        return;
      }

      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      if ((err as any)?.name === "AbortError") {
        console.error("[StorageProxy] request to storage backend timed out");
        res.status(504).send("Storage backend timeout");
        return;
      }

      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}
