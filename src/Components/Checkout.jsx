
import { useState } from "react";
import "./../Styles/Checkout.css";

function Checkout({ cartItems, onBack, onOrderComplete }) {
  const [formData, setFormData] = useState({
    role: "Student",
    name: "",
    institutionId: "",
    phone: "",
    location: "Classroom",
    locationDetails: "",
    pickupTime: "",
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (cartItems.length === 0) {
      return;
    }

    // Temporary frontend confirmation.
    // A real database order will be added with the backend.
    setOrderNumber(
      `CB-${Date.now().toString().slice(-8)}`
    );
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <section className="checkout-section">
        <div className="checkout-card checkout-success">
          <div className="success-icon">✓</div>

          <p className="checkout-eyebrow">CAMPUSBITE</p>
          <h2>Order Confirmation</h2>

          <p>
            Thank you, {formData.name}! Your order details
            have been received in this demo.
          </p>

          <div className="confirmation-details">
            <p>
              <strong>Demo Order ID:</strong> {orderNumber}
            </p>
            <p>
              <strong>Role:</strong> {formData.role}
            </p>
            <p>
              <strong>Location:</strong> {formData.location}
            </p>
            {formData.locationDetails && (
              <p>
                <strong>Location details:</strong>{" "}
                {formData.locationDetails}
              </p>
            )}
            <p>
              <strong>Pickup time:</strong>{" "}
              {formData.pickupTime}
            </p>
            <p>
              <strong>Total:</strong> ৳{totalPrice}
            </p>
          </div>

          <p className="checkout-note">
            This is a frontend demo. The order has not
            been saved to a database or sent to the canteen.
          </p>

          <button
            type="button"
            className="checkout-primary-button"
            onClick={onOrderComplete}
          >
            Back to Menu
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout-section" id="checkout">
      <div className="checkout-heading">
        <p className="checkout-eyebrow">CAMPUSBITE</p>
        <h2>Complete Your Order</h2>
        <p>
          Enter your details to prepare your canteen order.
        </p>
      </div>

      <div className="checkout-layout">
        <form
          className="checkout-card checkout-form"
          onSubmit={handleSubmit}
        >
          <h3>Your Information</h3>

          <div className="checkout-field">
            <label htmlFor="role">I am a *</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
            </select>
          </div>

          <div className="checkout-field">
            <label htmlFor="name">
              {formData.role} Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder={`Enter your ${formData.role.toLowerCase()} name`}
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="checkout-field">
            <label htmlFor="institutionId">
              {formData.role === "Student"
                ? "Student ID *"
                : "Teacher / Employee ID *"}
            </label>
            <input
              id="institutionId"
              name="institutionId"
              type="text"
              placeholder={
                formData.role === "Student"
                  ? "Enter student ID"
                  : "Enter teacher or employee ID"
              }
              value={formData.institutionId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="checkout-field">
            <label htmlFor="phone">Phone Number *</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <h3 className="checkout-subheading">
            Campus Location
          </h3>

          <div className="checkout-field">
            <label htmlFor="location">
              Where are you currently? *
            </label>
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            >
              <option value="Classroom">Classroom</option>
              <option value="Library">Library</option>
              <option value="Teacher's Room">
                Teacher's Room
              </option>
              <option value="Canteen">Canteen</option>
              <option value="Other">Other campus location</option>
            </select>
          </div>

          <div className="checkout-field">
            <label htmlFor="locationDetails">
              Room / Building / Floor Details
              {formData.location === "Other" ? " *" : ""}
            </label>
            <input
              id="locationDetails"
              name="locationDetails"
              type="text"
              placeholder="e.g. Building A, Room 305"
              value={formData.locationDetails}
              onChange={handleChange}
              required={formData.location === "Other"}
            />
          </div>

          <div className="checkout-field">
            <label htmlFor="pickupTime">Pickup Time *</label>
            <select
              id="pickupTime"
              name="pickupTime"
              value={formData.pickupTime}
              onChange={handleChange}
              required
            >
              <option value="">Choose pickup time</option>
              <option value="12:00 PM">12:00 PM</option>
              <option value="12:30 PM">12:30 PM</option>
              <option value="1:00 PM">1:00 PM</option>
              <option value="1:30 PM">1:30 PM</option>
              <option value="2:00 PM">2:00 PM</option>
              <option value="2:30 PM">2:30 PM</option>
              <option value="3:00 PM">3:00 PM</option>
            </select>
            <small>
              These are sample times; we can adjust them
              to your canteen's actual schedule.
            </small>
          </div>

          <button
            type="submit"
            className="checkout-primary-button"
            disabled={cartItems.length === 0}
          >
            Place Order · ৳{totalPrice}
          </button>
        </form>

        <aside className="checkout-card order-summary-card">
          <h3>Order Summary</h3>

          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div className="checkout-order-items">
              {cartItems.map((item) => (
                <div
                  className="checkout-order-item"
                  key={item.id}
                >
                  <span className="checkout-food-emoji">
                    {item.emoji}
                  </span>

                  <div className="checkout-food-details">
                    <strong>{item.name}</strong>
                    <small>
                      ৳{item.price} × {item.quantity}
                    </small>
                  </div>

                  <strong>
                    ৳{item.price * item.quantity}
                  </strong>
                </div>
              ))}
            </div>
          )}

          <div className="checkout-price-row">
            <span>Total Items</span>
            <strong>{totalItems}</strong>
          </div>

          <div className="checkout-price-row checkout-grand-total">
            <span>Total Price</span>
            <strong>৳{totalPrice}</strong>
          </div>

          <p className="checkout-note">
            Please review your food items and quantities
            before placing your order.
          </p>
        </aside>
      </div>

      <button
        type="button"
        className="checkout-back-button"
        onClick={onBack}
      >
        ← Back to Cart
      </button>
    </section>
  );
}

export default Checkout;
