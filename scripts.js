// --- New, corrected code for fetching a quote ---

// Find the quote elements (this part is the same)
const quoteTextElement = document.getElementById('quote-text');
const quoteAuthorElement = document.getElementById('quote-author');

// --- Universal Search Logic ---
const searchForm = document.getElementById('search-form');

function handleSearch(event) {
    // Prevent the form from reloading the page, which is the default behavior
    event.preventDefault();

    // Get the user's query from the input box
    const queryInput = document.getElementById('search-query');
    const query = queryInput.value.trim();

    // Stop if the query is empty
    if (!query) {
        return;
    }

    // Find out which search engine was selected
    const selectedEngine = document.querySelector('input[name="search-engine"]:checked').value;

    // Define the search URLs
    const searchUrls = {
        google: `https://www.google.com/search?q=${query}`,
        duckduckgo: `https://duckduckgo.com/?q=${query}`,
        youtube: `https://www.youtube.com/results?search_query=${query}`
    };

    // Get the correct URL
    const url = searchUrls[selectedEngine];

    // Open the search results in a new tab
    window.open(url, '_blank');

    // Optional: Clear the search box after searching
    queryInput.value = '';
}

// Listen for when the user submits the form (by clicking Go or pressing Enter)
searchForm.addEventListener('submit', handleSearch);

// Define a function to get a quote
async function getQuote() {
    try {
        // 1. CHANGED: Using the new, working API URL
        const response = await fetch('https://dummyjson.com/quotes/random');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();

        // 2. CHANGED: Using `data.quote` instead of `data.content`
        quoteTextElement.textContent = `"${data.quote}"`;
        quoteAuthorElement.textContent = `— ${data.author}`;

    } catch (error) {
        // This error handling is now more important than ever!
        quoteTextElement.textContent = "Couldn't fetch a quote. Please try again later.";
        console.error("Fetch error:", error);
    }
}

// Call the function when the page loads (this part is the same)
getQuote();