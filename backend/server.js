require("dotenv").config();

const express = require('express');
const cors = require('cors');
const path = require('path')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const jobRoutes = require('./routes/jobRoutes')

const app = express();


// Middleware to handle cors
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]

    })
)

// database
connectDB();

// middleware
app.use(express.json());


// routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/jobs', jobRoutes);

// server upload folder
app.use('/upload', express.static(path.join(__dirname, "uploads"), {}))


// strating server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`App is listening on ${PORT} http://localhost:8000`))