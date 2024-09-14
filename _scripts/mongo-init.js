// _scripts/mongo-init.js

// Switch to the coursemetricsDB database
db = db.getSiblingDB('coursemetricsDB');

db.createUser({
  user: 'root',
  pwd: 'pass',
  roles: [{ role: 'readWrite', db: 'coursemetricsDB' }],
});

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
    courseDescription: 'This subject will introduce students to creating a desktop application...',
  },
  {
    courseName: 'Data Structures and Algorithms',
    courseDescription:
      'Focuses on fundamental data structures, their implementations, and algorithms...',
  },
];
const insertedCourseDetails = db.coursedetails.insertMany(courseDetails);

// Insert sample data into the courses collection
const courses = [
  {
    courseCode: 'CCP555',
    courseDetailId: insertedCourseDetails.insertedIds[0],
    courseTerms: ['Winter', 'Summer'],
    courseDeliveryFormats: ['Hybrid', 'Flexible'],
    courseSections: ['Section 1', 'Section 2'],
  },
  {
    courseCode: 'APD545',
    courseDetailId: insertedCourseDetails.insertedIds[1],
    courseTerms: ['Winter', 'Summer', 'Fall'],
    courseDeliveryFormats: ['Online', 'Flexible'],
    courseSections: ['Section 3', 'Section 4'],
  },
  {
    courseCode: 'DSA501',
    courseDetailId: insertedCourseDetails.insertedIds[2],
    courseTerms: ['Fall'],
    courseDeliveryFormats: ['In-Person', 'Online'],
    courseSections: ['Section 5'],
  },
];
const insertedCourses = db.courses.insertMany(courses);

// Insert sample data into the professors collection
const professors = [
  {
    professorFirstName: 'John',
    professorLastName: 'Doe',
  },
  {
    professorFirstName: 'Jane',
    professorLastName: 'Smith',
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
  },
  {
    firstName: 'Bob',
    lastName: 'White',
    email: 'bob.white@example.com',
  },
];
const insertedUsers = db.users.insertMany(users);

// Insert sample data into the userProfiles collection
const userProfiles = [
  {
    userId: insertedUsers.insertedIds[0],
    biography: 'Alice is a software engineer specializing in cloud computing.',
  },
  {
    userId: insertedUsers.insertedIds[1],
    biography: 'Bob is a data analyst with a passion for machine learning.',
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
    reviewTypeId: insertedCourseDetails.insertedIds[0],
    statusId: 1,
    userId: insertedUsers.insertedIds[0],
    professorId: insertedProfessors.insertedIds[0],
  },
  {
    reviewTypeId: insertedCourseDetails.insertedIds[1],
    statusId: 2,
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
  },
  {
    historyID: 2,
    reviewID: insertedReviews.insertedIds[1],
    changeBy: insertedUsers.insertedIds[1],
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
    questionText: 'How do you rate the course content?',
    reviewTypeID: insertedCourseDetails.insertedIds[0],
  },
  {
    questionText: 'How do you rate the professor’s teaching?',
    reviewTypeID: insertedCourseDetails.insertedIds[1],
  },
];
const insertedQuestions = db.questions.insertMany(questions);

// Insert sample data into the courseQuestions collection
const courseQuestions = [
  {
    reviewID: insertedReviews.insertedIds[0],
    questionID: insertedQuestions.insertedIds[0],
  },
  {
    reviewID: insertedReviews.insertedIds[1],
    questionID: insertedQuestions.insertedIds[1],
  },
];
db.courseQuestions.insertMany(courseQuestions);

// Insert sample data into the reviewPolicies collection
const reviewPolicies = [
  {
    reviewID: insertedReviews.insertedIds[0],
    policyID: 1,
    policyIsEnabled: true,
  },
  {
    reviewID: insertedReviews.insertedIds[1],
    policyID: 2,
    policyIsEnabled: false,
  },
];
db.reviewPolicies.insertMany(reviewPolicies);

// Insert sample data into the policies collection
const policies = [
  {
    policyName: 'Honesty Policy',
    policyDescription: 'Ensure honesty in reviews',
  },
  {
    policyName: 'Privacy Policy',
    policyDescription: 'Protect user privacy',
  },
];
db.policies.insertMany(policies);

// Insert sample data into the adminActions collection
const adminActions = [
  {
    userId: insertedUsers.insertedIds[0],
    reviewId: insertedReviews.insertedIds[0],
    actionTypeID: 1,
  },
  {
    userId: insertedUsers.insertedIds[1],
    reviewId: insertedReviews.insertedIds[1],
    actionTypeID: 2,
  },
];
db.adminActions.insertMany(adminActions);

// Insert sample data into the actionTypes collection
const actionTypes = [
  { actionTypeName: 'Review Approval' },
  { actionTypeName: 'Feedback Management' },
];
db.actionTypes.insertMany(actionTypes);

console.log('Sample data inserted successfully!');
