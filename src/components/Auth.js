import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  
import "../styling/Auth.css";

const Auth = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();  // Initialize the navigate function

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  axios.defaults.withCredentials = true; // Ensure credentials are included globally

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isRegister
        ? "http://127.0.0.1:8000/api/register"
        : "http://127.0.0.1:8000/api/login";

    try {
        const res = await axios.post(url, formData, {
            headers: { "Content-Type": "application/json" },
        });

        console.log("Response:", res);

        if (res.data.token) {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("first_name", res.data.user.first_name);
            onLogin(res.data.user);
            alert("Login successful!");
            navigate('/hotel-selection');  // Navigate to HotelSelection after login
        } else {
            alert(res.data.message); // Show message after registration
        }
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        alert(error.response?.data?.message || "An error occurred. Please try again.");
    }
};

  return (
    <div>
      <h2>{isRegister ? "Register" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <>
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              onChange={handleChange}
              required
            />
          </>
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">{isRegister ? "Register" : "Login"}</button>
      </form>
      <button onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? "Switch to Login" : "Switch to Register"}
      </button>
    </div>
  );
};

export default Auth;
