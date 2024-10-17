// database/seedDB/index.ts

import { seedUserRoles } from './seedUserRoles';
import { seedUserProfiles } from './seedUserProfiles';
import { seedUsers } from './seedUsers';
import { seedCourse } from './seedCourses';
import { seedCourseTerms } from './seedCourseTerms';
import { seedCourseDetails } from './seedCourseDetails';
import { seedCourseDeliveryFormats } from './seedCourseDeliveryFormats';
import Course from '../models/Course';
import { seedProfessors } from './seedProfessors';
import { seedProfessorCourses } from './seedProfessorCourses';
import { seedReviewTypes } from './seedReviewTypes';
import { seedReviewStatus } from './seedReviewStatus';
import { seedQuestions } from './seedQuestions';
import { seedReview } from './seedReviews';
import { seedReviewQuestions } from './seedReviewQuestions';
import { seedReviewAnswers } from './seedReviewAnswers';
import { seedPolicies } from './seedPolicies';
import { seedReviewPolicyViolationLogs } from './seedReviewPolicyViolationLogs';
import { seedReviewHistories } from './seedReviewHistories';
import { seedAdminActionTypes } from './adminActionTypes';
import { seedAdminActions } from './seedAdminActions';

const dataExists = async () => {
  try {
    const course = await Course.findOne();
    return course ? true : false;
  } catch (error) {
    return false;
  }
};

const seedDB = async () => {
  let result = await dataExists();

  if (!result) {
    await seedUserRoles();
    await seedUsers();
    await seedUserProfiles();
    await seedCourseDetails();
    await seedCourseTerms();
    await seedCourseDeliveryFormats();
    await seedCourse();
    await seedProfessors();
    await seedProfessorCourses();
    await seedReviewTypes();
    await seedReviewStatus();
    await seedQuestions();
    await seedReview();
    await seedReviewQuestions();
    await seedReviewAnswers();
    await seedPolicies();
    await seedReviewPolicyViolationLogs();
    await seedReviewHistories();
    await seedAdminActionTypes();
    await seedAdminActions();
  }
};

export { seedDB };
