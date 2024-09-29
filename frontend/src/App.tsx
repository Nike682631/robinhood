import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User, signOut } from 'firebase/auth';
import StockQuery from './components/StockQuery';
import Portfolio from './components/Portfolio';
import TradeForm from './components/TradeForm';
import Login from './components/Login';
import { PortfolioProvider } from './context/PortfolioContext';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {user ? (
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Simple Robinhood Clone</h1>
          <div className="flex items-center">
            <span className="mr-4">Welcome, {user.displayName}</span>
            <button
              onClick={handleLogout}
              className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <h1 className="mb-8 text-3xl font-bold">Simple Robinhood Clone</h1>
      )}
      {user ? (
        <PortfolioProvider>
          <StockQuery />
          <TradeForm />
          <Portfolio />
        </PortfolioProvider>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default App;
