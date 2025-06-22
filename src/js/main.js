// Import the initialization functions and data handlers from our modules
import { initTheme } from './theme.js';
import { initWidgetManager } from './widgetManager.js';
import { initClock } from './clock.js';
import { getWeather } from './weather.js';
import { initLinks } from './links.js';
import { getQuote } from './quote.js';
import { initSearch } from './search.js';

// This is the main entry point for our application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all the different parts of our dashboard
    initWidgetManager();
    initTheme();
    initClock();
    initSearch();
    initLinks();
    getWeather();
    getQuote();
});
