const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const attendanceRoutes = require('./routes/attendance');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://sokchanear0:dKEhfzGaZ5F3ZNU2@cluster0.vrq9v2j.mongodb.net/testing?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/attendance', attendanceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));