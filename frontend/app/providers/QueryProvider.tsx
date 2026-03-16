"use client";

import { useChatSocketUpdates } from "@/features/change-chat-data/hooks/useDeleteChat";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, ReactNode } from "react";

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SocketManager />
      {children}
    </QueryClientProvider>
  );
}
function SocketManager() {
  useChatSocketUpdates();
  return null;
}
