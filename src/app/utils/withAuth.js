// utils/withAuth.js
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from './firebaseconfig'; // Adjust the import path accordingly

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (!user) {
          router.push('/Admin'); // Redirect to login page if not authenticated
        }
      });
      
      return () => unsubscribe();
    }, [router]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;