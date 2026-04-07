import { useEffect, useState } from "react";
import { fetchJson } from "./api";

const RETRY_DELAYS_MS = [600, 1200, 2000, 3200];

function wait(delay) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, delay);
  });
}

function shouldRetry(error) {
  return error?.isNetworkError || error?.isRetryable;
}

export function useFerrariData(path) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    setState((currentState) => ({
      data: currentState.data,
      loading: true,
      error: null,
    }));

    async function loadData() {
      for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
        try {
          const data = await fetchJson(path);

          if (!cancelled) {
            setState({
              data,
              loading: false,
              error: null,
            });
          }

          return;
        } catch (error) {
          const hasNextAttempt = attempt < RETRY_DELAYS_MS.length;

          if (!hasNextAttempt || !shouldRetry(error)) {
            if (!cancelled) {
              setState({
                data: null,
                loading: false,
                error,
              });
            }

            return;
          }

          await wait(RETRY_DELAYS_MS[attempt]);

          if (cancelled) {
            return;
          }
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [path]);

  return state;
}
