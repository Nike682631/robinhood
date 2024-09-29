import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

const Portfolio: React.FC = () => {
  const { portfolio, error } = usePortfolio();

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Your Portfolio</h2>
      {error && <p className="text-red-500">{error}</p>}
      {portfolio.length > 0 ? (
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Ticker</th>
              <th className="text-left">Quantity</th>
              <th className="text-left">Current Price</th>
              <th className="text-left">Total Value</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map((item) => (
              <tr key={item.ticker}>
                <td>{item.ticker}</td>
                <td>{item.quantity}</td>
                <td>${item.current_price.toFixed(2)}</td>
                <td>${item.total_value.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No stocks in your portfolio.</p>
      )}
    </div>
  );
};

export default Portfolio;
