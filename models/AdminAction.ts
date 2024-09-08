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

export const AdminAction = mongoose.model('adminAction', AdminActionSchema);
