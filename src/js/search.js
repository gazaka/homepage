// Get all the necessary HTML elements for the search functionality
const searchForm = document.getElementById('search-form');
const searchQueryInput = document.getElementById('search-query');
const suggestionsContainer = document.getElementById('suggestions-container');
const searchEngineSelector = document.getElementById('search-engine-selector');

// A state variable to keep track of the selected search engine
let selectedEngine = 'google';

/**
 * Handles the main search form submission.
 * @param {Event} event The form submission event.
 */
function handleSearch(event) {
    event.preventDefault();
    const query = searchQueryInput.value.trim();
    if (!query) return;

    // The logic now uses our 'selectedEngine' variable
    const searchUrls = {
        google: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        duckduckgo: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
        youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
    };

    const url = searchUrls[selectedEngine];
    window.open(url, '_blank');
    suggestionsContainer.innerHTML = '';
    searchQueryInput.value = '';
}

/**
 * Fetches predictive search suggestions from the proxy server.
 */
async function getSuggestions() {
    const query = searchQueryInput.value.trim();
    if (query === '') {
        suggestionsContainer.innerHTML = '';
        return;
    }

    try {
        const response = await fetch(
            `http://localhost:3000/suggestions?q=${encodeURIComponent(query)}`
        );
        const suggestions = await response.json();
        suggestionsContainer.innerHTML = '';

        suggestions.forEach((suggestion) => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.textContent = suggestion.phrase;

            item.addEventListener('click', () => {
                searchQueryInput.value = suggestion.phrase;
                searchForm.requestSubmit();
            });

            item.addEventListener('mouseenter', () => {
                const currentActive =
                    suggestionsContainer.querySelector('.suggestion-active');
                if (currentActive) {
                    currentActive.classList.remove('suggestion-active');
                }
                item.classList.add('suggestion-active');
            });

            suggestionsContainer.appendChild(item);
        });
    } catch (error) {
        suggestionsContainer.innerHTML = '';
        console.error('Suggestion fetch error:', error);
    }
}

/**
 * Handles ArrowUp, ArrowDown, and Enter key presses for suggestion navigation.
 * @param {KeyboardEvent} e The keyboard event.
 */
function handleKeyboardNav(e) {
    const suggestions =
        suggestionsContainer.querySelectorAll('.suggestion-item');
    if (suggestions.length === 0) return;

    const currentActive =
        suggestionsContainer.querySelector('.suggestion-active');

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
                    suggestions[suggestions.length - 1].classList.add(
                        'suggestion-active'
                    );
                }
            } else {
                suggestions[suggestions.length - 1].classList.add(
                    'suggestion-active'
                );
            }
            break;

        case 'Enter':
            if (currentActive) {
                e.preventDefault();
                currentActive.click();
            }
            break;
    }
}

/**
 * Hides the suggestions if a click occurs outside the search components.
 * @param {MouseEvent} event The click event.
 */
function handleOutsideClick(event) {
    if (
        !searchQueryInput.contains(event.target) &&
        !suggestionsContainer.contains(event.target)
    ) {
        suggestionsContainer.innerHTML = '';
    }
}

/**
 * Initializes all search-related event listeners.
 */
export function initSearch() {
    searchForm.addEventListener('submit', handleSearch);
    searchQueryInput.addEventListener('input', getSuggestions);
    searchQueryInput.addEventListener('keydown', handleKeyboardNav);
    searchQueryInput.addEventListener('focus', getSuggestions);
    document.addEventListener('click', handleOutsideClick);

    // Check to make sure the searchEngineSelector element exists before adding a listener
    if (searchEngineSelector) {
        searchEngineSelector.addEventListener('click', (e) => {
            const clickedButton = e.target.closest('.engine-btn');
            if (!clickedButton) return;

            // Update the state variable
            selectedEngine = clickedButton.dataset.engine;

            // Update the UI
            const currentActive = searchEngineSelector.querySelector('.active');
            if (currentActive) {
                currentActive.classList.remove('active');
            }
            clickedButton.classList.add('active');
        });
    }
}
