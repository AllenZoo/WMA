// hooks/useRefreshControl.ts
import { useState } from "react";

interface UseRefreshControlProps {
  onRefresh: () => Promise<void>;
  refreshTimeout?: number;
  maxRefreshTime?: number;
}

export function useRefreshControl({
  onRefresh,
  refreshTimeout = 1000,
  maxRefreshTime = 3000,
}: UseRefreshControlProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    let timeout: number;

    // Only show refresh indicator if it takes longer than refreshTimeout
    const showRefreshIndicator = new Promise<void>((resolve) => {
      timeout = setTimeout(() => {
        setRefreshing(true);
        resolve();
      }, refreshTimeout);
    });

    // Execute the refresh callback
    const refreshPromise = onRefresh().then(() => {
      setRefreshing(false);
      clearTimeout(timeout);
    });

    await Promise.race([showRefreshIndicator, refreshPromise]);

    // If refresh takes longer than maxRefreshTime, stop refreshing
    setTimeout(() => {
      setRefreshing(false);
    }, maxRefreshTime);
  };

  return {
    refreshing,
    onRefresh: handleRefresh,
  };
}
