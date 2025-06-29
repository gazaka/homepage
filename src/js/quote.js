// src/js/quote.js

// Immediately Invoked Function Expression to prevent scope pollution
(function() {
    const quoteWidget = document.getElementById('quote-widget');
    const quoteTextElement = document.getElementById('quote-text');
    const quoteAuthorElement = document.getElementById('quote-author');

    const CACHE_DURATION_MINUTES = 360; // 6 hours
    const CACHE_DURATION_MS = CACHE_DURATION_MINUTES * 60 * 1000;

    function displayQuote(data) {
        quoteTextElement.textContent = `"${data.quote}"`;
        quoteAuthorElement.textContent = `— ${data.author}`;
    }

    window.getQuote = async function() {
        const cachedQuote = localStorage.getItem('quoteData');
        const cachedTimestamp = localStorage.getItem('quoteTimestamp');

        if (cachedQuote && cachedTimestamp) {
            if (Date.now() - cachedTimestamp < CACHE_DURATION_MS) {
                console.log('Loading quote from cache.');
                displayQuote(JSON.parse(cachedQuote));
                return;
            }
        }

        console.log('Fetching new quote from API.');
        try {
            const apiBase = window.location.hostname === 'localhost' 
                ? 'http://localhost:3000' 
                : window.location.hostname === 'dashboard.yourdomain.com' 
                ? 'http://proxy:3000'
                : '';
            const response = await fetch(`${apiBase}/api/quotes/random`);
            if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            localStorage.setItem('quoteData', JSON.stringify(data));
            localStorage.setItem('quoteTimestamp', Date.now());

            displayQuote(data);
        } catch (error) {
            console.error('Fetch error:', error);
            quoteWidget.innerHTML = `<div class="widget-error">Could not load quote.</div>`;
        }
    };
})();
