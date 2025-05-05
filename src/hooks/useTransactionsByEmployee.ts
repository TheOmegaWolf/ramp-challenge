import { useCallback, useState } from "react";
import { RequestByEmployeeParams, Transaction } from "../utils/types";
import { TransactionsByEmployeeResult } from "./types";
import { useCustomFetch } from "./useCustomFetch";

export function useTransactionsByEmployee(): TransactionsByEmployeeResult {
  const { fetchWithCache, loading } = useCustomFetch();
  const [transactionsByEmployee, setTransactionsByEmployee] = useState<Transaction[] | null>(null);

  const fetchById = useCallback(
    async (employeeId: string) => {
      try {
        const data = await fetchWithCache<Transaction[], RequestByEmployeeParams>(
          "transactionsByEmployee",
          { employeeId }
        );
        setTransactionsByEmployee(data);
      } catch (error) {
        console.error(`Failed to fetch transactions for employee ${employeeId}:`, error);
        setTransactionsByEmployee([]);
      }
    },
    [fetchWithCache]
  );

  const invalidateData = useCallback(() => {
    setTransactionsByEmployee(null);
  }, []);

  return { data: transactionsByEmployee, loading, fetchById, invalidateData };
}
