/* eslint-disable */
// Load all script files in order
const scripts = [
    'widgetManager.js',
    'theme.js',
    'clock.js',
    'search.js',
    'data.js',
    'links.js',
    'weather.js',
    'quote.js'
];

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'js/' + src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
}

// Load all scripts sequentially
document.addEventListener('DOMContentLoaded', async () => {
    try {
        for (const script of scripts) {
            await loadScript(script);
        }
        
        // Initialize components after all scripts are loaded
        if (typeof initWidgetManager === 'function') initWidgetManager();
        if (typeof initTheme === 'function') initTheme();
        if (typeof initClock === 'function') initClock();
        if (typeof initSearch === 'function') initSearch();
        if (typeof initLinks === 'function') initLinks();
        if (typeof getWeather === 'function') getWeather();
        if (typeof getQuote === 'function') getQuote();
    } catch (error) {
        console.error('Script loading failed:', error);
    }
});
