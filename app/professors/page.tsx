// app/pages/page.tsx

'use client';
import useSWR from 'swr';
import { Spinner } from '@nextui-org/react';

/*

Here is an example of how you would call the API to get all professors

*/

const fetcher = async (uri: string) => {
  console.log(uri);

  const response = await fetch(uri);
  return response.json();
};

export default function Professors() {
  const { data, error } = useSWR('/api/professors', fetcher);

  console.log(data);
  if (error) return <div>oops... {error.message}</div>;

  // Have a better loading message or spinner that's different than the navbar's loading message
  if (data === undefined)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
        &nbsp;&nbsp;Loading the different professors...
      </div>
    );
  return <div>Hello World</div>;
}
