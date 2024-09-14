// models/ReviewHistory.ts

import mongoose from "mongoose";

const ReviewHistorySchema = new mongoose.Schema({
  historyID: { type: Number, required: true },
  reviewID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "review",
    required: true,
  },
  changeBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

// Use ReviewHistory model if already created, otherwise create a new one
// Ref Doc: https://nesin.io/blog/fix-mongoose-cannot-overwrite-model-once-compiled-error
export const ReviewHistory =
  mongoose.models.ReviewHistory ||
  mongoose.model("ReviewHistory", ReviewHistorySchema);
