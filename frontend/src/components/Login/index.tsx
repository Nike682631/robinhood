import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { motion } from 'framer-motion';
import backgroundVideo from '../../assets/videos/stock-market.mp4';
import { FaGoogle, FaChartLine, FaMobileAlt, FaLock } from 'react-icons/fa';

const Login: React.FC = () => {
  const handleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error during sign in:', error);
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="absolute h-full w-full object-cover"
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <div className="relative z-10 flex h-full items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md rounded-lg bg-white p-8 shadow-2xl"
        >
          <h1 className="mb-6 text-4xl font-bold text-green-600">SimpleHood</h1>
          <p className="mb-6 text-lg text-gray-600">
            Experience the future of investing with our Robinhood-inspired
            platform.
          </p>
          <motion.ul className="mb-8 space-y-4">
            {[
              { icon: FaChartLine, text: 'Commission-free trading' },
              { icon: FaMobileAlt, text: 'User-friendly interface' },
              { icon: FaLock, text: 'Secure and reliable platform' },
            ].map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-center text-gray-700"
              >
                <item.icon className="mr-3 text-green-500" />
                {item.text}
              </motion.li>
            ))}
          </motion.ul>
          <motion.button
            onClick={handleLogin}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex w-full items-center justify-center rounded-full bg-green-500 px-6 py-3 font-bold text-white transition-colors hover:bg-green-600"
          >
            <FaGoogle className="mr-2" />
            Sign in with Google
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
