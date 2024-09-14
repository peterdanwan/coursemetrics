// models/Professor.ts

import mongoose from "mongoose";
const ProfessorSchema = new mongoose.Schema({
  professorFirstName: { type: String, required: true },
  professorLastName: { type: String, required: true },
});

// Use Professor model if already created, otherwise create a new one
// Ref Doc: https://nesin.io/blog/fix-mongoose-cannot-overwrite-model-once-compiled-error
export const Professor =
  mongoose.models.Professor || mongoose.model("Professor", ProfessorSchema);
