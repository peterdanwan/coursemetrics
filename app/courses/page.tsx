// app/courses/page.tsx

'use client';
import useSWR from 'swr';

/*

Here is an example of how you would call the API to get all courses

*/

const fetcher = async (uri: string) => {
  const response = await fetch(uri);
  return response.json();
};

export default function Courses() {
  const { data, error } = useSWR('/api/courses?page=1&limit=10', fetcher);

  console.log(data);
  if (error) return <div>oops... {error.message}</div>;
  if (data === undefined) return <div>Loading...</div>;
  return <div></div>;
}
