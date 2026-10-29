
import "./../styles/Navbar.css";

function Navbar({
  cartCount,
  onCartClick,
  currentUser,
  onLoginClick,
  onRegisterClick,
  onLogout,
}) {
  return (
    <header className="navbar">
      <a
        href={currentUser ? "#home" : "#login"}
        className="logo"
        onClick={(event) => {
          if (!currentUser) {
            event.preventDefault();
            onLoginClick();
          }
        }}
      >
        🍴 Campus<span>Bite</span>
      </a>

      {currentUser ? (
        <>
          <nav>
            <a href="#home">Home</a>
            <a href="#menu">Food Menu</a>
            <a href="#about">About</a>
          </nav>

          <div className="navbar-actions">
            <span className="navbar-welcome">
              Hi, {currentUser.name}
            </span>

            <button
              type="button"
              className="cart-button"
              onClick={onCartClick}
            >
              🛒 Cart ({cartCount})
            </button>

            <button
              type="button"
              className="auth-nav-button"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        </>
      ) : (
        <div className="navbar-actions">
          <button
            type="button"
            className="auth-nav-button"
            onClick={onLoginClick}
          >
            Login
          </button>

          <button
            type="button"
            className="auth-nav-button register-nav-button"
            onClick={onRegisterClick}
          >
            Register
          </button>
        </div>
      )}
    </header>
  );
}

export default Navbar;
