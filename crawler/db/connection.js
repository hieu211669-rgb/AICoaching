import mongoose from "mongoose";
import { logger } from "../utils/index.js";

export async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/musclewiki";
  await mongoose.connect(uri);
  logger.info(`MongoDB connected: ${mongoose.connection.host}`);
}

export async function disconnectDB() {
  await mongoose.disconnect();
  logger.info("MongoDB disconnected");
}
