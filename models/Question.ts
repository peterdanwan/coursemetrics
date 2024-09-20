// models/Question.ts

import mongoose from 'mongoose';
import { ReviewType } from './ReviewType';
import { type IQuestion } from '@/interfaces';

/**
 * These are the repeated questions we will ask for EACH review
 *
 * E.g.,
 * - What are your thoughts on this course?
 * - What type of skills did your learn?
 *
 * The reviewTypeID indicates if this question's text is for a professor review or course review.
 */

const QuestionSchema: mongoose.Schema<IQuestion> = new mongoose.Schema({
  questionText: { type: String, required: true },
  reviewTypeID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ReviewType,
    required: true,
  },
});

// Use Question model if already created, otherwise create a new one
// Ref Doc: https://nesin.io/blog/fix-mongoose-cannot-overwrite-model-once-compiled-error
export const Question =
  mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);
