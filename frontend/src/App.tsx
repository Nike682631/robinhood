import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import StockQuery from './components/StockQuery';
import Portfolio from './components/Portfolio';
import TradeForm from './components/TradeForm';
import Login from './components/Login';
import Header from './components/Header';
import { PortfolioProvider } from './context/PortfolioContext';
import Transactions from './components/Transactions';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen w-full overflow-hidden">
      {user ? (
        <>
          <Header />
          <main className="container mx-auto p-4">
            <PortfolioProvider>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                  <StockQuery />
                  <TradeForm />
                </div>
                <div>
                  <Portfolio />
                  <Transactions />
                </div>
              </div>
            </PortfolioProvider>
          </main>
        </>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default App;
