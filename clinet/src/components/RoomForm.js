import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import styled from 'styled-components';

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
    selectMonth: "Select Month",
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
    selectMonth: "ជ្រើសរើសខែ",
    // ...add more as needed
  }
};

// Create a context for API services
const ApiContext = createContext(null);

// JWT token from environment variable (define ONCE at the top)
const JWT_TOKEN = process.env.REACT_APP_JWT_TOKEN;

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
  loadRoomData, roomsData,
  setSelectedRoomId, handleCreateRoom
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
    <div className="bg-white rounded-t-3xl shadow-xl max-w-md mx-auto mt-2 pb-4" style={{
      minHeight: 'calc(100vh - 120px)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
      borderTop: '6px solid #6366f1',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Room selector and add button - mobile style */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex-1">
          <select
            id="roomSelect"
            value={selectedRoomId}
            onChange={e => setSelectedRoomId(e.target.value)}
            className="w-full rounded-xl border border-indigo-200 px-3 py-2 text-lg font-semibold text-indigo-700 bg-indigo-50 focus:ring-2 focus:ring-indigo-400"
            style={{ minWidth: 120 }}
          >
            {Object.keys(roomsData).sort((a, b) => {
              const numA = parseInt(a.replace('room', '')) || 0;
              const numB = parseInt(b.replace('room', '')) || 0;
              return numA - numB;
            }).map(roomId => (
              <option key={roomId} value={roomId}>
                {roomId.replace('room', 'Room ')}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={handleCreateRoom}
          className="ml-3 px-4 py-2 rounded-xl bg-green-500 text-white font-bold text-lg shadow-md active:bg-green-600"
          style={{ minWidth: 44 }}
        >
          +
        </button>
      </div>
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
      <div className="px-4">
        <h2 className="text-2xl font-bold mb-4 text-indigo-600 text-center">
          {selectedRoomId ? `Details for ${selectedRoomId.replace('room', 'Room ')}` : 'Select Room'}
        </h2>
        <div className="grid grid-cols-1 gap-4 mb-4">
          {/* Date Input */}
          <div className="flex flex-col">
            <label htmlFor="date" className="text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            />
          </div>
          {/* Room Price Input */}
          <div className="flex flex-col">
            <label htmlFor="roomPrice" className="text-sm font-medium text-gray-700 mb-1">Room Price ($)</label>
            <input
              type="number"
              id="roomPrice"
              value={roomPrice}
              onChange={(e) => setRoomPrice(parseFloat(e.target.value))}
              className="rounded-lg border border-gray-300 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            />
          </div>
        </div>
        {/* Electricity Section */}
        <div className="rounded-xl bg-indigo-50 p-4 mb-4">
          <div className="text-lg font-semibold text-indigo-500 mb-2">Electricity</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <label htmlFor="prevElec" className="text-xs font-medium text-gray-700 mb-1">Previous</label>
              <input
                type="number"
                id="prevElec"
                value={prevElectricityAmount}
                onChange={(e) => setPrevElectricityAmount(parseFloat(e.target.value))}
                className="rounded-lg border border-gray-300 px-2 py-1"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="newElec" className="text-xs font-medium text-gray-700 mb-1">New</label>
              <input
                type="number"
                id="newElec"
                value={newElectricityAmount}
                onChange={(e) => setNewElectricityAmount(parseFloat(e.target.value))}
                className="rounded-lg border border-gray-300 px-2 py-1"
              />
            </div>
            <div className="flex flex-col col-span-2">
              <label htmlFor="elecRate" className="text-xs font-medium text-gray-700 mb-1">Rate ($/unit)</label>
              <input
                type="number"
                id="elecRate"
                value={electricityRate}
                onChange={(e) => setElectricityRate(parseFloat(e.target.value))}
                className="rounded-lg border border-gray-300 px-2 py-1"
              />
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span>Used: <span className="font-bold">{usedElectricity.toFixed(2)}</span> units</span>
            <span>Cost: <span className="font-bold text-indigo-600">${electricityCost.toFixed(2)}</span></span>
          </div>
        </div>
        {/* Water Section */}
        <div className="rounded-xl bg-blue-50 p-4 mb-4">
          <div className="text-lg font-semibold text-blue-500 mb-2">Water</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <label htmlFor="prevWater" className="text-xs font-medium text-gray-700 mb-1">Previous</label>
              <input
                type="number"
                id="prevWater"
                value={prevWaterAmount}
                onChange={(e) => setPrevWaterAmount(parseFloat(e.target.value))}
                className="rounded-lg border border-gray-300 px-2 py-1"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="newWater" className="text-xs font-medium text-gray-700 mb-1">New</label>
              <input
                type="number"
                id="newWater"
                value={newWaterAmount}
                onChange={(e) => setNewWaterAmount(parseFloat(e.target.value))}
                className="rounded-lg border border-gray-300 px-2 py-1"
              />
            </div>
            <div className="flex flex-col col-span-2">
              <label htmlFor="waterRate" className="text-xs font-medium text-gray-700 mb-1">Rate ($/unit)</label>
              <input
                type="number"
                id="waterRate"
                value={waterRate}
                onChange={(e) => setWaterRate(parseFloat(e.target.value))}
                className="rounded-lg border border-gray-300 px-2 py-1"
              />
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span>Used: <span className="font-bold">{usedWater.toFixed(2)}</span> units</span>
            <span>Cost: <span className="font-bold text-blue-600">${waterCost.toFixed(2)}</span></span>
          </div>
        </div>
        {/* Other Charges */}
        <div className="rounded-xl bg-gray-50 p-4 mb-4">
          <div className="text-lg font-semibold text-gray-700 mb-2">Other Charges</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <label htmlFor="otherAmount" className="text-xs font-medium text-gray-700 mb-1">Amount ($)</label>
              <input
                type="number"
                id="otherAmount"
                value={otherAmount}
                onChange={(e) => setOtherAmount(parseFloat(e.target.value))}
                className="rounded-lg border border-gray-300 px-2 py-1"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="otherStatus" className="text-xs font-medium text-gray-700 mb-1">Status</label>
              <select
                id="otherStatus"
                value={otherStatus}
                onChange={(e) => setOtherStatus(e.target.value)}
                className="rounded-lg border border-gray-300 px-2 py-1"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>
        </div>
        {/* Totals */}
        <div className="rounded-xl bg-indigo-100 p-4 mb-4">
          <h3 className="text-lg font-bold mb-2 text-indigo-700 text-center">Summary</h3>
          <div className="flex flex-col gap-1 text-base">
            <span>TOTAL ELEC + WATER: <span className="text-indigo-600 font-bold">${totalElectWater.toFixed(2)}</span></span>
            <span>TOTAL RIEL: <span className="text-indigo-600 font-bold">${totalRiel.toFixed(2)}</span></span>
            <span>PAYMENT STATUS:
              <span className={`ml-2 px-3 py-1 rounded-full text-white text-sm font-bold ${otherStatus === 'Paid' ? 'bg-green-500' : 'bg-red-500'}`}>
                {otherStatus}
              </span>
            </span>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleSaveRoom}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 ease-in-out text-lg"
          >
            Save Room Data
          </button>
        </div>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [language] = useState(
    localStorage.getItem('room_language') || 'en'
  );
  const t = (key) => translations[language][key] || key;

  const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 10000,
    headers: {
      Authorization: `Bearer ${JWT_TOKEN}`
    }
  });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/rooms-history');
        setHistoryData(Array.isArray(res.data) ? res.data : Object.values(res.data));
      } catch (e) {
        setHistoryData([]);
      }
      setLoading(false);
    };
    fetchHistory();
  }, []);

  const monthOptions = Array.from(
    new Set(
      historyData
        .map(room => (room.date ? room.date.slice(0, 7) : null))
        .filter(Boolean)
    )
  ).sort((a, b) => b.localeCompare(a));

  const filteredData = selectedMonth
    ? historyData.filter(room => room.date && room.date.startsWith(selectedMonth))
    : historyData;

  const totalRooms = filteredData.length;
  const pendingRooms = filteredData.filter(room => room.otherStatus === 'Pending');
  const paidRooms = filteredData.filter(room => room.otherStatus === 'Paid');
  const totalEstimatedIncome = filteredData.reduce((sum, room) => sum + parseFloat(room.roomPrice || 0), 0);
  const totalElectricityCost = filteredData.reduce((sum, room) => sum + parseFloat(room.electricityCost || 0), 0);
  const totalWaterCost = filteredData.reduce((sum, room) => sum + parseFloat(room.waterCost || 0), 0);
  const totalOtherAmount = filteredData.reduce((sum, room) => sum + parseFloat(room.otherAmount || 0), 0);
  const totalUtilitiesCost = totalElectricityCost + totalWaterCost;
  const totalExpectedRiel = filteredData.reduce((sum, room) => sum + parseFloat(room.totalRiel || 0), 0);

  // --- Mobile Card Style Dashboard ---
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md py-4 px-4 flex flex-col gap-2 shadow-sm rounded-b-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-indigo-700">{t('dashboard')}</h2>
          <img
            src={process.env.PUBLIC_URL + '/logo192.png'}
            alt="Logo"
            className="w-10 h-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">{t('selectMonth') || 'Month'}:</label>
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="">All</option>
            {monthOptions.map(month => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Main Content */}
      <div className="py-4 px-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <img
              src={process.env.PUBLIC_URL + '/logo192.png'}
              alt="App Logo"
              className="w-16 h-16 mb-2 animate-bounce"
              style={{ objectFit: 'contain' }}
            />
            <div className="text-lg text-gray-700">{t('loading')}</div>
          </div>
        ) : totalRooms === 0 ? (
          <div className="text-center text-gray-500 text-base py-10">
            <span className="block text-2xl mb-2">😕</span>
            {t('noRooms')}
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <StatCard
                icon={<span className="text-blue-500 text-2xl">🏠</span>}
                label="Total"
                value={totalRooms}
                bg="bg-blue-50"
              />
              <StatCard
                icon={<span className="text-red-500 text-2xl">⏳</span>}
                label="Pending"
                value={pendingRooms.length}
                bg="bg-red-50"
              />
              <StatCard
                icon={<span className="text-green-500 text-2xl">✅</span>}
                label="Paid"
                value={paidRooms.length}
                bg="bg-green-50"
              />
              <StatCard
                icon={<span className="text-purple-500 text-2xl">💵</span>}
                label="Income"
                value={`$${totalEstimatedIncome.toFixed(2)}`}
                bg="bg-purple-50"
              />
              <StatCard
                icon={<span className="text-yellow-500 text-2xl">🔌</span>}
                label="Utilities"
                value={`$${totalUtilitiesCost.toFixed(2)}`}
                bg="bg-yellow-50"
              />
              <StatCard
                icon={<span className="text-teal-500 text-2xl">💸</span>}
                label="Other"
                value={`$${totalOtherAmount.toFixed(2)}`}
                bg="bg-teal-50"
              />
            </div>
            {/* Total Expected Collection */}
            <div className="rounded-xl bg-indigo-100 p-4 mb-4 flex flex-col items-center shadow">
              <span className="text-indigo-700 font-bold text-lg mb-1">Total Expected</span>
              <span className="text-3xl font-extrabold text-indigo-700">${totalExpectedRiel.toFixed(2)}</span>
            </div>
            {/* Pending List */}
            {pendingRooms.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2 text-red-600">Pending Payments</h3>
                <div className="flex flex-col gap-2">
                  {pendingRooms.map(room => (
                    <div key={room._id} className="flex items-center justify-between bg-white rounded-lg shadow px-3 py-2 border border-red-100">
                      <div>
                        <span className="font-bold text-indigo-700">{room.roomId || room.id || room._id}</span>
                        <span className="block text-xs text-gray-400">{room.date || '-'}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-red-500 font-bold">${(room.totalRiel || 0).toFixed(2)}</span>
                        <span className="text-xs text-gray-500">{room.otherStatus}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// StatCard helper for Dashboard
function StatCard({ icon, label, value, bg }) {
  return (
    <div className={`rounded-xl ${bg} flex flex-col items-center justify-center py-4 shadow`}>
      <div>{icon}</div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}

// ListRooms Component
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
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 10000,
    headers: {
      Authorization: `Bearer ${JWT_TOKEN}`
    }
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
    <div className="w-full max-w-md mx-auto">
      {/* Sticky Filter/Search Bar */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md px-4 py-3 flex flex-col gap-2 shadow-sm rounded-b-2xl">
        <div className="flex flex-wrap items-center gap-2">
          <label className="font-medium text-gray-700 text-sm">{t('selectMonth')}:</label>
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="">All</option>
            {monthOptions.map(month => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search Room ID"
            value={searchRoomId}
            onChange={e => setSearchRoomId(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm flex-1"
            style={{ minWidth: 100 }}
          />
          <label className="flex items-center ml-2 text-xs">
            <input
              type="checkbox"
              checked={viewAll}
              onChange={e => setViewAll(e.target.checked)}
              className="mr-1"
            />
            View all (group)
          </label>
        </div>
      </div>
      {/* Main List Content */}
      <div className="py-4 px-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <img
              src={process.env.PUBLIC_URL + '/logo192.png'}
              alt="App Logo"
              className="w-16 h-16 mb-2 animate-bounce"
              style={{ objectFit: 'contain' }}
            />
            <div className="text-lg text-gray-700">{t('loading')}</div>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center text-gray-500 text-base py-10">
            <span className="block text-2xl mb-2">😕</span>
            No rooms available.
          </div>
        ) : viewAll ? (
          // Grouped by roomId view
          <div className="flex flex-col gap-6">
            {Object.keys(groupedByRoomId).sort((a, b) => parseInt(a) - parseInt(b)).map((roomId, idx) => (
              <div key={roomId}>
                <div
                  className="text-lg font-bold mb-2 px-4 py-2 rounded-xl flex items-center gap-2"
                  style={{
                    background: [
                      "#e0e7ff", "#fef9c3", "#bbf7d0", "#fca5a5",
                      "#fcd34d", "#a5b4fc", "#f9a8d4", "#fdba74"
                    ][idx % 8],
                    color: "#3730a3"
                  }}
                >
                  <span className="text-2xl">🏠</span> Room {roomId}
                </div>
                <div className="flex flex-col gap-3">
                  {groupedByRoomId[roomId].map((room) => {
                    const isEditing = editId === room._id;
                    return (
                      <div key={room._id} className="bg-white rounded-2xl shadow p-4 flex flex-col gap-2 border border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-indigo-700">{room.date || '-'}</span>
                          <span className={`px-3 py-1 rounded-full text-white text-xs font-bold ${room.otherStatus === 'Paid' ? 'bg-green-500' : 'bg-red-500'}`}>
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
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                          <div>
                            <span className="font-semibold">💵 Price:</span>{' '}
                            {isEditing ? (
                              <input
                                type="number"
                                value={editValues.roomPrice ?? 0}
                                onChange={e => handleEditChange('roomPrice', parseFloat(e.target.value))}
                                className="border rounded px-1 w-16"
                              />
                            ) : (
                              `$${room.roomPrice ?? 0}`
                            )}
                          </div>
                          <div>
                            <span className="font-semibold">💸 Other:</span>{' '}
                            {isEditing ? (
                              <input
                                type="number"
                                value={editValues.otherAmount ?? 0}
                                onChange={e => handleEditChange('otherAmount', parseFloat(e.target.value))}
                                className="border rounded px-1 w-16"
                              />
                            ) : (
                              `$${room.otherAmount ?? 0}`
                            )}
                          </div>
                          <div>
                            <span className="font-semibold">🔌 Elec:</span>{' '}
                            {isEditing ? (
                              <input
                                type="number"
                                value={editValues.usedElectricity ?? 0}
                                onChange={e => handleEditChange('usedElectricity', parseFloat(e.target.value))}
                                className="border rounded px-1 w-16"
                              />
                            ) : (
                              `${room.usedElectricity ?? 0}u`
                            )}
                          </div>
                          <div>
                            <span className="font-semibold">💧 Water:</span>{' '}
                            {isEditing ? (
                              <input
                                type="number"
                                value={editValues.usedWater ?? 0}
                                onChange={e => handleEditChange('usedWater', parseFloat(e.target.value))}
                                className="border rounded px-1 w-16"
                              />
                            ) : (
                              `${room.usedWater ?? 0}u`
                            )}
                          </div>
                          <div>
                            <span className="font-semibold">Total:</span>{' '}
                            {isEditing ? (
                              <input
                                type="number"
                                value={editValues.totalRiel ?? 0}
                                onChange={e => handleEditChange('totalRiel', parseFloat(e.target.value))}
                                className="border rounded px-1 w-16"
                              />
                            ) : (
                              `$${room.totalRiel ?? 0}`
                            )}
                          </div>
                          <div>
                            <span className="font-semibold">Updated:</span>{' '}
                            {isEditing ? (
                              <input
                                type="date"
                                value={editValues.lastUpdated ? editValues.lastUpdated.split('T')[0] : ''}
                                onChange={e => handleEditChange('lastUpdated', e.target.value)}
                                className="border rounded px-1 w-24"
                              />
                            ) : (
                              room.lastUpdated ? room.lastUpdated.split('T')[0] : '-'
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                          {isEditing ? (
                            <>
                              <button
                                onClick={handleSave}
                                className="flex-1 py-1 rounded bg-green-500 text-white text-xs font-bold"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancel}
                                className="flex-1 py-1 rounded bg-gray-300 text-black text-xs font-bold"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(room)}
                                className="flex-1 py-1 rounded bg-blue-500 text-white text-xs font-bold"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(room._id)}
                                className="flex-1 py-1 rounded bg-red-500 text-white text-xs font-bold"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Default flat list view
          <div className="flex flex-col gap-4">
            {filteredRooms.map((room) => {
              const roomId = room.roomId || room.id || '';
              const isEditing = editId === room._id;
              return (
                <div key={room._id} className="bg-white rounded-2xl shadow p-4 flex flex-col gap-2 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-700">{String(roomId).replace('room', 'Room ')}</span>
                    <span className={`px-3 py-1 rounded-full text-white text-xs font-bold ${room.otherStatus === 'Paid' ? 'bg-green-500' : 'bg-red-500'}`}>
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
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                    <div>
                      <span className="font-semibold">Date:</span>{' '}
                      {isEditing ? (
                        <input
                          type="date"
                          value={editValues.date || ''}
                          onChange={e => handleEditChange('date', e.target.value)}
                          className="border rounded px-1 w-24"
                        />
                      ) : (
                        room.date || '-'
                      )}
                    </div>
                    <div>
                      <span className="font-semibold">💵 Price:</span>{' '}
                      {isEditing ? (
                        <input
                          type="number"
                          value={editValues.roomPrice ?? 0}
                          onChange={e => handleEditChange('roomPrice', parseFloat(e.target.value))}
                          className="border rounded px-1 w-16"
                        />
                      ) : (
                        `$${room.roomPrice ?? 0}`
                      )}
                    </div>
                    <div>
                      <span className="font-semibold">💸 Other:</span>{' '}
                      {isEditing ? (
                        <input
                          type="number"
                          value={editValues.otherAmount ?? 0}
                          onChange={e => handleEditChange('otherAmount', parseFloat(e.target.value))}
                          className="border rounded px-1 w-16"
                        />
                      ) : (
                        `$${room.otherAmount ?? 0}`
                      )}
                    </div>
                    <div>
                      <span className="font-semibold">🔌 Elec:</span>{' '}
                      {isEditing ? (
                        <input
                          type="number"
                          value={editValues.usedElectricity ?? 0}
                          onChange={e => handleEditChange('usedElectricity', parseFloat(e.target.value))}
                          className="border rounded px-1 w-16"
                        />
                      ) : (
                        `${room.usedElectricity ?? 0}u`
                      )}
                    </div>
                    <div>
                      <span className="font-semibold">💧 Water:</span>{' '}
                      {isEditing ? (
                        <input
                          type="number"
                          value={editValues.usedWater ?? 0}
                          onChange={e => handleEditChange('usedWater', parseFloat(e.target.value))}
                          className="border rounded px-1 w-16"
                        />
                      ) : (
                        `${room.usedWater ?? 0}u`
                      )}
                    </div>
                    <div>
                      <span className="font-semibold">Total:</span>{' '}
                      {isEditing ? (
                        <input
                          type="number"
                          value={editValues.totalRiel ?? 0}
                          onChange={e => handleEditChange('totalRiel', parseFloat(e.target.value))}
                          className="border rounded px-1 w-16"
                        />
                      ) : (
                        `$${room.totalRiel ?? 0}`
                      )}
                    </div>
                    <div>
                      <span className="font-semibold">Updated:</span>{' '}
                      {isEditing ? (
                        <input
                          type="date"
                          value={editValues.lastUpdated ? editValues.lastUpdated.split('T')[0] : ''}
                          onChange={e => handleEditChange('lastUpdated', e.target.value)}
                          className="border rounded px-1 w-24"
                        />
                      ) : (
                        room.lastUpdated ? room.lastUpdated.split('T')[0] : '-'
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSave}
                          className="flex-1 py-1 rounded bg-green-500 text-white text-xs font-bold"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex-1 py-1 rounded bg-gray-300 text-black text-xs font-bold"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(room)}
                          className="flex-1 py-1 rounded bg-blue-500 text-white text-xs font-bold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(room._id)}
                          className="flex-1 py-1 rounded bg-red-500 text-white text-xs font-bold"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// --- New Mobile Bottom Navigation ---
const BottomNav = ({
  currentView,
  setCurrentView,
  t
}) => {
  // Map radio index to view
  const navItems = [
    { id: 'dashboard', icon: (
      <svg viewBox="0 0 24 24" fill="none" height={24} width={24} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="svg w-6 h-6 text-gray-800 dark:text-white">
        <path d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" />
      </svg>
    ), label: 'dashboard' },
    { id: 'rooms', icon: (
      // Changed to "add new" icon (plus in a circle)
      <svg viewBox="0 0 24 24" fill="none" height={24} width={24} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="svg w-6 h-6 text-gray-800 dark:text-white">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ), label: 'roomDetails' },
    { id: 'listRooms', icon: (
      <svg viewBox="0 0 24 24" fill="none" height={24} width={24} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="svg w-6 h-6 text-gray-800 dark:text-white">
        <path d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" strokeWidth={2} strokeLinecap="round" stroke="currentColor" />
      </svg>
    ), label: 'listRooms' }
    // Removed createRoom icon and entry
  ];
  return (
    <StyledWrapper>
      <div id="navbody">
        <form>
          <ul className="ul">
            {navItems.map((item, idx) => (
              <React.Fragment key={item.id}>
                <input
                  className="radio"
                  name="rad"
                  id={`choose${idx+1}`}
                  type="radio"
                  checked={currentView === item.id}
                  onChange={() => setCurrentView(item.id)}
                  aria-label={t(item.label)}
                />
                <label htmlFor={`choose${idx+1}`}>
                  <li className="li">
                    {item.icon}
                  </li>
                </label>
              </React.Fragment>
            ))}
          </ul>
        </form>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
#navbody {
  width: 100vw;
  max-width: 500px;
  height: 60px;
  background-color: rgb(0, 0, 0);
  // border-radius: 400px 400px 0 0;
  box-shadow: 0px -2px 15px rgba(0, 0, 0, 0.07);
  align-items: center;
  justify-content: center;
  display: flex;
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  z-index: 50;
}
.ul {
  list-style: none;
  width: 100%;
  background-color: transparent;
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  padding: 0 10px;
}
.ul .li {
  display: inline-block;
}
.radio {
  display: none;
}
.svg {
  width: 90px;
  height: 40px;
  opacity: 80%;
  cursor: pointer;
  padding: 8px 10px;
  transition: 0.2s;
}
.ul .li .svg:hover {
  transition: 0.1s;
  color: rgb(235, 40, 176);
  position: relative;
  margin-top: -4px;
  opacity: 100%;
}
.radio:checked + label .li .svg {
  color: rgb(235, 40, 176);
  fill-rule: evenodd;
}
@media (min-width: 600px) {
  #navbody {
    max-width: 400px;
  }
}
`;
// --- End Mobile Bottom Navigation ---

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
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 10000,
    headers: {
      Authorization: `Bearer ${JWT_TOKEN}`
    }
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
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-inter text-gray-800 relative">
        {/* --- Modern App Header --- */}
        <div className="w-full max-w-md mx-auto px-4 pt-6 pb-4">
          <div className="rounded-3xl bg-gradient-to-r from-indigo-500 to-blue-400 shadow-lg flex items-center gap-4 px-5 py-4">
            <div className="flex-shrink-0">
              <img
                src={process.env.PUBLIC_URL + '/logo192.png'}
                alt="Logo"
                className="w-12 h-12 rounded-full shadow"
              />
            </div>
            <div>
              <h1 className="text-white text-2xl font-extrabold tracking-tight drop-shadow">
                {t('roomManagement')}
              </h1>
              <div className="text-indigo-100 text-xs font-medium mt-1">
                {t('devBy')}
              </div>
            </div>
          </div>
        </div>
        {/* Main Content Area */}
        <main className="flex-1 p-2 md:p-8 w-full max-w-full overflow-x-auto pb-24">
          {/* Remove old h1 here */}
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
                setSelectedRoomId={setSelectedRoomId} // pass down
                handleCreateRoom={handleCreateRoom}   // pass down
              />
            ) : (
              <div className="text-base md:text-xl text-gray-700">{t('noRooms')}</div>
            )
          ) : currentView === 'dashboard' ? (
            <Dashboard />
          ) : currentView === 'listRooms' ? (
            <ListRooms />
          ) : null}
        </main>
        {/* --- Bottom Navigation --- */}
        <BottomNav
          currentView={currentView}
          setCurrentView={setCurrentView}
          t={t}
        />
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