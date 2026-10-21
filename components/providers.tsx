"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * Provides the TanStack Query client for content fetching.
 *
 * Content JSON is static, so queries are treated as long-lived: `staleTime` is
 * effectively infinite and refetches on window focus are disabled. Errors are
 * surfaced to the component (the content service returns typed errors), not
 * retried blindly more than once.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Infinity,
            refetchOnWindowFocus: false,
            retry: 1
          }
        }
      })
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
