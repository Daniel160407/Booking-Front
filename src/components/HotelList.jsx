import axios from "axios";
import {useEffect, useState} from "react";
import '../style/HotelList.scss';

function HotelList() {
    const [hotelData, setHotelData] = useState({hotels: []});
    const [roomData, setRoomData] = useState({rooms: []});
    const [showRooms, setShowRooms] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState('');
    const [selectedRoom, setSelectedRoom] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8080/Booking/hotels')
            .then(response => {
                setHotelData(response.data);
            });
    }, []);

    function showHotelRooms(hotelName) {
        axios.get(`http://localhost:8080/Booking/rooms?hotelName=${hotelName}`)
            .then(response => {
                setRoomData(response.data);
            });
        setShowRooms(true);
        setSelectedHotel(hotelName);
    }

    function chooseRoom(hotelName, roomName) {


        axios.put(`http://localhost:8080/Booking/hotels?name=${hotelName}`)
            .then(response => {
                console.log(response.data);
                setHotelData(response.data);
                if (response.status != 403) {
                    axios.put(`http://localhost:8080/Booking/rooms`, {
                        name: roomName,
                        hotelName: hotelName,
                        roomState: 'RESERVED'
                    });
                }
            });


    }

    function handleSubmit() {
        chooseRoom(selectedHotel, selectedRoom);
        setShowRooms(false);
    }

    return (
        <div id="hotelList">
            <div id="header">
                <h1>Booking</h1>
            </div>
            {hotelData.hotels.length > 0 && (
                <ul>
                    {hotelData.hotels.map(hotel => (
                        <li key={hotel.name}
                            onClick={() => showHotelRooms(hotel.name)}>{hotel.name} {hotel.currentMembers}/{hotel.maxMembers}</li>
                    ))}
                </ul>
            )}

            {showRooms && (
                <div id="hotelData">
                    <div id="hotelInfo">
                        <div id="hotelName">
                            <h1>{selectedHotel}</h1>
                        </div>
                        {roomData.rooms.length > 0 && (
                            <select id="roomList" value={""} onChange={(e) => setSelectedRoom(e.target.value)}>
                                <option disabled value="">Select a room</option>
                                {roomData.rooms.map(room => (
                                    <option key={room.name}>{room.name}</option>
                                ))}
                            </select>
                        )}
                        <div id="submit">
                            <button type="submit" onClick={handleSubmit} disabled={!selectedRoom}>Submit</button>
                        </div>
                    </div>
                </div>

            )}
        </div>
    );
}

export default HotelList;
