// models/ReviewPolicy.ts

import mongoose from 'mongoose';

const ReviewPolicySchema = new mongoose.Schema({
  reviewPolicyID: { type: Number, required: true },
  reviewID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'review',
    required: true,
  },
  policyID: { type: Number, required: true },
  policyIsEnabled: { type: Boolean, required: true },
});

export const ReviewPolicy = mongoose.model('reviewPolicy', ReviewPolicySchema);
