// models/UserRole.ts

import mongoose from "mongoose";

const UserRoleSchema = new mongoose.Schema({
  roleId: { type: Number, required: true },
  roleName: { type: String, required: true },
});

// Use UserRole model if already created, otherwise create a new one
// Ref Doc: https://nesin.io/blog/fix-mongoose-cannot-overwrite-model-once-compiled-error
export const UserRole =
  mongoose.models.UserRole || mongoose.model("UserRole", UserRoleSchema);
