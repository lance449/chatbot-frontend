import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import HotelSelection from "./components/HotelSelection";
import Auth from "./components/Auth";
import Chatbot from "./components/Chatbot";

function App() {
  const [user, setUser] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);

  // Load user data from localStorage on page load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedFirstName = localStorage.getItem("first_name");
    const storedHotel = JSON.parse(localStorage.getItem("selectedHotel")); // Get selected hotel from localStorage

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
    localStorage.removeItem("selectedHotel"); // Remove selected hotel data on logout
  };

  const handleHotelSelection = (hotel) => {
    setSelectedHotel(hotel);
    localStorage.setItem("selectedHotel", JSON.stringify(hotel)); // Store hotel data in localStorage
  };

  return (
    <Router>
      <div className="App">
        <main>
          <Routes>
            <Route path="/" element={
              !user ? (
                <Auth onLogin={handleLogin} />
              ) : selectedHotel ? (
                <Chatbot hotel={selectedHotel} onLogout={handleLogout} />
              ) : (
                <Navigate to="/hotel-selection" />
              )
            } />

            <Route path="/hotel-selection" element={
              user ? (
                <HotelSelection setHotel={handleHotelSelection} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" />
              )
            } />

            <Route path="/chatbot" element={
              user && selectedHotel ? (
                <Chatbot hotel={selectedHotel} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" />
              )
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
