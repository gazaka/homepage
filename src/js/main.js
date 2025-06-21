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
            
            // --- THIS IS THE MODIFIED PART ---

            // Listener for when the user clicks a suggestion
            item.addEventListener('click', () => {
                searchQueryInput.value = suggestion.phrase;
                searchForm.requestSubmit();
            });

            // NEW: Listener for when the mouse enters a suggestion
            item.addEventListener('mouseenter', () => {
                // First, remove the active class from any other item
                const currentActive = suggestionsContainer.querySelector('.suggestion-active');
                if (currentActive) {
                    currentActive.classList.remove('suggestion-active');
                }
                // Then, add the active class to this item
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


// --- Keyboard Navigation Logic (No changes needed here) ---
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