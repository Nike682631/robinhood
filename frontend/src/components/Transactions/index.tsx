import React from 'react';
import { FaHistory, FaSpinner } from 'react-icons/fa';
import { usePortfolio } from '../../context/PortfolioContext';

const Transactions: React.FC = () => {
  const { transactions, error } = usePortfolio();

  return (
    <div className="my-8 rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 flex items-center text-2xl font-bold text-gray-800">
        <FaHistory className="mr-2" />
        Transaction History
      </h2>
      {error && <p className="mb-4 text-red-500">{error}</p>}
      {transactions === null ? (
        <div className="flex items-center justify-center p-4 text-gray-500">
          <FaSpinner className="mr-2 animate-spin" />
          Loading transactions...
        </div>
      ) : transactions.length === 0 ? (
        <p className="text-center text-gray-500">No transactions found.</p>
      ) : (
        <div className="max-h-96 overflow-y-auto pr-2">
          <ul className="divide-y divide-gray-200">
            {[...transactions].reverse().map((transaction, index) => (
              <li key={index} className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{transaction.ticker}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.timestamp).toLocaleString(
                        undefined,
                        {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        },
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={
                        transaction.action === 'buy'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                      {transaction.action === 'buy' ? '+' : '-'}
                      {transaction.quantity} shares
                    </p>
                    <p className="text-sm text-gray-500">
                      ${transaction.price.toFixed(2)} per share
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Transactions;
