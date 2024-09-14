// models/ProfessorCourse.ts

import mongoose from "mongoose";
const ProfessorCourseSchema = new mongoose.Schema({
  professorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "professor",
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
    required: true,
  },
});

// Use ProfessorCourse model if already created, otherwise create a new one
// Ref Doc: https://nesin.io/blog/fix-mongoose-cannot-overwrite-model-once-compiled-error
export const ProfessorCourse =
  mongoose.models.ProfessorCourse ||
  mongoose.model("ProfessorCourse", ProfessorCourseSchema);
