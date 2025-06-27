import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';

// Add translation object
const translations = {
  en: {
    dashboard: "Dashboard",
    roomDetails: "Room Details",
    listRooms: "List Rooms",
    selectRoom: "Select Room",
    createNewRoom: "Create New Room",
    noRooms: "No rooms available. Create a new room to start.",
    devBy: "Develop By Sokchan",
    roomManagement: "Room Management System",
    loading: "Loading application...",
    // ...add more as needed
  },
  kh: {
    dashboard: "ផ្ទាំងគ្រប់គ្រង",
    roomDetails: "ព័ត៌មានបន្ទប់",
    listRooms: "បញ្ជីបន្ទប់",
    selectRoom: "ជ្រើសរើសបន្ទប់",
    createNewRoom: "បង្កើតបន្ទប់ថ្មី",
    noRooms: "មិនមានបន្ទប់ទេ។ សូមបង្កើតបន្ទប់ថ្មីដើម្បីចាប់ផ្តើម។",
    devBy: "បង្កើតដោយ សុខចាន់",
    roomManagement: "ប្រព័ន្ធគ្រប់គ្រងបន្ទប់",
    loading: "កំពុងផ្ទុកកម្មវិធី...",
    // ...add more as needed
  }
};

// Create a context for API services
const ApiContext = createContext(null);

// RoomDetailsForm Component
const RoomDetailsForm = ({
  selectedRoomId, roomData,
  date, setDate,
  prevElectricityAmount, setPrevElectricityAmount,
  newElectricityAmount, setNewElectricityAmount,
  electricityRate, setElectricityRate,
  prevWaterAmount, setPrevWaterAmount,
  newWaterAmount, setNewWaterAmount,
  waterRate, setWaterRate,
  roomPrice, setRoomPrice,
  otherAmount, setOtherAmount,
  otherStatus, setOtherStatus,
  usedElectricity, electricityCost,
  usedWater, waterCost,
  totalElectWater, totalRiel,
  loadRoomData, roomsData
}) => {
  const { api } = useContext(ApiContext);
  const [showAlert, setShowAlert] = useState(false);

  // Modified Save Room Data to also save to history API
  const handleSaveRoom = async () => {
    if (!selectedRoomId) {
      console.error("No room selected.");
      return;
    }

    const roomToSave = {
      date: date,
      prevElectricityAmount: parseFloat(prevElectricityAmount),
      newElectricityAmount: parseFloat(newElectricityAmount),
      usedElectricity: usedElectricity,
      electricityCost: electricityCost,
      electricityRate: parseFloat(electricityRate),
      prevWaterAmount: parseFloat(prevWaterAmount),
      newWaterAmount: parseFloat(newWaterAmount),
      usedWater: usedWater,
      waterCost: waterCost,
      waterRate: parseFloat(waterRate),
      roomPrice: parseFloat(roomPrice),
      otherAmount: parseFloat(otherAmount),
      otherStatus: otherStatus,
      totalElectWater: totalElectWater,
      totalRiel: totalRiel,
      lastUpdated: new Date().toISOString()
    };

    try {
      // Save/update current room data
      await api.post(`/rooms/${selectedRoomId}`, roomToSave);
      // Save to history/archive
      await api.post(`/rooms-history`, { ...roomToSave, roomId: selectedRoomId });
      console.log(`Room ${selectedRoomId} data saved successfully!`);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    } catch (e) {
      console.error("Error saving room data: ", e);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl">
      {/* Popup Styled Alert */}
      {showAlert && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0,0,0,0.2)" }}
        >
          <div className="bg-green-100 border border-green-400 text-green-800 font-semibold px-8 py-6 rounded-xl shadow-2xl text-2xl text-center animate-bounce-in">
            Save data success
          </div>
        </div>
      )}
      <h2 className="text-3xl font-semibold mb-6 text-indigo-600">
        Details for {selectedRoomId.replace('room', 'Room ')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Date Input */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
          />
        </div>
        {/* Room Price Input */}
        <div>
          <label htmlFor="roomPrice" className="block text-sm font-medium text-gray-700 mb-1">Room Price ($)</label>
          <input
            type="number"
            id="roomPrice"
            value={roomPrice}
            onChange={(e) => setRoomPrice(parseFloat(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
          />
        </div>

        {/* Electricity Section */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 border-t pt-6 mt-6 border-gray-200">
          <div className="col-span-full text-xl font-medium text-indigo-500 mb-2">Electricity</div>
          <div>
            <label htmlFor="prevElec" className="block text-sm font-medium text-gray-700 mb-1">Previous Amount</label>
            <input
              type="number"
              id="prevElec"
              value={prevElectricityAmount}
              onChange={(e) => setPrevElectricityAmount(parseFloat(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="newElec" className="block text-sm font-medium text-gray-700 mb-1">New Amount</label>
            <input
              type="number"
              id="newElec"
              value={newElectricityAmount}
              onChange={(e) => setNewElectricityAmount(parseFloat(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="elecRate" className="block text-sm font-medium text-gray-700 mb-1">Rate per Unit ($)</label>
            <input
              type="number"
              id="elecRate"
              value={electricityRate}
              onChange={(e) => setElectricityRate(parseFloat(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            />
          </div>
          <div className="col-span-full">
            <p className="text-md font-semibold text-gray-800">Used: <span className="font-normal">{usedElectricity.toFixed(2)}</span> units</p>
            <p className="text-md font-semibold text-gray-800">Cost: <span className="font-normal">${electricityCost.toFixed(2)}</span></p>
          </div>
        </div>

        {/* Water Section */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 border-t pt-6 mt-6 border-gray-200">
          <div className="col-span-full text-xl font-medium text-indigo-500 mb-2">Water</div>
          <div>
            <label htmlFor="prevWater" className="block text-sm font-medium text-gray-700 mb-1">Previous Amount</label>
            <input
              type="number"
              id="prevWater"
              value={prevWaterAmount}
              onChange={(e) => setPrevWaterAmount(parseFloat(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="newWater" className="block text-sm font-medium text-gray-700 mb-1">New Amount</label>
            <input
              type="number"
              id="newWater"
              value={newWaterAmount}
              onChange={(e) => setNewWaterAmount(parseFloat(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="waterRate" className="block text-sm font-medium text-gray-700 mb-1">Rate per Unit ($)</label>
            <input
              type="number"
              id="waterRate"
              value={waterRate}
              onChange={(e) => setWaterRate(parseFloat(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            />
          </div>
          <div className="col-span-full">
            <p className="text-md font-semibold text-gray-800">Used: <span className="font-normal">{usedWater.toFixed(2)}</span> units</p>
            <p className="text-md font-semibold text-gray-800">Cost: <span className="font-normal">${waterCost.toFixed(2)}</span></p>
          </div>
        </div>

        {/* Other Charges */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6 mt-6 border-gray-200">
          <div className="col-span-full text-xl font-medium text-indigo-500 mb-2">Other Charges</div>
          <div>
            <label htmlFor="otherAmount" className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
            <input
              type="number"
              id="otherAmount"
              value={otherAmount}
              onChange={(e) => setOtherAmount(parseFloat(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="otherStatus" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="otherStatus"
              value={otherStatus}
              onChange={(e) => setOtherStatus(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Totals */}
      <div className="border-t pt-6 mt-6 border-gray-200">
        <h3 className="text-2xl font-bold mb-4 text-indigo-700">Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p className="text-lg font-semibold text-gray-900">TOTAL ELEC + WATER: <span className="text-indigo-600">${totalElectWater.toFixed(2)}</span></p>
          <p className="text-lg font-semibold text-gray-900">TOTAL RIEL: <span className="text-indigo-600">${totalRiel.toFixed(2)}</span></p>
          <p className="text-lg font-semibold text-gray-900">PAYMENT STATUS:
            <span className={`ml-2 px-3 py-1 rounded-full text-white text-sm font-bold ${otherStatus === 'Paid' ? 'bg-green-500' : 'bg-red-500'}`}>
              {otherStatus}
            </span>
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex space-x-4">
        <button
          onClick={handleSaveRoom}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 ease-in-out transform hover:scale-105"
        >
          Save Room Data
        </button>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('');
  // Add translation function and language from parent
  const [language] = useState(
    localStorage.getItem('room_language') || 'en'
  );
  const t = (key) => translations[language][key] || key;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/rooms-history');
        setHistoryData(Array.isArray(res.data) ? res.data : Object.values(res.data));
      } catch (e) {
        setHistoryData([]);
      }
      setLoading(false);
    };
    fetchHistory();
  }, []);

  // Get unique months from data for dropdown
  const monthOptions = Array.from(
    new Set(
      historyData
        .map(room => (room.date ? room.date.slice(0, 7) : null))
        .filter(Boolean)
    )
  ).sort((a, b) => b.localeCompare(a)); // Descending order

  // Filter historyData by selectedMonth
  const filteredData = selectedMonth
    ? historyData.filter(room => room.date && room.date.startsWith(selectedMonth))
    : historyData;

  // Aggregate stats from filteredData
  const totalRooms = filteredData.length;
  const pendingRooms = filteredData.filter(room => room.otherStatus === 'Pending');
  const paidRooms = filteredData.filter(room => room.otherStatus === 'Paid');
  const totalEstimatedIncome = filteredData.reduce((sum, room) => sum + parseFloat(room.roomPrice || 0), 0);
  const totalElectricityCost = filteredData.reduce((sum, room) => sum + parseFloat(room.electricityCost || 0), 0);
  const totalWaterCost = filteredData.reduce((sum, room) => sum + parseFloat(room.waterCost || 0), 0);
  const totalOtherAmount = filteredData.reduce((sum, room) => sum + parseFloat(room.otherAmount || 0), 0);
  const totalUtilitiesCost = totalElectricityCost + totalWaterCost;
  const totalExpectedRiel = filteredData.reduce((sum, room) => sum + parseFloat(room.totalRiel || 0), 0);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl">
      <h2 className="text-3xl font-semibold mb-6 text-indigo-600">Overall Dashboard</h2>
      {/* Month filter dropdown */}
      <div className="mb-6 flex items-center gap-4">
        <label className="font-medium text-gray-700">Select Month:</label>
        <select
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="">All</option>
          {monthOptions.map(month => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <img
            src={process.env.PUBLIC_URL + '/logo192.png'}
            alt="App Logo"
            className="w-24 h-24 mb-4 animate-bounce"
            style={{ objectFit: 'contain' }}
          />
          <div className="text-xl text-gray-700">{t('loading')}</div>
        </div>
      ) : totalRooms === 0 ? (
        <p className="text-xl text-gray-700">No rooms available. Please create a room to view dashboard statistics.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-blue-800">Total Records</h3>
              <p className="text-4xl font-bold text-blue-600">{totalRooms}</p>
            </div>
            <div className="bg-red-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-red-800">Pending Payment</h3>
              <p className="text-4xl font-bold text-red-600">{pendingRooms.length}</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-green-800">Paid Status</h3>
              <p className="text-4xl font-bold text-green-600">{paidRooms.length}</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-purple-800">Total Income (Room Prices)</h3>
              <p className="text-4xl font-bold text-purple-600">${totalEstimatedIncome.toFixed(2)}</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-yellow-800">Total Utility Costs</h3>
              <p className="text-4xl font-bold text-yellow-600">${totalUtilitiesCost.toFixed(2)}</p>
            </div>
            <div className="bg-teal-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-teal-800">Total Other Charges</h3>
              <p className="text-4xl font-bold text-teal-600">${totalOtherAmount.toFixed(2)}</p>
            </div>
            <div className="bg-indigo-50 p-6 rounded-lg shadow-sm md:col-span-full">
              <h3 className="text-lg font-medium text-indigo-800">Total Expected Collection</h3>
              <p className="text-4xl font-bold text-indigo-600">${totalExpectedRiel.toFixed(2)}</p>
            </div>
          </div>
          {pendingRooms.length > 0 && (
            <div className="mt-8">
              <h3 className="text-2xl font-semibold mb-4 text-red-600">Pending Payments</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {pendingRooms.map(room => (
                  <li key={room._id} className="bg-white p-4 rounded-lg shadow-md border border-red-200">
                    <p className="font-bold text-lg text-red-700">
                      room:{room.roomId || room.id || room._id}
                    </p>
                    <p className="text-sm text-gray-700">Total Due: <span className="font-semibold">${(room.totalRiel || 0).toFixed(2)}</span></p>
                    <p className="text-xs text-gray-500">Last Updated: {room.date || 'N/A'}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Add a new ListRooms component that fetches its own data
const ListRooms = () => {
  const [roomsData, setRoomsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [selectedMonth, setSelectedMonth] = useState('');
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [viewAll, setViewAll] = useState(false); // <-- Add a toggle for "view info all"
  const [searchRoomId, setSearchRoomId] = useState(''); // <-- Add search state
  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 10000
  });

  const fetchRooms = async () => {
    try {
      const res = await api.get('/rooms-history');
      setRoomsData(Array.isArray(res.data) ? res.data : Object.values(res.data));
    } catch (e) {
      setRoomsData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRooms();
    // eslint-disable-next-line
  }, []);

  // Filter rooms by selected month and searchRoomId
  useEffect(() => {
    let filtered = roomsData;
    if (selectedMonth) {
      filtered = filtered.filter(room =>
        room.date && room.date.startsWith(selectedMonth)
      );
    }
    if (searchRoomId.trim()) {
      filtered = filtered.filter(room => {
        const roomId = (room.roomId || room.id || '').toString().toLowerCase();
        return roomId.includes(searchRoomId.trim().toLowerCase());
      });
    }
    setFilteredRooms(filtered);
  }, [roomsData, selectedMonth, searchRoomId]);

  // Group rooms by roomId for "view info all"
  const groupedByRoomId = filteredRooms.reduce((acc, room) => {
    const key = room.roomId || room.id || '';
    if (!acc[key]) acc[key] = [];
    acc[key].push(room);
    return acc;
  }, {});

  // Get unique months from data for dropdown
  const monthOptions = Array.from(
    new Set(
      roomsData
        .map(room => (room.date ? room.date.slice(0, 7) : null))
        .filter(Boolean)
    )
  ).sort((a, b) => b.localeCompare(a)); // Descending order

  const handleEdit = (room) => {
    setEditId(room._id);
    setEditValues({ ...room });
  };

  const handleEditChange = (field, value) => {
    setEditValues((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      await api.put(`/rooms-history/${editId}`, editValues);
      setEditId(null);
      setEditValues({});
      fetchRooms();
    } catch (e) {
      alert('Failed to update room history');
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setEditValues({});
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await api.delete(`/rooms-history/${id}`);
      fetchRooms();
    } catch (e) {
      alert('Failed to delete room history');
    }
  };

  // Add translation function and language from parent
  const [language] = useState(
    localStorage.getItem('room_language') || 'en'
  );
  const t = (key) => translations[language][key] || key;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl">
      <h2 className="text-3xl font-semibold mb-6 text-indigo-600">Room List</h2>
      {/* Month select filter, search, and view all toggle */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <label className="font-medium text-gray-700">Select Month:</label>
        <select
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="">All</option>
          {monthOptions.map(month => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
        {/* Search by Room ID */}
        <input
          type="text"
          placeholder="Search Room ID"
          value={searchRoomId}
          onChange={e => setSearchRoomId(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
          style={{ minWidth: 150 }}
        />
        <label className="flex items-center ml-4">
          <input
            type="checkbox"
            checked={viewAll}
            onChange={e => setViewAll(e.target.checked)}
            className="mr-2"
          />
          View info all (group by room)
        </label>
      </div>
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <img
            src={process.env.PUBLIC_URL + '/logo192.png'}
            alt="App Logo"
            className="w-24 h-24 mb-4 animate-bounce"
            style={{ objectFit: 'contain' }}
          />
          <div className="text-xl text-gray-700">{t('loading')}</div>
        </div>
      ) : filteredRooms.length === 0 ? (
        <p className="text-xl text-gray-700">No rooms available.</p>
      ) : viewAll ? (
        // Grouped by roomId view
        <div>
          {Object.keys(groupedByRoomId).sort((a, b) => parseInt(a) - parseInt(b)).map((roomId, idx) => (
            <div key={roomId} className="mb-8">
              {/* Add colored header for each room group */}
              <div
                className={`text-2xl font-bold mb-2 px-4 py-2 rounded-lg`}
                style={{
                  background: [
                    "#e0e7ff", // indigo-100
                    "#fef9c3", // yellow-100
                    "#bbf7d0", // green-100
                    "#fca5a5", // red-300
                    "#fcd34d", // yellow-300
                    "#a5b4fc", // indigo-300
                    "#f9a8d4", // pink-300
                    "#fdba74", // orange-300
                  ][idx % 8],
                  color: "#3730a3" // indigo-800
                }}
              >
                Room {roomId}
              </div>
              <ul className="divide-y divide-gray-200">
                {groupedByRoomId[roomId].map((room) => {
                  const isEditing = editId === room._id;
                  return (
                    <li key={room._id} className="py-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-lg text-indigo-700">{room.date || '-'}</span>
                        <span className={`px-3 py-1 rounded-full text-white text-sm font-bold ${room.otherStatus === 'Paid' ? 'bg-green-500' : 'bg-red-500'}`}>
                          {isEditing ? (
                            <select
                              value={editValues.otherStatus}
                              onChange={e => handleEditChange('otherStatus', e.target.value)}
                              className="text-black"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Paid">Paid</option>
                            </select>
                          ) : (
                            room.otherStatus
                          )}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-700">
                        <div>
                          <span className="font-semibold">Room Price:</span>{' '}
                          {isEditing ? (
                            <input
                              type="number"
                              value={editValues.roomPrice ?? 0}
                              onChange={e => handleEditChange('roomPrice', parseFloat(e.target.value))}
                              className="border rounded px-1"
                            />
                          ) : (
                            `$${room.roomPrice ?? 0}`
                          )}
                        </div>
                        <div>
                          <span className="font-semibold">Other Amount:</span>{' '}
                          {isEditing ? (
                            <input
                              type="number"
                              value={editValues.otherAmount ?? 0}
                              onChange={e => handleEditChange('otherAmount', parseFloat(e.target.value))}
                              className="border rounded px-1"
                            />
                          ) : (
                            `$${room.otherAmount ?? 0}`
                          )}
                        </div>
                        <div>
                          <span className="font-semibold">Electricity Used:</span>{' '}
                          {isEditing ? (
                            <input
                              type="number"
                              value={editValues.usedElectricity ?? 0}
                              onChange={e => handleEditChange('usedElectricity', parseFloat(e.target.value))}
                              className="border rounded px-1"
                            />
                          ) : (
                            `${room.usedElectricity ?? 0} units`
                          )}
                        </div>
                        <div>
                          <span className="font-semibold">Electricity Cost:</span>{' '}
                          {isEditing ? (
                            <input
                              type="number"
                              value={editValues.electricityCost ?? 0}
                              onChange={e => handleEditChange('electricityCost', parseFloat(e.target.value))}
                              className="border rounded px-1"
                            />
                          ) : (
                            `$${room.electricityCost ?? 0}`
                          )}
                        </div>
                        <div>
                          <span className="font-semibold">Water Used:</span>{' '}
                          {isEditing ? (
                            <input
                              type="number"
                              value={editValues.usedWater ?? 0}
                              onChange={e => handleEditChange('usedWater', parseFloat(e.target.value))}
                              className="border rounded px-1"
                            />
                          ) : (
                            `${room.usedWater ?? 0} units`
                          )}
                        </div>
                        <div>
                          <span className="font-semibold">Water Cost:</span>{' '}
                          {isEditing ? (
                            <input
                              type="number"
                              value={editValues.waterCost ?? 0}
                              onChange={e => handleEditChange('waterCost', parseFloat(e.target.value))}
                              className="border rounded px-1"
                            />
                          ) : (
                            `$${room.waterCost ?? 0}`
                          )}
                        </div>
                        <div>
                          <span className="font-semibold">Total Elec+Water:</span>{' '}
                          {isEditing ? (
                            <input
                              type="number"
                              value={editValues.totalElectWater ?? 0}
                              onChange={e => handleEditChange('totalElectWater', parseFloat(e.target.value))}
                              className="border rounded px-1"
                            />
                          ) : (
                            `$${room.totalElectWater ?? 0}`
                          )}
                        </div>
                        <div>
                          <span className="font-semibold">Total Riel:</span>{' '}
                          {isEditing ? (
                            <input
                              type="number"
                              value={editValues.totalRiel ?? 0}
                              onChange={e => handleEditChange('totalRiel', parseFloat(e.target.value))}
                              className="border rounded px-1"
                            />
                          ) : (
                            `$${room.totalRiel ?? 0}`
                          )}
                        </div>
                        <div>
                          <span className="font-semibold">Last Updated:</span>{' '}
                          {isEditing ? (
                            <input
                              type="date"
                              value={editValues.lastUpdated ? editValues.lastUpdated.split('T')[0] : ''}
                              onChange={e => handleEditChange('lastUpdated', e.target.value)}
                              className="border rounded px-1"
                            />
                          ) : (
                            room.lastUpdated ? room.lastUpdated.split('T')[0] : '-'
                          )}
                        </div>
                      </div>
                      <div className="mt-2 flex gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={handleSave}
                              className="px-3 py-1 bg-green-500 text-white rounded"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancel}
                              className="px-3 py-1 bg-gray-300 text-black rounded"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(room)}
                              className="px-3 py-1 bg-blue-500 text-white rounded"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(room._id)}
                              className="px-3 py-1 bg-red-500 text-white rounded"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        // Default flat list view
        <ul className="divide-y divide-gray-200">
          {filteredRooms.map((room) => {
            const roomId = room.roomId || room.id || '';
            const isEditing = editId === room._id;
            return (
              <li key={room._id} className="py-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg text-indigo-700">{String(roomId).replace('room', 'Room ')}</span>
                  <span className={`px-3 py-1 rounded-full text-white text-sm font-bold ${room.otherStatus === 'Paid' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {isEditing ? (
                      <select
                        value={editValues.otherStatus}
                        onChange={e => handleEditChange('otherStatus', e.target.value)}
                        className="text-black"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                      </select>
                    ) : (
                      room.otherStatus
                    )}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-700">
                  <div>
                    <span className="font-semibold">Date:</span>{' '}
                    {isEditing ? (
                      <input
                        type="date"
                        value={editValues.date || ''}
                        onChange={e => handleEditChange('date', e.target.value)}
                        className="border rounded px-1"
                      />
                    ) : (
                      room.date || '-'
                    )}
                  </div>
                  <div>
                    <span className="font-semibold">Room Price:</span>{' '}
                    {isEditing ? (
                      <input
                        type="number"
                        value={editValues.roomPrice ?? 0}
                        onChange={e => handleEditChange('roomPrice', parseFloat(e.target.value))}
                        className="border rounded px-1"
                      />
                    ) : (
                      `$${room.roomPrice ?? 0}`
                    )}
                  </div>
                  <div>
                    <span className="font-semibold">Other Amount:</span>{' '}
                    {isEditing ? (
                      <input
                        type="number"
                        value={editValues.otherAmount ?? 0}
                        onChange={e => handleEditChange('otherAmount', parseFloat(e.target.value))}
                        className="border rounded px-1"
                      />
                    ) : (
                      `$${room.otherAmount ?? 0}`
                    )}
                  </div>
                  <div>
                    <span className="font-semibold">Electricity Used:</span>{' '}
                    {isEditing ? (
                      <input
                        type="number"
                        value={editValues.usedElectricity ?? 0}
                        onChange={e => handleEditChange('usedElectricity', parseFloat(e.target.value))}
                        className="border rounded px-1"
                      />
                    ) : (
                      `${room.usedElectricity ?? 0} units`
                    )}
                  </div>
                  <div>
                    <span className="font-semibold">Electricity Cost:</span>{' '}
                    {isEditing ? (
                      <input
                        type="number"
                        value={editValues.electricityCost ?? 0}
                        onChange={e => handleEditChange('electricityCost', parseFloat(e.target.value))}
                        className="border rounded px-1"
                      />
                    ) : (
                      `$${room.electricityCost ?? 0}`
                    )}
                  </div>
                  <div>
                    <span className="font-semibold">Water Used:</span>{' '}
                    {isEditing ? (
                      <input
                        type="number"
                        value={editValues.usedWater ?? 0}
                        onChange={e => handleEditChange('usedWater', parseFloat(e.target.value))}
                        className="border rounded px-1"
                      />
                    ) : (
                      `${room.usedWater ?? 0} units`
                    )}
                  </div>
                  <div>
                    <span className="font-semibold">Water Cost:</span>{' '}
                    {isEditing ? (
                      <input
                        type="number"
                        value={editValues.waterCost ?? 0}
                        onChange={e => handleEditChange('waterCost', parseFloat(e.target.value))}
                        className="border rounded px-1"
                      />
                    ) : (
                      `$${room.waterCost ?? 0}`
                    )}
                  </div>
                  <div>
                    <span className="font-semibold">Total Elec+Water:</span>{' '}
                    {isEditing ? (
                      <input
                        type="number"
                        value={editValues.totalElectWater ?? 0}
                        onChange={e => handleEditChange('totalElectWater', parseFloat(e.target.value))}
                        className="border rounded px-1"
                      />
                    ) : (
                      `$${room.totalElectWater ?? 0}`
                    )}
                  </div>
                  <div>
                    <span className="font-semibold">Total Riel:</span>{' '}
                    {isEditing ? (
                      <input
                        type="number"
                        value={editValues.totalRiel ?? 0}
                        onChange={e => handleEditChange('totalRiel', parseFloat(e.target.value))}
                        className="border rounded px-1"
                      />
                    ) : (
                      `$${room.totalRiel ?? 0}`
                    )}
                  </div>
                  <div>
                    <span className="font-semibold">Last Updated:</span>{' '}
                    {isEditing ? (
                      <input
                        type="date"
                        value={editValues.lastUpdated ? editValues.lastUpdated.split('T')[0] : ''}
                        onChange={e => handleEditChange('lastUpdated', e.target.value)}
                        className="border rounded px-1"
                      />
                    ) : (
                      room.lastUpdated ? room.lastUpdated.split('T')[0] : '-'
                    )}
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="px-3 py-1 bg-green-500 text-white rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-3 py-1 bg-gray-300 text-black rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(room)}
                        className="px-3 py-1 bg-blue-500 text-white rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(room._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

// Main RoomForm Component
const RoomForm = () => {
  const [roomsData, setRoomsData] = useState({});
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [currentView, setCurrentView] = useState('rooms');
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState('en'); // Add language state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Room form state
  const [date, setDate] = useState('');
  const [prevElectricityAmount, setPrevElectricityAmount] = useState(0);
  const [newElectricityAmount, setNewElectricityAmount] = useState(0);
  const [electricityRate, setElectricityRate] = useState(0.25);
  const [prevWaterAmount, setPrevWaterAmount] = useState(0);
  const [newWaterAmount, setNewWaterAmount] = useState(0);
  const [waterRate, setWaterRate] = useState(0.005);
  const [roomPrice, setRoomPrice] = useState(300);
  const [otherAmount, setOtherAmount] = useState(0);
  const [otherStatus, setOtherStatus] = useState('Pending');

  // Calculated values
  const usedElectricity = newElectricityAmount - prevElectricityAmount;
  const electricityCost = usedElectricity > 0 ? usedElectricity * electricityRate : 0;
  const usedWater = newWaterAmount - prevWaterAmount;
  const waterCost = usedWater > 0 ? usedWater * waterRate : 0;
  const totalElectWater = electricityCost + waterCost;
  const totalRiel = totalElectWater + parseFloat(roomPrice) + parseFloat(otherAmount);

  // API client configuration
  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 10000
  });

  // Fetch all rooms data
  const fetchRoomsData = async () => {
    try {
      const response = await api.get('/rooms');
      setRoomsData(response.data);
      // Set default selected room if available
      const roomIds = Object.keys(response.data);
      if (roomIds.length > 0 && !selectedRoomId) {
        setSelectedRoomId(roomIds[0]);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching rooms data:", error);
      setIsLoading(false);
    }
  };

  // Create a new room
  const handleCreateRoom = async () => {
    const roomId = prompt('Enter new room ID (e.g., room101):');
    if (!roomId) return;
    try {
      await api.post('/rooms', { roomId });
      await fetchRoomsData(); // Refresh room data
      setSelectedRoomId(roomId); // Select the newly created room
      console.log(`Room ${roomId} created successfully!`);
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create room. It may already exist or there was a server error.');
    }
  };

  // Helper for translation
  const t = (key) => translations[language][key] || key;

  // Fetch initial data
  useEffect(() => {
    fetchRoomsData();
  }, []);

  // Load selected room data when selectedRoomId or roomsData changes
  useEffect(() => {
    if (selectedRoomId && roomsData[selectedRoomId]) {
      loadRoomData(roomsData[selectedRoomId]);
    } else {
      resetForm();
    }
  }, [selectedRoomId, roomsData]);

  const loadRoomData = (room) => {
    setDate(room.date || '');
    setPrevElectricityAmount(room.prevElectricityAmount || 0);
    setNewElectricityAmount(room.newElectricityAmount || 0);
    setElectricityRate(room.electricityRate || 0.25);
    setPrevWaterAmount(room.prevWaterAmount || 0);
    setNewWaterAmount(room.newWaterAmount || 0);
    setWaterRate(room.waterRate || 0.005);
    setRoomPrice(room.roomPrice || 0);
    setOtherAmount(room.otherAmount || 0);
    setOtherStatus(room.otherStatus || 'Pending');
  };

  const resetForm = () => {
    setDate('');
    setPrevElectricityAmount(0);
    setNewElectricityAmount(0);
    setElectricityRate(0.25);
    setPrevWaterAmount(0);
    setNewWaterAmount(0);
    setWaterRate(0.005);
    setRoomPrice(0);
    setOtherAmount(0);
    setOtherStatus('Pending');
  };

  // Generate room numbers dynamically from existing rooms
  const generateRoomNumbers = () => {
    return Object.keys(roomsData).sort((a, b) => {
      const numA = parseInt(a.replace('room', '')) || 0;
      const numB = parseInt(b.replace('room', '')) || 0;
      return numA - numB;
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <img
          src={process.env.PUBLIC_URL + '/logo192.png'}
          alt="App Logo"
          className="w-24 h-24 mb-4 animate-bounce"
          style={{ objectFit: 'contain' }}
        />
        <div className="text-xl text-gray-700">{t('loading')}</div>
      </div>
    );
  }

  return (
    <ApiContext.Provider value={{ api }}>
      <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-inter text-gray-800">
        {/* Topbar for mobile */}
        <div className="md:hidden flex items-center justify-between bg-white px-4 py-2 shadow z-30">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="text-2xl font-bold text-indigo-700 focus:outline-none"
            aria-label="Open menu"
          >
            &#9776;
          </button>
          <span className="text-lg font-bold text-indigo-700">Sokchan DEV</span>
          <div style={{ width: 32 }} /> {/* Spacer for symmetry */}
        </div>
        {/* Sidebar for Room Selection and Navigation */}
        {/* Overlay for mobile menu */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
        <aside
          className={`
            fixed md:static z-50 md:z-20
            top-0 left-0 h-full w-64 bg-white p-4 shadow-lg
            rounded-none md:rounded-r-xl flex flex-col
            transition-transform duration-200 ease-in-out
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0
          `}
          style={{ minHeight: 'auto' }}
        >
          {/* Close button for mobile */}
          <div className="md:hidden flex justify-between items-center mb-2">
            <span className="text-xl font-bold text-indigo-700">Sokchan DEV</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl font-bold text-indigo-700 focus:outline-none"
              aria-label="Close menu"
            >
              &times;
            </button>
          </div>
          {/* Language toggle */}
          <div className="flex justify-end mb-2 w-full">
            <button
              onClick={() => setLanguage(language === 'en' ? 'kh' : 'en')}
              className="px-3 py-1 rounded bg-indigo-100 text-indigo-700 font-bold text-sm"
            >
              {language === 'en' ? 'ភាសាខ្មែរ' : 'English'}
            </button>
          </div>
          <h2 className="hidden md:block text-xl md:text-2xl font-bold mb-4 md:mb-6 text-indigo-700 w-full text-left">Sokchan DEV</h2>
          <nav className="mb-4 md:mb-8 w-full flex flex-col gap-0">
            <button
              onClick={() => { setCurrentView('dashboard'); setMobileMenuOpen(false); }}
              className={`w-full text-left p-3 rounded-lg font-medium mb-2 transition-all duration-200 ease-in-out
                          ${currentView === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-md transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
                }`}
            >
              {/* Dashboard Icon */}
              <span className="inline-block align-middle mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6m-6 0v6m0 0H7m6 0h6" />
                </svg>
              </span>
              {t('dashboard')}
            </button>
            <button
              onClick={() => { setCurrentView('rooms'); setMobileMenuOpen(false); }}
              className={`w-full text-left p-3 rounded-lg font-medium mb-2 transition-all duration-200 ease-in-out
                          ${currentView === 'rooms'
                  ? 'bg-indigo-600 text-white shadow-md transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
                }`}
            >
              {/* Room Details Icon */}
              <span className="inline-block align-middle mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7V4a1 1 0 011-1h3m10 0a1 1 0 011 1v3m0 10v3a1 1 0 01-1 1h-3m-10 0a1 1 0 01-1-1v-3m16-8H4m16 0a2 2 0 00-2-2H6a2 2 0 00-2 2m16 0v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7" />
                </svg>
              </span>
              {t('roomDetails')}
            </button>
            <button
              onClick={() => { setCurrentView('listRooms'); setMobileMenuOpen(false); }}
              className={`w-full text-left p-3 rounded-lg font-medium transition-all duration-200 ease-in-out
                          ${currentView === 'listRooms'
                  ? 'bg-indigo-600 text-white shadow-md transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
                }`}
            >
              {/* List Rooms Icon */}
              <span className="inline-block align-middle mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </span>
              {t('listRooms')}
            </button>
          </nav>
          {currentView === 'rooms' && (
            <div className="w-full">
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-4 text-indigo-700">{t('selectRoom')}</h3>
              <button
                onClick={handleCreateRoom}
                className="w-full text-left p-2 md:p-3 rounded-lg font-medium bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 transition-all duration-200 ease-in-out mb-2 md:mb-4"
              >
                {/* Create New Room Icon */}
                <span className="inline-block align-middle mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </span>
                {t('createNewRoom')}
              </button>
              {generateRoomNumbers().length === 0 ? (
                <p className="text-sm text-gray-600">{t('noRooms')}</p>
              ) : (
                <div
                  className="grid grid-cols-3 gap-2 flex-grow pr-2 max-h-32 md:max-h-[350px] overflow-y-auto"
                >
                  {generateRoomNumbers().map((roomId) => (
                    <button
                      key={roomId}
                      onClick={() => { setSelectedRoomId(roomId); setMobileMenuOpen(false); }}
                      className={`p-2 md:p-3 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 ease-in-out
                                  ${selectedRoomId === roomId
                          ? 'bg-indigo-600 text-white shadow-md transform scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
                        }`}
                    >
                      {roomId.replace('room', 'R ')}
                      {roomsData[roomId]?.otherStatus === 'Pending' && (
                        <span className="ml-1 text-red-400 text-xs">●</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="mt-auto pt-2 md:pt-4 border-t border-gray-200 text-xs md:text-sm text-gray-500 w-full text-center md:text-left">
            <p>{t('devBy')}</p>
          </div>
        </aside>
        {/* Main Content Area */}
        <main className="flex-1 p-2 md:p-8 w-full max-w-full overflow-x-auto">
          <h1 className="text-2xl md:text-4xl font-extrabold mb-4 md:mb-8 text-indigo-800">
            {t('roomManagement')}
          </h1>
          {currentView === 'rooms' ? (
            Object.keys(roomsData).length > 0 && selectedRoomId ? (
              <RoomDetailsForm
                selectedRoomId={selectedRoomId}
                roomData={roomsData[selectedRoomId]}
                date={date} setDate={setDate}
                prevElectricityAmount={prevElectricityAmount} setPrevElectricityAmount={setPrevElectricityAmount}
                newElectricityAmount={newElectricityAmount} setNewElectricityAmount={setNewElectricityAmount}
                electricityRate={electricityRate} setElectricityRate={setElectricityRate}
                prevWaterAmount={prevWaterAmount} setPrevWaterAmount={setPrevWaterAmount}
                newWaterAmount={newWaterAmount} setNewWaterAmount={setNewWaterAmount}
                waterRate={waterRate} setWaterRate={setWaterRate}
                roomPrice={roomPrice} setRoomPrice={setRoomPrice}
                otherAmount={otherAmount} setOtherAmount={setOtherAmount}
                otherStatus={otherStatus} setOtherStatus={setOtherStatus}
                usedElectricity={usedElectricity} electricityCost={electricityCost}
                usedWater={usedWater} waterCost={waterCost}
                totalElectWater={totalElectWater} totalRiel={totalRiel}
                loadRoomData={loadRoomData}
                roomsData={roomsData}
              />
            ) : (
              <div className="text-base md:text-xl text-gray-700">No rooms available. Please create a room to manage details.</div>
            )
          ) : currentView === 'dashboard' ? (
            <Dashboard />
          ) : currentView === 'listRooms' ? (
            <ListRooms />
          ) : null}
        </main>
      </div>
    </ApiContext.Provider>
  );
};

export default RoomForm;

/* Add this animation to your global CSS (e.g., index.css or App.css) if you want a bounce-in effect:
@keyframes bounce-in {
  0% { transform: scale(0.7); opacity: 0; }
  60% { transform: scale(1.05); opacity: 1; }
  80% { transform: scale(0.95); }
  100% { transform: scale(1); }
}
.animate-bounce-in {
  animation: bounce-in 0.5s;
}
*/