require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { sequelize } = require('./models');

const authRoutes = require('./routes/auth');
const inventoryRoutes = require('./routes/inventory');
const orderRoutes = require('./routes/order');
const trackingRoutes = require('./routes/tracking');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => res.send('API is running...'));

// Socket.io integration
app.set('socketio', io);

io.on('connection', (socket) => {
  console.log('New client connected: ' + socket.id);

  socket.on('joinTracking', (trackingId) => {
    socket.join(trackingId);
    console.log(`Socket ${socket.id} joined tracking room: ${trackingId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Routes
app.use('/auth', authRoutes);
app.use('/products', inventoryRoutes);
app.use('/orders', orderRoutes);
app.use('/tracking', trackingRoutes);

const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
