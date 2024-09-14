// app/courses/[id]/page.tsx

'use client';
import useSWR from 'swr';

/*

Here is an example of how you would call the API to get a course by ID

*/

const fetcher = async (uri) => {
  const response = await fetch(uri);
  return response.json();
};

export default function Products({ params }: { params: { id: string } }) {
  const { data, error } = useSWR(`/api/courses/${params.id}`, fetcher);
  console.log(data);
  if (error) return <div>oops... {error.message}</div>;
  if (data === undefined) return <div>Loading...</div>;
  return <div>{data.protected}</div>;
}
