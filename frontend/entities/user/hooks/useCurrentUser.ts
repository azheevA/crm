"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type User = {
  id: number;
  name: string;
};

export const useCurrentUser = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const res = await axios.get<User>("/api/auth/me");
      return res.data;
    },
  });

  return {
    user: data,
    isLoading,
  };
};
