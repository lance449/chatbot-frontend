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
            if (Number(userInput) >= 1 && Number(userInput) <= 6) {
                setNumGuests(userInput);
                setMessages(prevMessages => [
                    ...prevMessages,
                    { sender: "bot", text: `You have ${userInput} guest(s). Please confirm if this is correct. (Yes/No)` }
                ]);
                setWaitingForGuests(false);
                setWaitingForGuestConfirmation(true); // New state for guest confirmation
            } else {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { sender: "bot", text: "Sorry, please enter a valid number of guests (1-6)." }
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
    
        console.log("Sending request data:", requestData); // Debugging
    
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/check-availability`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData),
            });
    
            const text = await response.text();
            console.log("Server response:", text); // Log raw response
    
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
                    const roomList = data.map(room => `Room ${room.id} (${room.room_type})`).join(", ");
                    setMessages(prevMessages => [
                        ...prevMessages,
                        { sender: "bot", text: `Available rooms: ${roomList}` }
                    ]);
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
        setSelectedRoomType(type);
        setMessages(prevMessages => [
            ...prevMessages,
            { sender: "user", text: type },
            { sender: "bot", text: `You selected the ${type}. Do you want to proceed with this room type? (Yes/No)` }
        ]);
        setWaitingForRoomType(false);
        setWaitingForRoomConfirmation(true);
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
                        <button onClick={() => handleRoomTypeSelection("Standard")}>Standard Room</button>
                        <button onClick={() => handleRoomTypeSelection("Family")}>Family Room</button>
                        <button onClick={() => handleRoomTypeSelection("Suite")}>Suite Room</button>
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

            </div>
        </div>
    );

    
};

export default Chatbot;
