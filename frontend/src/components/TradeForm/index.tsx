import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { usePortfolio } from '../../context/PortfolioContext';

const TradeForm: React.FC = () => {
  const [ticker, setTicker] = useState('');
  const [quantity, setQuantity] = useState('');
  const [action, setAction] = useState<'buy' | 'sell'>('buy');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { fetchPortfolio } = usePortfolio();

  const handleTrade = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      setError('User not authenticated');
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
      fetchPortfolio(); // Fetch updated portfolio after successful trade
    } catch (err) {
      setError(`Error executing trade`);
      setMessage(null);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="mb-4 text-2xl font-bold">Trade Stocks</h2>
      <div className="flex flex-col space-y-2">
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          placeholder="Enter stock ticker"
          className="border p-2"
        />
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Enter quantity"
          className="border p-2"
        />
        <select
          value={action}
          onChange={(e) => setAction(e.target.value as 'buy' | 'sell')}
          className="border p-2"
        >
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
        <button
          onClick={handleTrade}
          className="rounded bg-green-500 px-4 py-2 text-white"
        >
          Execute Trade
        </button>
      </div>
      {message && <p className="mt-2 text-green-500">{message}</p>}
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
};

export default TradeForm;
