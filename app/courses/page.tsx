// app/courses/page.tsx

'use client';
import useSWR from 'swr';
import { Spinner } from '@nextui-org/react';

/*

Here is an example of how you would call the API to get all courses

*/

const fetcher = async (uri: string) => {
  const response = await fetch(uri);
  return response.json();
};

export default function Courses() {
  const { data, error } = useSWR('/api/courses?page=1&limit=20', fetcher);

  console.log(data);
  if (error) return <div>oops... {error.message}</div>;

  // Have a better loading message or spinner that's different than the navbar's loading message
  if (data === undefined)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
        &nbsp;&nbsp;Loading the different courses...
      </div>
    );
  return <div>Hello World</div>;
}
