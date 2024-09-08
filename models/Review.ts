// models/Review.ts

import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  reviewTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'reviewtype',
    required: true,
  },
  statusId: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  professorId: { type: mongoose.Schema.Types.ObjectId, ref: 'professor' },
});

export const Review = mongoose.model('review', ReviewSchema);
