
import { useState } from "react";
import "./App.css";

import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import FoodMenu from "./Components/FoodMenu";
import Cart from "./Components/Cart";
import Checkout from "./Components/Checkout";
import About from "./Components/About";
import Footer from "./Components/Footer";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleAddToCart = (food) => {
    setCartItems((items) => {
      const existingItem = items.find(
        (item) => item.id === food.id
      );

      if (existingItem) {
        return items.map((item) =>
          item.id === food.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...items, { ...food, quantity: 1 }];
    });
  };

  const handleIncrease = (food) => {
    handleAddToCart(food);
  };

  const handleDecrease = (foodId) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === foodId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleCheckout = () => {
    setShowCart(false);
    setShowCheckout(true);
  };

  const handleOrderComplete = () => {
    setCartItems([]);
    setShowCheckout(false);
    setShowCart(false);
  };

  return (
    <div className="app">
      <Navbar
        cartCount={cartCount}
        onCartClick={() => {
          setShowCheckout(false);
          setShowCart((visible) => !visible);
        }}
      />

      <main>
        <Hero />

        <FoodMenu onAddToCart={handleAddToCart} />

        {showCart && !showCheckout && (
          <Cart
            cartItems={cartItems}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            onClose={() => setShowCart(false)}
            onCheckout={handleCheckout}
          />
        )}

        {showCheckout && (
          <Checkout
            cartItems={cartItems}
            onBack={() => {
              setShowCheckout(false);
              setShowCart(true);
            }}
            onOrderComplete={handleOrderComplete}
          />
        )}

        <About />
      </main>

      <Footer />
    </div>
  );
}

export default App;
