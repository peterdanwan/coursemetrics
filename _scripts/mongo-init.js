// _scripts/mongo-init.js

/* 
  Resources used to create this file:
  * https://www.mongodb.com/developer/products/mongodb/cheat-sheet/#handy-commands
  
*/

// Switch to the coursemetricsDB database
db = db.getSiblingDB('coursemetricsDB');

// Create all the collections
db.createCollection('courses');
db.createCollection('courseDetails');
db.createCollection('professors');
db.createCollection('users');
db.createCollection('userProfiles');
db.createCollection('userRoles');
db.createCollection('reviews');
db.createCollection('reviewAnswers');
db.createCollection('reviewStatuses');
db.createCollection('reviewHistory');
db.createCollection('reviewTypes');
db.createCollection('questions');
db.createCollection('courseQuestions');
db.createCollection('reviewPolicies');
db.createCollection('policies');
db.createCollection('professorCourses');
db.createCollection('feedback');
db.createCollection('adminActions');
db.createCollection('actionTypes');

// Insert sample data into the courseDetails collection
const courseDetails = [
  {
    courseName: 'Cloud Computing for Programmers',
    courseDescription:
      'This course builds on knowledge gained in previous courses and provides an overview of important software development, testing, and deployment practices in the cloud...',
  },
  {
    courseName: 'Application Development',
    courseDescription:
      'This subject will introduce students to creating a desktop application...',
  },
  {
    courseName: 'Data Structures and Algorithms',
    courseDescription:
      'Focuses on fundamental data structures, their implementations, and algorithms...',
  },
];
const insertedCourseDetails = db.courseDetails.insertMany(courseDetails);

// Insert sample data into the courses collection
const courses = [
  {
    courseCode: 'CCP555',
    courseDetailId: insertedCourseDetails.insertedIds[0],
    courseTerms: ['Winter', 'Summer'],
    courseDeliveryFormat: ['Hybrid', 'Flexible'],
    courseSections: ['Section 1', 'Section 2'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    courseCode: 'APD545',
    courseDetailId: insertedCourseDetails.insertedIds[1],
    courseTerms: ['Winter', 'Summer', 'Fall'],
    courseDeliveryFormats: ['Online', 'Flexible'],
    courseSections: ['Section 3', 'Section 4'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    courseCode: 'DSA501',
    courseDetailId: insertedCourseDetails.insertedIds[2],
    courseTerms: ['Fall'],
    courseDeliveryFormat: ['In-Person', 'Online'],
    courseSections: ['Section 5'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
const insertedCourses = db.courses.insertMany(courses);

// Insert sample data into the professors collection
const professors = [
  {
    professorFirstName: 'John',
    professorLastName: 'Doe',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    professorFirstName: 'Jane',
    professorLastName: 'Smith',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
const insertedProfessors = db.professors.insertMany(professors);

// Insert sample data into the professorCourses collection
const professorCourses = [
  {
    professorId: insertedProfessors.insertedIds[0],
    courseId: insertedCourses.insertedIds[0],
  },
  {
    professorId: insertedProfessors.insertedIds[1],
    courseId: insertedCourses.insertedIds[1],
  },
];
db.professorCourses.insertMany(professorCourses);

// Insert sample data into the users collection
const users = [
  {
    firstName: 'Alice',
    lastName: 'Brown',
    email: 'alice.brown@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    firstName: 'Bob',
    lastName: 'White',
    email: 'bob.white@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
const insertedUsers = db.users.insertMany(users);

// Insert sample data into the userProfiles collection
const userProfiles = [
  {
    userId: insertedUsers.insertedIds[0],
    biography: 'Alice is a software engineer specializing in cloud computing.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: insertedUsers.insertedIds[1],
    biography: 'Bob is a data analyst with a passion for machine learning.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
db.userProfiles.insertMany(userProfiles);

// Insert sample data into the userRoles collection
const userRoles = [
  { roleId: 1, roleName: 'Admin' },
  { roleId: 2, roleName: 'Student' },
  { roleId: 3, roleName: 'Professor' },
];
db.userRoles.insertMany(userRoles);

// Insert sample data into the reviews collection
const reviews = [
  {
    reviewTypeId: 1,
    statusId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: insertedUsers.insertedIds[0],
    professorId: insertedProfessors.insertedIds[0],
  },
  {
    reviewTypeId: 2,
    statusId: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: insertedUsers.insertedIds[1],
    professorId: insertedProfessors.insertedIds[1],
  },
];
const insertedReviews = db.reviews.insertMany(reviews);

// Insert sample data into the reviewAnswers collection
const reviewAnswers = [
  {
    reviewAnswerID: 1,
    reviewID: insertedReviews.insertedIds[0],
    answer: 'Excellent',
  },
  {
    reviewAnswerID: 2,
    reviewID: insertedReviews.insertedIds[1],
    answer: 'Good',
  },
];
db.reviewAnswers.insertMany(reviewAnswers);

// Insert sample data into the reviewStatuses collection
const reviewStatuses = [
  { statusId: 1, statusName: 'Pending' },
  { statusId: 2, statusName: 'Approved' },
  { statusId: 3, statusName: 'Rejected' },
];
db.reviewStatuses.insertMany(reviewStatuses);

// Insert sample data into the reviewHistory collection
const reviewHistory = [
  {
    historyID: 1,
    reviewID: insertedReviews.insertedIds[0],
    changeBy: insertedUsers.insertedIds[0],
    changeDate: new Date(),
  },
  {
    historyID: 2,
    reviewID: insertedReviews.insertedIds[1],
    changeBy: insertedUsers.insertedIds[1],
    changeDate: new Date(),
  },
];
db.reviewHistory.insertMany(reviewHistory);

// Insert sample data into the reviewTypes collection
const reviewTypes = [
  { reviewTypeID: 1, reviewTypeName: 'Course Feedback' },
  { reviewTypeID: 2, reviewTypeName: 'Professor Evaluation' },
];
db.reviewTypes.insertMany(reviewTypes);

// Insert sample data into the questions collection
const questions = [
  {
    questionID: 1,
    questionText: 'How do you rate the course content?',
    questionTypeID: 1,
  },
  {
    questionID: 2,
    questionText: 'How do you rate the professor’s teaching?',
    questionTypeID: 2,
  },
];
const insertedQuestions = db.questions.insertMany(questions);

// Insert sample data into the courseQuestions collection
const courseQuestions = [
  {
    reviewQuestionID: 1,
    questionID: insertedQuestions.insertedIds[0],
    reviewID: insertedReviews.insertedIds[0],
  },
  {
    reviewQuestionID: 2,
    questionID: insertedQuestions.insertedIds[1],
    reviewID: insertedReviews.insertedIds[1],
  },
];
db.courseQuestions.insertMany(courseQuestions);

// Insert sample data into the reviewPolicies collection
const reviewPolicies = [
  {
    reviewPolicyID: 1,
    reviewID: insertedReviews.insertedIds[0],
    policyID: 1,
    policyIsEnabled: true,
  },
  {
    reviewPolicyID: 2,
    reviewID: insertedReviews.insertedIds[1],
    policyID: 2,
    policyIsEnabled: false,
  },
];
db.reviewPolicies.insertMany(reviewPolicies);

// Insert sample data into the policies collection
const policies = [
  {
    policyID: 1,
    policyName: 'Honesty Policy',
    policyDescription: 'Ensure honesty in reviews',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    policyID: 2,
    policyName: 'Privacy Policy',
    policyDescription: 'Protect user privacy',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
db.policies.insertMany(policies);

// Insert sample data into the feedback collection
const feedback = [
  {
    feedbackID: 1,
    userId: insertedUsers.insertedIds[0],
    email: 'feedback1@example.com',
    message: 'Great course!',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    feedbackID: 2,
    userId: insertedUsers.insertedIds[1],
    email: 'feedback2@example.com',
    message: 'Loved the professor!',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
db.feedback.insertMany(feedback);

// Insert sample data into the adminActions collection
const adminActions = [
  {
    adminID: 1,
    userId: insertedUsers.insertedIds[0],
    actionTypeID: 1,
    actionDate: new Date(),
  },
  {
    adminID: 2,
    userId: insertedUsers.insertedIds[1],
    actionTypeID: 2,
    actionDate: new Date(),
  },
];
db.adminActions.insertMany(adminActions);

// Insert sample data into the actionTypes collection
const actionTypes = [
  { actionTypeID: 1, actionTypeName: 'Review Approval' },
  { actionTypeID: 2, actionTypeName: 'Feedback Management' },
];
db.actionTypes.insertMany(actionTypes);

console.log('Sample data inserted successfully!');
