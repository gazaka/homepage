# My Personal Web Dashboard

A personal, dynamic dashboard built from scratch to learn and apply core concepts of modern web development. This project features a clean, responsive UI, API-driven widgets, and a professional development environment orchestrated with Docker.

![Dashboard Screenshot](https://github.com/gazaka/learning_homepage/blob/main/src/assets/images/dashboard-screeenshot.png) <!-- You can replace this with a real screenshot of your dashboard later! -->

## ✨ Features

- **Dynamic Smart Header:** Displays the current time, full date, and live weather conditions based on the user's location.
- **5-Day Weather Forecast:** A dedicated widget showing the forecast for the next five days.
- **Detailed Weather Modal:** Clicking on any forecast day opens a detailed pop-up modal showing wind speed, humidity, and a scrollable hourly forecast for that specific day.
- **Universal Search Bar:** A central feature for searching across Google, DuckDuckGo, and YouTube.
    - **Live Predictive Suggestions:** A clean overlay provides search suggestions as you type.
    - **Full Keyboard & Mouse Navigation:** Seamlessly select suggestions using arrow keys and Enter, or with the mouse.
- **Dynamic Quick Links:** A responsive grid of links to frequently used sites and services, generated dynamically from a central data source in the code for easy management.
- **Random Quote Widget:** Fetches and displays a new random quote on each page load.
- **Advanced UI/UX:**
    - **API Caching:** Weather and quote data are cached in `localStorage` to improve performance and reduce API calls on page refresh.
    - **Geolocation:** Automatically detects the user's location for weather data, with a graceful fallback to a default location if permission is denied.
    - **User-Facing Error Handling:** Widgets display a clear, user-friendly error message if an API call fails.

## 🛠️ Tech Stack & Tooling

This project utilizes a multi-container Docker environment and modern development tools to ensure code quality and maintainability.

- **Frontend:**
    - HTML5 & CSS3 (Flexbox and CSS Grid)
    - **Modular JavaScript (ES6+):** Code is cleanly separated into modules for each feature (`weather.js`, `search.js`, etc.) using `import`/`export`.
- **Backend (Proxy Server):**
    - **Node.js** with **Express.js** to create a lightweight server.
    - **Axios** for making robust server-side API requests.
    - **dotenv** for securely managing environment variables.
- **Development Tooling:**
    - **ESLint:** For static code analysis to find and fix problems.
    - **Prettier:** For automated, consistent code formatting.
    - **VS Code Integration:** Configured to format and lint code automatically on save.
- **Environment:**
    - **Docker & Docker Compose:** For containerization and easy orchestration of all services.
    - **Nginx:** A lightweight web server for the frontend.

## 📂 Project Structure

- `learning_homepage/` (Root Directory)
    - `.env` (Local secrets, not committed to Git)
    - `.gitignore`
    - `eslint.config.js` (Modern ESLint configuration)
    - `.prettierrc.json` (Prettier configuration)
    - `package.json` & `package-lock.json` (For root dev dependencies like ESLint)
    - `Dockerfile` (For the frontend Nginx server)
    - `docker-compose.yml`
    - `README.md` (You are here!)
    - `proxy/` (Backend Proxy Server)
        - `Dockerfile`, `package.json`, `server.js`
    - `src/` (Frontend Application Code)
        - `index.html`
        - `assets/`
            - `images/`
                - `favicon.png`
        - `css/`
            - `style.css`
        - `js/`
            - `main.js` (Entry point)
            - `clock.js`, `data.js`, `links.js`, `quote.js`, `search.js`, `weather.js` (Modules)

## 🚀 Getting Started

To run this project locally, you will need [Git](https://git-scm.com/), [Docker Desktop](https://www.docker.com/products/docker-desktop/), and [Node.js](https://nodejs.org/) (for `npm`) installed on your machine.

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/your-username/learning_homepage.git](https://github.com/your-username/learning_homepage.git)
    cd learning_homepage
    ```

2.  **Install Root Dependencies:**
    This installs ESLint, Prettier, and other development tools.

    ```bash
    npm install
    ```

3.  **Create the Environment File:**
    Create a file named `.env` in the project's root. Add your free API key from [WeatherAPI.com](https://www.weatherapi.com/):

    ```env
    WEATHER_API_KEY=your_api_key_goes_here
    ```

4.  **Build and Run the Containers:**
    This command will build the Docker images and start both the frontend and backend services.

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
