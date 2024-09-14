// models/User.ts

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
});

// Use User model if already created, otherwise create a new one
// Ref Doc: https://nesin.io/blog/fix-mongoose-cannot-overwrite-model-once-compiled-error
export const User = mongoose.models.User || mongoose.model('User', UserSchema);
