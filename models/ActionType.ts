// models/ActionType.ts

import mongoose from 'mongoose';

const ActionTypeSchema = new mongoose.Schema({
  actionTypeName: { type: String, required: true },
});

export const ActionType = mongoose.model('actionType', ActionTypeSchema);
