// models/Policy.ts

import mongoose from 'mongoose';

const PolicySchema = new mongoose.Schema({
  policyName: { type: String, required: true },
  policyDescription: { type: String, required: true },
});

// Use Policy model if already created, otherwise create a new one
// Ref Doc: https://nesin.io/blog/fix-mongoose-cannot-overwrite-model-once-compiled-error
export const Policy = mongoose.models.Policy || mongoose.model('Policy', PolicySchema);
