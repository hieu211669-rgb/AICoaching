import { delay } from "./delay.js";
import { logger } from "./logger.js";

export async function retry(fn, { retries = 3, delayMs = 2000 } = {}) {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries) throw err;
      logger.warn(`Retry ${i + 1}/${retries}: ${err.message}`);
      await delay(delayMs * (i + 1));
    }
  }
}
