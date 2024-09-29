import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

interface PortfolioItem {
  ticker: string;
  quantity: number;
  current_price: number;
  total_value: number;
}

interface Transaction {
  ticker: string;
  quantity: number;
  action: 'buy' | 'sell';
  price: number;
  timestamp: number;
}

interface PortfolioContextType {
  portfolio: PortfolioItem[];
  transactions: Transaction[];
  error: string | null;
  fetchPortfolio: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(
  undefined,
);

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      setError('User not authenticated');
      return;
    }

    try {
      const idToken = await user.getIdToken();
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/portfolio`,
        {
          headers: {
            Authorization: idToken,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch portfolio');
      }

      const data = await response.json();
      setPortfolio(data);
      setError(null);
    } catch (err) {
      setError('Error fetching portfolio');
    }
  };

  const fetchTransactions = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      setError('User not authenticated');
      return;
    }

    try {
      const idToken = await user.getIdToken();
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/transactions`,
        {
          headers: {
            Authorization: idToken,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data = await response.json();
      setTransactions(data);
      setError(null);
    } catch (err) {
      setError('Error fetching transactions');
    }
  };

  useEffect(() => {
    fetchPortfolio();
    fetchTransactions();
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        transactions,
        error,
        fetchPortfolio,
        fetchTransactions,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};
