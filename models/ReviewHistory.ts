// models/ReviewHistory.ts

import mongoose from 'mongoose';

const ReviewHistorySchema = new mongoose.Schema({
  historyID: { type: Number, required: true },
  reviewID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'review',
    required: true,
  },
  changeBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

export const ReviewHistory = mongoose.model(
  'reviewHistory',
  ReviewHistorySchema
);
