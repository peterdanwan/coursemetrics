// models/Course.ts

import mongoose from "mongoose";
import { CourseDetail } from "./CourseDetail";
import { type ICourse } from "@/interfaces";

const CourseSchema: mongoose.Schema = new mongoose.Schema({
  courseCode: { type: String, required: true },
  courseDetailId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: CourseDetail,
    required: true,
  },
  courseTerms: [{ type: String }],
  // Online Async, Online Sync, In-person
  courseDeliveryFormats: [{ type: String }],
  courseSections: [{ type: String }],
});

// Use Course model if already created, otherwise create a new one
// Ref Doc: https://nesin.io/blog/fix-mongoose-cannot-overwrite-model-once-compiled-error
export const Course =
  mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);
