import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import axios from 'axios';

const HomePage = () => {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || null);
  const [cartItemCount, setCartItemCount] = useState(cart ? cart.totalQuantity : 0);
  const [products, setProducts] = useState([]);
  const [isDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const navigate = useNavigate();

  // Extra function, gets the first 20 products to show on Homepage (visual purpuse)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://dummyjson.com/products?limit=20');
        setProducts(response.data.products);
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    };

    fetchProducts();
  }, []);

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

  // Function to keep track of cart object state
  useEffect(() => {
    if (cart) {
      localStorage.setItem('cart', JSON.stringify(cart));
      setCartItemCount(cart.totalQuantity);
    }
  }, [cart]);

  const handleGenerateRandomCart = async () => {
    try {
      const randomCartId = Math.floor(Math.random() * 50) + 1;
      const url = `https://dummyjson.com/carts/${randomCartId}`;

      const response = await axios.get(url);
      const cartData = response.data;

      setCart(cartData);
    } catch (error) {
      console.error('Error al generar el carrito:', error);
    }
  };

  const handleNavigateToCart = () => {
    if (cart) {
      navigate('/checkout', { state: { cart } });
    } else {
      alert('No hay carrito para mostrar.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-200 via-purple-300 to-pink-300 dark:from-gray-800 dark:via-gray-900 dark:to-black">
      <TopBar
        onGenerateRandomCart={handleGenerateRandomCart}
        navigateToCart={handleNavigateToCart}
        cartItemCount={cartItemCount}
        showGenerateCart={true}
      />
      <main className="flex-grow p-4 md:p-6 lg:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">Bienvenido a la tienda</h1>
        <p className="text-lg md:text-xl mb-6 text-gray-700 dark:text-gray-300">Explora nuestros productos y genera un carrito aleatorio.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(product => (
            <div key={product.id} className="bg-white shadow-md rounded-lg overflow-hidden dark:bg-gray-800 dark:text-gray-100">
              <img src={product.thumbnail} alt={product.title} className="w-full h-48 md:h-60 lg:h-72 object-cover" />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{product.title}</h2>
                <p className="text-gray-700 dark:text-gray-300">${product.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
