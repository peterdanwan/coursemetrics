// models/UserProfile.ts

import mongoose from 'mongoose';

const UserProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  biography: { type: String },
});

export const UserProfile = mongoose.model('userProfile', UserProfileSchema);
