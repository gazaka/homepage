const express = require('express');
const axios = require('axios');
const cors = require('cors');
const rateLimit = require('express-rate-limit'); // 1. Import the package
require('dotenv').config({ path: '../.env' });

const app = express();
const PORT = process.env.PROXY_PORT || 3000;

// Use CORS middleware to allow requests from our frontend
app.use(cors());

// 2. Define the rate limiter rules
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: { error: 'Too many requests, please try again after 15 minutes.' },
});

// 3. Apply the rate limiter to all routes that start with /
app.use('/', apiLimiter);

// Suggestions endpoint
app.get('/api/suggestions', async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res
            .status(400)
            .json({ error: 'Query parameter "q" is required' });
    }
    try {
        const url = `https://duckduckgo.com/ac/?q=${encodeURIComponent(query)}&format=json`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch suggestions' });
    }
});

// Weather endpoint - UPDATED for a 5-day forecast
app.get('/api/weather', async (req, res) => {
    const { lat, lon } = req.query;
    const apiKey = process.env.WEATHER_API_KEY;

    if (!lat || !lon || !apiKey) {
        return res.status(400).json({
            error: 'Missing required parameters: lat, lon, or API key.',
        });
    }

    try {
        // The only change is here: days=5
        const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=5&aqi=no&alerts=no`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error(
            'Error fetching from WeatherAPI.com:',
            error.response ? error.response.data : error.message
        );
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// Quotes endpoint
app.get('/api/quotes/random', async (req, res) => {
    try {
        const response = await axios.get('https://dummyjson.com/quotes/random');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch quote' });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});
