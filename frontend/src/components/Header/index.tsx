import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import Logo from '../../assets/images/logo.png';

const Header: React.FC = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center">
          <img src={Logo} alt="Logo" className="mr-4 h-8 w-8" />
          <h1 className="text-2xl font-bold text-green-500">SimpleHood</h1>
        </div>
        <nav>
          <ul className="flex space-x-4">
            {user && (
              <li>
                <button
                  onClick={handleLogout}
                  className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
