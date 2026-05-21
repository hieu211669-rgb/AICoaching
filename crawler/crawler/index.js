import "dotenv/config";
import fs from "fs-extra";
import { connectDB, disconnectDB } from "../db/connection.js";
import { launchBrowser, closeBrowser } from "./browser.js";
import { crawlExerciseLinks } from "./crawlExerciseLinks.js";
import { crawlExerciseDetail } from "./crawlExerciseDetail.js";
import { saveExercise } from "./saveExercise.js";
import { limit } from "./queue.js";
import { logger } from "../utils/index.js";

const PROGRESS_FILE = "progress.json";

async function loadProgress() {
  if (await fs.pathExists(PROGRESS_FILE)) return fs.readJson(PROGRESS_FILE);
  return { completed: [], failed: [] };
}

async function saveProgress(progress) {
  await fs.writeJson(PROGRESS_FILE, progress, { spaces: 2 });
}

async function main() {
  logger.info("MuscleWiki Crawler starting...");

  await connectDB();
  await launchBrowser();

  const links = await crawlExerciseLinks();
  const progress = await loadProgress();
  const completedSet = new Set(progress.completed);

  // Filter out already completed links for resume
  const pending = links.filter((url) => !completedSet.has(url));
  logger.info(`Total: ${links.length} | Completed: ${progress.completed.length} | Pending: ${pending.length}`);

  let saved = 0;
  let failed = 0;

  const tasks = pending.map((url, i) =>
    limit(async () => {
      try {
        logger.progress(progress.completed.length + i + 1, links.length, url);
        const data = await crawlExerciseDetail(url);
        await saveExercise(data);
        progress.completed.push(url);
        saved++;
      } catch (err) {
        logger.error(`Failed: ${url} - ${err.message}`);
        progress.failed.push(url);
        failed++;
      }
      // Periodic save progress
      if ((saved + failed) % 10 === 0) await saveProgress(progress);
    })
  );

  await Promise.all(tasks);
  await saveProgress(progress);

  logger.info("=== Crawl Complete ===");
  logger.info(`Total crawled: ${saved + failed}`);
  logger.info(`Saved: ${saved}`);
  logger.info(`Failed: ${failed}`);

  await closeBrowser();
  await disconnectDB();
}

main().catch((err) => {
  logger.error(`Fatal: ${err.message}`);
  process.exit(1);
});
