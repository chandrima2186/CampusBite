
import "./../styles/About.css";

function About() {
  return (
    <section className="about-section" id="about">
      <p className="about-eyebrow">MADE FOR STUDENTS</p>

      <h2>Less Waiting. More Living.</h2>

      <p className="about-description">
        CampusBite makes campus food ordering easier by bringing
        the canteen menu to your screen.
      </p>

      <div className="about-features">
        <div className="about-feature">
          <span>🍔</span>
          <h3>Easy Ordering</h3>
          <p>Browse your favourite campus food in one place.</p>
        </div>

        <div className="about-feature">
          <span>⚡</span>
          <h3>Save Time</h3>
          <p>Spend less time waiting and more time enjoying campus.</p>
        </div>

        <div className="about-feature">
          <span>🎓</span>
          <h3>Made for Campus</h3>
          <p>A simple food ordering experience designed for students.</p>
        </div>
      </div>
    </section>
  );
}

export default About;
