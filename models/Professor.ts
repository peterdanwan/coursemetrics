// models/Professor.ts

import mongoose from 'mongoose';
const ProfessorSchema = new mongoose.Schema({
  professorFirstName: { type: String, required: true },
  professorLastName: { type: String, required: true },
});

export const Professor = mongoose.model('professor', ProfessorSchema);
 