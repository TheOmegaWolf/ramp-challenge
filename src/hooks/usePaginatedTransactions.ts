import { useCallback, useEffect, useState } from "react";
import { PaginatedRequestParams, PaginatedResponse, Transaction } from "../utils/types";
import { PaginatedTransactionsResult } from "./types";
import { useCustomFetch } from "./useCustomFetch";

export function usePaginatedTransactions(): PaginatedTransactionsResult {
  const { fetchWithCache, loading } = useCustomFetch();
  const [paginatedTransactions, setPaginatedTransactions] = useState<PaginatedResponse<Transaction[]> | null>(null);

  const fetchAll = useCallback(async () => {
    // Stop if we’ve reached the end of pagination
    if (paginatedTransactions?.nextPage === null) return;
  
    const pageToFetch =
      paginatedTransactions?.nextPage !== undefined &&
      paginatedTransactions?.nextPage !== null
        ? paginatedTransactions.nextPage
        : 0;
  
    try {
      const response = await fetchWithCache<
        PaginatedResponse<Transaction[]>,
        PaginatedRequestParams
      >("paginatedTransactions", {
        page: pageToFetch,
      });
  
      setPaginatedTransactions((prev) => {
        if (!response) return prev;
        if (!prev) return response;
  
        return {
          data: [...prev.data, ...response.data],
          nextPage: response.nextPage,
        };
      });
    } catch (error) {
      console.error("Failed to fetch paginated transactions:", error);
    }
  }, [fetchWithCache, paginatedTransactions]);
  

  const invalidateData = useCallback(() => {
    setPaginatedTransactions(null);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { data: paginatedTransactions, loading, fetchAll, invalidateData };
}
