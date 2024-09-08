// models/Course.ts

import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
  courseCode: { type: String, required: true },
  courseDetailId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'courseDetail',
    required: true,
  },
  courseTerms: [{ type: String }],
  // Online Async, Online Sync, In-person
  courseDeliveryFormats: [{ type: String }],
  courseSections: [{ type: String }],
});

export const Course = mongoose.model('course', CourseSchema);
