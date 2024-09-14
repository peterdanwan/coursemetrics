// models/ReviewType.ts

import mongoose from 'mongoose';

const ReviewTypeSchema = new mongoose.Schema({
  reviewTypeID: { type: Number, required: true },
  reviewTypeName: { type: String, required: true },
});

// Use ReviewType model if already created, otherwise create a new one
// Ref Doc: https://nesin.io/blog/fix-mongoose-cannot-overwrite-model-once-compiled-error
export const ReviewType =
  mongoose.models.ReviewType || mongoose.model('ReviewType', ReviewTypeSchema);
