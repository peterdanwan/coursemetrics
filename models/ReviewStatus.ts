// models/ReviewStatus.ts

import mongoose from 'mongoose';

const ReviewStatusSchema = new mongoose.Schema({
  statusId: { type: Number, required: true },
  statusName: { type: String, required: true },
});

export const ReviewStatus = mongoose.model('reviewStatus', ReviewStatusSchema);
