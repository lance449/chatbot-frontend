import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import HotelSelection from "./components/HotelSelection";
import Auth from "./components/Auth";
import Chatbot from "./components/Chatbot";
import LandingPage from "./components/LandingPage";
import HelpPage from "./components/HelpPage";
import AboutPage from "./components/AboutPage";

function App() {
  const [user, setUser] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedFirstName = localStorage.getItem("first_name");
    const storedHotel = JSON.parse(localStorage.getItem("selectedHotel"));

    if (storedToken && storedFirstName) {
      setUser({ first_name: storedFirstName });
    }

    if (storedHotel) {
      setSelectedHotel(storedHotel);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("first_name", userData.first_name);
    localStorage.setItem("token", userData.token);
  };

  const handleLogout = () => {
    localStorage.removeItem("first_name");
    localStorage.removeItem("token");
    setUser(null);
    setSelectedHotel(null);
    localStorage.removeItem("selectedHotel");
  };

  const handleHotelSelection = (hotel) => {
    setSelectedHotel(hotel);
    localStorage.setItem("selectedHotel", JSON.stringify(hotel));
  };

  return (
    <Router>
      <div className="App">
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Auth onLogin={handleLogin} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/hotel-selection" element={
              user ? (
                <HotelSelection setHotel={handleHotelSelection} onLogout={handleLogout} />
              ) : (
                <Navigate to="/auth" />
              )
            } />
            <Route path="/chatbot" element={
              user && selectedHotel ? (
                <Chatbot hotel={selectedHotel} onLogout={handleLogout} />
              ) : (
                <Navigate to="/auth" />
              )
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
