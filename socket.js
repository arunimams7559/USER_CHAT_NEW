const Message = require('./models/chatmodel');
const User = require('./models/usermodel');

const setupSocket = (io) => {
  const connectedUsers = new Map();

  io.on('connection', (socket) => {
    console.log('User connected', socket.id);

    // Send initial user list to the newly connected client
    User.find()
      .then((users) => {
        socket.emit('userList', users);
      })
      .catch((err) => {
        console.error('Error in fetching users:', err);
      });

    // Handle user registration
    socket.on('register', async (userData) => {
      console.log('User registered:', userData);

      // Store the user's ID or username for later reference
      socket.userId = userData.username;
      connectedUsers.set(userData.username, socket.id);

      // Update the user's online status
      try {
        const user = await User.findOne({ username: userData.username });
        if (user) {
          await User.updateOne({ _id: user._id }, { isOnline: true });

          // Broadcast updated user list to all clients
          const allUsers = await User.find();
          io.emit('userList', allUsers);
        }
      } catch (err) {
        console.error('Error updating user status:', err);
      }
    });

    // Handle message sending
    socket.on('sendMessage', async (messageData) => {
      console.log('Message received:', messageData);

      try {
        const { sender, receiver, text, timestamp } = messageData;

        // Validate message data
        if (!sender || !receiver || !text) {
          console.error('Invalid message data:', messageData);
          return;
        }

        // Save the message to the database
        const message = await Message.create({
          sender,
          receiver,
          text,
          timestamp: timestamp || new Date().toISOString()
        });

        console.log('Message saved to database:', message);

        // Get receiver's socket ID
        const receiverSocketId = connectedUsers.get(receiver);

        // Emit the message to the receiver
        if (receiverSocketId) {
          console.log(`Emitting message to receiver ${receiver} with socket ID ${receiverSocketId}`);
          io.to(receiverSocketId).emit('receiveMessage', message);
        } else {
          console.log(`Receiver ${receiver} is not connected, message will be delivered when they connect`);
        }

        // Emit back to sender to confirm delivery
        console.log(`Emitting confirmation to sender with socket ID ${socket.id}`);
        io.to(socket.id).emit('receiveMessage', message);
      } catch (err) {
        console.error('Error handling message:', err);
        // Notify sender of the error
        socket.emit('messageError', { error: 'Failed to send message' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.id}`);
      try {
        if (socket.userId) {
          const user = await User.findOne({ username: socket.userId });
          if (user) {
            await User.updateOne({ _id: user._id }, { isOnline: false });
            connectedUsers.delete(socket.userId);
            const allUsers = await User.find();
            io.emit('userList', allUsers);
          }
        }
      } catch (err) {
        console.error(`Error in disconnect event: ${err.message}`);
      }
    });
  });
};

module.exports = { setupSocket };
