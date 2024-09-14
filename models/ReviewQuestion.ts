// models/CourseQuestion.ts

import mongoose from 'mongoose';

const ReviewQuestionSchema = new mongoose.Schema({
  reviewID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'review',
    required: true,
  },
  questionID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'question',
    required: true,
  },
});

// Use ReviewQuestion model if already created, otherwise create a new one
// Ref Doc: https://nesin.io/blog/fix-mongoose-cannot-overwrite-model-once-compiled-error
export const ReviewQuestion =
  mongoose.models.ReviewQuestion || mongoose.model('ReviewQuestion', ReviewQuestionSchema);
