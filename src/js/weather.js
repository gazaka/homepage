// src/js/weather.js

import { PROXY_PORT } from './config.js'; 

// --- DOM ELEMENT SELECTION ---
const weatherWidget = document.getElementById('weather-container');
const forecastWidget = document.getElementById('forecast-widget');
const modalOverlay = document.getElementById('modal-overlay');
const modalDateElement = document.getElementById('modal-date');
const modalStatsContainer = document.querySelector('.modal-stats');
const modalHourlyContainer = document.getElementById('modal-hourly-forecast');
const modalCloseBtn = document.getElementById('modal-close-btn');

// --- CACHING SETUP ---
const CACHE_DURATION_MINUTES = 30;
const CACHE_DURATION_MS = CACHE_DURATION_MINUTES * 60 * 1000;

// A module-level variable to store the full weather data so we can access it for the modal
let fullWeatherData = null;

// --- FUNCTIONS ---

/**
 * Populates the main dashboard UI with weather data.
 * @param {object} data The weather data object.
 */
function displayWeatherData(data) {
    // Update the Smart Header
    const current = data.current;
    document.getElementById('weather-temp').textContent =
        `${Math.round(current.temp_c)}°C`;
    document.getElementById('weather-icon').src =
        `https:${current.condition.icon}`;
    document.getElementById('weather-icon').alt = current.condition.text;

    // Update the Forecast Widget
    const forecastDays = document.querySelectorAll('.forecast-day');
    data.forecast.forecastday.slice(0, 5).forEach((day, index) => {
        const dayElement = forecastDays[index];
        if (!dayElement) return;

        const dayName = new Date(day.date).toLocaleDateString(
            navigator.language,
            { weekday: 'long' }
        );
        dayElement.querySelector('.forecast-day-name').textContent =
            index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : dayName;
        dayElement.querySelector('.forecast-icon').src =
            `https:${day.day.condition.icon}`;
        dayElement.querySelector('.temp-high').textContent =
            `${Math.round(day.day.maxtemp_c)}°`;
        dayElement.querySelector('.temp-low').textContent =
            `${Math.round(day.day.mintemp_c)}°`;
    });
}

/**
 * Gets user coordinates, prioritizing saved values.
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
async function getCoordinates() {
    const savedCoords = localStorage.getItem('userCoordinates');
    if (savedCoords) {
        console.log('Using saved coordinates from localStorage.');
        return JSON.parse(savedCoords);
    }

    try {
        console.log('Requesting location from browser.');
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        };

        localStorage.setItem('userCoordinates', JSON.stringify(coords));
        return coords;
    } catch (error) {
        console.log(
            `Geolocation failed (${error.message}). Falling back to default.`
        );
        return { latitude: 53.53, longitude: -2.35 };
    }
}

/**
 * Opens the modal and populates it with details for a specific day.
 * @param {number} dayIndex The index of the day to show (0-4).
 */
function openWeatherModal(dayIndex) {
    if (!fullWeatherData) return;

    const dayData = fullWeatherData.forecast.forecastday[dayIndex];

    // Populate Modal Header
    modalDateElement.textContent = new Date(dayData.date).toLocaleDateString(
        navigator.language,
        { weekday: 'long', month: 'long', day: 'numeric' }
    );

    // Populate Modal General Stats (Wind and Humidity)
    modalStatsContainer.innerHTML = `
        <div class="stat-item">
            <span>${Math.round(dayData.day.maxwind_kph)} kph</span>
            <small>Max Wind</small>
        </div>
        <div class="stat-item">
            <span>${dayData.day.avghumidity}%</span>
            <small>Humidity</small>
        </div>
    `;

    // Populate Modal Hourly Forecast
    modalHourlyContainer.innerHTML = ''; // Clear previous hourly items
    dayData.hour.forEach((hourData) => {
        const hour = new Date(hourData.time_epoch * 1000).toLocaleTimeString(
            navigator.language,
            { hour: '2-digit', minute: '2-digit' }
        );
        const hourlyItem = document.createElement('div');
        hourlyItem.className = 'hourly-item';
        hourlyItem.innerHTML = `
            <div class="hourly-time">${hour}</div>
            <img src="https:${hourData.condition.icon}" alt="${hourData.condition.text}">
            <div class="hourly-temp">${Math.round(hourData.temp_c)}°</div>
        `;
        modalHourlyContainer.appendChild(hourlyItem);
    });

    // Show the modal
    modalOverlay.classList.remove('hidden');
}

/**
 * Closes the weather detail modal.
 */
function closeWeatherModal() {
    modalOverlay.classList.add('hidden');
}

/**
 * Main function to get and display all weather data.
 */
export async function getWeather() {
    const coords = await getCoordinates(); // This helper function is unchanged
    const { latitude: lat, longitude: lon } = coords;

    const cacheKey = `weatherData_${lat.toFixed(2)}_${lon.toFixed(2)}`;
    const timestampKey = `weatherTimestamp_${lat.toFixed(2)}_${lon.toFixed(2)}`;
    const cachedWeatherData = localStorage.getItem(cacheKey);
    const cachedTimestamp = localStorage.getItem(timestampKey);

    if (cachedWeatherData && cachedTimestamp) {
        if ((Date.now() - cachedTimestamp) < CACHE_DURATION_MS) {
            console.log("Loading weather from cache.");
            fullWeatherData = JSON.parse(cachedWeatherData);
            displayWeatherData(fullWeatherData);
            return;
        }
    }

    console.log("Fetching new weather data from API.");
    try {
        // THIS IS THE KEY CHANGE
        const proxyUrl = `http://${window.location.hostname}:${PROXY_PORT}/weather?lat=${lat}&lon=${lon}`;
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error(`Server responded with ${response.status}`);
        const data = await response.json();

        fullWeatherData = data;
        localStorage.setItem(cacheKey, JSON.stringify(data));
        localStorage.setItem(timestampKey, Date.now());
        
        displayWeatherData(data);
    } catch (error) {
        console.error("Failed to fetch weather:", error);
        weatherWidget.innerHTML = `<div class="widget-error">Weather unavailable</div>`;
        forecastWidget.innerHTML = `<div class="widget-error">Forecast unavailable</div>`;
    }
}

// --- INITIALIZE EVENT LISTENERS ---

// Add click listeners to the forecast days to open the modal
document.querySelectorAll('.forecast-day').forEach((dayElement, index) => {
    dayElement.addEventListener('click', () => openWeatherModal(index));
});

// Add listeners to close the modal
modalCloseBtn.addEventListener('click', closeWeatherModal);
modalOverlay.addEventListener('click', (event) => {
    // Only close if the click is on the overlay itself, not the modal window
    if (event.target === modalOverlay) {
        closeWeatherModal();
    }
});
