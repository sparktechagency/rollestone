"use client";
import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { apiConfig } from "@/lib/config";
import { CookiesProvider } from "react-cookie";
export default function TanstackProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <CookiesProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        {apiConfig.isDevelopment && (
          <ReactQueryDevtools client={queryClient} initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </CookiesProvider>
  );
}
