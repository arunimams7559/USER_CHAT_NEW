const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { setupSocket } = require('./socket');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true  }
});
const PORT = process.env.PORT || 5001; 

mongoose.connect(process.env.MONGO_URI, {
  
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));


app.use(cors());
  
app.use(express.json());
app.use('/auth', require('./routes/authroutes'));
app.use('/chat', require('./routes/chatroutes'));
app.use('/users', require('./routes/userroutes'));


setupSocket(io);


server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});