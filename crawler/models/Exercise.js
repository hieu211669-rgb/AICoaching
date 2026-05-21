import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    difficulty: { type: String, default: "" },
    exercise_type: { type: String, default: "" },
    primary_muscles: [String],
    secondary_muscles: [String],
    equipments: [String],
    instructions: [String],
    tips: [String],
    images: [String],
    gif_url: { type: String, default: "" },
    thumbnail_url: { type: String, default: "" },
    calories_burn: { type: Number, default: 0 },
    category: { type: String, default: "" },
    source_url: { type: String, default: "" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

exerciseSchema.index({ primary_muscles: 1 });
exerciseSchema.index({ category: 1 });

export const Exercise = mongoose.model("Exercise", exerciseSchema);
