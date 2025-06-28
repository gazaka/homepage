// Get all the necessary HTML elements for the search functionality
const searchForm = document.getElementById('search-form');
const searchQueryInput = document.getElementById('search-query');
const suggestionsContainer = document.getElementById('suggestions-container');
const searchEngineSelector = document.getElementById('search-engine-selector');

// A state variable to keep track of the selected search engine
let selectedEngine = 'duckduckgo';
let debounceTimer;

/**
 * Handles the main search form submission.
 * @param {Event} event The form submission event.
 */
function handleSearch(event) {
    event.preventDefault();
    const query = searchQueryInput.value.trim();
    if (!query) return;

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
            `/api/suggestions?q=${encodeURIComponent(query)}`
        );
        if (!response.ok) {
            // If we get a rate-limit error, we can just silently ignore it
            if (response.status === 429) {
                console.warn('Suggestion rate limit hit.');
                return;
            }
            throw new Error(`Server responded with ${response.status}`);
        }
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
 * Handles ArrowUp, ArrowDown, Enter, and Escape key presses for suggestion navigation.
 * @param {KeyboardEvent} e The keyboard event.
 */
function handleKeyboardNav(e) {
    const suggestions =
        suggestionsContainer.querySelectorAll('.suggestion-item');

    // NEW: Handle the Escape key to clear the search
    if (e.key === 'Escape') {
        searchQueryInput.value = '';
        suggestionsContainer.innerHTML = '';
        searchQueryInput.blur(); // Removes focus from the input
        return;
    }

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

        case ' ': // Listen for the spacebar
            if (currentActive) {
                e.preventDefault(); // Stop a space from being added
                searchQueryInput.value = currentActive.textContent; // Autofill the input
                suggestionsContainer.innerHTML = ''; // Clear the suggestions
            }
            break;
    }
}

/**
 * Hides the suggestions if a click occurs outside the search components.
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

    // Instead of calling getSuggestions directly, we use a debounced approach.
    searchQueryInput.addEventListener('input', () => {
        // Clear the previous timer every time the user types a new character
        clearTimeout(debounceTimer);
        // Set a new timer
        debounceTimer = setTimeout(() => {
            getSuggestions();
        }, 300); // Wait 300ms after the user stops typing
    });

    searchQueryInput.addEventListener('keydown', handleKeyboardNav);
    searchQueryInput.addEventListener('focus', getSuggestions);
    document.addEventListener('click', handleOutsideClick);

    if (searchEngineSelector) {
        searchEngineSelector.addEventListener('click', (e) => {
            const clickedButton = e.target.closest('.engine-btn');
            if (!clickedButton) return;

            selectedEngine = clickedButton.dataset.engine;

            const currentActive = searchEngineSelector.querySelector('.active');
            if (currentActive) {
                currentActive.classList.remove('active');
            }
            clickedButton.classList.add('active');
        });
    }

    // Global Key Listener for "Type Anywhere"
    document.addEventListener('keydown', (e) => {
        const activeElement = document.activeElement;
        const isTypingInInput =
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA';
        const isModalOpen =
            !document
                .getElementById('add-link-modal-overlay')
                .classList.contains('hidden') ||
            !document
                .getElementById('modal-overlay')
                .classList.contains('hidden');

        if (isTypingInInput || isModalOpen) {
            return;
        }

        if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
            searchQueryInput.focus();
        }
    });
}
