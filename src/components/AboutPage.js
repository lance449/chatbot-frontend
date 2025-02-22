import React from 'react';
import { Link } from 'react-router-dom';
import "../styling/AboutPage.css";
import logo from '../assets/logo.png';
import teamMember1 from '../assets/formal3.jpg';
import teamMember2 from '../assets/formal2.jpg'; 
import teamMember3 from '../assets/formal1.jpg'; 

const AboutPage = () => {
  return (
    <div className="about-page">
      <nav>
        <ul>
          <li className="logo">
            <Link to="/">
              <img src={logo} alt="RESBOT Logo" className="logo-image" />
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
            <img src={teamMember1} alt="Lance Melendrez" className="team-image" />
            <h3>Lance Melendrez</h3>
            <p>Programmer</p>
          </div>
          <div className="team-member">
            <img src={teamMember2} alt="John Robert Rogel" className="team-image" />
            <h3>John Robert Rogel</h3>
            <p>Designer</p>
          </div>
          <div className="team-member">
            <img src={teamMember3} alt="Vince Cimatu" className="team-image" />
            <h3>Vince Cimatu</h3>
            <p>Researcher</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
