// models/Review.ts

import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  reviewTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "reviewtype",
    required: true,
  },
  statusId: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  professorId: { type: mongoose.Schema.Types.ObjectId, ref: "professor" },
});

// Use Review model if already created, otherwise create a new one
// Ref Doc: https://nesin.io/blog/fix-mongoose-cannot-overwrite-model-once-compiled-error
export const Review =
  mongoose.models.Review || mongoose.model("Review", ReviewSchema);
