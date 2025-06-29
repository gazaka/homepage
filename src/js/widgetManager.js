// src/js/widgetManager.js

const WIDGET_STATES_KEY = 'widgetCollapsedStates';

function loadWidgetStates() {
    const savedStates = localStorage.getItem(WIDGET_STATES_KEY);
    return savedStates ? JSON.parse(savedStates) : {};
}

function saveWidgetStates(states) {
    localStorage.setItem(WIDGET_STATES_KEY, JSON.stringify(states));
}

function applyInitialStates() {
    const states = loadWidgetStates();
    document.querySelectorAll('.widget[data-widget-id]').forEach((widget) => {
        const widgetId = widget.dataset.widgetId;
        if (states[widgetId]) {
            widget.classList.add('collapsed');
        }
    });
}

function toggleWidgetState(widget) {
    const widgetId = widget.dataset.widgetId;
    if (!widgetId) return;

    const states = loadWidgetStates();
    states[widgetId] = !widget.classList.contains('collapsed');

    widget.classList.toggle('collapsed');
    saveWidgetStates(states);
}

function initWidgetManager() {
    applyInitialStates();

    document.querySelector('.container').addEventListener('click', (event) => {
        const collapseButton = event.target.closest('.collapse-btn');
        if (collapseButton) {
            const widget = collapseButton.closest('.widget');
            if (widget) {
                toggleWidgetState(widget);
            }
        }
    });
}
