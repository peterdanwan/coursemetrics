// models/AdminAction.ts

import mongoose from 'mongoose';

const AdminActionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  reviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'review',
    required: true,
  },
  actionTypeID: { type: Number, required: true },
});

// Use AdminAction model if already created, otherwise create a new one
// Ref Doc: https://nesin.io/blog/fix-mongoose-cannot-overwrite-model-once-compiled-error
export const AdminAction =
  mongoose.models.AdminAction || mongoose.model('AdminAction', AdminActionSchema);
