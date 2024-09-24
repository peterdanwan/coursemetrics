-- Drop tables if they exist to start fresh
DROP TABLE IF EXISTS review_answers CASCADE;
DROP TABLE IF EXISTS review_questions CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS review_types CASCADE;
DROP TABLE IF EXISTS review_statuses CASCADE;
DROP TABLE IF EXISTS course_sections CASCADE;
DROP TABLE IF EXISTS course_delivery_formats CASCADE;
DROP TABLE IF EXISTS course_terms CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS course_details CASCADE;
DROP TABLE IF EXISTS professors CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create 'user_roles' table first
CREATE TABLE user_roles (
  role_id SERIAL PRIMARY KEY,
  role_name VARCHAR(50) UNIQUE
);

-- Create 'users' table
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  full_name VARCHAR(200),
  email VARCHAR(255) UNIQUE,
  role_id INT REFERENCES user_roles(role_id)
);

-- Create 'user_profiles' table
CREATE TABLE user_profiles (
  profile_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id),
  bio TEXT
);

-- Create 'professors' table
CREATE TABLE professors (
  professor_id SERIAL PRIMARY KEY,
  professor_first_name VARCHAR(100),
  professor_last_name VARCHAR(100)
);

-- Create 'course_details' table
CREATE TABLE course_details (
  course_detail_id SERIAL PRIMARY KEY,
  course_name VARCHAR(255),
  course_description TEXT
);

-- Create 'courses' table
CREATE TABLE courses (
  course_id SERIAL PRIMARY KEY,
  course_code VARCHAR(10),
  course_detail_id INT REFERENCES course_details(course_detail_id)
);

-- Create 'course_terms' table
CREATE TABLE course_terms (
  term_id SERIAL PRIMARY KEY,
  course_id INT REFERENCES courses(course_id),
  term_name VARCHAR(50)
);

-- Create 'course_delivery_formats' table
CREATE TABLE course_delivery_formats (
  format_id SERIAL PRIMARY KEY,
  course_id INT REFERENCES courses(course_id),
  format_name VARCHAR(50)
);

-- Create 'course_sections' table
CREATE TABLE course_sections (
  section_id SERIAL PRIMARY KEY,
  course_id INT REFERENCES courses(course_id),
  section_name VARCHAR(50)
);

-- Create 'review_statuses' table
CREATE TABLE review_statuses (
  status_id SERIAL PRIMARY KEY,
  status_name VARCHAR(50)
);

-- Create 'review_types' table
CREATE TABLE review_types (
  review_type_id SERIAL PRIMARY KEY,
  review_type_name VARCHAR(50)
);

-- Create 'reviews' table
CREATE TABLE reviews (
  review_id SERIAL PRIMARY KEY,
  review_type_id INT REFERENCES review_types(review_type_id),
  status_id INT REFERENCES review_statuses(status_id),
  user_id INT REFERENCES users(user_id),
  professor_id INT REFERENCES professors(professor_id),
  course_id INT REFERENCES courses(course_id),
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT
);

-- Create 'questions' table
CREATE TABLE questions (
  question_id SERIAL PRIMARY KEY,
  question_text TEXT,
  review_type_id INT REFERENCES review_types(review_type_id)
);

-- Create 'review_questions' table
CREATE TABLE review_questions (
  review_question_id SERIAL PRIMARY KEY,
  review_id INT REFERENCES reviews(review_id),
  question_id INT REFERENCES questions(question_id)
);

-- Create 'review_answers' table
CREATE TABLE review_answers (
  review_answer_id SERIAL PRIMARY KEY,
  review_question_id INT REFERENCES review_questions(review_question_id),
  answer TEXT
);

-- Create 'review_history' table
CREATE TABLE review_history (
  history_id SERIAL PRIMARY KEY,
  review_id INT REFERENCES reviews(review_id),
  change_by INT REFERENCES users(user_id),
  change_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data into 'user_roles'
INSERT INTO user_roles (role_name) VALUES
('admin'),
('student');

-- Insert sample data into 'users'
INSERT INTO users (full_name, email, role_id) VALUES
('Alice Johnson', 'alice.johnson@example.com', 2),
('Bob Smith', 'bob.smith@example.com', 1);

-- Insert sample data into 'professors'
INSERT INTO professors (professor_first_name, professor_last_name) VALUES
('John', 'Doe'),
('Jane', 'Doe');

-- Insert sample data into 'course_details'
INSERT INTO course_details (course_name, course_description) VALUES
('Course 1 Name', 'Description for Course 1'),
('Course 2 Name', 'Description for Course 2'),
('Course 3 Name', 'Description for Course 3');

-- Insert sample data into 'courses'
INSERT INTO courses (course_code, course_detail_id) VALUES
('CCP555', 1),
('MOBILE202', 2),
('SE400', 3);

-- Insert sample data into 'course_terms'
INSERT INTO course_terms (course_id, term_name) VALUES
(1, 'Winter'), 
(1, 'Summer'),
(2, 'Fall'),
(3, 'Spring');

-- Insert sample data into 'course_delivery_formats'
INSERT INTO course_delivery_formats (course_id, format_name) VALUES
(1, 'Hybrid'), 
(2, 'Online'),
(3, 'In-Person');

-- Insert sample data into 'course_sections'
INSERT INTO course_sections (course_id, section_name) VALUES
(1, 'Section 1'), 
(1, 'Section 2'),
(2, 'Section 1'),
(3, 'Section 1');

-- Insert sample data into 'review_statuses'
INSERT INTO review_statuses (status_name) VALUES
('Pending'),
('Approved'),
('Rejected');

-- Insert sample data into 'review_types'
INSERT INTO review_types (review_type_name) VALUES
('Course Review'),
('Professor Review');

-- Insert sample data into 'reviews'
INSERT INTO reviews (review_type_id, status_id, user_id, professor_id, course_id, rating, comment) VALUES
(1, 1, 1, 1, 1, 5, 'Great course!'),
(2, 1, 2, 2, 2, 4, 'Good course but needs improvement.');

-- Insert sample data into 'questions'
INSERT INTO questions (question_text, review_type_id) VALUES
('How do you rate the course content?', 1),
('Is the course teaching relevant material?', 1);

-- Insert sample data into 'review_questions'
INSERT INTO review_questions (review_id, question_id) VALUES
(1, 1), (1, 2), (2, 1);

-- Insert sample data into 'review_answers'
INSERT INTO review_answers (review_question_id, answer) VALUES
(1, 'Excellent'), (2, 'Very Relevant'), (3, 'Good');

-- Insert sample data into 'review_history'
INSERT INTO review_history (review_id, change_by) VALUES
(1, 1), (2, 2);

-- Insert sample data into 'user_profiles'
INSERT INTO user_profiles (user_id, bio) VALUES
(1, 'Alice is a software engineer specializing in cloud computing.'),
(2, 'Bob is a data analyst with a passion for machine learning.');
