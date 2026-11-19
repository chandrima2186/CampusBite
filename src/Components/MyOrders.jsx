
import { useEffect, useState } from "react";
import "./../Styles/MyOrders.css";

const API_URL = "http://localhost:5000/api/orders/my-orders";

function MyOrders({ token, onBack }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // LOAD ORDER HISTORY
  const fetchOrders = async () => {
    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load orders.");
      }

      setOrders(data.orders || []);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  // LOAD AND REFRESH ORDERS
  useEffect(() => {
    if (!token) return;

    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, [token]);

  // KEEP SELECTED ORDER UPDATED
  useEffect(() => {
    if (!selectedOrder) return;

    const updatedOrder = orders.find(
      (order) => order.id === selectedOrder.id
    );

    if (updatedOrder) {
      setSelectedOrder(updatedOrder);
    }
  }, [orders]);

  // STATUS INFORMATION
  const getStatusInfo = (status) => {
    switch (status) {
      case "pending":
        return {
          label: "Order Received",
          color: "#2563eb",
          description: "Your order has been received by the canteen.",
        };

      case "preparing":
        return {
          label: "Preparing Your Food",
          color: "#d97706",
          description: "The canteen is preparing your food.",
        };

      case "ready":
        return {
          label: "Ready for Pickup",
          color: "#16a34a",
          description: "Your food is ready! Please collect your order.",
        };

      case "completed":
        return {
          label: "Completed",
          color: "#15803d",
          description: "Your order has been completed.",
        };

      case "cancelled":
        return {
          label: "Cancelled",
          color: "#dc2626",
          description: "This order has been cancelled.",
        };

      default:
        return {
          label: status || "Unknown",
          color: "#64748b",
          description: "Status information is unavailable.",
        };
    }
  };

  // ORDER PROGRESS STEPS
  const progressSteps = [
    "pending",
    "preparing",
    "ready",
    "completed",
  ];

  const getProgressIndex = (status) => {
    return progressSteps.indexOf(status);
  };

  // DATE FORMAT
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-BD", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // LOADING
  if (loading) {
    return (
      <section className="my-orders-page">
        <div className="my-orders-loading">
          <div className="my-orders-spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="my-orders-page">
      <div className="my-orders-container">
        <div className="my-orders-header">
          <div>
            <span className="my-orders-subtitle">CAMPUSBITE</span>
            <h1>My Orders</h1>
            <p>View your previous orders and track their status.</p>
          </div>

          <button className="my-orders-back-btn" onClick={onBack}>
            ← Back to Menu
          </button>
        </div>

        {error && (
          <div className="my-orders-error">
            {error}
            <button onClick={fetchOrders}>Retry</button>
          </div>
        )}

        {!error && orders.length === 0 ? (
          <div className="my-orders-empty">
            <div className="my-orders-empty-icon">🛍️</div>
            <h2>No orders yet!</h2>
            <p>Your orders will appear here after you order food.</p>
            <button onClick={onBack}>Explore Menu</button>
          </div>
        ) : (
          <div className="my-orders-list">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status);

              return (
                <div className="my-order-card" key={order.id}>
                  <div className="my-order-card-top">
                    <div>
                      <span className="my-order-id">
                        Order #{order.id}
                      </span>
                      <p className="my-order-date">
                        {formatDate(order.created_at)}
                      </p>
                    </div>

                    <span
                      className="my-order-status"
                      style={{
                        color: statusInfo.color,
                        backgroundColor: `${statusInfo.color}15`,
                      }}
                    >
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="my-order-items">
                    {order.items?.map((item, index) => (
                      <div
                        className="my-order-item"
                        key={`${order.id}-${item.food_id}-${index}`}
                      >
                        <div>
                          <span className="my-order-food-name">
                            {item.food_name}
                          </span>
                          <span className="my-order-quantity">
                            × {item.quantity}
                          </span>
                        </div>

                        <span className="my-order-item-price">
                          ৳{Number(item.subtotal).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="my-order-card-bottom">
                    <div>
                      <span className="my-order-total-label">
                        Total Amount
                      </span>
                      <strong className="my-order-total">
                        ৳{Number(order.total_price).toFixed(2)}
                      </strong>
                    </div>

                    <button
                      className="my-order-track-btn"
                      onClick={() => setSelectedOrder(order)}
                    >
                      Track Order →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ORDER TRACKING MODAL */}
      {selectedOrder && (
        <div
          className="my-order-modal-overlay"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="my-order-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="my-order-modal-close"
              onClick={() => setSelectedOrder(null)}
            >
              ×
            </button>

            <span className="my-orders-subtitle">ORDER TRACKING</span>
            <h2>Order #{selectedOrder.id}</h2>

            <div className="my-order-modal-status">
              <span
                className="my-order-status"
                style={{
                  color: getStatusInfo(selectedOrder.status).color,
                  backgroundColor: `${getStatusInfo(selectedOrder.status).color}15`,
                }}
              >
                {getStatusInfo(selectedOrder.status).label}
              </span>

              <p>{getStatusInfo(selectedOrder.status).description}</p>
            </div>

            {selectedOrder.status === "cancelled" ? (
              <div className="my-order-cancelled-message">
                ❌ This order has been cancelled.
              </div>
            ) : (
              <div className="my-order-progress">
                {progressSteps.map((step, index) => {
                  const currentIndex = getProgressIndex(
                    selectedOrder.status
                  );

                  const isCompleted = index < currentIndex;
                  const isCurrent = index === currentIndex;

                  return (
                    <div
                      className={`my-order-progress-step ${
                        isCompleted ? "completed" : ""
                      } ${isCurrent ? "current" : ""}`}
                      key={step}
                    >
                      <div className="my-order-progress-circle">
                        {isCompleted ? "✓" : index + 1}
                      </div>

                      <div className="my-order-progress-label">
                        {getStatusInfo(step).label}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="my-order-modal-info">
              <div>
                <span>Order Placed</span>
                <strong>{formatDate(selectedOrder.created_at)}</strong>
              </div>

              <div>
                <span>Pickup Time</span>
                <strong>{selectedOrder.pickup_time || "N/A"}</strong>
              </div>

              <div>
                <span>Total Amount</span>
                <strong>৳{Number(selectedOrder.total_price).toFixed(2)}</strong>
              </div>
            </div>

            <h3 className="my-order-modal-items-heading">
              Ordered Items
            </h3>

            <div className="my-order-modal-items">
              {selectedOrder.items?.map((item, index) => (
                <div
                  className="my-order-item"
                  key={`${item.food_id}-${index}`}
                >
                  <div>
                    <span className="my-order-food-name">
                      {item.food_name}
                    </span>
                    <span className="my-order-quantity">
                      × {item.quantity}
                    </span>
                  </div>

                  <span className="my-order-item-price">
                    ৳{Number(item.subtotal).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <p className="my-order-live-note">
              🔄 Order status refreshes automatically every 5 seconds.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default MyOrders;
