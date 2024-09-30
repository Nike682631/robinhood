import React, { useState } from 'react';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import { usePortfolio } from '../../context/PortfolioContext';

const StockQuery: React.FC = () => {
  const [ticker, setTicker] = useState('');
  const [stockInfo, setStockInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { showToast } = usePortfolio();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleQuery();
    }
  };

  const handleQuery = async () => {
    setStockInfo(null);
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/query?ticker=${ticker}`,
      );
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Stock not found. Please check the ticker symbol.');
        }
        throw new Error('Failed to fetch stock information');
      }
      const data = await response.json();
      setStockInfo(data);
      showToast(
        `Successfully fetched information for ${data.symbol}`,
        'success',
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
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
          onKeyDown={handleKeyDown}
          placeholder="Enter stock ticker"
          aria-label="Stock ticker symbol"
          className="mr-2 w-full rounded-l-md border border-gray-300 p-2 focus:border-green-500 focus:outline-none"
        />
        <button
          onClick={handleQuery}
          disabled={isLoading}
          className="flex items-center rounded-r-md bg-green-500 px-4 py-2 text-white transition duration-300 hover:bg-green-600 disabled:bg-gray-400"
        >
          {isLoading ? (
            <FaSpinner className="mr-2 animate-spin" />
          ) : (
            <FaSearch className="mr-2" />
          )}
          {isLoading ? 'Loading...' : 'Query'}
        </button>
      </div>
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
