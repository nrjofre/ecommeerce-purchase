import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopBar from '../components/TopBar';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [shippingQuote, setShippingQuote] = useState({ cost: 0, message: '' });
  const [loading, setLoading] = useState(false);
  const [isDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : location.state?.cart || { products: [], total: 0, discountedTotal: 0, totalQuantity: 0 };
  });

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
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleQuoteShipping = async () => {
    setLoading(true);
    try {
      const products = cart.products.map(product => ({
        id: product.id,
        price: product.price,
        quantity: product.quantity,
        discountPercentage: product.discountPercentage
      }));

      const response = await axios.post('http://localhost:5000/api/cart', products);
      if (response.data.canReceiveCart) {
        const shippingCost = 4;
        setShippingQuote({ cost: shippingCost, message: '' });
      } else {
        setShippingQuote({ cost: 0, message: 'No hay envíos disponibles :(' });
      }
    } catch (error) {
      setShippingQuote({ cost: 0, message: 'No hay envíos disponibles' });
    } finally {
      setLoading(false);
    }
  };

  const handleClearCart = () => {
    setCart({
      products: [],
      total: 0,
      discountedTotal: 0,
      totalQuantity: 0,
    });
    localStorage.removeItem('cart');
    setShippingQuote({ cost: 0, message: '' });
    alert('El carrito ha sido vaciado.');
    handleBack()
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleQuantityChange = (productId, change) => {
    setCart(prevCart => {
      const updatedProducts = prevCart.products.map(product => {
        if (product.id === productId) {
          const newQuantity = product.quantity + change;
          if (newQuantity <= 0) {
            return null;
          }
          return { ...product, quantity: newQuantity, discountedTotal: newQuantity * product.price * (1 - product.discountPercentage / 100) };
        }
        return product;
      }).filter(product => product !== null);

      const total = updatedProducts.reduce((acc, product) => acc + product.discountedTotal, 0);
      const discountedTotal = total;
      const totalQuantity = updatedProducts.reduce((acc, product) => acc + product.quantity, 0);

      return {
        ...prevCart,
        products: updatedProducts,
        total,
        discountedTotal,
        totalQuantity,
      };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-300 to-pink-300 dark:from-gray-800 dark:via-gray-900 dark:to-black">
      <TopBar
        navigateToCart={() => {}}
        cartItemCount={cart.totalQuantity || 0}
        showGenerateCart={false}
      />
      <div className="p-4 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Carrito</h1>
        {cart.products && cart.products.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8 lg:justify-center">
            <div className="lg:w-2/3 flex flex-col items-center lg:items-start">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Detalles del Carrito</h2>
              <div className="bg-white shadow-lg rounded-lg p-4 dark:bg-gray-800 dark:text-gray-100">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="p-4 text-center text-gray-800 dark:text-gray-200">Imagen</th>
                      <th className="p-4 text-center text-gray-800 dark:text-gray-200">Nombre</th>
                      <th className="p-4 text-center text-gray-800 dark:text-gray-200">Cantidad</th>
                      <th className="p-4 text-center text-gray-800 dark:text-gray-200">Precio</th>
                      <th className="p-4 text-center text-gray-800 dark:text-gray-200">Descuento (%)</th>
                      <th className="p-4 text-center text-gray-800 dark:text-gray-200">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.products.length > 0 ? (
                      cart.products.map(product => (
                        <tr key={product.id} className="border-b">
                          <td className="p-4">
                            <img src={product.thumbnail} alt={product.title} className="w-16 h-16 object-cover" />
                          </td>
                          <td className="p-4 text-gray-800 dark:text-gray-200">{product.title}</td>
                          <td className="p-4 text-gray-800 dark:text-gray-200 flex items-center">
                            <button
                              className="px-2 py-1 bg-gray-300 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                              onClick={() => handleQuantityChange(product.id, -1)}
                            >
                              -
                            </button>
                            <span className="mx-4 text-gray-800 dark:text-gray-200">{product.quantity}</span>
                            <button
                              className="px-2 py-1 bg-gray-300 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                              onClick={() => handleQuantityChange(product.id, 1)}
                            >
                              +
                            </button>
                          </td>
                          <td className="p-4 text-right text-gray-800 dark:text-gray-200">${product.price.toFixed(2)}</td>
                          <td className="p-4 text-right text-gray-800 dark:text-gray-200">{product.discountPercentage.toFixed(2)}%</td>
                          <td className="p-4 text-right text-gray-800 dark:text-gray-200">${product.discountedTotal.toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="p-4 text-center text-gray-800 dark:text-gray-200">No hay productos en el carrito.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="lg:w-1/3 flex flex-col items-center lg:items-start space-y-4 lg:space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Resumen</h2>
              <div className="bg-white shadow-lg rounded-lg p-6 dark:bg-gray-800 dark:text-gray-100">
                <div className="flex justify-between mb-4 text-gray-800 dark:text-gray-200">
                  <p className="text-lg">Total:</p>
                  <p className="text-lg">${cart.total.toFixed(2)}</p>
                </div>
                <div className="flex justify-between mb-4 text-gray-800 dark:text-gray-200">
                  <p className="text-lg mr-4">Total con Descuento:</p>
                  <p className="text-lg">${cart.discountedTotal.toFixed(2)}</p>
                </div>
                {shippingQuote.cost !== 0 && (
                  <div className="flex justify-between mb-4 text-gray-800 dark:text-gray-200">
                    <p className="text-lg mr-4 font-bold">Envío Flapp⚡️:</p>
                    <p className="text-lg font-bold">${parseFloat(shippingQuote.cost)}.00</p>
                  </div>
                )}
                {shippingQuote.message && shippingQuote.cost === 0 && (
                  <div className="flex justify-between mb-4 text-gray-800 dark:text-gray-200">
                    <p className="text-lg font-bold">{shippingQuote.message}</p>
                  </div>
                )}
                <div className="flex justify-between mb-4 text-gray-800 dark:text-gray-200">
                  <p className="text-xl font-bold">Total a Pagar:</p>
                  <p className="text-xl font-bold">${ (cart.discountedTotal + parseFloat(shippingQuote.cost)).toFixed(2) }</p>
                </div>
                <div className="flex flex-col gap-4">
                  {cart.products.length > 0 && (
                    <>
                      <button
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                        onClick={handleQuoteShipping}
                        disabled={loading}
                      >
                        {loading ? 'Calculando...' : 'Cotizar Envío'}
                      </button>
                      <button
                        className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                        onClick={handleClearCart}
                      >
                        Limpiar Carrito
                      </button>
                    </>
                  )}
                  <button
                    className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                    onClick={handleBack}
                  >
                    Volver
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-800 dark:text-gray-200">
            <p>No hay productos en el carrito.</p>
            <button
              className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              onClick={handleBack}
            >
              Volver a la tienda
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
