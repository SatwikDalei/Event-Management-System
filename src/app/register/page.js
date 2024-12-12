"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./register.css"; // Ensure the CSS for the register page is imported

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    roles: ["ATTENDEE"], // Send the role as an array with the default role set to "ATTENDEE"
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRoleChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      roles: [value], // Ensure the roles field is always an array
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data Sent to Backend:", formData); // Log formData to verify role is correct

    try {
      const response = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send the formData with the selected role
      });

      const result = await response.json();
      console.log(result);  // Log the result to check for errors or success

      if (response.ok) {
        setSuccessMessage(result.message); // Display success message
        setErrorMessage(""); // Clear any previous error message
        setTimeout(() => {
          router.push("/login"); // Redirect to login page after 2 seconds
        }, 2000);
      } else {
        setSuccessMessage(""); // Clear any previous success message
        setErrorMessage(result.message); // Display error message
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
      setSuccessMessage(""); // Clear any previous success message
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

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

        <div className="form-group-radio">
          <div>
            <input
              type="radio"
              id="user"
              name="role"
              value="USER"
              checked={formData.roles.includes("USER")}
              onChange={handleRoleChange}
            />
            <label className="radio-label" htmlFor="user">User</label>
          </div>
          <div>
            <input
              type="radio"
              id="attendee"
              name="role"
              value="ATTENDEE"
              checked={formData.roles.includes("ATTENDEE")}
              onChange={handleRoleChange}
            />
            <label className="radio-label" htmlFor="attendee">Attendee</label>
          </div>
        </div>

        <button type="submit">Register</button>
      </form>
      <div className="login-redirect">
        <p>Already have an account? <a href="/login">Login here</a></p>
      </div>
    </div>
  );
};

export default RegisterPage;
