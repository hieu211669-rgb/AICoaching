import { chromium } from "playwright";
import { getRandomUserAgent } from "../utils/index.js";

let browser = null;

export async function launchBrowser() {
  browser = await chromium.launch({ headless: true });
  return browser;
}

export async function createPage() {
  if (!browser) await launchBrowser();
  const context = await browser.newContext({
    userAgent: getRandomUserAgent(),
    viewport: { width: 1920, height: 1080 },
  });
  const page = await context.newPage();
  page.setDefaultTimeout(60000);
  return page;
}

export async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
  }
}
