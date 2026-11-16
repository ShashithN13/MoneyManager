import { createContext, PropsWithChildren, useContext, useState } from "react";

export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  title: string;
  category: string;
  amount: number;
  type: TransactionType;
  date: string;
  note: string;
};

type NewTransaction = Omit<Transaction, "id" | "date">;

type TransactionContextValue = {
  transactions: Transaction[];
  addTransaction: (transaction: NewTransaction) => void;
  removeTransaction: (id: string) => void;
  appStateMessage: string;
  setAppStateMessage: (message: string) => void;
};

const TransactionContext = createContext<TransactionContextValue | undefined>(
  undefined,
);

export function TransactionProvider({ children }: PropsWithChildren) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [appStateMessage, setAppStateMessage] = useState("App is active.");

  function addTransaction(transaction: NewTransaction) {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };

    setTransactions((currentTransactions) => [newTransaction, ...currentTransactions]);
  }

  function removeTransaction(id: string) {
    setTransactions((currentTransactions) =>
      currentTransactions.filter((transaction) => transaction.id !== id),
    );
  }

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        removeTransaction,
        appStateMessage,
        setAppStateMessage,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);

  if (!context) {
    throw new Error("useTransactions must be used inside TransactionProvider.");
  }

  return context;
}
