# learning_homepage
docker venture to the world of programming
My Learning Homepage

A personal dashboard project built from scratch to learn and apply core concepts of web development, containerization, and client-server architecture.
Core Features

The dashboard currently includes the following features:

    Responsive Design: A clean, dark-themed UI that works on both desktop and mobile devices.
    Widget-Based Layout: Content is organized into distinct "widget" cards.
    Dynamic Clock: A real-time clock that displays the current time.
    Random Quote Widget: Fetches and displays a new random quote from an external API on each page load.
    Universal Search Bar: A central feature for searching across multiple platforms.
        Supports Google, DuckDuckGo, and YouTube.
        Predictive Suggestions: As you type, a list of search suggestions appears in real-time.
        Full Keyboard Navigation: Users can use ArrowUp, ArrowDown, and Enter to select suggestions without using the mouse.

Tech Stack

This project utilizes a multi-container Docker environment to simulate a real-world application architecture.

    Frontend:
        HTML5
        CSS3 (Flexbox for responsive layout)
        JavaScript (ES6+)
            async/await for handling API calls
            fetch API for making network requests
            DOM manipulation for all dynamic content

    Backend (Proxy Server):
        Node.js
        Express.js for creating the server
        Axios for making server-side API requests
        CORS middleware to securely connect the frontend and backend.

    Environment:
        Docker & Docker Compose for containerization and orchestration.
        Nginx as a lightweight, high-performance web server for the frontend.

Project Structure

The project is organized with a clean separation between the application source code (src) and the backend proxy server (proxy).

learning_homepage/
├── .gitignore
├── Dockerfile              # Docker instructions for the frontend Nginx server
├── docker-compose.yml      # Defines and orchestrates all services
├── README.md               # You are here!
│
├── proxy/                  # Contains the backend proxy server
│   ├── Dockerfile          # Docker instructions for the Node.js server
│   ├── package.json        # Node.js project definition and dependencies
│   └── server.js           # The Express.js server code
│
└── src/                    # Contains all frontend application code
    ├── index.html          # The main HTML structure
    ├── css/
    │   └── style.css       # All custom styles
    └── js/
        └── main.js         # All JavaScript logic

Getting Started

To run this project locally, you will need Git and Docker Desktop installed.

    Clone the repository:
    Bash

git clone https://github.com/gazaka/learning_homepage.git

Navigate to the project directory:
Bash

cd learning_homepage

Build and run the containers:
Bash

    docker-compose up --build

    Open the application: Navigate to http://localhost:8080 in your web browser.

How It Works: Architecture

The application runs in two separate containers managed by Docker Compose:

    web (Nginx Frontend): This container serves the static files located in the src directory (index.html, css/style.css, js/main.js). It is exposed on port 8080.

    proxy (Node.js Backend): This container runs a small Express.js server. Its only job is to handle requests for search suggestions from the frontend. It receives a request, calls the external DuckDuckGo API (bypassing browser CORS security limitations), and safely forwards the results back to the frontend JavaScript. It is exposed on port 3000.