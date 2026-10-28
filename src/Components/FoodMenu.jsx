
import { useState } from "react";
import "./../styles/FoodMenu.css";

function FoodMenu({ onAddToCart }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const foods = [
    {
      id: 1,
      name: "Chicken Burger",
      category: "Fast Food",
      price: 150,
      emoji: "🍔",
    },
    {
      id: 2,
      name: "Pizza",
      category: "Fast Food",
      price: 250,
      emoji: "🍕",
    },
    {
      id: 3,
      name: "Sandwich",
      category: "Snacks",
      price: 80,
      emoji: "🥪",
    },
    {
      id: 4,
      name: "Fried Rice",
      category: "Main Course",
      price: 180,
      emoji: "🍚",
    },
    {
      id: 5,
      name: "Coffee",
      category: "Drinks",
      price: 60,
      emoji: "☕",
    },
    {
      id: 6,
      name: "French Fries",
      category: "Snacks",
      price: 100,
      emoji: "🍟",
    },
  ];

  const categories = [
    "All",
    "Fast Food",
    "Snacks",
    "Main Course",
    "Drinks",
  ];

  const filteredFoods = foods.filter((food) => {
    const matchesSearch = food.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase().trim());

    const matchesCategory =
      selectedCategory === "All" ||
      food.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="menu-section" id="menu">
      <div className="section-heading">
        <div>
          <p className="eyebrow">OUR MENU</p>
          <h2>Discover Your Favorites</h2>
          <p>Delicious meals for your campus life.</p>
        </div>

        <span className="menu-count">
          {filteredFoods.length}{" "}
          {filteredFoods.length === 1 ? "choice" : "choices"}
        </span>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search your favorite food..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="food-search"
        />
      </div>

      <div className="category-filters">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`category-button ${
              selectedCategory === category ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(category)}
            aria-pressed={selectedCategory === category}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="food-grid">
        {filteredFoods.length > 0 ? (
          filteredFoods.map((food) => (
            <article className="food-card" key={food.id}>
              <div className="food-image">{food.emoji}</div>

              <div className="food-info">
                <span className="food-category">
                  {food.category}
                </span>

                <h3>{food.name}</h3>

                <div className="food-bottom">
                  <strong>৳{food.price}</strong>

                  <button
                    type="button"
                    className="add-button"
                    onClick={() => onAddToCart(food)}
                    aria-label={`Add ${food.name} to cart`}
                  >
                    +
                  </button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="no-foods">
            <span>🍽️</span>
            <h3>No food found!</h3>
            <p>Try another food name or category.</p>

            <button
              type="button"
              className="reset-button"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
            >
              Show All Foods
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default FoodMenu;
