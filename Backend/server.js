require('dotenv').config(); // Load environment variables
const express = require('express');
const connectDB = require('./config/connectDB'); // Import the connectDB function
const authRoutes = require('./routes/auth'); // Import the auth routes
const portfolioRoutes = require('./routes/portfolioRoutes'); // Import the draft routes
const cors = require('cors');


const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));
// Connect to MongoDB
connectDB();

// Use the auth routes
app.use('/auth', authRoutes);
app.use('/portfolio', portfolioRoutes); // Register portfolio routes
app.use('/uploads', express.static('uploads'));
app.post('/portfolio/create', async (req, res) => {
    try {
        console.log("Received Data:", req.body);
        res.status(201).json({ message: 'Portfolio created successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/portfolio/:id', async (req, res) => {
    const { id } = req.params;
    console.log("Requested Portfolio ID:", id);

    // Replace this with your database fetch logic
    const portfolio = {}; // Example: Fetch from MongoDB or another DB
    if (!portfolio) {
        return res.status(404).json({ error: 'Portfolio not found' });
    }

    res.json(portfolio);
});




// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
