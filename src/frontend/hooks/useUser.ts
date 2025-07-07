import { useUser as useClerkUser } from '@clerk/clerk-expo';
import { useMemo } from 'react';

export const useUser = () => {
  const { user, isLoaded, isSignedIn } = useClerkUser();

  const userData = useMemo(() => {
    if (!isLoaded || !isSignedIn || !user) {
      return {
        firstName: '',
        lastName: '',
        fullName: '',
        email: '',
        initials: '',
        isAuthenticated: false
      };
    }

    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();
    const email = user.primaryEmailAddress?.emailAddress || '';
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

    return {
      firstName,
      lastName,
      fullName,
      email,
      initials,
      isAuthenticated: true
    };
  }, [user, isLoaded, isSignedIn]);

  return {
    ...userData,
    isLoaded,
    isSignedIn,
    user
  };
}; 