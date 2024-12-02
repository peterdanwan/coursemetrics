# **CourseMetrics User Manual** <!-- omit from toc -->

<div align="center">
  <img src="../../assets/images/CourseMetricsLogo.png" alt="Logo" style="width: 30%; height: auto;">
</div>

**Submitted by:**
- Peter Wan
- Mimi Dang
- Aryan Khurana
- Jeremy Lee
- Tomas Rochwerger
- Vinh Nhan

**Submitted to:**  
Krishna Kishore

**Due Date:**
Friday, December 6. 2024

<div style="page-break-after: always;"></div>

# **Table of Contents**  <!-- omit from toc -->
- [Introduction](#introduction)
- [Installation and Setup](#installation-and-setup)
  - [Requirement](#requirement)
  - [Getting Started](#getting-started)
    - [Users](#users)
    - [Admin](#admin)
- [Workflows](#workflows)
  - [User View Course Summary Page](#user-view-course-summary-page)
  - [User View Professor Summary Page](#user-view-professor-summary-page)
  - [User Add Course Review](#user-add-course-review)
  - [User Add Professor Review](#user-add-professor-review)
  - [User Delete Course Review](#user-delete-course-review)
  - [User Delete Professor Review](#user-delete-professor-review)
  - [User Bookmark Course/Professor Reviews](#user-bookmark-courseprofessor-reviews)
  - [Admin Add Course](#admin-add-course)
  - [Admin Edit Course](#admin-edit-course)
  - [Admin Delete Course](#admin-delete-course)
  - [Admin Add Professor](#admin-add-professor)
  - [Admin Edit Professor](#admin-edit-professor)
  - [Admin Delete Professor](#admin-delete-professor)
  - [Admin Edit Reviews](#admin-edit-reviews)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
  - [How do I reset my password](#how-do-i-reset-my-password)
  - [How do you make a review?](#how-do-you-make-a-review)
  - [Do I have to create an account to view reviews?](#do-i-have-to-create-an-account-to-view-reviews)

<div style="page-break-after: always;"></div>

# Introduction

Our application aims to create a dedicated platform specifically for providing detailed information about college and university courses. This platform will reduce the workload on support and counseling staff, allowing them to focus more effectively on students with specific needs. By centralizing course information, the app will facilitate easier access to critical data for both students and educational administrators.

This manual would guide users on navigating and using CourseMetrics features effectively.

# Installation and Setup

## Requirement
- Install [Node.js](https://nodejs.org/en/download/package-manager)
- Install [Docker](https://docs.docker.com/desktop/install/windows-install)
- Clone the [project](https://github.com/peterdanwan/coursemetrics)

## Getting Started
Install the necessary dependencies using the following command:
```sh
npm install
```

To run the project frontend:
```sh
npm run dev
```
 
To run the project backend:
```sh
docker compose up --build
```

> [!NOTE]
> To stop the project `CTRL + C`. Then do `docker compose down` to stop and remove the container.

### Users
Sign-in regularly.




### Admin
Update in the database your role_id to 1 to have the admin role.





# Workflows

## User View Course Summary Page

## User View Professor Summary Page

## User Add Course Review

## User Add Professor Review

## User Delete Course Review

## User Delete Professor Review

## User Bookmark Course/Professor Reviews

## Admin Add Course

## Admin Edit Course

## Admin Delete Course

## Admin Add Professor

## Admin Edit Professor

## Admin Delete Professor

## Admin Edit Reviews



# Troubleshooting
- Pending Reviews
- Admin red toast

# FAQ
## How do I reset my password
To reset your password, select the sign-in button which would go to api/auth/login route. Then you can use the Forget Password link... (continue)

## How do you make a review?
To make a review, you must first create an account. Once you have an account, there are two ways to make a review.

***First Way***
- Go to the course or professor page you want to review.
- Click on the Add button.
- Fill out the form with the necessary information.

***Second Way***
- Go to the Reviews menu in your Profile Menu.
- Select the submenu you want to add a review (Courses or Professors).
- Click the Add button.
- Fill out the form with the necessary information.

## Do I have to create an account to view reviews?
 No, you can still view the courses and professors reviews without having to create an account.
