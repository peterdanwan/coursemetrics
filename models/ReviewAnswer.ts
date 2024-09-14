// models/ReviewAnswer.ts

import mongoose from "mongoose";

const ReviewAnswerSchema = new mongoose.Schema({
  reviewAnswerID: { type: Number, required: true },
  reviewID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "review",
    required: true,
  },
  answer: { type: String, required: true },
});

// Use ReviewAnswer model if already created, otherwise create a new one
// Ref Doc: https://nesin.io/blog/fix-mongoose-cannot-overwrite-model-once-compiled-error
export const ReviewAnswer =
  mongoose.models.ReviewAnswer ||
  mongoose.model("ReviewAnswer", ReviewAnswerSchema);
