// models/ReviewAnswer.ts

import mongoose from 'mongoose';

const ReviewAnswerSchema = new mongoose.Schema({
  reviewAnswerID: { type: Number, required: true },
  reviewID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'review',
    required: true,
  },
  answer: { type: String, required: true },
});

export const ReviewAnswer = mongoose.model('reviewAnswer', ReviewAnswerSchema);
