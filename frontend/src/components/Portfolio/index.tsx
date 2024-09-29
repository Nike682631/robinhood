import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { FaChartLine, FaSpinner } from 'react-icons/fa';

const Portfolio: React.FC = () => {
  const { portfolio, error } = usePortfolio();

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 flex items-center text-2xl font-bold text-gray-800">
        <FaChartLine className="mr-2 text-green-500" />
        Your Portfolio
      </h2>
      {error && (
        <p className="mb-4 rounded-md bg-red-100 p-2 text-red-700">{error}</p>
      )}
      {portfolio.length > 0 ? (
        <div className="max-h-96 overflow-y-auto pr-2">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-100">
              <tr>
                <th className="p-2 text-left">Ticker</th>
                <th className="p-2 text-left">Quantity</th>
                <th className="p-2 text-left">Current Price</th>
                <th className="p-2 text-left">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map((item) => (
                <tr key={item.ticker} className="border-b">
                  <td className="p-2 font-semibold">{item.ticker}</td>
                  <td className="p-2">{item.quantity}</td>
                  <td className="p-2">${item.current_price.toFixed(2)}</td>
                  <td className="p-2">${item.total_value.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex items-center justify-center p-4 text-gray-500">
          <FaSpinner className="mr-2 animate-spin" />
          Loading portfolio...
        </div>
      )}
    </div>
  );
};

export default Portfolio;
