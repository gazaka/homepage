import { myLinks } from './data.js';

export function renderLinks() {
    const linksGrid = document.querySelector('#links-widget .links-grid');
    linksGrid.innerHTML = '';

    myLinks.forEach((link) => {
        const listItem = document.createElement('li');
        const linkAnchor = document.createElement('a');
        const linkIcon = document.createElement('i');
        const linkSpan = document.createElement('span');

        linkAnchor.href = link.url;
        linkAnchor.target = '_blank';
        linkAnchor.rel = 'noopener noreferrer';
        linkIcon.className = link.icon;
        linkSpan.textContent = link.name;

        linkAnchor.appendChild(linkIcon);
        linkAnchor.appendChild(linkSpan);
        listItem.appendChild(linkAnchor);
        linksGrid.appendChild(listItem);
    });
}
