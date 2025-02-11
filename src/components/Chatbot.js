import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styling/Chatbot.css"; // Ensure correct path

const Chatbot = ({ hotel, onLogout }) => {
    const firstName = localStorage.getItem("first_name") || "Guest";

    const [messages, setMessages] = useState([
        { sender: "bot", text: `Welcome, ${firstName}, to ${hotel.name}! 😊 How can I assist you today?` },
        { sender: "bot", text: "Please select or enter your check-in date." }
    ]);

    const [input, setInput] = useState("");
    const [waitingForCheckIn, setWaitingForCheckIn] = useState(true);
    const [waitingForCheckOut, setWaitingForCheckOut] = useState(false);
    const [waitingForConfirmation, setWaitingForConfirmation] = useState(false); // For confirmation step
    const [waitingForRoomType, setWaitingForRoomType] = useState(false);
    const [waitingForGuests, setWaitingForGuests] = useState(false); // For number of guests
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [selectedRoomType, setSelectedRoomType] = useState(null);
    const [numGuests, setNumGuests] = useState(null); // Track the number of guests
    const [waitingForRoomConfirmation, setWaitingForRoomConfirmation] = useState(false); 
    const chatEndRef = useRef(null);
    const [waitingForGuestConfirmation, setWaitingForGuestConfirmation] = useState(false);
    const [waitingForBookingConfirmation, setWaitingForBookingConfirmation] = useState(false);
    const [waitingForContactInfo, setWaitingForContactInfo] = useState(false);
    const [contactStep, setContactStep] = useState(0); // 0: name, 1: email, 2: phone
    const [contactInfo, setContactInfo] = useState({
        name: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleUserInput = () => {
        if (!input.trim()) return;

        setMessages([...messages, { sender: "user", text: input }]);
        processUserInput(input);
        setInput("");
    };

    const processUserInput = (userInput) => {
        if (waitingForCheckIn) {
            setCheckInDate(userInput);
            setMessages(prevMessages => [
                ...prevMessages,
                { sender: "bot", text: `Got it! Your check-in date is ${userInput}. Now, please select or enter your check-out date.` }
            ]);
            setWaitingForCheckIn(false);
            setWaitingForCheckOut(true);
        } else if (waitingForCheckOut) {
            setCheckOutDate(userInput);
            if (new Date(userInput) >= new Date(checkInDate)) {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { sender: "bot", text: `Your check-in is ${checkInDate} and check-out is ${userInput}. Please confirm if the dates are correct. (Yes/No)` }
                ]);
                setWaitingForCheckOut(false);
                setWaitingForConfirmation(true);
            } else {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { sender: "bot", text: "Sorry, your check-out date must be on or after the check-in date. Please try again." }
                ]);
            }
        } else if (waitingForConfirmation) {
            if (userInput.toLowerCase() === "yes") {
                if (!selectedRoomType) {
                    setMessages(prevMessages => [
                        ...prevMessages,
                        { sender: "bot", text: "Great! Now, please choose your room type." }
                    ]);
                    setWaitingForConfirmation(false);
                    setWaitingForRoomType(true);
                } else if (!numGuests) {
                    setMessages(prevMessages => [
                        ...prevMessages,
                        { sender: "bot", text: "How many guests will be staying?" }
                    ]);
                    setWaitingForConfirmation(false);
                    setWaitingForGuests(true);
                }
            } else if (userInput.toLowerCase() === "no") {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { sender: "bot", text: "Let's restart the date selection. Please enter your check-in date again." }
                ]);
                setWaitingForConfirmation(false);
                setWaitingForCheckIn(true);
                setCheckInDate(null);
                setCheckOutDate(null);
            } else {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { sender: "bot", text: "Sorry, I didn't understand that. Please respond with 'Yes' or 'No'." }
                ]);
            }
        } else if (waitingForRoomType) {
            if (["Standard Room", "Family Room", "Suite Room"].includes(userInput)) {
                setSelectedRoomType(userInput);
                setMessages(prevMessages => [
                    ...prevMessages,
                    { sender: "user", text: userInput },
                    { sender: "bot", text: `You selected the ${userInput}. Do you want to proceed with this room type? (Yes/No)` }
                ]);
                setWaitingForRoomType(false);
                setWaitingForRoomConfirmation(true);
            } else {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { sender: "bot", text: "Sorry, I didn't understand that. Please choose a room type: 'Standard Room', 'Family Room', or 'Suite Room'." }
                ]);
            }
        } else if (waitingForRoomConfirmation) {
            if (userInput.toLowerCase() === "yes") {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { sender: "bot", text: "How many guests will be staying?" }
                ]);
                setWaitingForRoomConfirmation(false);
                setWaitingForGuests(true);
            } else {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { sender: "bot", text: "Please select a room type again." }
                ]);
                setWaitingForRoomConfirmation(false);
                setWaitingForRoomType(true);
            }
        } else if (waitingForGuests) {
            const guestNum = Number(userInput);
            let minCapacity, maxCapacity;
            
            // Remove "Room" from selectedRoomType for comparison
            const roomType = selectedRoomType.replace(' Room', '');
            
            // Set capacity ranges based on room type
            switch(roomType) {
                case 'Standard':
                    minCapacity = 1;
                    maxCapacity = 2;
                    break;
                case 'Family':
                    minCapacity = 3;
                    maxCapacity = 6;
                    break;
                case 'Suite':
                    minCapacity = 2;
                    maxCapacity = 6;
                    break;
                default:
                    minCapacity = 1;
                    maxCapacity = 2;
            }

            if (guestNum >= minCapacity && guestNum <= maxCapacity) {
                setNumGuests(guestNum);
                setMessages(prevMessages => [
                    ...prevMessages,
                    { sender: "bot", text: `You have ${guestNum} guest(s). Please confirm if this is correct. (Yes/No)` }
                ]);
                setWaitingForGuests(false);
                setWaitingForGuestConfirmation(true);
            } else {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { 
                        sender: "bot", 
                        text: `Sorry, the ${roomType} room can only accommodate ${minCapacity}-${maxCapacity} guests. Please enter a valid number of guests.` 
                    }
                ]);
            }
        } else if (waitingForGuestConfirmation) {
            if (userInput.toLowerCase() === "yes") {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { sender: "bot", text: "Checking available rooms..." }
                ]);
                checkRoomAvailability(); // Call function to fetch available rooms
                setWaitingForGuestConfirmation(false);
            } else if (userInput.toLowerCase() === "no") {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { sender: "bot", text: "Okay, let's try again. How many guests will be staying?" }
                ]);
                setWaitingForGuestConfirmation(false);
                setWaitingForGuests(true);
            } else {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { sender: "bot", text: "Sorry, I didn't understand that. Please respond with 'Yes' or 'No'." }
                ]);
            }
        } else if (waitingForBookingConfirmation) {
            if (userInput.toLowerCase() === 'yes') {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { 
                        sender: "bot", 
                        text: "Great! To complete your reservation, I'll need some information.\n\nFirst, please enter your full name:" 
                    }
                ]);
                setWaitingForBookingConfirmation(false);
                setWaitingForContactInfo(true);
                setContactStep(0);
                setContactInfo({ name: '', email: '', phone: '' });
            } else if (userInput.toLowerCase() === 'no') {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { 
                        sender: "bot", 
                        text: "No problem! Let's start over with the dates. Please select your check-in date." 
                    }
                ]);
                // Reset all booking states
                setWaitingForBookingConfirmation(false);
                setWaitingForCheckIn(true);
                setCheckInDate(null);
                setCheckOutDate(null);
                setSelectedRoomType(null);
                setNumGuests(null);
            } else {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { 
                        sender: "bot", 
                        text: "Please respond with 'Yes' or 'No' to confirm the booking details." 
                    }
                ]);
            }
        } else if (waitingForContactInfo) {
            switch (contactStep) {
                case 0: // Name
                    setContactInfo(prev => ({ ...prev, name: userInput }));
                    setMessages(prevMessages => [
                        ...prevMessages,
                        { sender: "user", text: userInput },
                        { 
                            sender: "bot", 
                            text: "Thank you! Now, please enter your email address:" 
                        }
                    ]);
                    setContactStep(1);
                    setInput("");
                    break;

                case 1: // Email
                    if (validateEmail(userInput)) {
                        setContactInfo(prev => ({ ...prev, email: userInput }));
                        setMessages(prevMessages => [
                            ...prevMessages,
                            { sender: "user", text: userInput },
                            { 
                                sender: "bot", 
                                text: "Great! Finally, please enter your contact number:" 
                            }
                        ]);
                        setContactStep(2);
                        setInput("");
                    } else {
                        setMessages(prevMessages => [
                            ...prevMessages,
                            { sender: "user", text: userInput },
                            { 
                                sender: "bot", 
                                text: "That doesn't look like a valid email address. Please try again:" 
                            }
                        ]);
                    }
                    break;

                case 2: // Phone
                    if (validatePhone(userInput)) {
                        setContactInfo(prev => ({ ...prev, phone: userInput }));
                        // Show final summary
                        setMessages(prevMessages => [
                            ...prevMessages,
                            { sender: "user", text: userInput },
                            { 
                                sender: "bot", 
                                text: "Perfect! Here's a summary of your reservation:\n\n" +
                                      `📅 Check-in: ${checkInDate.toDateString()}\n` +
                                      `📅 Check-out: ${checkOutDate.toDateString()}\n` +
                                      `🏠 Room Type: ${selectedRoomType}\n` +
                                      `👥 Number of Guests: ${numGuests}\n\n` +
                                      `👤 Name: ${contactInfo.name}\n` +
                                      `📧 Email: ${contactInfo.email}\n` +
                                      `📱 Phone: ${userInput}\n\n` +
                                      "Your reservation is being processed..."
                            }
                        ]);
                        setWaitingForContactInfo(false);
                        // Here you would call your API to save the reservation
                    } else {
                        setMessages(prevMessages => [
                            ...prevMessages,
                            { sender: "user", text: userInput },
                            { 
                                sender: "bot", 
                                text: "That doesn't look like a valid phone number. Please enter a valid phone number:" 
                            }
                        ]);
                    }
                    break;
            }
        }
    };    

    const saveBookingToDatabase = async (checkIn, checkOut, roomType, guests) => {
        try {
            // Removed the message showing booking details to the user
        } catch (error) {
            console.error("Error saving booking:", error);
            setMessages(prevMessages => [
                ...prevMessages,
                { sender: "bot", text: "Sorry, there was an error saving your booking. Please try again." }
            ]);
        }
    };

    const checkRoomAvailability = async () => {
        const requestData = {
            hotel_id: hotel.id,
            check_in: checkInDate,
            check_out: checkOutDate,
            room_type: selectedRoomType,
            num_guests: numGuests
        };
    
        console.log("Sending request data:", requestData);
    
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/check-availability`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData),
            });
    
            const text = await response.text();
            console.log("Server response:", text);
    
            if (!response.ok) {
                console.error("Server error:", response.status, response.statusText);
                setMessages(prevMessages => [
                    ...prevMessages,
                    { sender: "bot", text: `Error fetching room availability. Status: ${response.status} ${response.statusText}` }
                ]);
                return;
            }
    
            try {
                const data = JSON.parse(text);
                console.log("Parsed JSON data:", data);
    
                if (!Array.isArray(data) || data.length === 0) {
                    setMessages(prevMessages => [
                        ...prevMessages,
                        { sender: "bot", text: "No rooms available for these dates." }
                    ]);
                } else {
                    const price = data[0].price;
                    const roomList = data.map(room => `Room ${room.id} (${room.room_type})`).join(", ");
                    
                    // First show available rooms
                    setMessages(prevMessages => [
                        ...prevMessages,
                        { 
                            sender: "bot", 
                            text: `📍 Available Rooms:\n${roomList}\n\n💰 Price per night: $${price}`
                        },
                        {
                            sender: "bot",
                            text: "Here are your booking details for confirmation:\n\n" +
                                  `📅 Check-in: ${checkInDate.toDateString()}\n` +
                                  `📅 Check-out: ${checkOutDate.toDateString()}\n` +
                                  `🏠 Room Type: ${selectedRoomType}\n` +
                                  `👥 Number of Guests: ${numGuests}\n` +
                                  `💰 Price per night: $${price}\n\n` +
                                  "Are these details correct? (Yes/No)"
                        }
                    ]);
                    setWaitingForBookingConfirmation(true);
                }
            } catch (jsonError) {
                console.error("Invalid JSON response:", text);
                setMessages(prevMessages => [
                    ...prevMessages,
                    { sender: "bot", text: "Error: Unexpected server response." }
                ]);
            }
        } catch (error) {
            console.error("Error fetching rooms:", error);
            setMessages(prevMessages => [
                ...prevMessages,
                { sender: "bot", text: `Error fetching room availability: ${error.message}` }
            ]);
        }
    };
    
    const handleRoomTypeSelection = (type) => {
        const roomType = type.replace(' Room', '');
        setSelectedRoomType(roomType);
        setMessages(prevMessages => [
            ...prevMessages,
            { sender: "user", text: type },
            { sender: "bot", text: `You selected the ${type}. Do you want to proceed with this room type? (Yes/No)` }
        ]);
        setWaitingForRoomType(false);
        setWaitingForRoomConfirmation(true);
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePhone = (phone) => {
        const re = /^\+?[\d\s-]{8,}$/;
        return re.test(phone);
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                {hotel.name} Chatbot
                <div className="header-buttons">
                    <button onClick={() => alert("Settings Page Coming Soon!")}>Settings</button>
                    <button onClick={onLogout}>Logout</button>
                </div>
            </div>
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}

                {/* Check-in Date Picker */}
                {waitingForCheckIn && (
                    <div className="date-picker">
                        <DatePicker
                            selected={checkInDate}
                            onChange={(date) => {   
                                if (date && date.getTime() !== checkInDate?.getTime()) {  // Check if the date is the same
                                    setCheckInDate(date);
                                    setMessages(prevMessages => [
                                        ...prevMessages,
                                        { sender: "user", text: `Check-in: ${date.toDateString()}` },
                                        { sender: "bot", text: `Got it! Your check-in date is ${date.toDateString()}. Now, please select or enter your check-out date.` }
                                    ]);
                                    setCheckOutDate(null); // Reset check-out date when check-in is changed
                                    setWaitingForCheckIn(false);
                                    setWaitingForCheckOut(true);
                                } else {
                                    setMessages(prevMessages => [
                                        ...prevMessages,
                                        { sender: "bot", text: "Please select a different check-in date." }
                                    ]);
                                }
                            }}
                            placeholderText="Select check-in date"
                            minDate={new Date()} // Ensure future dates only
                        />
                    </div>
                )}

                {/* Check-out Date Picker */}
                {waitingForCheckOut && (
                    <div className="date-picker">
                        <DatePicker
                            selected={checkOutDate}
                            onChange={(date) => {
                                if (date && date.getTime() !== checkOutDate?.getTime()) {  // Check if the date is the same
                                    setCheckOutDate(date);
                                    setMessages(prevMessages => [
                                        ...prevMessages,
                                        { sender: "user", text: `Check-out: ${date.toDateString()}` },
                                        { sender: "bot", text: `Got it! Your check-out date is ${date.toDateString()}. Please confirm if the dates are correct.` }
                                    ]);
                                    setWaitingForCheckOut(false);
                                    setWaitingForConfirmation(true);
                                } else {
                                    setMessages(prevMessages => [
                                        ...prevMessages,
                                        { sender: "bot", text: "Please select a different check-out date." }
                                    ]);
                                }
                            }}
                            placeholderText="Select check-out date"
                            minDate={checkInDate || new Date()} // Ensure check-out is on or after check-in date
                        />
                    </div>
                )}

                {/* Confirmation for Dates */}
                {waitingForConfirmation && (
                    <div className="confirmation-buttons">
                        <button onClick={() => processUserInput("Yes")}>Yes</button>
                        <button onClick={() => processUserInput("No")}>No</button>
                    </div>
                )}

                {/* Room Type Buttons */}
                {waitingForRoomType && (
                    <div className="room-type-buttons">
                        <button onClick={() => handleRoomTypeSelection("Standard Room")}>Standard Room</button>
                        <button onClick={() => handleRoomTypeSelection("Family Room")}>Family Room</button>
                        <button onClick={() => handleRoomTypeSelection("Suite Room")}>Suite Room</button>
                    </div>
                )}

                {waitingForRoomConfirmation && (
                    <div className="confirmation-buttons">
                        <button onClick={() => processUserInput("Yes")}>Yes</button>
                        <button onClick={() => processUserInput("No")}>No</button>
                    </div>
                )}

                {/* Number of Guests Input */}
                {waitingForGuests && (
                    <div className="guest-input">
                        <input
                            type="number"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Enter number of guests"
                            min="1"
                            max="6"
                        />
                        <button onClick={handleUserInput}>Submit</button>
                    </div>
                )}

                                {/* Confirmation for Number of Guests */}
                {waitingForGuestConfirmation && (
                    <div className="confirmation-buttons">
                        <button onClick={() => processUserInput("Yes")}>Yes</button>
                        <button onClick={() => processUserInput("No")}>No</button>
                    </div>
                )}

                {/* Booking Confirmation Buttons */}
                {waitingForBookingConfirmation && (
                    <div className="confirmation-buttons">
                        <button onClick={() => processUserInput("Yes")}>Yes</button>
                        <button onClick={() => processUserInput("No")}>No</button>
                    </div>
                )}

                {/* Contact Information Input */}
                {waitingForContactInfo && (
                    <div className="contact-input">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Enter your contact information..."
                            className="chat-input"
                        />
                        <button onClick={handleUserInput} className="send-button">Submit</button>
                    </div>
                )}

                {/* Chatbox for user input */}
                <div className="chat-input-container">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message here..."
                        className="chat-input"
                    />
                    <button onClick={handleUserInput} className="send-button">Send</button>
                </div>
            </div>
        </div>
    );

    
};

export default Chatbot;
