"use client";

import { useAuthControllerGetSessionInfo } from "@/src/shared/api/endpoints/auth/auth";

export const useCurrentUser = () => {
  const { data, isLoading, isError } = useAuthControllerGetSessionInfo();

  return {
    user: data,
    isLoading,
    isError,
  };
};
