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

// Insert sample data into the courseDetails collection
const courseDetails = [
  {
    courseName: 'Cloud Computing for Programmers',
    courseDescription:
      'This course builds on knowledge gained in previous courses and provides an overview of important software development, testing, and deployment practices in the cloud. The popularity of cloud computing platforms like Amazon Web Services (AWS), Microsoft Azure, and others has changed the way that software developers write, test, and deploy their applications. Many new technologies, architectural patterns, tools, and best practices have evolved along with the capabilities of the cloud.',
  },
  {
    courseName: 'Application Development',
    courseDescription:
      'This subject will introduce students to creating a desktop application. Students will create an object oriented application that will allow users to enter data, validate it, and process it according to specifications provided. Application data will be stored in a relational database and updated by the program. Students will be exposed to MVC (model, view, controller) design principles, concurrency, and threading.',
  },
];
const insertedCourseDetails = db.courseDetails.insertMany(courseDetails);

// Insert sample data into the courses collection
const courses = [
  {
    courseCode: 'CCP555',
    courseDetailId: insertedCourseDetails.insertedIds[0],
    courseTerms: ['Winter', 'Summer'],
    courseTypes: ['Hybrid', 'Flexible'],
    courseSections: ['Section 1', 'Section 2'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    courseCode: 'APD545',
    courseDetailId: insertedCourseDetails.insertedIds[1],
    courseTerms: ['Winter', 'Summer', 'Fall'],
    courseTypes: ['Online', 'Flexible'],
    courseSections: ['Section 3', 'Section 4'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
db.courses.insertMany(courses);

console.log('Sample data inserted successfully!');
