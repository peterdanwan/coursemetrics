// models/Question.ts

import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  reviewTypeID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "reviewType",
    required: true,
  },
});

// Use Question model if already created, otherwise create a new one
// Ref Doc: https://nesin.io/blog/fix-mongoose-cannot-overwrite-model-once-compiled-error
export const Question =
  mongoose.models.Question || mongoose.model("Question", QuestionSchema);
