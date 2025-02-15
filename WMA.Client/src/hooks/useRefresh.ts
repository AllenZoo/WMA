import { useState } from "react";

/**
 * Type for any asynchronous function that returns a promise
 */
type AsyncFunction<T = any> = () => Promise<T>;

/**
 * Type for the refresh callback function
 */
type RefreshFunction = () => void;

/**
 * Options for configuring the useRefresh hook
 */
interface UseRefreshOptions {
  /**
   * Delay in milliseconds before triggering the refresh
   * @default 0
   */
  delay?: number;
  /**
   * Whether to automatically refresh on error
   * @default false
   */
  refreshOnError?: boolean;
}

/**
 * A hook for handling component refreshes after async operations
 * @param refreshFunc - Function to call when refreshing the component
 * @param options - Configuration options for the refresh behavior
 * @returns Object containing the refresh functions and loading state
 */
export function useRefresh(
  refreshFunc: RefreshFunction,
  options: UseRefreshOptions = {}
) {
  const { delay = 0, refreshOnError = false } = options;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  /**
   * Executes an async function and triggers a refresh afterward
   * @param func - Async function to execute before refreshing
   * @returns Promise that resolves when both the function and refresh are complete
   */
  const waitToRefresh = async <T>(func: AsyncFunction<T>): Promise<T> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await func();

      // Only proceed with refresh if we successfully got a result
      return new Promise((resolve) => {
        setRefreshCounter((prev) => prev + 1);

        if (delay > 0) {
          setTimeout(() => {
            refreshFunc();
            setIsLoading(false);
            resolve(result);
          }, delay);
        } else {
          refreshFunc();
          setIsLoading(false);
          resolve(result);
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setIsLoading(false);

      if (refreshOnError) {
        refreshFunc();
      }

      throw err;
    }
  };

  /**
   * Waits for a promise to resolve and triggers a refresh afterward
   * @param promise - Promise to wait for before refreshing
   * @returns Promise that resolves when both the input promise and refresh are complete
   */
  const waitForPromise = async <T>(promise: Promise<T>): Promise<T> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await promise;

      return new Promise((resolve) => {
        setRefreshCounter((prev) => prev + 1);

        if (delay > 0) {
          setTimeout(() => {
            refreshFunc();
            setIsLoading(false);
            resolve(result);
          }, delay);
        } else {
          refreshFunc();
          setIsLoading(false);
          resolve(result);
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setIsLoading(false);

      if (refreshOnError) {
        refreshFunc();
      }

      throw err;
    }
  };

  const refresh = () => {
    setIsLoading(true);
    setError(null);

    return new Promise<void>((resolve) => {
      setRefreshCounter((prev) => prev + 1);

      if (delay > 0) {
        setTimeout(() => {
          refreshFunc();
          setIsLoading(false);
          resolve();
        }, delay);
      } else {
        refreshFunc();
        setIsLoading(false);
        resolve();
      }
    });
  };

  return {
    waitToRefresh,
    waitForPromise,
    refresh,
    isLoading,
    error,
    refreshCount: refreshCounter,
  };
}
