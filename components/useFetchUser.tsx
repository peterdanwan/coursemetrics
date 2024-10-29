// components/useFetchUser.tsx
import { useState, useEffect } from 'react';

const useFetchUser = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/users', { method: 'GET' });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const fetchedUser = await response.json();
      setUser(fetchedUser.data.user);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return { user, loading, error };
};

export default useFetchUser;
