// interfaces/models.ts

import { Document, Types } from "mongoose";

export interface ICourse extends Document {
  courseCode: string;
  courseDetailId: Types.ObjectId | ICourseDetail; // ObjectId reference or populated CourseDetail document
  courseTerms: string[];
  courseDeliveryFormats: string[]; // e.g., "Online Async", "Online Sync", "In-person"
  courseSections: string[];
}

export interface ICourseDetail extends Document {
  courseName: string;
  courseDescription: string;
}
