const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://sokchanear0:dKEhfzGaZ5F3ZNU2@cluster0.vrq9v2j.mongodb.net/testing?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

const JWT_SECRET = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzUxNTUwNjIyfQ.VVhG2JxUIYGmRrEROoDJCREIdLKT_bYkzEhpYjbiA4M'; // Change this to a strong secret

// Dummy user for demonstration (replace with real user DB in production)
const USER = { username: 'admin', password: 'chansok123' };

// JWT Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Hg merl Api And ng mean Token ot ah jmr (Free time Rean klas tv ah jmr kom der yk api ke use kdma jm' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Login endpoint to get JWT token
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username !== USER.username || password !== USER.password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ username }, JWT_SECRET);
  res.json({ token });
});

/*
How to use JWT authentication:

1. Obtain a token:
   - Send a POST request to /api/login with JSON body:
     {
       "username": "admin",
       "password": "password"
     }
   - The response will contain a "token" field.

2. Use the token:
   - For all other /api/* endpoints, include the token in the Authorization header:
     Authorization: Bearer <your_token_here>

   Example using curl:
     curl -H "Authorization: Bearer <your_token_here>" http://localhost:5000/api/rooms

   - If the token is missing or invalid, the API will return 401 or 403 errors.
*/

// Protect all API endpoints below (except /api/login)
app.use('/api', (req, res, next) => {
  if (req.path === '/login') return next();
  authenticateToken(req, res, next);
});

// Room Schema
const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  date: { type: String },
  prevElectricityAmount: { type: Number, default: 0 },
  newElectricityAmount: { type: Number, default: 0 },
  usedElectricity: { type: Number, default: 0 },
  electricityCost: { type: Number, default: 0 },
  electricityRate: { type: Number, default: 0.25 },
  prevWaterAmount: { type: Number, default: 0 },
  newWaterAmount: { type: Number, default: 0 },
  usedWater: { type: Number, default: 0 },
  waterCost: { type: Number, default: 0 },
  waterRate: { type: Number, default: 0.005 },
  roomPrice: { type: Number, default: 300 },
  otherAmount: { type: Number, default: 0 },
  otherStatus: { type: String, default: 'Pending' },
  totalElectWater: { type: Number, default: 0 },
  totalRiel: { type: Number, default: 0 },
  lastUpdated: { type: String }
});

const Room = mongoose.model('Room', roomSchema);

// API Endpoints
// Get all rooms
app.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await Room.find();
    const roomsData = rooms.reduce((acc, room) => {
      acc[room.roomId] = room;
      return acc;
    }, {});
    res.json(roomsData);
  } catch (err) {
    console.error('Error fetching rooms:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get specific room
app.get('/api/rooms/:roomId', async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId });
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
  } catch (err) {
    console.error('Error fetching room:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new room
app.post('/api/rooms', async (req, res) => {
  try {
    const { roomId } = req.body;
    if (!roomId) {
      return res.status(400).json({ error: 'Room ID is required' });
    }
    const existingRoom = await Room.findOne({ roomId });
    if (existingRoom) {
      return res.status(400).json({ error: 'Room ID already exists' });
    }
    const newRoom = new Room({
      roomId,
      date: new Date().toISOString().split('T')[0],
      prevElectricityAmount: 0,
      newElectricityAmount: 0,
      usedElectricity: 0,
      electricityCost: 0,
      electricityRate: 0.25,
      prevWaterAmount: 0,
      newWaterAmount: 0,
      usedWater: 0,
      waterCost: 0,
      waterRate: 0.005,
      roomPrice: 300,
      otherAmount: 0,
      otherStatus: 'Pending',
      totalElectWater: 300,
      totalRiel: 300,
      lastUpdated: new Date().toISOString()
    });
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (err) {
    console.error('Error creating room:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Save or update room data (current month)
app.post('/api/rooms/:roomId', async (req, res) => {
  try {
    const roomData = req.body;
    const room = await Room.findOneAndUpdate(
      { roomId: req.params.roomId },
      { $set: roomData },
      { new: true, upsert: true }
    );
    res.json(room);
  } catch (err) {
    console.error('Error saving room data:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Save all room data to a new collection for history/archive
app.post('/api/rooms-history', async (req, res) => {
  try {
    const roomHistorySchema = new mongoose.Schema({}, { strict: false, timestamps: true });
    const RoomHistory = mongoose.models.RoomHistory || mongoose.model('RoomHistory', roomHistorySchema);

    let data = req.body;
    if (!Array.isArray(data)) data = [data];

    const result = await RoomHistory.insertMany(data);
    res.status(201).json({ message: 'Room data saved to history', result });
  } catch (err) {
    console.error('Error saving room history:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add GET endpoint to view room history
app.get('/api/rooms-history', async (req, res) => {
  try {
    const RoomHistory = mongoose.models.RoomHistory || mongoose.model('RoomHistory', new mongoose.Schema({}, { strict: false, timestamps: true }));
    const history = await RoomHistory.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    console.error('Error fetching room history:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add PUT endpoint to update a room history record by _id
app.put('/api/rooms-history/:id', async (req, res) => {
  try {
    const RoomHistory = mongoose.models.RoomHistory || mongoose.model('RoomHistory', new mongoose.Schema({}, { strict: false, timestamps: true }));
    const updated = await RoomHistory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ error: 'Room history not found' });
    }
    res.json(updated);
  } catch (err) {
    console.error('Error updating room history:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add DELETE endpoint to delete a room history record by _id
app.delete('/api/rooms-history/:id', async (req, res) => {
  try {
    const RoomHistory = mongoose.models.RoomHistory || mongoose.model('RoomHistory', new mongoose.Schema({}, { strict: false, timestamps: true }));
    const deleted = await RoomHistory.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Room history not found' });
    }
    res.json({ message: 'Room history deleted' });
  } catch (err) {
    console.error('Error deleting room history:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});