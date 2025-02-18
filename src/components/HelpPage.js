import React from 'react';
import { Link } from 'react-router-dom';
import "../styling/HelpPage.css";

const HelpPage = () => {
  return (
    <div className="help-page">
      <nav>
        <ul>
          <li>
            <Link to="/" className="logo">
              RESBOT
            </Link>
          </li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/help" className="active-link">Help</Link></li>
          <li className="auth-link"><Link to="/auth">Login/Register</Link></li>
        </ul>
      </nav>

      <div className="help-content">
        <h1>Help Center</h1>
        <p>Welcome to the ResBot Help Section. Here you will find answers to frequently asked questions and step-by-step guidance on using the platform.</p>
      </div>

      <div className="faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-item">
          <h3>How do I make a reservation?</h3>
          <p>Simply log in, choose a hotel, and interact with ResBot to select your check-in/check-out dates, room type, and the number of guests. ResBot will instantly confirm availability and finalize your booking.</p>
        </div>
        <div className="faq-item">
          <h3>Can I change my reservation?</h3>
          <p>To modify your reservation, please contact customer support directly for assistance.</p>
        </div>
        <div className="faq-item">
          <h3>What if my room is unavailable?</h3>
          <p>If your selected room is not available, ResBot will recommend alternative options based on your preferences.</p>
        </div>
      </div>

      <div className="booking-process">
        <h2>Booking Process</h2>
        <div className="booking-card">
          <ul>
            <li>Sign up or log in to your account.</li>
            <li>Select the hotel of your choice.</li>
            <li>Enter your check-in and check-out dates, room type, and the number of guests.</li>
            <li>Confirm room availability, and your booking will be completed automatically.</li>
          </ul>
        </div>
      </div>

    </div>
  );
};

export default HelpPage;
