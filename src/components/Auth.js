import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styling/Auth.css";
import logo from '../assets/logo.png';

const Auth = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);  // State to toggle password visibility
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",  // State for confirm password field
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
            setErrorMessage(res.data.message || "Unexpected error. Please try again.");
        }
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        setErrorMessage(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <>
      <div className="logo-container">
        <Link to="/">
          <img src={logo} alt="RESBOT Logo" />
        </Link>
      </div>
      <div className="auth-container">
        <header>
          <h1 className="heading">{isRegister ? "Register" : "Login"}</h1>
          <p className="title">{isRegister ? "Create your account" : "Sign in to your account"}</p>
        </header>
        <div className="tab-bar">
          <button className={`tab ${!isRegister ? "active" : ""}`} onClick={() => setIsRegister(false)}>Login</button>
          <button className={`tab ${isRegister ? "active" : ""}`} onClick={() => setIsRegister(true)}>Register</button>
        </div>
        <div className="form-section">
          {!isRegister ? (
            <div className="login-box">
              <form onSubmit={handleSubmit} className="auth-form">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={handleChange}
                  className="ele"
                  required
                />
                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    className="ele"
                    required
                  />
                  <span
                    className="eye-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    👁️
                  </span>
                </div>
                <button type="submit" className="clkbtn">Login</button>
              </form>
            </div>
          ) : (
            <div className="signup-box">
              <form onSubmit={handleSubmit} className="auth-form">
                <input
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  onChange={handleChange}
                  className="ele"
                  required
                />
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  onChange={handleChange}
                  className="ele"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={handleChange}
                  className="ele"
                  required
                />
                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    className="ele"
                    required
                  />
                  <span
                    className="eye-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    👁️
                  </span>
                </div>
                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    onChange={handleChange}
                    className="ele"
                    required
                  />
                  <span
                    className="eye-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    👁️
                  </span>
                </div>
                <button type="submit" className="clkbtn">Register</button>
              </form>
            </div>
          )}
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </>
  );
};

export default Auth;
