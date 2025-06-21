// --- Time and Date Logic ---
const timeElement = document.getElementById('current-time');
const dateElement = document.getElementById('current-date');

function updateTimeAndDate() {
    const now = new Date();
    const timeString = now.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' });
    timeElement.textContent = timeString;
    const dateString = now.toLocaleDateString(navigator.language, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    dateElement.textContent = dateString;
}
updateTimeAndDate();
setInterval(updateTimeAndDate, 1000);


// --- Weather Logic ---
const weatherIconElement = document.getElementById('weather-icon');
const weatherTempElement = document.getElementById('weather-temp');

async function getWeather() {
    const lat = 53.53;
    const lon = -2.35;

    try {
        const response = await fetch(`http://localhost:3000/weather?lat=${lat}&lon=${lon}`);
        
        // NEW: Check if the response from our proxy was successful
        if (!response.ok) {
            // If not, throw an error to be caught by the catch block
            throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();
        
        weatherTempElement.textContent = `${Math.round(data.main.temp)}°C`;
        const iconCode = data.weather[0].icon;
        weatherIconElement.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        weatherIconElement.alt = data.weather[0].description;

    } catch (error) {
        console.error("Failed to fetch weather:", error);
        weatherTempElement.textContent = "N/A";
    }
}


// --- Universal Search Logic ---
// ... (The rest of your main.js file from here is unchanged) ...
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
    } catch (error) {
        quoteTextElement.textContent = "Couldn't fetch a quote. Please try again later.";
        console.error("Fetch error:", error);
    }
}

// --- Initial Page Load Actions ---
document.addEventListener('DOMContentLoaded', () => {
    getWeather();
    getQuote();
});