const timeElement = document.getElementById('current-time');
const dateElement = document.getElementById('current-date');

function updateTimeAndDate() {
    const now = new Date();
    const timeString = now.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' });
    timeElement.textContent = timeString;
    const dateString = now.toLocaleDateString(navigator.language, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    dateElement.textContent = dateString;
}

export function initClock() {
    updateTimeAndDate();
    setInterval(updateTimeAndDate, 1000);
}