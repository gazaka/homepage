// --- Time and Date Logic ---
const timeElement = document.getElementById('current-time');
const dateElement = document.getElementById('current-date');

function updateTimeAndDate() {
    const now = new Date();
    // Time
    const timeString = now.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' });
    timeElement.textContent = timeString;
    // Date
    const dateString = now.toLocaleDateString(navigator.language, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    dateElement.textContent = dateString;
}
// Update immediately, then every second
updateTimeAndDate();
setInterval(updateTimeAndDate, 1000);


// --- Weather Logic (Heavily Updated for WeatherAPI.com) ---
const weatherIconElement = document.getElementById('weather-icon');
const weatherTempElement = document.getElementById('weather-temp');

async function getWeather() {
    const lat = 53.53;
    const lon = -2.35;

    try {
        const response = await fetch(`http://localhost:3000/weather?lat=${lat}&lon=${lon}`);
        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }
        const data = await response.json();

        // --- Part 1: Update the Smart Header (with CURRENT weather) ---
        const current = data.current;
        weatherTempElement.textContent = `${Math.round(current.temp_c)}°C`;
        // The new API provides a full URL for the icon, so we add "https:" to it
        weatherIconElement.src = `https:${current.condition.icon}`;
        weatherIconElement.alt = current.condition.text;

        // --- Part 2: Update the Forecast Widget ---
        const forecastDays = document.querySelectorAll('.forecast-day');
        // The forecast data is in a different array now: `data.forecast.forecastday`
        data.forecast.forecastday.slice(0, 5).forEach((day, index) => {
            const dayElement = forecastDays[index];
            if (!dayElement) return;

            // The date is a string, so we convert it to get the day name
            const dayName = new Date(day.date).toLocaleDateString(navigator.language, { weekday: 'long' });
            dayElement.querySelector('.forecast-day-name').textContent = index === 0 ? 'Today' : (index === 1 ? 'Tomorrow' : dayName);
            
            // Get Icon
            const forecastIconUrl = day.day.condition.icon;
            dayElement.querySelector('.forecast-icon').src = `https:${forecastIconUrl}`;
            
            // Get Temps
            dayElement.querySelector('.temp-high').textContent = `${Math.round(day.day.maxtemp_c)}°`;
            dayElement.querySelector('.temp-low').textContent = `${Math.round(day.day.mintemp_c)}°`;
        });

    } catch (error) {
        console.error("Failed to fetch weather:", error);
        weatherTempElement.textContent = "N/A";
    }
}



// --- Universal Search Logic ---
const searchForm = document.getElementById('search-form');
function handleSearch(event) {
    event.preventDefault();
    const queryInput = document.getElementById('search-query');
    const query = queryInput.value.trim();
    if (!query) return;

    const selectedEngine = document.querySelector('input[name="search-engine"]:checked').value;
    const searchUrls = {
        google: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        duckduckgo: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
        youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
    };
    const url = searchUrls[selectedEngine];
    window.open(url, '_blank');
    document.getElementById('suggestions-container').innerHTML = '';
    queryInput.value = '';
}
searchForm.addEventListener('submit', handleSearch);


// --- Predictive Search Logic ---
const searchQueryInput = document.getElementById('search-query');
const suggestionsContainer = document.getElementById('suggestions-container');

async function getSuggestions() {
    const query = searchQueryInput.value.trim();
    if (query === '') {
        suggestionsContainer.innerHTML = '';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/suggestions?q=${encodeURIComponent(query)}`);
        const suggestions = await response.json();
        suggestionsContainer.innerHTML = '';

        suggestions.forEach(suggestion => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.textContent = suggestion.phrase;
            
            item.addEventListener('click', () => {
                searchQueryInput.value = suggestion.phrase;
                searchForm.requestSubmit();
            });

            item.addEventListener('mouseenter', () => {
                const currentActive = suggestionsContainer.querySelector('.suggestion-active');
                if (currentActive) {
                    currentActive.classList.remove('suggestion-active');
                }
                item.classList.add('suggestion-active');
            });

            suggestionsContainer.appendChild(item);
        });

    } catch (error) {
        suggestionsContainer.innerHTML = '';
        console.error("Suggestion fetch error:", error);
    }
}
searchQueryInput.addEventListener('input', getSuggestions);


// --- Keyboard Navigation Logic ---
searchQueryInput.addEventListener('keydown', (e) => {
    const suggestions = suggestionsContainer.querySelectorAll('.suggestion-item');
    if (suggestions.length === 0) return;

    const currentActive = suggestionsContainer.querySelector('.suggestion-active');
    
    switch (e.key) {
        case 'ArrowDown':
            e.preventDefault();
            if (currentActive) {
                currentActive.classList.remove('suggestion-active');
                let nextSibling = currentActive.nextElementSibling;
                if (nextSibling) {
                    nextSibling.classList.add('suggestion-active');
                } else {
                    suggestions[0].classList.add('suggestion-active');
                }
            } else {
                suggestions[0].classList.add('suggestion-active');
            }
            break;

        case 'ArrowUp':
            e.preventDefault();
            if (currentActive) {
                currentActive.classList.remove('suggestion-active');
                let prevSibling = currentActive.previousElementSibling;
                if (prevSibling) {
                    prevSibling.classList.add('suggestion-active');
                } else {
                    suggestions[suggestions.length - 1].classList.add('suggestion-active');
                }
            } else {
                suggestions[suggestions.length - 1].classList.add('suggestion-active');
            }
            break;

        case 'Enter':
            if (currentActive) {
                e.preventDefault();
                currentActive.click();
            }
            break;
    }
});


// Hide suggestions when clicking outside
document.addEventListener('click', (event) => {
    if (!searchQueryInput.contains(event.target) && !suggestionsContainer.contains(event.target)) {
        suggestionsContainer.innerHTML = '';
    }
});

// Re-fetch suggestions when the search box is focused
searchQueryInput.addEventListener('focus', getSuggestions);


// --- Quote Fetcher Logic ---
const quoteTextElement = document.getElementById('quote-text');
const quoteAuthorElement = document.getElementById('quote-author');
async function getQuote() {
    try {
        const response = await fetch('https://dummyjson.com/quotes/random');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        quoteTextElement.textContent = `"${data.quote}"`;
        quoteAuthorElement.textContent = `— ${data.author}`;
    } catch (error)
        {
        quoteTextElement.textContent = "Couldn't fetch a quote. Please try again later.";
        console.error("Fetch error:", error);
    }
}

// --- Initial Page Load Actions ---
document.addEventListener('DOMContentLoaded', () => {
    getWeather();
    getQuote();
});