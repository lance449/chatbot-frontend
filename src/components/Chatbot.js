import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaUserCircle } from "react-icons/fa";
import "../styling/Chatbot.css"; // Ensure correct path

const Chatbot = ({ hotel, onLogout }) => {
    const firstName = localStorage.getItem("first_name") || "Guest";
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const toggleProfileMenu = () => {
        setShowProfileMenu(!showProfileMenu);
    };

    const [messages, setMessages] = useState([
        { sender: "bot", text: `Welcome, ${firstName}, to ${hotel.name}! 😊 How can I assist you today?` },
        { sender: "bot", text: "Please select or enter your check-in date." }
    ]);

    const [input, setInput] = useState("");
    const [waitingForCheckIn, setWaitingForCheckIn] = useState(true);
    const [waitingForCheckOut, setWaitingForCheckOut] = useState(false);
    const [waitingForConfirmation, setWaitingForConfirmation] = useState(false); 
    const [waitingForRoomType, setWaitingForRoomType] = useState(false);
    const [waitingForGuests, setWaitingForGuests] = useState(false); 
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [selectedRoomType, setSelectedRoomType] = useState(null);
    const [numGuests, setNumGuests] = useState(null); 
    const [waitingForRoomConfirmation, setWaitingForRoomConfirmation] = useState(false); 
    const chatEndRef = useRef(null);
    const [waitingForGuestConfirmation, setWaitingForGuestConfirmation] = useState(false);
    const [waitingForBookingConfirmation, setWaitingForBookingConfirmation] = useState(false);
    const [waitingForContactInfo, setWaitingForContactInfo] = useState(false);
    const [contactStep, setContactStep] = useState(0);
    const [contactInfo, setContactInfo] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [showingFAQs, setShowingFAQs] = useState(false);
    const [waitingForFinalConfirmation, setWaitingForFinalConfirmation] = useState(false);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleUserInput = () => {
        if (!input.trim()) return;

        setMessages([...messages, { sender: "user", text: input }]);
        processUserInput(input);
        setInput(""); 
    };

    const [showingReservationPolicy, setShowingReservationPolicy] = useState(false);

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
                resetDateSelection();
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

            const roomType = selectedRoomType.replace(' Room', '');

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
                checkRoomAvailability(); 
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
                    { sender: "bot", text: "Please provide your contact information." }
                ]);
                setWaitingForBookingConfirmation(false);
                setWaitingForContactInfo(true);
            } else if (userInput.toLowerCase() === 'no') {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { sender: "bot", text: "Okay, let's start over. Please select your check-in date." }
                ]);
                resetAllStates();
                setWaitingForCheckIn(true);
            } else {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { sender: "bot", text: "Sorry, I didn't understand that. Please respond with 'Yes' or 'No'." }
                ]);
            }
        } else if (waitingForContactInfo) {
            if (contactStep === 0) {
                setContactInfo(prevInfo => ({ ...prevInfo, name: userInput }));
                setMessages(prevMessages => [
                    ...prevMessages,
                    { sender: "bot", text: "Please enter your email address." }
                ]);
                setContactStep(1);
            } else if (contactStep === 1) {
                if (validateEmail(userInput)) {
                    setContactInfo(prevInfo => ({ ...prevInfo, email: userInput }));
                    setMessages(prevMessages => [
                        ...prevMessages,
                        { sender: "bot", text: "Please enter your phone number." }
                    ]);
                    setContactStep(2);
                } else {
                    setMessages(prevMessages => [
                        ...prevMessages,
                        { sender: "bot", text: "Invalid email address. Please enter a valid email." }
                    ]);
                }
            } else if (contactStep === 2) {
                if (validatePhone(userInput)) {
                    setContactInfo(prevInfo => ({ ...prevInfo, phone: userInput }));
                    setMessages(prevMessages => [
                        ...prevMessages,
                        { sender: "bot", text: "Thank you! Saving your booking..." }
                    ]);
                    setWaitingForContactInfo(false);
                    saveBookingToDatabase(checkInDate, checkOutDate, selectedRoomType, numGuests, {
                        ...contactInfo,
                        phone: userInput
                    })
                    .then(data => {
                        setMessages(prevMessages => [
                            ...prevMessages,
                            { 
                                sender: "bot", 
                                text: "✅ Your booking has been confirmed! Thank you for choosing our hotel."
                            },
                            { 
                                sender: "bot", 
                                text: `📅 Check-in: ${new Date(checkInDate).toDateString()}`
                            },
                            { 
                                sender: "bot", 
                                text: `📅 Check-out: ${new Date(checkOutDate).toDateString()}`
                            },
                            { 
                                sender: "bot", 
                                text: `🏠 Room Type: ${selectedRoomType}`
                            },
                            { 
                                sender: "bot", 
                                text: `👥 Number of Guests: ${numGuests}`
                            },
                            { 
                                sender: "bot", 
                                text: "📞 Contact Information:"
                            },
                            { 
                                sender: "bot", 
                                text: `   - Name: ${contactInfo.name}`
                            },
                            { 
                                sender: "bot", 
                                text: `   - Email: ${contactInfo.email}`
                            },
                            { 
                                sender: "bot", 
                                text: `   - Phone: ${userInput}`
                            },
                            { 
                                sender: "bot", 
                                text: `🏢 Room Number: ${data.room_number}`
                            },
                            { 
                                sender: "bot", 
                                text: "🎉 Enjoy your stay! If you need assistance, feel free to ask."
                            }
                        ]);
            
                        
                        resetAllStates();
                    })
                    .catch(error => {
                        setMessages(prevMessages => [
                            ...prevMessages,
                            { sender: "bot", text: `Error saving booking: ${error.message}` }
                        ]);
                    });
                } else {
                    setMessages(prevMessages => [
                        ...prevMessages,
                        { sender: "bot", text: "Invalid phone number. Please enter a valid phone number." }
                    ]);
                }
            }
        }
    };    

    const saveBookingToDatabase = async (checkIn, checkOut, roomType, guests, contactInfo) => {
        try {
            const requestData = {
                hotel_id: hotel.id,
                check_in: new Date(checkIn).toISOString().split('T')[0], 
                check_out: new Date(checkOut).toISOString().split('T')[0], 
                room_type: roomType,
                num_guests: guests,
                customer_name: contactInfo.name,
                customer_email: contactInfo.email,
                customer_phone: contactInfo.phone
            };
    
            console.log("Sending booking request data:", requestData);
    
            const response = await fetch(`http://127.0.0.1:8000/api/assign-room`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData),
            });
    
            const text = await response.text();
            console.log("Server response:", text);
    
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText} - ${text}`);
            }
    
            const data = JSON.parse(text);
            return data;
        } catch (error) {
            console.error("Error saving booking:", error);
            setMessages(prevMessages => [
                ...prevMessages,
                { sender: "bot", text: `Error saving booking: ${error.message}` }
            ]);
            throw error;
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
                        { sender: "bot", text: "❌ No rooms available for these dates. Please select new check-in and check-out dates." }
                    ]);
                    resetDateSelection();
                } else {
                    const price = data[0].price;
                    const roomList = data.map(room => `🏠 Room ${room.id} (${room.room_type})`).join("\n");
                
                    setMessages(prevMessages => [
                        ...prevMessages,
                        { 
                            sender: "bot",  text: `📍 Available Rooms:\n${roomList}\n\n💰 **Price per night:** $${price}`
                        },
                        {
                            sender: "bot", text: "📝 Booking Confirmation:"
                        },
                        { 
                            sender: "bot", text: `📅 Check-in: ${checkInDate.toDateString()}`
                        },
                        { 
                            sender: "bot",  text: `📅 Check-out: ${checkOutDate.toDateString()}`
                        },
                        { 
                            sender: "bot",  text: `🏠 Room Type: ${selectedRoomType}`
                        },
                        { 
                            sender: "bot", text: `👥 Number of Guests: ${numGuests}`
                        },
                        { 
                            sender: "bot",  text: `💰 Price per night: $${price}`
                        },
                        { 
                            sender: "bot",  text: "✅ Are these details correct? (Yes/No)"
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
        const re = /^\+?[\d\s-]{11,}$/;
        return re.test(phone);
    };

    const handleCheckAvailability = () => {
        resetAllStates();
        setMessages(prevMessages => [
            ...prevMessages,
            { sender: "bot", text: "Please select your check-in date." }
        ]);
        setWaitingForCheckIn(true);
        setShowingFAQs(false);
    };

    const handleReservation = () => {
        resetAllStates();
        setMessages(prevMessages => [
            ...prevMessages,
            { sender: "bot", text: "To make a reservation, I'll need some information. Please select your check-in date." }
        ]);
        setWaitingForCheckIn(true);
        setShowingFAQs(false);
    };

    const resetAllStates = () => {
        setWaitingForCheckIn(false);
        setWaitingForCheckOut(false);
        setWaitingForConfirmation(false);
        setWaitingForRoomType(false);
        setWaitingForGuests(false);
        setWaitingForRoomConfirmation(false);
        setWaitingForGuestConfirmation(false);
        setWaitingForBookingConfirmation(false);
        setWaitingForContactInfo(false);
        setContactStep(0);
        setContactInfo({ name: '', email: '', phone: '' });
        setCheckInDate(null);
        setCheckOutDate(null);
        setSelectedRoomType(null);
        setNumGuests(null);
    };

    const resetDateSelection = () => {
        setCheckInDate(null);
        setCheckOutDate(null);
        setSelectedRoomType(null);
        setNumGuests(null);
        setWaitingForCheckIn(true);
        setWaitingForCheckOut(false);
        setWaitingForConfirmation(false);
        setWaitingForRoomType(false);
        setWaitingForGuests(false);
        setWaitingForRoomConfirmation(false);
        setWaitingForGuestConfirmation(false);
        setWaitingForBookingConfirmation(false);
        setWaitingForContactInfo(false);
        setContactStep(0);
        setContactInfo({ name: '', email: '', phone: '' });
    };

    const resetContactInfo = () => {
        setWaitingForContactInfo(false);
        setContactStep(0);
        setContactInfo({ name: '', email: '', phone: '' });
    };

    const handleFAQClick = (questionNumber) => {
        let faqAnswer = '';
        switch(questionNumber) {
            case 1:
                faqAnswer = "Yes, we are pet-friendly and welcome your furry companions for a small fee. Please contact us in advance for availability.";
                break;
            case 2:
                faqAnswer = "Yes, we offer complimentary high-speed Wi-Fi in all rooms and public areas.";
                break;
            case 3:
                faqAnswer = "Rooms come equipped with essentials like a flat-screen TV, air conditioning, complimentary toiletries, a mini-fridge, and more.";
                break;
            case 4:
                faqAnswer = "Yes, we offer a loyalty program that allows you to earn points for every stay, which can be redeemed for discounts and rewards.";
                break;
            case 5:
                faqAnswer = "Yes, we offer seasonal promotions and special packages. Check our website or contact us for current offers.";
                break;
            case 6:
                faqAnswer = "Our hotel is conveniently located at Cabuyao";
                break;
            default:
                faqAnswer = "Please select a valid question.";
        }
        
        setMessages(prevMessages => [
            ...prevMessages,
            { sender: "user", text: `Question ${questionNumber}` },
            { sender: "bot", text: faqAnswer }
        ]);
    };

    const handleFAQs = () => {
        setShowingFAQs(true);
        setMessages(prevMessages => [
            ...prevMessages,
            { 
                sender: "bot", 
                text: "Please select a question you'd like to know more about:"
            }
        ]);
    };

    const handleReservationPolicy = () => {
        setShowingReservationPolicy(true);
        setShowingFAQs(false);
        setMessages(prevMessages => [
            ...prevMessages,
            { sender: "bot", type: "policy", text: "Reservation Policy" },
            { sender: "bot", type: "policy", text: "📌 Booking Guarantee: A valid credit card or deposit is required to confirm the reservation." },
            { sender: "bot", type: "policy", text: "🚫 Cancellation & No-show: Free cancellation up to 24 hours before check-in. Late cancellations or no-shows incur one night's charge." },
            { sender: "bot", type: "policy", text: "💰 Payment: Full payment upon check-in. Accepted: cash, credit/debit cards." },
            { sender: "bot", type: "policy", text: "🆔 Guests & ID: All guests must present a valid ID. Minimum check-in age: 18." },
            { sender: "bot", type: "policy", text: "💥 Damages: Guests are responsible for any damages caused." },
            { sender: "bot", type: "policy", text: "🔍 Lost & Found: The hotel is not responsible for lost items but will assist in recovery efforts." }
        ]);
    };
    
    return (
        <div>
            <div className="profile-section">
                <FaUserCircle className="profile-icon" onClick={toggleProfileMenu} />
                {showProfileMenu && (
                    <div className="profile-menu">
                        <button onClick={() => alert("Settings Page Coming Soon!")}>Settings</button>
                        <button onClick={onLogout}>Logout</button>
                    </div>
                )}
            </div>
            <div className="main-container">
                <div className="chat-container">
                    <div className="chat-header">
                        {hotel.name} Chatbot
                    </div>
                    <div className="quick-actions">
                        <button onClick={handleCheckAvailability} className="action-button">
                            <span className="icon">🔍</span>
                            Check Availability
                        </button>
                        <button onClick={handleReservation} className="action-button">
                            <span className="icon">📅</span>
                            Make Reservation
                        </button>
                        <button onClick={handleFAQs} className="action-button">
                            <span className="icon">❓</span>
                            FAQs
                        </button>
                        <button onClick={handleReservationPolicy} className="action-button">
                            <span className="icon">📜</span>
                            Reservation Policy
                        </button>
                    </div>
                    <div className="chat-box">
                        {messages.map((msg, index) => (
                            <div key={index} className={`chat-message ${msg.sender} ${msg.type === "policy" ? "policy-message" : ""}`}>
                                {msg.type === "policy" ? (
                                    <div className="policy-box">{msg.text}</div>
                                ) : (
                                    msg.text
                                )}
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
                                    minDate={new Date()} 
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
                                    minDate={checkInDate || new Date()}
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

                        {waitingForFinalConfirmation && (
                            <div className="confirmation-buttons">
                                <button onClick={() => processUserInput("Yes")}>Yes</button>
                                <button onClick={() => processUserInput("No")}>No</button>
                            </div>
                        )}

                        {showingFAQs && (
                            <div className="faq-buttons">
                                <button onClick={() => handleFAQClick(1)} className="faq-button">
                                    1. Do you accept pets?
                                </button>
                                <button onClick={() => handleFAQClick(2)} className="faq-button">
                                    2. Do you provide free Wi-Fi?
                                </button>
                                <button onClick={() => handleFAQClick(3)} className="faq-button">
                                    3. What amenities are included in the room?
                                </button>
                                <button onClick={() => handleFAQClick(4)} className="faq-button">
                                    4. Do you offer loyalty or reward programs?
                                </button>
                                <button onClick={() => handleFAQClick(5)} className="faq-button">
                                    5. Do you have any special packages or promotions?
                                </button>
                                <button onClick={() => handleFAQClick(6)} className="faq-button">
                                    6. Where is your hotel located?
                                </button>
                            </div>
                        )}

                        <div ref={chatEndRef} /> 
                    </div>

                    {/* Chat input container outside the chat-box */}
                    {!waitingForContactInfo && (
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chatbot;