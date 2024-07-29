require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

const port = process.env.PORT || 5000;

const mongoDB = require('./db');
mongoDB();

// Use CORS middleware
app.use(cors());

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    
//     // Handle preflight requests
//     if (req.method === 'OPTIONS') {
//         return res.sendStatus(200);
//     }
    
//     next();
// });

// Middleware to parse JSON bodies
app.use(express.json());

// Basic route to check if the server is running
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Route for creating a user
app.use('/api', require("./Routes/CreateUser"));
app.use('/api', require("./Routes/DisplayData"));

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
