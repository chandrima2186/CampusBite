
import "./../styles/Navbar.css";

function Navbar({ cartCount, onCartClick }) {
  return (
    <header className="navbar">
      <a href="#home" className="logo">
        🍴 Campus<span>Bite</span>
      </a>

      <nav>
        <a href="#home">Home</a>
        <a href="#menu">Food Menu</a>
        <a href="#about">About</a>
      </nav>

      <button
        type="button"
        className="cart-button"
        onClick={onCartClick}
      >
        🛒 Cart ({cartCount})
      </button>
    </header>
  );
}

export default Navbar;
