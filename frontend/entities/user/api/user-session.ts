import { useAuthControllerGetSessionInfo } from "@/shared/api/endpoints/auth/auth";

export const useSession = () => {
  const { data, isLoading, isError } = useAuthControllerGetSessionInfo({
    query: {
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  });

  return {
    user: data,
    isAuth: !!data,
    isLoading,
    isError,
  };
};
