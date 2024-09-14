# Weather Forecast Application

A simple weather forecast application that allows users to get real-time weather updates by entering a city and country code. The app provides weather details and suggestions based on the weather condition codes returned from the OpenWeatherMap API.

## Features
- Search weather for any city and country.
- Real-time weather information fetched from the [OpenWeatherMap API](https://openweathermap.org/).
- Cached weather data to improve response time.
- Weather suggestions based on current conditions (e.g., thunderstorms, drizzle, snow, etc.).
- Error handling for invalid inputs or API issues.

## Technologies Used
- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web application framework for Node.js.
- **Axios**: Promise-based HTTP client for making API requests.
- **EJS**: Embedded JavaScript for rendering dynamic content.
- **Body-Parser**: Middleware for parsing incoming request bodies.
- **dotenv**: Environment variables for storing sensitive API keys.
- **OpenWeatherMap API**: Provides weather data for any location in the world.

## Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.
- An API key from [OpenWeatherMap](https://openweathermap.org/api).

### Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/Lost-sudo/WeatherForecast.git
    ```

2. Navigate to the project directory:
    ```bash
    cd WeatherForecast
    ```

3. Install the necessary dependencies:
    ```bash
    npm install
    ```

4. Create a `.env` file in the root directory and add your OpenWeatherMap API key:
    ```bash
    API_KEY=your_openweather_api_key
    ```

### Running the Application
1. Start the server:
    ```bash
    npm start
    ```

2. Open your browser and go to `http://localhost:3000`.

### How to Use
- Enter a city name and country code in the input fields (e.g., `London`, `GB` for London, United Kingdom).
- Click the "Get Weather" button to retrieve the weather information.
- The application will display the current weather conditions, temperature, and a weather suggestion based on the conditions.

### API Endpoints
- **GET `/`**: Displays the weather search form.
- **POST `/getWeather`**: Fetches weather data based on the user's input and returns the current weather along with a suggestion.

### Project Structure
- **public/**: Contains static files (e.g., styles, images).
- **views/**: Contains EJS templates for rendering the user interface.
- **index.js**: Main server file containing all the application logic.
- **.env**: Contains environment variables (not tracked by Git).

### Contributions
Contributions are welcome! If you have any suggestions or find a bug, feel free to open an issue or submit a pull request.

### License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
