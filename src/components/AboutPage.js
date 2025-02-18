import React from 'react';
import { Link } from 'react-router-dom';
import "../styling/AboutPage.css";

const AboutPage = () => {
  return (
    <div className="about-page">
      <nav>
        <ul>
          <li>
            <Link to="/" className="logo">
              RESBOT
            </Link>
          </li>
          <li><Link to="/about" className="active-link">About</Link></li>
          <li><Link to="/help">Help</Link></li>
          <li className="auth-link"><Link to="/auth">Login/Register</Link></li>
        </ul>
      </nav>
      <div className="about-content">
        <h1>About Resbot</h1>
        <p>Resbot is designed to make your hotel reservation experience as smooth and seamless as possible. We aim to provide a personalized, efficient, and intuitive service to help you find the perfect stay with ease.</p>
      </div>
      <div className="mission">
        <h2>Our Mission</h2>
        <p>We aim to revolutionize the way you book hotels by offering a convenient AI-driven platform that takes care of all the details, so you can focus on what truly matters – your stay.</p>
      </div>
      <div className="team">
        <h2>Meet Our Team</h2>
        <div className="team-list">
          <div className="team-member">
            <h3>Lance Melendrez</h3>
            <p>Programmer</p>
          </div>
          <div className="team-member">
            <h3>John Robert Rogel</h3>
            <p>Designer</p>
          </div>
          <div className="team-member">
            <h3>Vincent Cimatu</h3>
            <p>Researcher</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
