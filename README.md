# My Personal Web Dashboard

A personal, dynamic dashboard built from scratch to learn and apply core concepts of modern web development. This project features a clean, responsive UI, API-driven widgets, and a professional development environment orchestrated with Docker.

![Dashboard Screenshot](https://github.com/gazaka/learning_homepage/blob/main/src/assets/images/dashboard-screeenshot.png) <!-- You can replace this with a real screenshot of your dashboard later! -->

## ✨ Core Features

- **Responsive Dark-Themed UI:** A clean, modern interface designed to be easy on the eyes, adapting seamlessly to both desktop and mobile screens.
- **Dynamic Smart Header:** Displays the current time, full date, and live weather conditions based on the user's location.
- **5-Day Weather Forecast:** A dedicated widget showing the forecast for the next five days.
- **Detailed Weather Modal:** Clicking on any forecast day opens a detailed pop-up modal showing wind speed, humidity, and a scrollable hourly forecast for that specific day.
- **Modern Search Widget:** A central feature for searching across multiple platforms (Google, DuckDuckGo, YouTube).
    - **Icon-Based Selector:** A sleek, button-based UI to select the search engine, replacing traditional radio buttons.
    - **Live Predictive Suggestions:** A clean overlay provides search suggestions as you type.
    - **Full Keyboard & Mouse Navigation:** Seamlessly select suggestions using arrow keys and Enter, or with the mouse.
- **User-Editable Quick Links:**
    - A responsive grid of links to frequently used sites and services.
    - Users can add new links via a pop-up modal. The system is smart enough to handle both full URLs and simple search terms (which are automatically converted to Google searches).
    - Users can delete any link with a single click.
    - All links are saved to the browser's `localStorage`, so they persist between sessions.
- **Subtle Theme Customization:**
    - A static, triangular cluster of buttons in the corner allows users to switch between multiple themes (Default Dark, Retro Green, Sepia).
    - The user's theme choice is saved to `localStorage`.
- **Advanced Code & UI Quality:**
    - **API Caching:** Weather and quote data are cached to improve performance and reduce API calls on page refresh.
    - **Geolocation:** Automatically detects the user's location, with a graceful fallback to a default if permission is denied. It also remembers the location to prevent asking on every visit.
    - **User-Facing Error Handling:** Widgets display a clear error message if an API call fails.
    - **Modular Codebase:** The entire frontend JavaScript is broken down into clean, manageable modules for each feature (`weather.js`, `search.js`, etc.).

## 🛠️ Tech Stack & Tooling

- **Frontend:** HTML5, CSS3, Modular JavaScript (ES6+)
- **Backend (Proxy Server):** Node.js with Express.js and Axios
- **Development Tooling:**
    - **ESLint & Prettier:** For professional-grade code linting and automatic formatting.
- **Environment:** Docker & Docker Compose
- **Web Server:** Nginx

## 🚀 Getting Started

To run this project locally, you will need [Git](https://git-scm.com/), [Docker Desktop](https://www.docker.com/products/docker-desktop/), and [Node.js](https://nodejs.org/) (for `npm`) installed.

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/your-username/learning_homepage.git](https://github.com/your-username/learning_homepage.git)
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
