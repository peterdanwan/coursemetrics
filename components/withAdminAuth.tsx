// components/withAdminAuth.tsx
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Spinner } from '@nextui-org/react';
import useFetchUser from './useFetchUser';

const withAdminAuth = (WrappedComponent: React.ComponentType<any>) => {
  const AuthenticatedComponent = (props: any) => {
    const router = useRouter();
    const { user, loading, error } = useFetchUser();

    useEffect(() => {
      if (!loading) {
        if (error) {
          console.error('Error fetching user data:', error);
          return;
        }

        console.log('Fetched Admin role ID:', user?.role_id);
        if (!user || user.role_id !== 1) {
          router.push('/');
        }
      }
    }, [loading, user, error, router]);

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Spinner />
          &nbsp;&nbsp;Loading the data ...
        </div>
      );
    }

    return user && user.role_id === 1 ? <WrappedComponent {...props} user={user} /> : null;
  };

  AuthenticatedComponent.displayName = `withAdminAuth(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return AuthenticatedComponent;
};

export default withAdminAuth;
