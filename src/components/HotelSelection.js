import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const hotels = [
    { id: 1, name: 'Hotel A', logo: '/hotel-a.png', details: "Located in the heart of the city, Hotel A offers luxury and comfort for travelers." },
    { id: 2, name: 'Hotel B', logo: '/hotel-b.png', details: "A beachfront paradise with stunning ocean views and world-class amenities." },
    { id: 3, name: 'Hotel C', logo: '/hotel-c.png', details: "A cozy retreat near nature, perfect for a peaceful and relaxing stay." }
];

const HotelSelection = ({ setHotel }) => {
    const [selectedHotel, setSelectedHotel] = useState(null);
    const navigate = useNavigate();  // Initialize the navigate function

    const handleHotelClick = (hotel) => {
        setHotel(hotel);  // Set the selected hotel in the parent component
        localStorage.setItem("selectedHotel", JSON.stringify(hotel));  // Store the hotel in localStorage
        navigate('/chatbot');  // Redirect to the Chatbot page after selecting a hotel
    };

    return (
        <div>
            <h2>Select a Hotel</h2>
            {hotels.map(hotel => (
                <div key={hotel.id} className="hotel-card">
                    <img src={hotel.logo} alt={hotel.name} />
                    <h3>{hotel.name}</h3>
                    <button onClick={() => handleHotelClick(hotel)}>Select</button>  {/* Use handleHotelClick */}
                    <button onClick={() => setSelectedHotel(hotel)}>Details</button>
                </div>
            ))}
            {selectedHotel && (
                <div className="hotel-details">
                    <h3>{selectedHotel.name} Details</h3>
                    <p>{selectedHotel.details}</p>
                    <button onClick={() => setSelectedHotel(null)}>Close</button>
                </div>
            )}
        </div>
    );
};

export default HotelSelection;
