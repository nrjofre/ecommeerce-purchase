# Flapp Technical Test - Flapp E-Commerce Shopping Simulation

This React application serves as a technical test for Flapp, simulating an e-commerce shopping experience.

## Table of Contents

- [Overview](#overview)
- [Assumptions](#assumptions)
- [Extra Features](#extra-features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)

## Overview

### Back-End

The back-end consists of a single endpoint:

- **POST /api/cart**: Manages the cart quotation from the front end. It receives the cart products, compares the quantities with the real stock in the database, and responds with a boolean indicating whether the purchase can be completed.

### Front-End

The application features two main screens:

1. **Home Page**: Displays dummy products, a dummy search bar, and a navigation bar with three buttons: Cart, Generate Random Cart, and Light/Dark Mode.
2. **Checkout Page**: Shows the contents of the generated cart, allows quantity adjustments for items, quotes the delivery price, clears the cart, or navigates back to the Home Page.

## Assumptions

- **Delivery Price**: The delivery price is converted from CLP to USD.
- **Search Bar and Products on Home Page**: Serve purely as visual elements, preventing the user from seeing blank spaces.
- **"Finalizar Compra" Button**: Replaced by a cart icon to create a more realistic example of how an e-commerce site functions.

## Extra Features

- **Dark Mode**: A toggle to switch between light and dark themes for an improved viewing experience.
- **Quantity Changer**: Adjust the quantity of items in the cart using `-` and `+` buttons next to the quantity number.
- **Dummy Products and Search Bar**: Display dummy products and a search bar for visual purposes in this example.

## Technologies Used

- **React**: For building the user interface.
- **React Router**: For managing navigation between pages.
- **DummyJSON**: For fetching cart and product data.
- **CSS/Tailwind CSS**: For styling the application.

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/nrjofre/ecommeerce-purchase.git
    ```

2. **Navigate to the project directory**:
    ```bash
    cd flapp-ecommerce
    ```

3. **Install client dependencies**:
    ```bash
    npm install
    ```

4. **Navigate to the server directory**:
    ```bash
    cd server
    ```

5. **Install server dependencies**:
    ```bash
    npm install
    ```

6. **Start the server application**:
    ```bash
    node index.js
    ```
    The server runs on `http://localhost:5000`. Check the console for logs.

7. **Open another terminal**.

8. **Navigate back to the project directory**:
    ```bash
    cd flapp-ecommerce
    ```

9. **Start the application**:
    ```bash
    npm start
    ```

10. **Open your browser** and navigate to `http://localhost:3000` to view the application if it did not open automatically.
