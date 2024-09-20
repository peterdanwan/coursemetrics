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
db.createCollection('reviewQuestions');
db.createCollection('reviewPolicies');
db.createCollection('policies');
db.createCollection('professorCourses');
db.createCollection('adminActions');
db.createCollection('actionTypes');

// Insert sample data into the reviewStatuses collection
const reviewStatuses = [
  { statusId: 1, statusName: 'Pending' },
  { statusId: 2, statusName: 'Approved' },
  { statusId: 3, statusName: 'Rejected' },
];
db.reviewStatuses.insertMany(reviewStatuses);

// Insert sample data into the reviewTypes collection
const reviewTypes = [{ reviewTypeID: 1, reviewTypeName: 'Course' }];
const insertedReviewTypes = db.reviewTypes.insertMany(reviewTypes);

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

// Insert sample data into the courseDetails collection
const courseDetails = [
  {
    courseName: 'Cloud Computing for Programmers',
    courseDescription:
      'This course builds on knowledge gained in previous courses and provides an overview of important software development, testing, and deployment practices in the cloud...',
  },
];
const insertedCourseDetails = db.courseDetails.insertMany(courseDetails);

// Insert sample data into the courses collection
const courses = [
  {
    courseCode: 'CCP555',
    courseDetailId: insertedCourseDetails.insertedIds[0],
    courseTerms: ['Winter', 'Summer'],
    courseDeliveryFormats: ['Hybrid', 'Flexible'],
    courseSections: ['Section 1', 'Section 2'],
  },
];
const insertedCourses = db.courses.insertMany(courses);

// Insert sample data into the reviews collection
const reviews = [
  {
    reviewTypeId: insertedReviewTypes.insertedIds[0],
    statusId: 1,
    userId: insertedUsers.insertedIds[0],
    professorId: insertedProfessors.insertedIds[0],
    courseId: insertedCourses.insertedIds[0],
    rating: 5,
    comment: 'Great course!',
  },
  {
    reviewTypeId: insertedReviewTypes.insertedIds[0],
    statusId: 1,
    userId: insertedUsers.insertedIds[1],
    professorId: insertedProfessors.insertedIds[0],
    courseId: insertedCourses.insertedIds[0],
    rating: 4,
    comment: 'Good, but could be improved.',
  },
];
const insertedReviews = db.reviews.insertMany(reviews);

// Insert sample data into the questions collection
const questions = [
  {
    questionText: 'How do you rate the course content?',
    reviewTypeID: insertedReviewTypes.insertedIds[0],
  },
  {
    questionText: 'Is the course teaching relevant material?',
    reviewTypeID: insertedReviewTypes.insertedIds[0],
  },
];
const insertedQuestions = db.questions.insertMany(questions);

// Insert sample data into the reviewQuestions collection
const reviewQuestions = [
  {
    reviewID: insertedReviews.insertedIds[0],
    questionID: insertedQuestions.insertedIds[0],
  },
  {
    reviewID: insertedReviews.insertedIds[0],
    questionID: insertedQuestions.insertedIds[1],
  },
  {
    reviewID: insertedReviews.insertedIds[1],
    questionID: insertedQuestions.insertedIds[0],
  },
  {
    reviewID: insertedReviews.insertedIds[1],
    questionID: insertedQuestions.insertedIds[1],
  },
];
db.reviewQuestions.insertMany(reviewQuestions);

// Insert sample data into the reviewAnswers collection
const reviewAnswers = [
  {
    reviewQuestionID: insertedReviews.insertedIds[0],
    answer: 'Excellent',
  },
  {
    reviewQuestionID: insertedReviews.insertedIds[0],
    answer: 'Very Relevant',
  },
  {
    reviewQuestionID: insertedReviews.insertedIds[1],
    answer: 'Good',
  },
  {
    reviewQuestionID: insertedReviews.insertedIds[1],
    answer: 'Somewhat Relevant',
  },
];
db.reviewAnswers.insertMany(reviewAnswers);

// Insert sample data into the reviewHistory collection
const reviewHistory = [
  {
    reviewID: insertedReviews.insertedIds[0],
    changeBy: insertedUsers.insertedIds[0],
  },
  {
    reviewID: insertedReviews.insertedIds[1],
    changeBy: insertedUsers.insertedIds[1],
  },
];
db.reviewHistory.insertMany(reviewHistory);

// Insert sample data into the professorCourses collection
const professorCourses = [
  {
    professorId: insertedProfessors.insertedIds[0],
    courseId: insertedCourses.insertedIds[0],
  },
];
db.professorCourses.insertMany(professorCourses);

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
  { roleId: 1, roleName: 'admin' },
  { roleId: 2, roleName: 'student' },
];
db.userRoles.insertMany(userRoles);

// Insert sample data into the policies collection
const policies = [
  {
    policyName: 'Anonymous Reviews',
    description: 'Allows users to post reviews anonymously.',
  },
  {
    policyName: 'Starred Reviews',
    description: 'Allows users to star their favorite reviews.',
  },
];
db.policies.insertMany(policies);
