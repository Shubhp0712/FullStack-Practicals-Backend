const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3003",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Store active users and their socket IDs
const activeUsers = new Map();
const chatRooms = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user joining
  socket.on('user_join', (userData) => {
    activeUsers.set(socket.id, {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      photoURL: userData.photoURL,
      socketId: socket.id
    });
    
    // Notify all users about online status
    socket.broadcast.emit('user_online', {
      id: userData.id,
      name: userData.name,
      photoURL: userData.photoURL
    });
    
    // Send list of online users to the new user
    const onlineUsers = Array.from(activeUsers.values()).map(user => ({
      id: user.id,
      name: user.name,
      photoURL: user.photoURL
    }));
    socket.emit('online_users', onlineUsers);
  });

  // Handle private messaging
  socket.on('private_message', (data) => {
    const { receiverId, message, senderId, senderName, timestamp } = data;
    
    // Find receiver's socket
    const receiverSocket = Array.from(activeUsers.values()).find(user => user.id === receiverId);
    
    if (receiverSocket) {
      // Send message to receiver
      io.to(receiverSocket.socketId).emit('receive_message', {
        senderId,
        senderName,
        message,
        timestamp,
        chatId: `${senderId}_${receiverId}`
      });
      
      // Send confirmation to sender
      socket.emit('message_sent', {
        receiverId,
        message,
        timestamp,
        chatId: `${senderId}_${receiverId}`
      });
    }
  });

  // Handle joining a chat room
  socket.on('join_chat', (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat: ${chatId}`);
  });

  // Handle leaving a chat room
  socket.on('leave_chat', (chatId) => {
    socket.leave(chatId);
    console.log(`User ${socket.id} left chat: ${chatId}`);
  });

  // Handle typing indicators
  socket.on('typing_start', (data) => {
    const { chatId, userId, userName } = data;
    socket.to(chatId).emit('user_typing', { userId, userName });
  });

  socket.on('typing_stop', (data) => {
    const { chatId, userId } = data;
    socket.to(chatId).emit('user_stop_typing', { userId });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const user = activeUsers.get(socket.id);
    if (user) {
      // Notify others that user went offline
      socket.broadcast.emit('user_offline', { id: user.id });
      activeUsers.delete(socket.id);
    }
    console.log('User disconnected:', socket.id);
  });
});

// REST API endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

app.get('/api/users/online', (req, res) => {
  const onlineUsers = Array.from(activeUsers.values()).map(user => ({
    id: user.id,
    name: user.name,
    photoURL: user.photoURL
  }));
  res.json(onlineUsers);
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Socket.IO server ready for connections`);
});
