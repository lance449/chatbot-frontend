import React from 'react';
import { Link } from 'react-router-dom';
import "../styling/LandingPage.css";
import logo from '../assets/logo.png'; // Import the logo image

const LandingPage = () => {
  return (
    <div className="landing-page">
      <nav>
        <ul>
          <li>
            <Link to="/" className="logo">
              <img src={logo} alt="RESBOT Logo" className="logo-image" /> {/* Use the logo image */}
            </Link>
          </li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/help">Help</Link></li>
          <li className="auth-link"><Link to="/auth">Login/Register</Link></li>
        </ul>
      </nav>
      <div className="landing-content">
        <h1>Welcome to Resbot</h1>
        <p>Your ultimate solution for hassle-free reservations.</p>
        <Link to="/auth" className="start-button">Get Started</Link>
      </div>
      <div className="features">
        <h2>Why Choose Resbot?</h2>
        <div className="feature-list">
          <div className="feature-item">
            <h3>Easy to Use</h3>
            <p>Our user-friendly interface makes booking a breeze.</p>
          </div>
          <div className="feature-item">
            <h3>Secure</h3>
            <p>Your data is safe with our top-notch security measures.</p>
          </div>
          <div className="feature-item">
            <h3>24/7 Support</h3>
            <p>We're here to help you anytime, anywhere.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;