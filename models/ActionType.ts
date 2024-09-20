// models/ActionType.ts

import mongoose from 'mongoose';

/**
 *
 */

const ActionTypeSchema = new mongoose.Schema({
  actionTypeName: { type: String, required: true },
});

// Use ActionType model if already created, otherwise create a new one
// Ref Doc: https://nesin.io/blog/fix-mongoose-cannot-overwrite-model-once-compiled-error
export const ActionType =
  mongoose.models.ActionType || mongoose.model('ActionType', ActionTypeSchema);
