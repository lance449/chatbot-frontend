import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../styling/HelpPage.css";
import logo from '../assets/logo.png';
import { FaChevronDown, FaChevronUp, FaUserCheck, FaHotel, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';

const HelpPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqData = [
    { question: "How do I make a reservation?", answer: "Simply log in, choose a hotel, and interact with ResBot to select your check-in/check-out dates, room type, and the number of guests. ResBot will instantly confirm availability and finalize your booking." },
    { question: "Can I change my reservation?", answer: "To modify your reservation, please contact customer support directly for assistance." },
    { question: "What if my room is unavailable?", answer: "If your selected room is not available, ResBot will recommend alternative options based on your preferences." }
  ];

  const bookingSteps = [
    { icon: <FaUserCheck />, text: "Sign up or log in to your account." },
    { icon: <FaHotel />, text: "Select the hotel of your choice." },
    { icon: <FaCalendarAlt />, text: "Enter your check-in and check-out dates, room type, and the number of guests." },
    { icon: <FaCheckCircle />, text: "Confirm room availability, and your booking will be completed automatically." }
  ];

  return (
    <div className="help-page">
      <nav>
        <ul>
          <li className="logo">
            <Link to="/">
              <img src={logo} alt="RESBOT Logo" className="logo-image" loading="lazy" />
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
        {faqData.map((item, index) => (
          <div 
            key={index} 
            className={`faq-item ${openFaq === index ? "open" : ""}`} 
            onClick={() => toggleFaq(index)}
            role="button"
            aria-expanded={openFaq === index}
            tabIndex={0}
            onKeyPress={(e) => { if (e.key === 'Enter') toggleFaq(index); }}
          >
            <h3>{item.question} {openFaq === index ? <FaChevronUp /> : <FaChevronDown />}</h3>
            {openFaq === index && <p>{item.answer}</p>}
          </div>
        ))}
      </div>

      <div className="booking-process">
        <h2>Booking Process</h2>
        <div className="booking-steps">
          {bookingSteps.map((step, index) => (
            <div key={index} className="booking-step">
              <div className="step-icon">{step.icon}</div>
              <div className="step-text">{step.text}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default HelpPage;
