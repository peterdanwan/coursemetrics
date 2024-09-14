// models/ReviewStatus.ts

import mongoose from "mongoose";

const ReviewStatusSchema = new mongoose.Schema({
  statusId: { type: Number, required: true },
  statusName: { type: String, required: true },
});

// Use ReviewStatus model if already created, otherwise create a new one
// Ref Doc: https://nesin.io/blog/fix-mongoose-cannot-overwrite-model-once-compiled-error
export const ReviewStatus =
  mongoose.models.ReviewStatus ||
  mongoose.model("ReviewStatus", ReviewStatusSchema);
