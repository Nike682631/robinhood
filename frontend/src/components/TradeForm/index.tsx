import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { usePortfolio } from '../../context/PortfolioContext';
import { FaExchangeAlt } from 'react-icons/fa';

const validateQuantity = (value: string): boolean => {
  const num = Number(value);
  return Number.isInteger(num) && num > 0;
};

const TradeForm: React.FC = () => {
  const [ticker, setTicker] = useState('');
  const [quantity, setQuantity] = useState('');
  const [action, setAction] = useState<'buy' | 'sell'>('buy');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { fetchPortfolio, fetchTransactions } = usePortfolio();

  const handleTrade = async () => {
    setError(null);
    setMessage(null);
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      setError('User not authenticated');
      return;
    }

    if (!validateQuantity(quantity)) {
      setError('Quantity must be a positive integer');
      return;
    }

    try {
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
            ticker,
            quantity: parseInt(quantity),
            action,
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Trade failed');
      }

      const data = await response.json();
      setMessage(data.message);
      setError(null);
      fetchPortfolio();
      fetchTransactions();
    } catch (err) {
      setError(`Error executing trade`);
      setMessage(null);
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
          placeholder="Enter stock ticker"
          className="rounded-md border border-gray-300 p-2 focus:border-green-500 focus:outline-none"
        />
        <div className="flex items-center">
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
            min="1"
            step="1"
            placeholder="Enter quantity"
            className="w-full rounded-md border border-gray-300 p-2 focus:border-green-500 focus:outline-none"
          />
        </div>
        <select
          value={action}
          onChange={(e) => setAction(e.target.value as 'buy' | 'sell')}
          className="rounded-md border border-gray-300 p-2 focus:border-green-500 focus:outline-none"
        >
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
        <button
          onClick={handleTrade}
          className="flex items-center justify-center rounded-md bg-green-500 px-4 py-2 text-white transition duration-300 hover:bg-green-600"
        >
          <FaExchangeAlt className="mr-2" />
          Execute Trade
        </button>
      </div>
      {message && (
        <p className="mt-4 rounded-md bg-green-100 p-2 text-green-700">
          {message}
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-md bg-red-100 p-2 text-red-700">{error}</p>
      )}
    </div>
  );
};

export default TradeForm;
