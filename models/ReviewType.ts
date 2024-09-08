// models/ReviewType.ts

import mongoose from 'mongoose';

const ReviewTypeSchema = new mongoose.Schema({
  reviewTypeID: { type: Number, required: true },
  reviewTypeName: { type: String, required: true },
});

export const ReviewType = mongoose.model('reviewType', ReviewTypeSchema);
