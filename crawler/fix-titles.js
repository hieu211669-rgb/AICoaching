import "dotenv/config";
import mongoose from "mongoose";
import { Exercise } from "./models/Exercise.js";

function slugToTitle(slug) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

await mongoose.connect(process.env.MONGO_URI);

const docs = await Exercise.find({}).lean();
let updated = 0;

for (const doc of docs) {
  const correctTitle = slugToTitle(doc.slug);
  if (doc.title !== correctTitle) {
    await Exercise.updateOne({ _id: doc._id }, { title: correctTitle });
    updated++;
  }
}

console.log(`Fixed ${updated}/${docs.length} exercises`);
await mongoose.disconnect();
