import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['/api/auth/user'],
    queryFn: async () => {
      console.log('Fetching user authentication status...');
      const response = await fetch('/api/auth/user', {
        credentials: 'include'
      });

      console.log('Auth response:', response.status);

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.log('User not authenticated');
          return null; // User is not authenticated
        }
        throw new Error(`Failed to fetch user: ${response.status}`);
      }

      const userData = await response.json();
      console.log('User authenticated:', !!userData);
      return userData;
    },
    retry: (failureCount, error: any) => {
      // Don't retry on authentication errors
      if (error?.message?.includes('401') || error?.message?.includes('403')) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
    error
  };
}