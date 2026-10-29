
import { useState } from "react";

function Register({ onRegister, onShowLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    institution_id: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Registration failed. Please try again."
        );
      }

   setFormData({
  name: "",
  email: "",
  password: "",
  role: "student",
  institution_id: "",
  phone: "",
});

onShowLogin();
    } catch (error) {
      setErrorMessage(
        error.message === "Failed to fetch"
          ? "Cannot connect to the server. Please try again."
          : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-card">
        <p className="auth-eyebrow">CAMPUSBITE</p>
        <h2>Create Account</h2>
        <p className="auth-description">
          Join CampusBite to get started.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="register-name">Full Name</label>
            <input
              id="register-name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-email">Email Address</label>
            <input
              id="register-email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              name="password"
              type="password"
              placeholder="At least 8 characters"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-role">Account Type</label>
            <select
              id="register-role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          <div className="auth-field">
            <label htmlFor="register-institution">
              {formData.role === "student"
                ? "Student ID"
                : "Teacher / Employee ID"}
            </label>
            <input
              id="register-institution"
              name="institution_id"
              type="text"
              placeholder="Enter your institution ID"
              value={formData.institution_id}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-phone">Phone Number</label>
            <input
              id="register-phone"
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              autoComplete="tel"
              required
            />
          </div>

          {errorMessage && (
            <p className="auth-error" role="alert">
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p className="auth-success" role="status">
              {successMessage}
            </p>
          )}

          <button
            className="auth-primary-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <button
            type="button"
            className="auth-link-button"
            onClick={onShowLogin}
          >
            Login
          </button>
        </p>
      </div>
    </section>
  );
}

export default Register;
