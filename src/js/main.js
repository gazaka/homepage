// Import the initialization functions and data handlers from our modules
import { initClock } from './clock.js';
import { getWeather } from './weather.js';
import { renderLinks } from './links.js';
import { getQuote } from './quote.js';
import { initSearch } from './search.js';

// This is the main entry point for our application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all the different parts of our dashboard
    initClock();
    initSearch();
    renderLinks();
    getWeather();
    getQuote();
});
