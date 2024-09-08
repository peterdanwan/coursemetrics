// models/UserRole.ts

import mongoose from 'mongoose';

const UserRoleSchema = new mongoose.Schema({
  roleId: { type: Number, required: true },
  roleName: { type: String, required: true },
});

export const UserRole = mongoose.model('userRole', UserRoleSchema);
