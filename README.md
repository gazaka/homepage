# My Personal Web Dashboard

A personal, dynamic dashboard built from scratch to learn and apply core concepts of modern web development. This project features a clean, responsive UI, API-driven widgets, and a professional development environment orchestrated with Docker.

![Dashboard Screenshot](https://github.com/gazaka/learning_homepage/blob/main/src/assets/images/dashboard-screeenshot.png) <!-- You can replace this with a real screenshot of your dashboard later! -->

## ✨ Core Features

- **Organized & Customizable Layout:**

    - **Section Headers:** The UI is organized into logical groups like "Core" and "Info" for better readability.
    - **Collapsible Widgets:** Each widget can be collapsed to hide its content, and its state is saved between sessions, allowing for a customized view.

- **Dynamic Smart Header:** Displays the current time, full date, and live weather conditions based on the user's location.

- **5-Day Weather Forecast:**

    - A dedicated widget showing the forecast for the next five days.
    - **Detailed Weather Modal:** Clicking on any forecast day opens a detailed pop-up modal showing wind speed, humidity, and a scrollable hourly forecast.
    - **Smart Scrolling:** When viewing today's details, the hourly forecast automatically scrolls to the current hour. The modal can be closed by pressing `Escape` or clicking outside of it.

- **Advanced Search Widget:**

    - A central feature for searching across Google, DuckDuckGo, and YouTube, with a modern, icon-based selector.
    - **Live Predictive Suggestions:** A clean overlay provides search suggestions as you type.
    - **"Type Anywhere" Functionality:** Simply start typing anywhere on the page to automatically focus the search bar.
    - **Quick Clear:** Pressing the `Escape` key while in the search box clears the input and suggestions.
    - **Full Keyboard & Mouse Navigation:** Seamlessly select suggestions using arrow keys and Enter, or with the mouse.

- **User-Editable Quick Links:**

    - A responsive grid of links to frequently used sites and services.
    - **Add/Delete Links:** Users can add new links via a pop-up modal and delete any link with a single click.
    - **Smart Input:** The URL field intelligently handles both full URLs (e.g., `https://google.com`) and simple search terms (which are automatically converted to Google searches).
    - **Persistent Storage:** All user-added links are saved to the browser's `localStorage`, so they persist between sessions.

- **Subtle Theme Customization:**

    - A static, triangular cluster of buttons in the corner allows users to switch between multiple themes (Default Dark, Retro Green, Sepia).
    - The user's theme choice is saved to `localStorage`.

- **Code & Performance Quality:**
    - **API Caching:** Weather and quote data are cached to improve performance and reduce API calls on page refresh.
    - **Geolocation:** Automatically detects the user's location, with a graceful fallback to a default if permission is denied. The location is saved to avoid asking on every visit.
    - **User-Facing Error Handling:** Widgets display a clear error message if an API call fails.
    - **Modular Codebase:** The entire frontend JavaScript is broken down into clean, single-purpose modules (`weather.js`, `search.js`, etc.) for maintainability.

## 🛠️ Tech Stack & Tooling

- **Frontend:** HTML5, CSS3, Modular JavaScript (ES6+)
- **Backend (Proxy Server):** Node.js with Express.js and Axios
- **Development Tooling:**
    - **ESLint:** For static code analysis to find and fix problems.
    - **Prettier:** For automated, consistent code formatting.
- **Environment:** Docker & Docker Compose
- **Web Server:** Nginx (configured as a reverse proxy for API calls)

## 🚀 Getting Started

To run this project locally, you will need [Git](https://git-scm.com/), [Docker Desktop](https://www.docker.com/products/docker-desktop/), and [Node.js](https://nodejs.org/) (for `npm`) installed.

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/gazaka/learning_homepage.git](https://github.com/gazaka/learning_homepage.git)
    cd learning_homepage
    ```

2.  **Install Root Dependencies:**
    This installs development tools like ESLint and Prettier.

    ```bash
    npm install
    ```

3.  **Create the Environment File:**
    Create a file named `.env` in the project's root. Add your free API key from [WeatherAPI.com](https://www.weatherapi.com/):

    ```env
    WEATHER_API_KEY=your_api_key_goes_here
    ```

4.  **Build and Run the Containers:**
    This command will build the images and start both the frontend and backend services.

    ```bash
    docker-compose up --build
    ```

5.  **Open the Application:**
    Navigate to `http://localhost:8080` in your web browser.

## 💻 Development

This project is set up with professional code quality tools.

- **To automatically format all files:**
    ```bash
    npm run format
    ```
- **To find potential errors and bugs in the code:**
    ```bash
    npm run lint
    ```
