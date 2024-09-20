// models/Review.ts

import mongoose from 'mongoose';
import { IReview } from '@/interfaces';
import { ReviewType } from './ReviewType';
import { User } from './User';
import { Professor } from './Professor';
import { Course } from './Course';

const ReviewSchema: mongoose.Schema<IReview> = new mongoose.Schema(
  {
    reviewTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ReviewType,
      required: true,
    },
    statusId: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: User },
    professorId: { type: mongoose.Schema.Types.ObjectId, ref: Professor },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: Course },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: false },
  },
  {
    collection: 'reviews',
  }
);

// Use Review model if already created, otherwise create a new one
// Ref Doc: https://nesin.io/blog/fix-mongoose-cannot-overwrite-model-once-compiled-error

export const Review = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
