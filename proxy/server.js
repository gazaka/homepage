const express = require('express');
const axios = require('axios');
const cors = require('cors');

// This loads variables from the .env file
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());

// Suggestions endpoint
app.get('/suggestions', async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }
  try {
    const url = `https://duckduckgo.com/ac/?q=${encodeURIComponent(query)}&format=json`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
});

// Weather endpoint
app.get('/weather', async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.WEATHER_API_KEY;

  if (!lat || !lon || !apiKey) {
    return res.status(400).json({ error: 'Missing required parameters: lat, lon, or API key.' });
  }
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});