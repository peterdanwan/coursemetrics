// app/courses/[courseCode]/page.tsx

'use client';
import useSWR from 'swr';

/*

Here is an example of how you would call the API to get a course by courseCode

*/

const fetcher = async (uri: string) => {
  const response = await fetch(uri);
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  let res = await response.json();
  return res.data;
};

export default function CoursePage({ params }: { params: { courseCode: string } }) {
  // Fetch course details
  const { data: courseData, error: courseError } = useSWR(
    `/api/courses/${params.courseCode.toUpperCase()}`,
    fetcher
  );

  // Fetch course reviews (with default pagination, page 1 and limit 10)
  const { data: reviewsData, error: reviewsError } = useSWR(
    `/api/courses/${params.courseCode.toUpperCase()}/reviews?page=1&limit=10`,
    fetcher
  );

  console.log('Course Data:', courseData);
  console.log('Reviews Data:', reviewsData);

  if (courseError) return <div>Oops... {courseError.message}</div>;
  if (reviewsError) return <div>Oops... {reviewsError.message}</div>;

  if (!courseData || !reviewsData) return <div>Loading...</div>;

  return (
    <div>
      <h1>Course: {courseData?.course?.courseCode}</h1>
      <p>{courseData?.course?.courseDetailId.courseName}</p>
      <p>{courseData?.course?.courseDetailId.courseDescription}</p>
      <p>Delivery Formats: {courseData?.course?.courseDeliveryFormats.join(', ')}</p>

      <h2>Reviews</h2>
      {reviewsData.reviews.length === 0 ? (
        <p>No reviews found for this course.</p>
      ) : (
        <ul>
          {reviewsData.reviews.map((review: any, index: number) => (
            <li key={index}>
              <p>
                <strong>Review {index + 1}:</strong>
              </p>
              <p>Status: {review.statusId}</p>
              <p>Professor ID: {review.professorId}</p>
            </li>
          ))}
        </ul>
      )}

      <p>
        Page {reviewsData.pagination.page} of {reviewsData.pagination.totalPages}
      </p>
    </div>
  );
}
