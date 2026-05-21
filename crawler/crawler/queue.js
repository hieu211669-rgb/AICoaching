import pLimit from "p-limit";

const concurrency = parseInt(process.env.CONCURRENCY || "5", 10);
export const limit = pLimit(concurrency);
