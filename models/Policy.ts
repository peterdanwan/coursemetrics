// models/Policy.ts

import mongoose from 'mongoose';

const PolicySchema = new mongoose.Schema({
  policyName: { type: String, required: true },
  policyDescription: { type: String, required: true },
});

export const Policy = mongoose.model('policy', PolicySchema);
