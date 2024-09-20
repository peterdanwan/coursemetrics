// models/CourseQuestion.ts

import mongoose from 'mongoose';
import { IReviewQuestion } from '@/interfaces';
import { Review } from './Review';
import { Question } from './Question';

/**
 * A ReviewQuestion contains the verbiage from the Question model.$
 * Each ReviewQuestion is tied to a specific Review through the reviewID.
 */

const ReviewQuestionSchema: mongoose.Schema<IReviewQuestion> = new mongoose.Schema(
  {
    reviewID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Review,
      required: true,
    },
    questionID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Question,
      required: true,
    },
  },
  {
    collection: 'reviewQuestions',
  }
);

// Use ReviewQuestion model if already created, otherwise create a new one
// Ref Doc: https://nesin.io/blog/fix-mongoose-cannot-overwrite-model-once-compiled-error

export const ReviewQuestion =
  mongoose.models.ReviewQuestion ||
  mongoose.model<IReviewQuestion>('ReviewQuestion', ReviewQuestionSchema);
