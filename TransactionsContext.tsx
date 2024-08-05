import React, { createContext, useState, useContext, ReactNode } from 'react';

type Transaction = {
  id: string;
  name: string;
  amount: number;
  date: string;
  address: string;
};

type TransactionsContextType = {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
};

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export const TransactionsProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', name: 'Fanshawe College', amount: 8470, date: '01-07-2024', address: '1001 Fanshawe College Blvd, London, ON' },
    { id: '2', name: 'Canadian Tire', amount: 200, date: '02-07-2024', address: '800 Commissioners Rd E, London, ON' },
    { id: '3', name: 'Petro Canada', amount: 70, date: '03-07-2014', address: '777 York St, London, ON' },
    { id: '4', name: 'Shelbys Shawarma', amount: 36, date: '04-07-2014', address: '310 Front St E, London, ON' },
    { id: '5', name: 'Tim Hortans', amount: 4.9, date: '05-07-2014', address: '151 Innovation Dr, London, ON' },
  ]);

  const addTransaction = (transaction: Transaction) => {
    setTransactions([...transactions, transaction]);
  };

  return (
    <TransactionsContext.Provider value={{ transactions, addTransaction }}>
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = (): TransactionsContextType => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
};
