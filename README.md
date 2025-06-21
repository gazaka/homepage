# My Learning Homepage

A personal dashboard project built from scratch to learn and apply core concepts of web development, containerization, and client-server architecture.

## ✨ Core Features

The dashboard currently includes the following features:

* **Responsive Design:** A clean, dark-themed UI that works on both desktop and mobile devices.
* **Widget-Based Layout:** Content is organized into distinct "widget" cards.
* **Dynamic Clock:** A real-time clock that displays the current time.
* **Random Quote Widget:** Fetches and displays a new random quote from an external API on each page load.
* **Universal Search Bar:** A central feature for searching across multiple platforms.
    * Supports Google, DuckDuckGo, and YouTube.
    * **Predictive Suggestions:** As you type, a list of search suggestions appears in real-time.
    * **Full Keyboard Navigation:** Users can use `ArrowUp`, `ArrowDown`, and `Enter` to select suggestions without using the mouse.

## 🛠️ Tech Stack

This project utilizes a multi-container Docker environment to simulate a real-world application architecture.

* **Frontend:**
    * HTML5
    * CSS3 (Flexbox for responsive layout)
    * JavaScript (ES6+)
        * `async/await` for handling API calls
        * `fetch` API for making network requests
        * DOM manipulation for all dynamic content

* **Backend (Proxy Server):**
    * [Node.js](https://nodejs.org/)
    * [Express.js](https://expressjs.com/) for creating the server
    * [Axios](https://axios-http.com/) for making server-side API requests
    * [CORS](https://expressjs.com/en/resources/middleware/cors.html) middleware to securely connect the frontend and backend.

* **Environment:**
    * [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) for containerization and orchestration.
    * [Nginx](https://www.nginx.com/) as a lightweight, high-performance web server for the frontend.

## 📂 Project Structure

The project is organized with a clean separation between the application source code (`src`) and the backend proxy server (`proxy`).


* `learning_homepage/` (Root Directory)
    * `.gitignore`
    * `Dockerfile`
    * `docker-compose.yml`
    * `README.md`
    * `proxy/` (Backend Proxy Server)
        * `Dockerfile`
        * `package.json`
        * `server.js`
    * `src/` (Frontend Application Code)
        * `index.html`
        * `css/`
            * `style.css`
        * `js/`
            * `main.js`

## 🚀 Getting Started

To run this project locally, you will need [Git](https://git-scm.com/) and [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed.

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/gazaka/learning_homepage.git](https://github.com/gazaka/learning_homepage.git)
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd learning_homepage
    ```
3.  **Build and run the containers:**
    ```bash
    docker-compose up --build
    ```
4.  **Open the application:**
    Navigate to `http://localhost:8080` in your web browser.

## ⚙️ How It Works: Architecture

The application runs in two separate containers managed by Docker Compose:

1.  **`web` (Nginx Frontend):** This container serves the static files located in the `src` directory (`index.html`, `css/style.css`, `js/main.js`). It is exposed on port `8080`.

2.  **`proxy` (Node.js Backend):** This container runs a small Express.js server. Its only job is to handle requests for search suggestions from the frontend. It receives a request, calls the external DuckDuckGo API (bypassing browser CORS security limitations), and safely forwards the results back to the frontend JavaScript. It is exposed on port `3000`.
