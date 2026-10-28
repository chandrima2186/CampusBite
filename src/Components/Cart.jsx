
import "./../Styles/Cart.css";

function Cart({
  cartItems,
  onIncrease,
  onDecrease,
  onClose,
  onCheckout,
}) {
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <section className="cart-section" id="cart">
      <div className="cart-heading">
        <div>
          <p className="eyebrow">YOUR ORDER</p>
          <h2>Shopping Cart</h2>
        </div>

        <button
          type="button"
          className="cart-close"
          onClick={onClose}
        >
          Close ✕
        </button>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <span>🛒</span>
          <h3>Your cart is empty</h3>
          <p>Add your favorite food from the menu.</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <article className="cart-item" key={item.id}>
                <div className="cart-item-emoji">
                  {item.emoji}
                </div>

                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>৳{item.price} each</p>
                  <strong>
                    ৳{item.price * item.quantity}
                  </strong>
                </div>

                <div className="quantity-controls">
                  <button
                    type="button"
                    onClick={() => onDecrease(item.id)}
                    aria-label={`Decrease ${item.name} quantity`}
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    type="button"
                    onClick={() => onIncrease(item)}
                    aria-label={`Increase ${item.name} quantity`}
                  >
                    +
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="cart-summary">
            <p>
              Total items: <strong>{totalItems}</strong>
            </p>

            <p className="cart-total">
              Total Price: <strong>৳{totalPrice}</strong>
            </p>

            <button
              type="button"
              className="checkout-button"
              onClick={onCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default Cart;
