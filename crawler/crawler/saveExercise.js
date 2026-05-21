import { Exercise } from "../models/Exercise.js";
import { logger } from "../utils/index.js";

export async function saveExercise(data) {
  if (!data || !data.slug) {
    logger.warn("Skipping save: no slug");
    return null;
  }
  const result = await Exercise.updateOne({ slug: data.slug }, data, { upsert: true });
  return result;
}
