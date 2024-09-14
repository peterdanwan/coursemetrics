// models/CourseDetail.ts

import mongoose from "mongoose";
import { type ICourseDetail } from "@/interfaces";

const CourseDetailsSchema: mongoose.Schema = new mongoose.Schema({
  courseName: { type: String, required: true },
  courseDescription: { type: String, required: true },
});

// Use CourseDetail model if already created, otherwise create a new one
// Ref Doc: https://nesin.io/blog/fix-mongoose-cannot-overwrite-model-once-compiled-error
export const CourseDetail =
  mongoose.models.CourseDetail ||
  mongoose.model<ICourseDetail>("CourseDetail", CourseDetailsSchema);
