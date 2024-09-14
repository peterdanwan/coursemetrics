// models/ReviewPolicy.ts

import mongoose from "mongoose";

const ReviewPolicySchema = new mongoose.Schema({
  reviewPolicyID: { type: Number, required: true },
  reviewID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "review",
    required: true,
  },
  policyID: { type: Number, required: true },
  policyIsEnabled: { type: Boolean, required: true },
});

// Use ReviewPolicy model if already created, otherwise create a new one
// Ref Doc: https://nesin.io/blog/fix-mongoose-cannot-overwrite-model-once-compiled-error
export const ReviewPolicy =
  mongoose.models.ReviewPolicy ||
  mongoose.model("ReviewPolicy", ReviewPolicySchema);
