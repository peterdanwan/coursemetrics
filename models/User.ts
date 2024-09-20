// models/User.ts

import mongoose from 'mongoose';
import { type IUser } from '@/interfaces';
import { UserRole } from './UserRole';

const UserSchema: mongoose.Schema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: UserRole },
  },
  {
    collection: 'users',
  }
);

// Use User model if already created, otherwise create a new one
// Ref Doc: https://nesin.io/blog/fix-mongoose-cannot-overwrite-model-once-compiled-error
export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
