import fs from "fs-extra";
import { chromium } from "playwright";
import { logger, randomDelay, deduplicate, getRandomUserAgent } from "../utils/index.js";

const LINKS_FILE = "links.json";
const BASE = process.env.BASE_URL || "https://musclewiki.com";

// Muscle groups from sitemap
const MUSCLE_GROUPS = [
  "biceps", "long-head-bicep", "short-head-bicep", "traps-middle",
  "lowerback", "abdominals", "lower-abdominals", "upper-abdominals",
  "calves", "tibialis", "soleus", "gastrocnemius",
  "forearms", "wrist-extensors", "wrist-flexors", "glutes",
  "gluteus-medius", "gluteus-maximus", "hamstrings", "medial-hamstrings",
  "lateral-hamstrings", "lats", "chest", "upper-chest", "lower-chest",
  "neck", "obliques", "quadriceps", "inner-quadriceps", "outer-quadriceps",
  "shoulders", "lateral-deltoid", "anterior-deltoid", "posterior-deltoid",
  "traps", "triceps", "long-head-tricep", "lateral-head-tricep",
  "medial-head-tricep", "hip-flexors", "adductors", "abductors",
  "serratus-anterior", "infraspinatus",
];

export async function crawlExerciseLinks() {
  if (await fs.pathExists(LINKS_FILE)) {
    const existing = await fs.readJson(LINKS_FILE);
    if (existing.length > 0) {
      logger.info(`Resuming with ${existing.length} existing links`);
      return existing;
    }
  }

  const allLinks = [];
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: getRandomUserAgent(),
    viewport: { width: 1920, height: 1080 },
  });
  const page = await context.newPage();
  page.setDefaultTimeout(60000);

  try {
    for (const muscle of MUSCLE_GROUPS) {
      logger.info(`Crawling muscle group: ${muscle}`);

      try {
        await page.goto(`${BASE}/exercises/${muscle}`, { waitUntil: "domcontentloaded", timeout: 45000 });
      } catch (err) {
        logger.warn(`  Timeout navigating to ${muscle}, retrying...`);
        try {
          await page.goto(`${BASE}/exercises/${muscle}`, { waitUntil: "domcontentloaded", timeout: 45000 });
        } catch {
          logger.warn(`  Skipping ${muscle}: ${err.message}`);
          continue;
        }
      }
      await page.waitForTimeout(4000);

      // Get total results count
      const totalText = await page.evaluate(() => {
        const match = document.body.innerText.match(/of (\d+) Results/);
        return match ? parseInt(match[1]) : 0;
      });
      const totalPages = Math.ceil(totalText / 4) || 1;
      logger.info(`  Total: ${totalText} exercises, ${totalPages} pages`);

      let pageNum = 1;
      while (pageNum <= totalPages) {
        const links = await page.evaluate(() => {
          return [...document.querySelectorAll('a[href*="/exercise/"]')]
            .map((a) => a.href)
            .filter((h) => h.match(/\/exercise\/[^/]+$/));
        });

        allLinks.push(...links);

        if (links.length < 4 || pageNum >= totalPages) break;

        // Click Next button in nav pagination
        try {
          await page.locator("nav button.rounded-r-md").first().click({ force: true, timeout: 5000 });
          await page.waitForTimeout(2000);
        } catch {
          break;
        }
        pageNum++;
      }

      logger.info(`  Collected from ${muscle}: ${pageNum} pages`);
      await randomDelay(1000, 2000);

      // Incremental save
      const currentUnique = deduplicate(
        allLinks.map((url) => {
          try { return `${BASE}${new URL(url).pathname.replace(/\/$/, "")}`; } catch { return url; }
        })
      );
      await fs.writeJson(LINKS_FILE, currentUnique, { spaces: 2 });
    }
  } finally {
    await context.close();
    await browser.close();
  }

  // Normalize and deduplicate
  const unique = deduplicate(
    allLinks.map((url) => {
      try {
        const u = new URL(url);
        return `${BASE}${u.pathname.replace(/\/$/, "")}`;
      } catch {
        return url;
      }
    })
  );

  await fs.writeJson(LINKS_FILE, unique, { spaces: 2 });
  logger.info(`Saved ${unique.length} unique exercise links`);
  return unique;
}
