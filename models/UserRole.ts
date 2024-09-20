// models/UserRole.ts

import mongoose, { Document } from 'mongoose';
import { IUserRole } from '@/interfaces';

const UserRoleSchema = new mongoose.Schema<IUserRole>(
  {
    roleId: { type: Number, required: true },
    roleName: { type: String, required: true },
  },
  {
    collection: 'userRoles',
  }
);

// Use UserRole model if already created, otherwise create a new one
export const UserRole =
  mongoose.models.UserRole || mongoose.model<IUserRole>('UserRole', UserRoleSchema);
