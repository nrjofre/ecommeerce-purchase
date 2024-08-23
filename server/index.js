const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/api/cart', async (req, res) => {
  console.log('Received POST request to /api/cart');
  console.log()
  // Recieves cart
  const products = req.body;

  // Obtains all products from database 10 by 10
  try {
    let allProducts = [];
    let skip = 0;
    let hasMoreProducts = true;

    while (hasMoreProducts) {
      const response = await axios.get(`https://dummyjson.com/products?limit=10&skip=${skip}`);
      const products = response.data.products;
      

      if (products.length > 0) {
        allProducts = allProducts.concat(products);
        skip += 10;
      } else {
        hasMoreProducts = false;
      }
    }

    // Map all products
    const productMap = allProducts.reduce((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {});

    // Searches each cart item on all products to obtain extra information
    const cartResults = products.map(item => {
      const product = productMap[item.id];

      if (product) {
        const stock = product.stock;
        const rating = product.rating;
        const realStock = stock / rating;
        const discountTotal = (product.price * item.discountPercentage / 100) * item.quantity;

        return {
          id: item.id,
          name: product.title,
          price: product.price,
          discountTotal,
          quantity: item.quantity,
          stockObtained: stock,
          rating,
          realStock
        };
      } else {
        return null;
      }
    }).filter(item => item !== null);

    // Compares cart item desired quantity with realStock to determine if is valid
    const canReceiveCart = cartResults.every(item => item.realStock >= item.quantity);

    // Print cart
    console.log(`CART:`)
    console.log(`---`)
    cartResults.forEach(item => {
      console.log(`ID: ${item.id}`);
      console.log(`Nombre: ${item.name}`);
      console.log(`Precio por unidad: ${item.price}`);
      console.log(`Descuento total: ${item.discountTotal}`);
      console.log(`Cantidad solicitada: ${item.quantity}`);
      console.log(`Stock obtenido: ${item.stockObtained}`);
      console.log(`Rating: ${item.rating}`);
      console.log(`Stock real: ${item.realStock}`);
      console.log('---');
    });

    // Boolean response
    res.json({ canReceiveCart });

  } catch (error) {
    console.error('Error processing cart:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
