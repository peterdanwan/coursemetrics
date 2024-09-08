// models/CourseDetail.ts

import mongoose from 'mongoose';

const CourseDetailsSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  courseDescription: { type: String, required: true },
});

export const CourseDetail = mongoose.model(
  'courseDetail',
  CourseDetailsSchema
);
