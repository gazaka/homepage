# My Learning Homepage

A personal, dynamic dashboard built from scratch to learn and apply core concepts of modern web development, containerization, and client-server architecture. The dashboard provides at-a-glance information and quick access to frequently used services.

![Dashboard Screenshot](https://i.imgur.com/rL4e1aQ.png) <!-- You can replace this with a real screenshot of your dashboard later! -->

## ✨ Core Features

* **Responsive Dark-Themed UI:** A clean, modern interface designed to be easy on the eyes, adapting seamlessly to both desktop and mobile screens.
* **Smart Header:** Displays the current time, full date, and live weather conditions for a specific location.
* **5-Day Weather Forecast:** A dedicated widget showing the forecast for the next five days, including high/low temperatures and weather icons.
* **Universal Search Bar:** A central feature for searching across multiple platforms (Google, DuckDuckGo, YouTube).
    * **Live Predictive Suggestions:** As you type, a list of search suggestions appears in real-time.
    * **Full Keyboard & Mouse Navigation:** Users can use `ArrowUp`, `ArrowDown`, and `Enter` keys, or the mouse, to select suggestions. The UI handles both input methods seamlessly without conflicts.
* **Quick Links Widget:** An organized, responsive grid of links to frequently used websites and local services, complete with icons.
* **Random Quote Widget:** Fetches and displays a new random quote from an external API on each page load.

## 🛠️ Tech Stack

This project utilizes a multi-container Docker environment to simulate a real-world application architecture.

* **Frontend:**
    * HTML5 & CSS3 (Flexbox and CSS Grid for responsive layouts)
    * JavaScript (ES6+)
        * `async/await` and the `fetch` API for all network requests.
        * Advanced DOM manipulation for dynamic content and UI state management.
* **Backend (Proxy Server):**
    * **Node.js** with **Express.js** to create a lightweight server.
    * **Axios** for making robust server-side API requests.
    * **CORS** middleware to securely connect the frontend and backend.
    * **dotenv** for securely managing environment variables (like API keys).
* **APIs Used:**
    * **WeatherAPI.com:** Provides current weather and 5-day forecast data.
    * **DummyJSON:** Provides random quotes.
    * **DuckDuckGo:** Provides search suggestions (via the proxy).
* **Environment:**
    * **Docker & Docker Compose:** For containerization and easy orchestration of all services.
    * **Nginx:** A lightweight, high-performance web server for the frontend.

## 📂 Project Structure

* `learning_homepage/` (Root Directory)
    * `.env` (Local secrets, not committed to Git)
    * `.gitignore`
    * `Dockerfile` (For the frontend Nginx server)
    * `docker-compose.yml`
    * `README.md` (You are here!)
    * `proxy/` (Backend Proxy Server)
        * `Dockerfile` (For the Node.js server)
        * `package.json`
        * `server.js`
    * `src/` (Frontend Application Code)
        * `index.html`
        * `assets/`
            * `images/`
                * `favicon.png`
        * `css/`
            * `style.css`
        * `js/`
            * `main.js`

## 🚀 Getting Started

To run this project locally, you will need [Git](https://git-scm.com/) and [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed.

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/learning_homepage.git](https://github.com/your-username/learning_homepage.git)
    cd learning_homepage
    ```

2.  **Create the environment file:**
    Create a file named `.env` in the project's root directory. Add your free API key from [WeatherAPI.com](https://www.weatherapi.com/):
    ```env
    WEATHER_API_KEY=your_api_key_goes_here
    ```

3.  **Build and run the containers:**
    This command will build the images for the first time and start both the frontend and backend services.
    ```bash
    docker-compose up --build
    ```

4.  **Open the application:**
    Navigate to `http://localhost:8080` in your web browser.

## ⚙️ How It Works: Architecture

The application runs in two separate containers managed by Docker Compose:

1.  **`web` (Nginx Frontend):** This container serves the static files (`index.html`, `css`, `js`, `assets`). It is exposed on port `8080` and is what the user interacts with.

2.  **`proxy` (Node.js Backend):** This container runs a small Express.js server that acts as a secure intermediary. Its job is to handle API requests from the frontend, add the secret API key, and call the external services (like WeatherAPI.com). This is crucial for bypassing browser CORS security limitations and protecting the secret API key. The proxy is exposed on port `3000`.

