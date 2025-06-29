// src/js/theme.js

const themeController = document.getElementById('theme-controller');
const body = document.body;

/**
 * Applies a theme by setting the class on the body element.
 * @param {string} themeName The name of the theme to apply.
 */
function applyTheme(themeName) {
    // Clear any existing theme classes
    body.className = '';

    if (themeName !== 'default-dark') {
        body.classList.add(`theme-${themeName}`);
    }

    // Update active state on buttons
    const buttons = themeController.querySelectorAll('.theme-btn');
    buttons.forEach((btn) => {
        if (btn.dataset.theme === themeName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Save the chosen theme to localStorage
    localStorage.setItem('selectedTheme', themeName);
}

/**
 * Initializes the theme switcher functionality.
 */
function initTheme() {
    // Add a single click listener to the parent container
    themeController.addEventListener('click', (event) => {
        // Check if a theme button was clicked
        if (event.target.classList.contains('theme-btn')) {
            const themeName = event.target.dataset.theme;
            applyTheme(themeName);
        }
    });

    // On page load, check if a theme is saved in localStorage
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        // Ensure a default theme is active on first load
        applyTheme('default-dark');
    }
}
