// --- DOM ELEMENT SELECTION ---
const linksGrid = document.querySelector('#links-widget .links-grid');
const addLinkBtn = document.getElementById('add-link-btn');
const addLinkModalOverlay = document.getElementById('add-link-modal-overlay');
const addLinkModalCloseBtn = document.getElementById(
    'add-link-modal-close-btn'
);
const addLinkForm = document.getElementById('add-link-form');
const linkNameInput = document.getElementById('link-name');
const linkUrlInput = document.getElementById('link-url');

// A variable to hold the current state of links
let currentLinks = [];

// --- FUNCTIONS ---

/**
 * Gets links from localStorage, or uses defaults if none are found.
 */
function getLinks() {
    const storedLinks = localStorage.getItem('userLinks');
    // If links are stored, use them. Otherwise, use the default links from data.js.
    currentLinks = storedLinks ? JSON.parse(storedLinks) : window.myLinks;
}

/**
 * Saves the current links array to localStorage.
 */
function saveLinks() {
    localStorage.setItem('userLinks', JSON.stringify(currentLinks));
}

/**
 * Renders the links from the 'currentLinks' array to the DOM.
 */
function renderLinks() {
    linksGrid.innerHTML = ''; // Clear existing links

    currentLinks.forEach((link, index) => {
        const listItem = document.createElement('li');

        const linkAnchor = document.createElement('a');
        linkAnchor.href = link.url;
        linkAnchor.target = '_blank';
        linkAnchor.rel = 'noopener noreferrer';

        const linkIcon = document.createElement('i');
        linkIcon.className = link.icon;

        const linkSpan = document.createElement('span');
        linkSpan.textContent = link.name;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-link-btn';
        deleteBtn.title = 'Delete Link';
        deleteBtn.innerHTML = `<i class="ph-bold ph-x"></i>`;
        deleteBtn.dataset.index = index; // Use the array index for deletion

        linkAnchor.appendChild(linkIcon);
        linkAnchor.appendChild(linkSpan);
        listItem.appendChild(linkAnchor);
        listItem.appendChild(deleteBtn);
        linksGrid.appendChild(listItem);
    });
}

/**
 * A helper function to determine if a string is a likely URL.
 * @param {string} text The input text.
 * @returns {boolean}
 */
function isLikelyUrl(text) {
    // A simple heuristic: if it contains a dot and no spaces, it's probably a URL.
    return text.includes('.') && !text.includes(' ');
}

/**
 * Adds a new link to the array, saves, and re-renders.
 * @param {string} name The name of the link.
 * @param {string} urlOrSearchTerm The user's input for the URL field.
 */
function addLink(name, urlOrSearchTerm) {
    let finalUrl;
    let icon = 'ph-bold ph-link'; // Default icon

    if (isLikelyUrl(urlOrSearchTerm)) {
        // It's a URL, so make sure it has a protocol
        if (
            !urlOrSearchTerm.startsWith('http://') &&
            !urlOrSearchTerm.startsWith('https://')
        ) {
            finalUrl = `https://${urlOrSearchTerm}`;
        } else {
            finalUrl = urlOrSearchTerm;
        }
    } else {
        // It's a search term, so create a Google search link
        finalUrl = `https://www.google.com/search?q=${encodeURIComponent(urlOrSearchTerm)}`;
        icon = 'ph-bold ph-google-logo'; // Use a Google icon for searches
    }

    currentLinks.push({
        name: name,
        url: finalUrl,
        icon: icon,
    });
    saveLinks();
    renderLinks();
}

/**
 * Deletes a link from the array by its index.
 * @param {number} index The index of the link to delete.
 */
function deleteLink(index) {
    currentLinks.splice(index, 1); // Removes 1 item at the specified index
    saveLinks();
    renderLinks();
}

// --- INITIALIZATION ---

function initLinks() {
    // Modal open/close listeners
    addLinkBtn.addEventListener('click', () => {
        addLinkModalOverlay.classList.remove('hidden');
        linkNameInput.focus();
    });
    addLinkModalCloseBtn.addEventListener('click', () => {
        addLinkModalOverlay.classList.add('hidden');
    });

    // Form submission listener
    addLinkForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = linkNameInput.value.trim();
        const urlOrSearchTerm = linkUrlInput.value.trim();
        if (name && urlOrSearchTerm) {
            addLink(name, urlOrSearchTerm);
            addLinkForm.reset();
            addLinkModalOverlay.classList.add('hidden');
        }
    });

    // Listener for delete buttons (using event delegation)
    linksGrid.addEventListener('click', (e) => {
        const deleteButton = e.target.closest('.delete-link-btn');
        if (deleteButton) {
            const indexToDelete = parseInt(deleteButton.dataset.index, 10);
            deleteLink(indexToDelete);
        }
    });

    // Initial load
    getLinks();
    renderLinks();
}
