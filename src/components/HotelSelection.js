import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import "../styling/HotelSelection.css";


const hotels = [
    { id: 1, name: 'YES Hotel', logo: '/hotel-a.png', details: "Yes Hotel Cabuyao Laguna is a modern hotel located in Divimall, National Road, Barangay Pulo, Cabuyao, 4025 Laguna, Philippines. It offers a selection of stylish rooms and suites equipped with modern amenities designed to provide a relaxing and enjoyable stay. " },
    { id: 2, name: 'Rizmy Hotel', logo: '/hotel-b.png', details: "Rizmy Hotel, also known as Rizmy Apartment Hotel, is a 3-star accommodation located in Cabuyao, Laguna, Philippines. Situated along Pulo Diezmo Road, it offers convenient access to various attractions in the area." },
    { id: 3, name: 'Asia Novo Boutique Hotel', logo: '/hotel-c.png', details: "Asia Novo Boutique Hotel in Cabuyao, Laguna, Philippines, is a 1-star establishment offering comfortable accommodations at affordable rates. The hotel is conveniently located at 310 LE J.P. Rizal St., Barangay Uno, Cabuyao City, Laguna, 4025, Philippines." }
];



const HotelSelection = ({ setHotel }) => {
    const [selectedHotel, setSelectedHotel] = useState(null);
    const navigate = useNavigate();  

    const handleHotelClick = (hotel) => {
        setHotel(hotel);  
        localStorage.setItem("selectedHotel", JSON.stringify(hotel));  
        navigate('/chatbot');  
    };

    return (
        <div>
            <h2>Select a Hotel</h2>
            {hotels.map(hotel => (
                <div key={hotel.id} className="hotel-card">
                    <img src={hotel.logo} alt={hotel.name} />
                    <h3>{hotel.name}</h3>
                    <button onClick={() => handleHotelClick(hotel)}>Select</button>  
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
