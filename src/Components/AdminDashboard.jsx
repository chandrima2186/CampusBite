
import { useEffect, useState } from "react";
import "../Styles/AdminDashboard.css";

const API_URL = "http://localhost:5000/api/admin";
const FOOD_API_URL = "http://localhost:5000/api/foods";

const emptyFood = {
  name: "",
  description: "",
  price: "",
  category: "Fast Food",
  image_url: "",
};

const foodCategories = ["Fast Food", "Snacks", "Main Course", "Drinks"];

function AdminDashboard({ currentUser, token }) {
  const [dashboard, setDashboard] = useState(null);
  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState([]);

  const [loading, setLoading] = useState(true);
  const [foodsLoading, setFoodsLoading] = useState(true);
  const [error, setError] = useState("");
  const [foodError, setFoodError] = useState("");
  const [foodMessage, setFoodMessage] = useState("");

  const [foodForm, setFoodForm] = useState(emptyFood);
  const [editingFoodId, setEditingFoodId] = useState(null);
  const [savingFood, setSavingFood] = useState(false);

  // Search and category filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Load dashboard stats and orders
  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [statsResponse, ordersResponse] = await Promise.all([
        fetch(`${API_URL}/dashboard`, { headers }),
        fetch(`${API_URL}/orders`, { headers }),
      ]);

      const statsData = await statsResponse.json();
      const ordersData = await ordersResponse.json();

      if (!statsResponse.ok || !statsData.success) {
        throw new Error(statsData.message || "Could not load dashboard.");
      }

      if (!ordersResponse.ok || !ordersData.success) {
        throw new Error(ordersData.message || "Could not load orders.");
      }

      setDashboard(statsData.dashboard);
      setOrders(ordersData.orders);
    } catch (error) {
      setError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Load foods from database
  const loadAdminFoods = async () => {
    try {
      setFoodsLoading(true);
      setFoodError("");

      const response = await fetch(`${FOOD_API_URL}/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not load foods.");
      }

      setFoods(data.foods);
    } catch (error) {
      setFoodError(error.message || "Could not load food menu.");
    } finally {
      setFoodsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    loadAdminFoods();
  }, [token]);

  // Update order status
  const updateStatus = async (orderId, status) => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Status update failed.");
      }

      alert("Order status updated successfully!");
      loadDashboard();
    } catch (error) {
      alert(error.message);
    }
  };

  // Handle food form inputs
  const handleFoodInput = (event) => {
    const { name, value } = event.target;

    setFoodForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset food form
  const resetFoodForm = () => {
    setFoodForm(emptyFood);
    setEditingFoodId(null);
  };

  // Add new food or update existing food
  const handleFoodSubmit = async (event) => {
    event.preventDefault();

    try {
      setSavingFood(true);
      setFoodError("");
      setFoodMessage("");

      const isEditing = editingFoodId !== null;

      const url = isEditing
        ? `${FOOD_API_URL}/admin/${editingFoodId}`
        : `${FOOD_API_URL}/admin`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: foodForm.name.trim(),
          description: foodForm.description.trim(),
          price: Number(foodForm.price),
          category: foodForm.category,
          image_url: foodForm.image_url.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not save food.");
      }

      setFoodMessage(
        isEditing
          ? "Food updated successfully!"
          : "New food added successfully!"
      );

      resetFoodForm();
      await loadAdminFoods();
    } catch (error) {
      setFoodError(error.message || "Food save failed.");
    } finally {
      setSavingFood(false);
    }
  };

  // Edit food
  const handleEditFood = (food) => {
    setFoodForm({
      name: food.name || "",
      description: food.description || "",
      price: food.price ?? "",
      category: food.category || "Fast Food",
      image_url: food.image_url || "",
    });

    setEditingFoodId(food.id);
    setFoodMessage("");
    setFoodError("");

    document.getElementById("admin-food-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Toggle food availability
  const handleAvailability = async (food) => {
    try {
      setFoodError("");
      setFoodMessage("");

      const newAvailability = Number(food.is_available) === 1 ? 0 : 1;

      const response = await fetch(
        `${FOOD_API_URL}/admin/${food.id}/availability`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ is_available: newAvailability }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Availability update failed.");
      }

      setFoodMessage(
        `${food.name} is now ${
          newAvailability === 1 ? "Available" : "Unavailable"
        }.`
      );

      await loadAdminFoods();
    } catch (error) {
      setFoodError(error.message || "Availability update failed.");
    }
  };

  // Soft-delete food
  const handleDeleteFood = async (food) => {
    const confirmed = window.confirm(
      `Are you sure you want to make "${food.name}" unavailable?`
    );

    if (!confirmed) return;

    try {
      setFoodError("");
      setFoodMessage("");

      const response = await fetch(`${FOOD_API_URL}/admin/${food.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not delete food.");
      }

      setFoodMessage(`${food.name} removed from the available menu.`);
      await loadAdminFoods();
    } catch (error) {
      setFoodError(error.message || "Food delete failed.");
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading Admin Dashboard...</div>;
  }

  if (error) {
    return (
      <div className="admin-error">
        <h3>Could not load Admin Dashboard</h3>
        <p>{error}</p>
        <button onClick={loadDashboard}>Try Again</button>
      </div>
    );
  }

  // Search and category filtering
  const filteredFoods = foods.filter((food) => {
    const search = searchTerm.trim().toLowerCase();

    const matchesSearch =
      (food.name || "").toLowerCase().includes(search) ||
      (food.description || "").toLowerCase().includes(search);

    const matchesCategory =
      selectedCategory === "All" ||
      food.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const availableFoods = filteredFoods.filter(
    (food) => Number(food.is_available) === 1
  );

  const unavailableFoods = filteredFoods.filter(
    (food) => Number(food.is_available) === 0
  );

  const stats = [
    { title: "Total Foods", value: dashboard.availableFoods },
    { title: "Available Foods", value: dashboard.availableFoods },
    { title: "Total Orders", value: dashboard.totalOrders },
    { title: "Pending Orders", value: dashboard.pendingOrders },
    { title: "Preparing Orders", value: dashboard.preparingOrders },
    { title: "Ready Orders", value: dashboard.readyOrders },
    { title: "Completed Orders", value: dashboard.completedOrders },
    { title: "Cancelled Orders", value: dashboard.cancelledOrders },
    {
      title: "Total Sales",
      value: `৳${Number(dashboard.totalSales).toFixed(2)}`,
    },
  ];

  // Reusable food table
  const renderFoodTable = (foodList, isAvailable) => {
    if (foodList.length === 0) {
      return (
        <p className="admin-food-empty">
          No {isAvailable ? "available" : "unavailable"} foods found.
        </p>
      );
    }

    return (
      <div className="admin-food-table-wrapper">
        <table className="admin-food-table">
          <thead>
            <tr>
              <th>Food</th>
              <th>Category</th>
              <th>Price</th>
              <th>Availability</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {foodList.map((food) => (
              <tr key={food.id}>
                <td>
                  <div className="admin-food-name">
                    {food.image_url ? (
                      <img
                        src={food.image_url}
                        alt={food.name}
                        className="admin-food-thumbnail"
                      />
                    ) : (
                      <div className="admin-food-no-image">No Image</div>
                    )}

                    <div>
                      <strong>{food.name}</strong>
                      {food.description && <small>{food.description}</small>}
                    </div>
                  </div>
                </td>

                <td>{food.category || "Other"}</td>
                <td>৳{Number(food.price).toFixed(2)}</td>

                <td>
                  <button
                    type="button"
                    className={
                      isAvailable
                        ? "admin-availability available"
                        : "admin-availability unavailable"
                    }
                    onClick={() => handleAvailability(food)}
                  >
                    {isAvailable ? "Available" : "Unavailable"}
                  </button>
                </td>

                <td>
                  <div className="admin-food-actions">
                    <button
                      type="button"
                      className="admin-food-edit"
                      onClick={() => handleEditFood(food)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="admin-food-delete"
                      onClick={() => handleDeleteFood(food)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <main className="admin-dashboard">
      {/* Dashboard Heading */}
      <section className="admin-heading">
        <div>
          <p className="admin-eyebrow">CAMPUSBITE ADMIN PANEL</p>
          <h1>Welcome, {currentUser.name}!</h1>
          <p>Manage your canteen orders and food menu.</p>
        </div>

        <button onClick={loadDashboard} className="admin-refresh">
          Refresh Data
        </button>
      </section>

      {/* Dashboard Statistics */}
      <section className="admin-stats">
        {stats.map((item) => (
          <div className="admin-stat-card" key={item.title}>
            <p>{item.title}</p>
            <h2>{item.value}</h2>
          </div>
        ))}
      </section>

      {/* Food Management */}
      <section className="admin-food-management">
        <div className="admin-section-heading">
          <div>
            <h2>Food Management</h2>
            <p>Add new foods and manage your canteen menu.</p>
          </div>

          <button
            className="admin-refresh"
            onClick={loadAdminFoods}
            type="button"
          >
            Refresh Foods
          </button>
        </div>

        {/* Add / Edit Food Form */}
        <form
          id="admin-food-form"
          className="admin-food-form"
          onSubmit={handleFoodSubmit}
        >
          <h3>{editingFoodId ? "Edit Food" : "Add New Food"}</h3>

          <div className="admin-food-form-grid">
            <div className="admin-form-group">
              <label htmlFor="food-name">Food Name *</label>
              <input
                id="food-name"
                name="name"
                type="text"
                placeholder="e.g. Chicken Burger"
                value={foodForm.name}
                onChange={handleFoodInput}
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="food-price">Price (৳) *</label>
              <input
                id="food-price"
                name="price"
                type="number"
                min="1"
                step="0.01"
                placeholder="e.g. 120"
                value={foodForm.price}
                onChange={handleFoodInput}
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="food-category">Category *</label>
              <select
                id="food-category"
                name="category"
                value={foodForm.category}
                onChange={handleFoodInput}
                required
              >
                {foodCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-form-group admin-form-full">
              <label htmlFor="image_url">Food Image URL</label>
              <input
                id="image_url"
                name="image_url"
                type="url"
                placeholder="Paste food image URL here"
                value={foodForm.image_url}
                onChange={handleFoodInput}
              />

              {foodForm.image_url && (
                <div className="food-image-preview">
                  <p>Image Preview:</p>
                  <img
                    src={foodForm.image_url}
                    alt="Food preview"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                    onLoad={(event) => {
                      event.currentTarget.style.display = "block";
                    }}
                  />
                </div>
              )}
            </div>

            <div className="admin-form-group admin-form-full">
              <label htmlFor="food-description">Description</label>
              <textarea
                id="food-description"
                name="description"
                placeholder="Describe the food..."
                rows="3"
                value={foodForm.description}
                onChange={handleFoodInput}
              />
            </div>
          </div>

          <div className="admin-food-form-actions">
            <button
              type="submit"
              className="admin-food-submit"
              disabled={savingFood}
            >
              {savingFood
                ? "Saving..."
                : editingFoodId
                ? "Update Food"
                : "Add Food"}
            </button>

            {editingFoodId && (
              <button
                type="button"
                className="admin-food-cancel"
                onClick={resetFoodForm}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        {foodMessage && <p className="admin-food-success">{foodMessage}</p>}
        {foodError && <p className="admin-food-error">{foodError}</p>}

        {/* Search and Category Filter */}
        <div className="admin-food-filters">
          <div className="admin-form-group">
            <label htmlFor="food-search">Search Food</label>
            <input
              id="food-search"
              type="text"
              placeholder="Search by food name or description..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="food-filter-category">Filter by Category</label>
            <select
              id="food-filter-category"
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
            >
              <option value="All">All Categories</option>
              {foodCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="admin-refresh"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All");
            }}
          >
            Clear Filters
          </button>
        </div>

        <p className="admin-food-filter-count">
          Showing {filteredFoods.length} of {foods.length} foods
        </p>

        {/* Available Foods */}
        <div className="admin-food-list-heading">
          <h3>Available Foods ({availableFoods.length})</h3>
        </div>

        {foodsLoading ? (
          <p className="admin-food-loading">Loading foods...</p>
        ) : (
          renderFoodTable(availableFoods, true)
        )}

        {/* Unavailable Foods */}
        <div className="admin-food-list-heading">
          <h3>Unavailable Foods ({unavailableFoods.length})</h3>
        </div>

        {foodsLoading ? (
          <p className="admin-food-loading">Loading foods...</p>
        ) : (
          renderFoodTable(unavailableFoods, false)
        )}
      </section>

      {/* Order Management */}
      <section className="admin-orders">
        <h2>Recent Orders</h2>

        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Role</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customer_name}</td>
                    <td>{order.role}</td>
                    <td>{order.totalItems}</td>
                    <td>৳{Number(order.total_price).toFixed(2)}</td>
                    <td>
                      <span className={`order-status ${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(event) =>
                          updateStatus(order.id, event.target.value)
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminDashboard;