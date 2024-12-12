"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./login.css"; // Ensure the CSS for the login page is imported

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json(); // Ensure we parse the response JSON
      console.log("API Response:", result); // Log the API response for debugging

      if (response.ok) {
        const { roles, token, user } = result;  // Access the roles, token, and user info
        
        // Log roles and user data for debugging
        console.log("User Roles:", roles);
        console.log("User Data:", user);

        // Check if roles are present
        if (roles && Array.isArray(roles)) {
          // Store token and user email in localStorage
          localStorage.setItem("token", token);
          localStorage.setItem("userEmail", user.email);

          // Check roles and redirect based on the role
          if (roles.includes("ROLE_USER")) {
            router.push("/dashboard");
          } else if (roles.includes("ROLE_ATTENDEE")) {
            router.push("/attendeeDashboard");
          } else {
            setErrorMessage("Unknown role. Unable to redirect.");
          }
        } else {
          setErrorMessage("Roles are missing or invalid.");
        }
      } else {
        setErrorMessage(result.message || "Invalid credentials.");
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="register-redirect">
        <p>
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
