import React, { useState } from 'react';

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

      setStockInfo(data);
      setError(null);
    } catch (err) {
      setError('Error fetching stock information, please recheck stock symbol');
      setStockInfo(null);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="mb-4 text-2xl font-bold">Stock Query</h2>
      <div className="mb-4 flex">
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          placeholder="Enter stock ticker"
          className="mr-2 border p-2"
        />
        <button
          onClick={handleQuery}
          className="rounded bg-blue-500 px-4 py-2 text-white"
        >
          Query
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {stockInfo && (
        <div>
          <h3 className="text-xl font-semibold">{stockInfo.name}</h3>
          <p>Symbol: {stockInfo.symbol}</p>
          <p>Price: ${stockInfo.price}</p>
        </div>
      )}
    </div>
  );
};

export default StockQuery;
