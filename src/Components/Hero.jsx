
import "./../styles/Hero.css";

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <p className="eyebrow">WELCOME TO CAMPUSBITE</p>

        <h1>
          Your Campus.
          <br />
          Your Food.
          <br />
          <span>Your Way.</span>
        </h1>

        <p className="hero-description">
          Skip the queue, order your favorite meals online, and
          enjoy more time on campus.
        </p>

        <a href="#menu" className="primary-button">
          Explore Menu →
        </a>

        <div className="hero-stats">
          <div>
            <strong>Fresh</strong>
            <span>Every Day</span>
          </div>

          <div>
            <strong>Easy</strong>
            <span>Online Ordering</span>
          </div>

          <div>
            <strong>Smart</strong>
            <span>Order Tracking</span>
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="food-circle">🍔</div>
        <div className="floating-food pizza">🍕</div>
        <div className="floating-food fries">🍟</div>

        <div className="delivery-card">
          <span>⚡</span>
          <div>
            <strong>Quick & Easy</strong>
            <p>Order without the queue</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
