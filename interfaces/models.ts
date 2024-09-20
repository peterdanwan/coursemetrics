// interfaces/models.ts

import { Document, Types } from 'mongoose';

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

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  role: Types.ObjectId;
}

export interface IUserProfile {
  userId: Types.ObjectId;
  biography?: string;
}

export interface IUserRole {
  roleId: number;
  roleName: string;
}

export interface IReview extends Document {
  reviewTypeId: Types.ObjectId;
  statusId: number;
  userId: Types.ObjectId;
  professorId: Types.ObjectId;
  courseId: Types.ObjectId;
  rating: number;
  comment: string;
}

export interface IReviewAnswer extends Document {
  reviewQuestionID: Types.ObjectId;
  answer: string;
}

export interface IReviewQuestion extends Document {
  reviewID: Types.ObjectId;
  questionID: Types.ObjectId;
}

export interface IQuestion extends Document {
  questionText: string;
  reviewTypeID: Types.ObjectId;
}
