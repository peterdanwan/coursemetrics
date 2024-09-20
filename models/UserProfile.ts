// models/UserProfile.ts

import mongoose from 'mongoose';
import { User } from './User';
import { type IUserProfile } from '@/interfaces';

const UserProfileSchema: mongoose.Schema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
    biography: { type: String },
  },
  {
    collection: 'userProfiles',
  }
);

// Use UserProfile model if already created, otherwise create a new one
// Ref Doc: https://nesin.io/blog/fix-mongoose-cannot-overwrite-model-once-compiled-error
export const UserProfile =
  mongoose.models.UserProfile || mongoose.model<IUserProfile>('UserProfile', UserProfileSchema);
