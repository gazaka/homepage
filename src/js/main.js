// --- Clock Logic ---
const timeElement = document.getElementById('current-time');
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' });
    timeElement.textContent = timeString;
}
updateTime();
setInterval(updateTime, 1000);


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

// NEW: A "state" variable to track which suggestion is highlighted
let activeSuggestionIndex = -1;

async function getSuggestions() {
    const query = searchQueryInput.value.trim();
    if (query === '') {
        suggestionsContainer.innerHTML = '';
        return;
    }

    // NEW: Reset the active index whenever the user types a new character
    activeSuggestionIndex = -1;

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
            suggestionsContainer.appendChild(item);
        });

    } catch (error) {
        suggestionsContainer.innerHTML = '';
        console.error("Suggestion fetch error:", error);
    }
}
searchQueryInput.addEventListener('input', getSuggestions);


// NEW: Event listener for keyboard navigation (ArrowUp, ArrowDown, Enter)
searchQueryInput.addEventListener('keydown', (e) => {
    const suggestions = suggestionsContainer.querySelectorAll('.suggestion-item');
    if (suggestions.length === 0) return;

    // A variable to store the previously active item
    let prevActiveSuggestion = suggestions[activeSuggestionIndex];

    switch (e.key) {
        case 'ArrowDown':
            e.preventDefault(); // Stop cursor from moving in the input box
            activeSuggestionIndex++;
            if (activeSuggestionIndex >= suggestions.length) {
                activeSuggestionIndex = 0; // Wrap around to the top
            }
            break;

        case 'ArrowUp':
            e.preventDefault(); // Stop cursor from moving in the input box
            activeSuggestionIndex--;
            if (activeSuggestionIndex < 0) {
                activeSuggestionIndex = suggestions.length - 1; // Wrap around to the bottom
            }
            break;

        case 'Enter':
            if (activeSuggestionIndex > -1) {
                e.preventDefault(); // Stop the form from submitting with the wrong text
                suggestions[activeSuggestionIndex].click(); // Trigger the click event on the active item
            }
            return; // Allow normal Enter submission if no suggestion is selected
    }

    // Remove highlight from the previous item if it exists
    if (prevActiveSuggestion) {
        prevActiveSuggestion.classList.remove('suggestion-active');
    }

    // Add highlight to the new active item
    suggestions[activeSuggestionIndex].classList.add('suggestion-active');
});


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
getQuote();