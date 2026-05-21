import { createPage } from "./browser.js";
import { parseInterceptedData, extractFromDOM } from "./extractExerciseData.js";
import { logger, randomDelay, retry } from "../utils/index.js";

/**
 * Crawl a single exercise detail page.
 * Intercepts RSC/API responses, falls back to DOM extraction.
 */
export async function crawlExerciseDetail(url) {
  return retry(async () => {
    const page = await createPage();
    const intercepted = [];

    try {
      // Intercept network responses for RSC/API data
      page.on("response", async (response) => {
        const resUrl = response.url();
        if (response.status() !== 200) return;

        const isTarget =
          resUrl.includes("_rsc") ||
          resUrl.includes("/api/") ||
          (resUrl.includes("/exercise/") && resUrl.includes("_rsc"));

        if (isTarget) {
          try {
            const ct = response.headers()["content-type"] || "";
            if (ct.includes("json") || ct.includes("text")) {
              const body = await response.text();
              if (body.includes("instruction") || body.includes("difficulty") || body.includes("muscle") || body.includes("equipment")) {
                intercepted.push(body);
              }
            }
          } catch { /* response disposed */ }
        }
      });

      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
      await randomDelay(2000, 4000);

      // Extract slug from URL
      const slug = new URL(url).pathname.split("/").filter(Boolean).pop();

      // Try intercepted data first
      let data = parseInterceptedData(intercepted);

      // Fallback to DOM extraction
      if (!data || !data.title) {
        data = await extractFromDOM(page);
      }

      if (!data || !data.title) {
        throw new Error(`No data extracted from ${url}`);
      }

      return {
        ...data,
        slug,
        title: data.title.trim(),
        source_url: url,
      };
    } finally {
      await page.context().close();
    }
  }, { retries: 3, delayMs: 3000 });
}
