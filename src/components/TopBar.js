import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaRandom, FaSun, FaMoon } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const TopBar = ({ onGenerateRandomCart, navigateToCart, cartItemCount, showGenerateCart = true }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const navigate = useNavigate();

  // Extra function for Dark/Light mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Extra function to handle Dark/Light mode toggle
  const handleThemeToggle = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className="bg-gray-800 dark:bg-gray-900 text-white dark:text-gray-100 flex items-center p-4">
      <div className="flex items-center mr-4 cursor-pointer" onClick={handleLogoClick}>
        <img src="./Logo.jpg" alt="ShopEase Logo" className="h-8 w-8 mr-2" />
        <span className="text-xl font-bold">ShopEase</span>
      </div>
      <input
        type="text"
        placeholder="Buscar..."
        className="flex-grow p-2 rounded-lg bg-gray-700 dark:bg-gray-800 text-white border border-gray-600 dark:border-gray-700 mr-4"
      />
      <button 
        className="relative p-2 rounded-lg bg-gray-700 dark:bg-gray-800 hover:bg-gray-600 dark:hover:bg-gray-700 mr-4" 
        onClick={navigateToCart}
      >
        <FaShoppingCart className="text-xl" />
        {cartItemCount > 0 && (
          <span className="absolute top-0 right-0 block h-5 w-5 text-xs leading-tight text-white bg-red-500 rounded-full">
            {cartItemCount}
          </span>
        )}
      </button>
      {showGenerateCart && (
        <button
          className="p-2 rounded-lg bg-gray-700 dark:bg-gray-800 hover:bg-gray-600 dark:hover:bg-gray-700 flex items-center mr-4"
          onClick={onGenerateRandomCart}
        >
          <FaRandom className="text-xl mr-2" />
          Generar Carrito
        </button>
      )}
      <button
        className="p-2 rounded-lg bg-gray-700 dark:bg-gray-800 hover:bg-gray-600 dark:hover:bg-gray-700 flex items-center"
        onClick={handleThemeToggle}
      >
        {isDarkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
      </button>
    </div>
  );
};

export default TopBar;
