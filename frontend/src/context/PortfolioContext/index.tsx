import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import Toast from '../../components/Toast';

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
  timestamp: string;
}

interface PortfolioContextType {
  portfolio: PortfolioItem[] | null;
  transactions: Transaction[] | null;
  error: string | null;
  fetchPortfolio: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  showToast: (message: string, type: 'success' | 'error') => void;
  clearToast: () => void;
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
  const [portfolio, setPortfolio] = useState<PortfolioItem[] | null>(null);
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const clearToast = () => {
    setToast(null);
  };

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
      setPortfolio(data.length === 0 ? [] : data);
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
      setTransactions(data.length === 0 ? [] : data);
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
        showToast,
        clearToast,
      }}
    >
      {children}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={clearToast} />
      )}
    </PortfolioContext.Provider>
  );
};
