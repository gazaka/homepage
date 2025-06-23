const express = require('express');
const axios = require('axios');
const cors = require('cors');

// This loads variables from the .env file
require('dotenv').config();

const app = express();
const PORT = 2626;

// Use CORS middleware to allow requests from our frontend
app.use(cors());

// Suggestions endpoint
app.get('/suggestions', async (req, res) => {
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
app.get('/weather', async (req, res) => {
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

app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});
