
import "./../styles/Footer.css";

function Footer() {
  return (
    <footer className="campusbite-footer">
      <a href="#home" className="footer-logo">
        🍴 Campus<span>Bite</span>
      </a>

      <p>
        Making campus food ordering simple, quick, and convenient.
      </p>

      <div className="footer-links">
        <a href="#home">Home</a>
        <a href="#menu">Food Menu</a>
        <a href="#about">About</a>
      </div>

      <div className="footer-divider"></div>

      <p className="footer-copyright">
        © 2026 CampusBite. Built for campus life.
      </p>
    </footer>
  );
}

export default Footer;
