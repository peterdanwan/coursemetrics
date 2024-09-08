// models/Question.ts

import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  reviewTypeID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'reviewType',
    required: true,
  },
});

export const Question = mongoose.model('question', QuestionSchema);
