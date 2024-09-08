// models/ProfessorCourse.ts

import mongoose from 'mongoose';
const ProfessorCourseSchema = new mongoose.Schema({
  professorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'professor',
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'course',
    required: true,
  },
});

export const ProfessorCourse = mongoose.model(
  'professorCourse',
  ProfessorCourseSchema
);
