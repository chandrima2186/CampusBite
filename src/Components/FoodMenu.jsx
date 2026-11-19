
import { useState, useEffect } from "react";
import "../Styles/FoodMenu.css";

const categories = [
  "All",
  "Fast Food",
  "Snacks",
  "Main Course",
  "Drinks",
];

function FoodMenu({ onAddToCart }) {
  const [foods, setFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load foods from MySQL database through backend API
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/foods");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load foods.");
        }

        const foodsWithImages = data.foods.map((food) => ({
          ...food,
          price: Number(food.price),
          image: food.image_url || "",
        }));

        setFoods(foodsWithImages);
      } catch (err) {
        console.error("Food loading error:", err);
        setError("Unable to load food menu. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  // Search and category filtering
  const filteredFoods = foods.filter((food) => {
    const matchesSearch = food.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      food.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="menu-section" id="menu">
      <div className="menu-heading">
        <h2>Our Food Menu</h2>
        <p>Choose your favorite food at an affordable price!</p>
      </div>

      <div className="menu-search">
        <input
          type="text"
          placeholder="Search your favorite food..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="menu-categories">
        {categories.map((category) => (
          <button
            key={category}
            className={
              selectedCategory === category
                ? "category-btn active"
                : "category-btn"
            }
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="food-grid">
        {loading ? (
          <p className="no-food-message">Loading food menu...</p>
        ) : error ? (
          <p className="no-food-message">{error}</p>
        ) : filteredFoods.length > 0 ? (
          filteredFoods.map((food) => (
            <div className="food-card" key={food.id}>
              <div className="food-image">
                {food.image ? (
                  <img
                    src={food.image}
                    alt={food.name}
                    className="food-photo"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="food-no-image">
                    Image not added
                  </div>
                )}
              </div>

              <div className="food-info">
                <h3>{food.name}</h3>
                <p className="food-category">{food.category}</p>

                <div className="food-bottom">
                  <span className="food-price">
                    ৳{food.price}
                  </span>

                  <button
                    className="add-to-cart-btn"
                    onClick={() => onAddToCart(food)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-food-message">No food found!</p>
        )}
      </div>
    </section>
  );
}

export default FoodMenu;
