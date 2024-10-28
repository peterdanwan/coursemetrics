// utils/api.ts
export const apiFetcher = async (uri: string) => {
  console.log(uri);

  const response = await fetch(uri);
  return response.json();
};
