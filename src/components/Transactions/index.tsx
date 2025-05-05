import { useCallback } from "react";
import { useCustomFetch } from "src/hooks/useCustomFetch";
import { SetTransactionApprovalParams } from "src/utils/types";
import { TransactionPane } from "./TransactionPane";
import { SetTransactionApprovalFunction, TransactionsComponent } from "./types";

export const Transactions: TransactionsComponent = ({ transactions }) => {
  const { fetchWithoutCache, loading } = useCustomFetch();

  const setTransactionApproval = useCallback<SetTransactionApprovalFunction>(
    async ({ transactionId, newValue }) => {
      try {
        await fetchWithoutCache<void, SetTransactionApprovalParams>(
          "setTransactionApproval",
          {
            transactionId,
            value: newValue,
          }
        );
      } catch (error) {
        console.error("Failed to update transaction approval:", error);
        alert("Failed to update approval. Please try again.");
      }
    },
    [fetchWithoutCache]
  );

  if (transactions === null) {
    return <div className="RampLoading--container">Loading...</div>;
  }

  if (transactions.length === 0) {
    return <div className="RampEmptyState">No transactions found.</div>;
  }

  return (
    <div data-testid="transaction-container">
      {transactions.map((transaction) => (
        <TransactionPane
          transaction={transaction}
          loading={loading}
          setTransactionApproval={setTransactionApproval}
        />
      ))}
    </div>
  );
};
