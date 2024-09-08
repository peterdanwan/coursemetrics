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

export const ReviewQuestion = mongoose.model(
  'courseQuestion',
  ReviewQuestionSchema
);
