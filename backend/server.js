const express = require('express');
const connectDB = require('./config/db');
const mcpRoutes = require('./routes/mcpRoutes');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',  // Match your frontend URL
  credentials: true,               // Allow cookies/auth headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']  // Allowed methods
}));

// Log incoming requests for debugging
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.originalUrl}`);
  next();
});

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/mcp', mcpRoutes);

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).send(`Route not found: ${req.method} ${req.originalUrl}`);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});