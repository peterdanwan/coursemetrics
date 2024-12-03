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
    - [Start/Stop Frontend Client](#startstop-frontend-client)
    - [Start/Stop Backend Container Server:](#startstop-backend-container-server)
    - [Users](#users)
      - [Create an account](#create-an-account)
    - [Admin](#admin)
- [Workflows](#workflows)
  - [User View Specific Course Summary Page](#user-view-specific-course-summary-page)
  - [User View Specific Professor Summary Page](#user-view-specific-professor-summary-page)
  - [User Add Course Review](#user-add-course-review)
  - [User Add Professor Review](#user-add-professor-review)
  - [User View Specific Review Detail](#user-view-specific-review-detail)
  - [User Delete Course Review](#user-delete-course-review)
  - [User Delete Professor Review](#user-delete-professor-review)
  - [User Bookmark Course/Professor Reviews](#user-bookmark-courseprofessor-reviews)
  - [Admin Manage Course](#admin-manage-course)
    - [Admin Add Course](#admin-add-course)
    - [Admin Edit Course](#admin-edit-course)
    - [Admin Delete Course](#admin-delete-course)
  - [Admin Manage Professor](#admin-manage-professor)
    - [Admin Add Professor](#admin-add-professor)
    - [Admin Edit Professor](#admin-edit-professor)
    - [Admin Delete Professor](#admin-delete-professor)
  - [Admin Manage Reviews](#admin-manage-reviews)
    - [Admin Approve/Reject Reviews](#admin-approvereject-reviews)
  - [User Sign Out](#user-sign-out)
- [Troubleshooting](#troubleshooting)
  - [Problem 1: Unhandled Runtime Error](#problem-1-unhandled-runtime-error)
  - [Problem 2: Delete Course error](#problem-2-delete-course-error)
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
- Create `.env` file, containing credentials for:
   -  [Auth0](https://auth0.com)
   -  `PostgreSQL`
   -  [Redis](https://redis.io/docs/latest/operate/oss_and_stack/install)
   -  [Google Gemini API Key](https://aistudio.google.com/app/apikey)

## Getting Started
To install CourseMetrics's necessary dependendies, run the following command:
```sh
# This installs all of the necessary frontend dependencies for CourseMetrics
npm install
```
> [!NOTE]
> This installs a `node_modules` folder with the necessary dependencies.


### Start/Stop Frontend Client
```sh
# This command will open a connection on localhost:3000
npm run dev
```
> [!NOTE]
> The Frontend Client will be hosted on `http://localhost:3000`.  
> To _stop_ the frontend client, go to the terminal twhere `npm run dev` was run, and then press `Ctrl + C` to stop the client.

### Start/Stop Backend Container Server:
```sh
# This command will open a connection on localhost:8080
docker compose up --build
```

> [!NOTE]
> The Backend Server will be hosted on `http://localhost:8080`.  
> To stop the project, press `CTRL + C`. Then use the following command `docker compose down` to stop and remove the container.

### Users

#### Create an account

![Profile Sign-In](./images/profile-sign-in.png)

There are multiple way to create an account:
- Local account
- Google provider
- GitHub provider

![Sign-In Page](./images/sign-in-page.png)

To create an account locally, click on the `Sign up` link, fill out the form and click continue:
![Sign-Up Page](./images/sign-up-page.png)

User would be redirected to the home page with the propoer profile menu:
![User Profile Menu](./images/user-profile-menu.png)

> [!NOTE]
> If the Google or GitHub provider is selected, user just need to follow the provider direction to sign-up properly.

### Admin
After creating an account, go to localhost:8080, fill the form with the proper database credential found in `.env` file to access to the database:

![Login to Database](./images/database-login.png)

To have an admin role, update the role_id in the users table to `1`:

![Users Table](./images/users-table.png)

![Change to Admin Role](./images/admin-role.png)

Admin would be redirected to the admin dashboard with the proper profile menu:
![Admin Dashboard](./images/admin-dashboard.png)

# Workflows

## User View Specific Course Summary Page
To view a specific course summary page, user have to go to the course page and select the `View Reviews` button of the specific course:
![Course Page](./images/course-page.png)
![Course View Reviews Button](./images/course-view-reviews-button.png)
![WEB222 Empty Summary Page](./images/web222-empty-summary-page.png)

## User View Specific Professor Summary Page
To view a specific professor summary page, user have to go to the professor page and select the `View Reviews` button of the specific professor:
![Professor Page](./images/professor-page.png)
![Professor View Reviews Button](./images/professor-view-reviews-button.png)
![David Humphrey Empty Summary Page](./images/david-humphrey-empty-summary-page.png)

## User Add Course Review
To add a course review, scroll down until user see the `Add a Review` button:
![Add Course Review](./images/add-course-review.png)

Complete the review form:
![Course Review Form](./images/course-review-form.png)

Review has been posted successfully:
![Course Review Posted Successfully](./images/course-review-posted-successfully.png)

To see if the review has been approved, go to the user reviews courses:
![User Course Reviews](./images/user-course-reviews.png)

If the review has a status with a green checkmark icon, it means that the review has been approved:
![Approved Course Review](./images/approved-course-review.png)

> [!NOTE]
> The Course Summary page reloads with the new review and calculated ratings, only if the review is approved.

![Reload Course Summary Page](./images/reload-course-summary-page.png)

## User Add Professor Review
To add a professor review, scroll down until user see the `Add a Review` button:
![Add Professor Review](./images/add-professor-review.png)

Complete the review form:
![Professor Review Form](./images/professor-review-form.png)

Review has been posted successfully:
![Professor Review Posted Successfully](./images/professor-review-posted-successfully.png)

To see if the review has been approved, go to the user reviews professors:
![User Professor Reviews](./images/user-professor-reviews.png)

The status of the review is a yellow exclamation point, meaning that the review is pending and it is waiting for an admin answer:
![Pending Professor Review](./images/pending-professor-review.png)

> [!NOTE]
> The Professor Summary page reloads with the new review and calculated ratings, only if the review is approved.

## User View Specific Review Detail
To view a specific review details, click on the `See More` link, which will open a modal:
![Course Review See More](./images/course-review-see-more.png)
![Course Review Detail Modal](./images/course-review-detail-modal.png)

## User Delete Course Review
To delete your own course review, click on the `Delete` button:
![User Course Reviews](./images/user-course-reviews.png)

![User Delete Course Review](./images/user-delete-course-review.png)

User has successfully delete the course review:
![User Delete Course Review Successfully](./images/user-delete-course-review-successfully.png)

> [!NOTE]
> If the review has been previously approved and posted in the Course Summary page, the review would be removed.

## User Delete Professor Review
To delete your own professor review:
![User Professor Reviews](./images/user-professor-reviews.png)

![User Delete Professor Review](./images/user-delete-professor-review.png)

User has successfully delete the professor review:
![User Delete Professor Review Successfully](./images/user-delete-professor-review-successfully.png)

> [!NOTE]
> If the review has been previously approved and posted in the Professor Summary page, the review would be removed.

![David Humphrey Empty Summary Page](./images/david-humphrey-empty-summary-page.png)

## User Bookmark Course/Professor Reviews
To bookmark a review, user need to toggle the bookmark icon on the reviews section of Course/Professor Summary page:
![Course Bookmark](./images/course-bookmark.png)
![Professor Bookmark](./images/professor-bookmark.png)

To view what the user has bookmarked, user can go to their profile menu and select `Bookmark`:
![user-bookmark](./images/user-bookmark.png)

Then select the `Course Reviews` or `Professor Reviews` that user has bookmarked. By default it is always on `Course Reviews`
![Course Reviews Bookmark](./images/course-reviews-bookmark.png)

![Professor Reviews Bookmark](./images/professor-reviews-bookmark.png)

## Admin Manage Course
There are two ways to get to the course management page:

***The first way***
![Profile Manage Course](./images/profile-manage-course.png)

***The second way***
![Dashboard Manage Course](./images/dashboard-manage-course.png)

Both ways would redirect to the admin/manage?option=courses:
![Manage Course Page](./images/manage-course-page.png)

### Admin Add Course
To add a course, select the `Add` button on the top right of the page:
![Course Add Button](./images/course-add-button.png)

Complete the course form:
![Add New Course Form](./images/add-new-course-form.png)

The new course has been added successfully:
![Add New Course Successfully](./images/add-new-course-successfully.png)

This new course would now appear in the course page:
![Go to Course Page](./images/go-to-course-page.png)

![Course Page with New Course](./images/course-page-with-new-course.png)

### Admin Edit Course
To edit a course, select the `Edit` button on a specific course:
![Course Edit Button](./images/course-edit-button.png)

Update the course form:
![Update Course Form](./images/update-course-form.png)

This course has been updated successfully:
![Update Course Successfully](./images/update-course-successfully.png)

### Admin Delete Course
To delete a course, select the `Remove` button on a specific course:
![Course Remove Button](./images/course-remove-button.png)

This course has been deleted successfully:
![Delete Course Successfully](./images/delete-course-successfully.png)

This course no longer appear in the course page:
![Course Page with Deleted Course](./images/course-page-with-deleted-course.png)

## Admin Manage Professor
There are two ways to get to the professor management page:

***The first way***
![Profile Manage Professor](./images/profile-manage-professor.png)

***The second way***
![Dashboard Manage Professor](./images/dashboard-manage-professor.png)

Both ways would redirect to the admin/manage?option=professors:
![Manage Professor Page](./images/manage-professor-page.png)

### Admin Add Professor
To add a professor, select the `Add` button on the top right of the page:
![Professor Add Button](./images/professor-add-button.png)

Complete the professor form:
![Add New Professor Form](./images/add-new-professor-form.png)

The new professor has been added successfully:
![Add New Professor Successfully](./images/add-new-professor-successfully.png)

This new professor would now appear in the professor page:
![Go to Professor Page](./images/go-to-professor-page.png)
![Professor Page with New Professor](./images/professor-page-with-new-professor.png)

### Admin Edit Professor
To edit a professor, select the `Edit` button on a specific professor:
![Professor Edit Button](./images/professor-edit-button.png)

Update the professor form:
![Update Professor Form](./images/update-professor-form.png)

This professor has been updated successfully:
![Update Professor Successfully](./images/update-professor-successfully.png)

### Admin Delete Professor
To delete a professor, select the `Remove` button on a specific professor:
![Professor Remove Button](./images/professor-remove-button.png)

This professor has been deleted successfully:
![Delete Professor Successfully](./images/delete-professor-successfully.png)

This professor no longer appear in the professor page:
![Professor Page with Deleted Professor](./images/professor-page-with-deleted-professor.png)

## Admin Manage Reviews

There are two ways to get to the review management page:

***The first way***
![Profile Manage Review](./images/profile-manage-review.png)

***The second way***
![Dashboard Manage Review](./images/dashboard-manage-review.png)

Both ways would redirect to the admin/manage?option=reviews:

### Admin Approve/Reject Reviews
To approve or reject a review, admin should click on the `View Details` button of a pending review:
![Admin Pending Review](./images/admin-pending-review.png)

Admin should read through the review carefully and see if there is no policy violation.

If the review have violated a policy, select the proper type of violation and click on `Reject Review` button:
![Reject Review Button](./images/reject-review-button.png)

Review has been rejected successfully:
![Review Rejected Successfully](./images/reject-review-successfully.png)

If the review has been completed properly, admin can click on the `Accept Review` button
![Accept Review Button](./images/accept-review-button.png)

Review has been accepted successfully:
![Review Accepted Successfully](./images/accept-review-successfully.png)

This review would then be posted properly to their course/professor summary page:
![Reload Professor Summary Page](./images/reload-professor-summary-page.png)

## User Sign Out
To sign out, go to your profile menu and select `Sign out`:
![User Sign Out](./images/user-sign-out.png)

# Troubleshooting
Follow the steps to resolve common problems. If the issue persists, please contact our support team.

## Problem 1: Unhandled Runtime Error

![Chunk load error](./images/chunk-load-error.png)

**Solution:** Refresh the page.

## Problem 2: Delete Course error

![Delete Course Error](./images/delete-course-error.png)

**Solution:** Remove all association with this course.

# FAQ
## How do I reset my password
To reset your password, select the `Sign In` inside the `Profile Icon` which would redirect you to api/auth/login. Then you click on the `Forget Password?` link, enter the email address used for the account you want to reset your password, and press `Continue`. Afterwards, you will receive an email with the proper steps to reset your password.

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
