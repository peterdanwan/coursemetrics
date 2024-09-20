// models/ReviewAnswer.ts

import mongoose from 'mongoose';
import { IReviewAnswer } from '@/interfaces';
import { ReviewQuestion } from './ReviewQuestion';

/**
 * A Review answer is tied to a specific ReviewQuestion ID.
 */

const ReviewAnswerSchema: mongoose.Schema<IReviewAnswer> = new mongoose.Schema(
  {
    reviewQuestionID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ReviewQuestion,
      required: true,
    },
    answer: { type: String, required: true },
  },
  {
    collection: 'reviewAnswers',
  }
);

// Use ReviewAnswer model if already created, otherwise create a new one
// Ref Doc: https://nesin.io/blog/fix-mongoose-cannot-overwrite-model-once-compiled-error

export const ReviewAnswer =
  mongoose.models.ReviewAnswer || mongoose.model<IReviewAnswer>('ReviewAnswer', ReviewAnswerSchema);
