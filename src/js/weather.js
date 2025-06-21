const weatherIconElement = document.getElementById('weather-icon');
const weatherTempElement = document.getElementById('weather-temp');
const forecastDays = document.querySelectorAll('.forecast-day');

// Cache duration in minutes.
const CACHE_DURATION_MINUTES = 30;
const CACHE_DURATION_MS = CACHE_DURATION_MINUTES * 60 * 1000;

/**
 * A helper function to display weather data on the page.
 * @param {object} data The complete weather data object from the API.
 */
function displayWeatherData(data) {
    // Update the Smart Header
    const current = data.current;
    weatherTempElement.textContent = `${Math.round(current.temp_c)}°C`;
    weatherIconElement.src = `https:${current.condition.icon}`;
    weatherIconElement.alt = current.condition.text;

    // Update the Forecast Widget
    data.forecast.forecastday.slice(0, 5).forEach((day, index) => {
        const dayElement = forecastDays[index];
        if (!dayElement) return;

        const dayName = new Date(day.date).toLocaleDateString(navigator.language, { weekday: 'long' });
        dayElement.querySelector('.forecast-day-name').textContent = index === 0 ? 'Today' : (index === 1 ? 'Tomorrow' : dayName);
        dayElement.querySelector('.forecast-icon').src = `https:${day.day.condition.icon}`;
        dayElement.querySelector('.temp-high').textContent = `${Math.round(day.day.maxtemp_c)}°`;
        dayElement.querySelector('.temp-low').textContent = `${Math.round(day.day.mintemp_c)}°`;
    });
}

/**
 * Gets coordinates from localStorage, then browser, then default.
 * @returns {Promise<{latitude: number, longitude: number}>} A promise that resolves with the coordinates.
 */
async function getCoordinates() {
    // 1. Try to get coordinates from localStorage first.
    const savedCoords = localStorage.getItem('userCoordinates');
    if (savedCoords) {
        console.log("Using saved coordinates from localStorage.");
        return JSON.parse(savedCoords);
    }

    // 2. If not saved, ask the browser for permission.
    try {
        console.log("Requesting location from browser.");
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };

        // Save the newly acquired coordinates for next time.
        localStorage.setItem('userCoordinates', JSON.stringify(coords));
        return coords;

    } catch (error) {
        // 3. If everything else fails, use the hardcoded default.
        console.log(`Geolocation failed (${error.message}). Falling back to default.`);
        return { latitude: 53.53, longitude: -2.35 };
    }
}

/**
 * Main function to get weather.
 */
export async function getWeather() {
    // First, get the coordinates from our new helper function. This will always return a valid object.
    const coords = await getCoordinates();
    const { latitude: lat, longitude: lon } = coords;

    // Now, with guaranteed coordinates, check the weather cache.
    const cacheKey = `weatherData_${lat.toFixed(2)}_${lon.toFixed(2)}`;
    const timestampKey = `weatherTimestamp_${lat.toFixed(2)}_${lon.toFixed(2)}`;
    const cachedWeatherData = localStorage.getItem(cacheKey);
    const cachedTimestamp = localStorage.getItem(timestampKey);

    if (cachedWeatherData && cachedTimestamp) {
        if ((Date.now() - cachedTimestamp) < CACHE_DURATION_MS) {
            console.log("Loading weather from cache.");
            displayWeatherData(JSON.parse(cachedWeatherData));
            return;
        }
    }

    // If no fresh cache, fetch new data.
    console.log("Fetching new weather data from API.");
    try {
        const response = await fetch(`http://localhost:3000/weather?lat=${lat}&lon=${lon}`);
        if (!response.ok) throw new Error(`Server responded with ${response.status}`);
        const data = await response.json();
        localStorage.setItem(cacheKey, JSON.stringify(data));
        localStorage.setItem(timestampKey, Date.now());
        displayWeatherData(data);
    } catch (error) {
        console.error("Failed to fetch weather:", error);
        // Display a user-friendly error inside the widgets
        weatherWidget.innerHTML = `<div class="widget-error">Weather unavailable</div>`;
        forecastWidget.innerHTML = `<div class="widget-error">Forecast unavailable</div>`;
    }
}