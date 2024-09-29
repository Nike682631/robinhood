import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const StockQuery: React.FC = () => {
  const [ticker, setTicker] = useState('');
  const [stockInfo, setStockInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleQuery = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/query?ticker=${ticker}`,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch stock information');
      }
      const data = await response.json();
      console.log(data);
      setStockInfo(data);
      setError(null);
    } catch (err) {
      setError('Error fetching stock information, please recheck stock symbol');
      setStockInfo(null);
    }
  };

  return (
    <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-bold text-gray-800">Stock Query</h2>
      <div className="mb-4 flex">
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          placeholder="Enter stock ticker"
          className="mr-2 w-full rounded-l-md border border-gray-300 p-2 focus:border-green-500 focus:outline-none"
        />
        <button
          onClick={handleQuery}
          className="flex items-center rounded-r-md bg-green-500 px-4 py-2 text-white transition duration-300 hover:bg-green-600"
        >
          <FaSearch className="mr-2" />
          Query
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {stockInfo && (
        <div className="rounded-md bg-gray-100 p-4">
          <h3 className="mb-2 text-xl font-semibold text-gray-800">
            {stockInfo.name}
          </h3>
          <p className="text-gray-600">Symbol: {stockInfo.symbol}</p>
          <p className="text-2xl font-bold text-green-500">
            ${stockInfo.price.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
};

export default StockQuery;
