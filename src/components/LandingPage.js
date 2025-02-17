import React from 'react';
import { Link } from 'react-router-dom';
import "../styling/LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <nav>
        <ul>
          <li>
            <Link to="/" className="logo">
              RESBOT
            </Link>
          </li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/help">Help</Link></li>
          <li className="auth-link"><Link to="/auth">Login/Register</Link></li>
        </ul>
      </nav>
      <div className="landing-content">
        <h1>Welcome to Resbot</h1>
        <Link to="/auth" className="start-button">Get Started</Link>
      </div>
    </div>
  );
};

export default LandingPage;