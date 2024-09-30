import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { usePortfolio } from '../../context/PortfolioContext';
import { FaExchangeAlt, FaSpinner } from 'react-icons/fa';

const validateQuantity = (value: string): boolean => {
  const num = Number(value);
  return Number.isInteger(num) && num > 0;
};

const TradeForm: React.FC = () => {
  const [ticker, setTicker] = useState('');
  const [quantity, setQuantity] = useState('');
  const [action, setAction] = useState<'buy' | 'sell'>('buy');
  const [isLoading, setIsLoading] = useState(false);
  const { fetchPortfolio, fetchTransactions, showToast } = usePortfolio();

  const validateForm = (): boolean => {
    if (!ticker.trim()) {
      showToast('Please enter a ticker symbol', 'error');
      return false;
    }
    if (!validateQuantity(quantity)) {
      showToast('Please enter a valid quantity (positive integer)', 'error');
      return false;
    }
    return true;
  };

  const handleTrade = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error('User not authenticated');
      }

      const idToken = await user.getIdToken();

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/trade`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: idToken,
          },
          body: JSON.stringify({
            ticker: ticker.toUpperCase(),
            quantity: parseInt(quantity),
            action,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to execute trade');
      }

      const data = await response.json();
      showToast(data.message || 'Trade executed successfully', 'success');

      // Reset form
      setTicker('');
      setQuantity('');
      setAction('buy');

      // Refresh portfolio and transactions
      await fetchPortfolio();
      await fetchTransactions();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleTrade();
    }
  };

  return (
    <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-bold text-gray-800">Trade Stocks</h2>
      <div className="flex flex-col space-y-4">
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter stock ticker"
          className="rounded-md border border-gray-300 p-2 focus:border-green-500 focus:outline-none"
          aria-label="Stock ticker symbol"
        />
        <div className="flex items-center">
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            onKeyDown={handleKeyDown}
            min="1"
            step="1"
            placeholder="Enter quantity"
            className="w-full rounded-md border border-gray-300 p-2 focus:border-green-500 focus:outline-none"
            aria-label="Trade quantity"
          />
        </div>
        <select
          value={action}
          onChange={(e) => setAction(e.target.value as 'buy' | 'sell')}
          className="rounded-md border border-gray-300 p-2 focus:border-green-500 focus:outline-none"
          aria-label="Trade action"
        >
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
        <button
          onClick={handleTrade}
          disabled={isLoading || !ticker.trim() || !validateQuantity(quantity)}
          className="flex items-center justify-center rounded-md bg-green-500 px-4 py-2 text-white transition duration-300 hover:bg-green-600 disabled:bg-gray-400"
        >
          {isLoading ? (
            <FaSpinner className="mr-2 animate-spin" />
          ) : (
            <FaExchangeAlt className="mr-2" />
          )}
          {isLoading ? 'Processing...' : 'Execute Trade'}
        </button>
      </div>
    </div>
  );
};

export default TradeForm;
