import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import dotenv from "dotenv"; // Importing dotenv to load environment variables from a .env file

dotenv.config(); // Loading environment variables from a .env file

const app = express();
const port = 3000;
const API_URL = "http://api.openweathermap.org/geo/1.0/direct";
const API_URL2 = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = process.env.API_KEY; // Storing the API key from environment variables

const cache = {};

const CACHE_TTL = 10 * 60 * 1000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", {
    weatherData: null,
    suggestion: null,
    error: null,
  });
});

function getWeatherSuggestion(code) {
  let suggestion = "";

  switch (code) {
    // Thunderstorm
    case 200:
      suggestion =
        "Light rain and thunder. Stay indoors and avoid outdoor activities that require stability.";
      break;
    case 201:
      suggestion =
        "Rain and thunder. Ensure that you’re in a safe place away from potential lightning strikes.";
      break;
    case 202:
      suggestion =
        "Heavy rain and thunder. Be cautious of flooding and avoid traveling if possible.";
      break;
    case 210:
      suggestion =
        "Mild thunderstorm. It's a good idea to stay indoors or under cover.";
      break;
    case 211:
      suggestion =
        "Standard thunderstorm. Seek shelter and stay away from tall objects and open fields.";
      break;
    case 212:
      suggestion =
        "Intense thunderstorm. Be cautious of strong winds and potential flooding.";
      break;
    case 221:
      suggestion =
        "Unstable and unpredictable thunderstorm. Stay alert and avoid outdoor activities.";
      break;
    case 230:
      suggestion =
        "Light drizzle and thunder. Keep an umbrella handy and stay indoors if possible.";
      break;
    case 231:
      suggestion =
        "Drizzle and thunder. Dress appropriately for light rain and stay safe from lightning.";
      break;
    case 232:
      suggestion =
        "Heavy drizzle and thunder. Prepare for possible flooding and reduce travel.";
      break;

    // Drizzle
    case 300:
      suggestion =
        "Light, persistent drizzle. Keep an umbrella handy and be cautious of wet surfaces.";
      break;
    case 301:
      suggestion =
        "General drizzle. Dress appropriately for light rain and watch out for slippery sidewalks.";
      break;
    case 302:
      suggestion =
        "More intense drizzle. Be prepared for a bit more water on the roads and possibly use rain gear.";
      break;
    case 310:
      suggestion =
        "Light drizzle mixed with rain. Use waterproof clothing and take care on wet roads.";
      break;
    case 311:
      suggestion =
        "Light rain with drizzle. Prepare for a damp day and potential mild flooding in low areas.";
      break;
    case 312:
      suggestion =
        "Persistent heavy drizzle. Expect wet conditions and potential mild flooding.";
      break;
    case 313:
      suggestion =
        "Showers mixed with drizzle. Be prepared for changing conditions and carry an umbrella.";
      break;
    case 314:
      suggestion =
        "Heavy showers with drizzle. Expect wet conditions and potential puddling; drive carefully.";
      break;
    case 321:
      suggestion =
        "Showers with light drizzle. Be cautious on the roads and prepare for wet weather.";
      break;

    // Rain
    case 500:
      suggestion =
        "Light rain showers. Carry an umbrella and be cautious of wet sidewalks.";
      break;
    case 501:
      suggestion =
        "Steady rain. Use rain gear and watch for possible localized flooding.";
      break;
    case 502:
      suggestion =
        "Heavy rain showers. Prepare for potential flooding and reduced visibility.";
      break;
    case 503:
      suggestion =
        "Intense rain. Avoid travel if possible and be cautious of flood warnings.";
      break;
    case 504:
      suggestion =
        "Extremely heavy rain. Stay indoors and avoid driving unless absolutely necessary.";
      break;
    case 511:
      suggestion =
        "Rain that may freeze on contact. Be cautious of ice on sidewalks and roads; avoid travel if possible.";
      break;
    case 520:
      suggestion =
        "Light rain showers. Carry an umbrella and be cautious of slippery conditions.";
      break;
    case 521:
      suggestion =
        "Showers of rain. Prepare for wet conditions and possible minor flooding.";
      break;
    case 522:
      suggestion =
        "Heavy rain showers. Watch out for heavy flooding and consider postponing travel.";
      break;
    case 531:
      suggestion =
        "Unpredictable showers. Be prepared for sudden changes in weather and carry appropriate rain gear.";
      break;

    // Snow
    case 600:
      suggestion =
        "Light snow showers. Dress warmly and be cautious of slippery roads.";
      break;
    case 601:
      suggestion =
        "Snowfall. Prepare for snow-covered roads and possible travel disruptions.";
      break;
    case 602:
      suggestion =
        "Heavy snowfall. Avoid unnecessary travel and be prepared for significant snow accumulation.";
      break;
    case 611:
      suggestion =
        "Mix of rain and snow with ice. Watch out for slippery conditions and potential ice accumulation.";
      break;
    case 612:
      suggestion =
        "Light sleet showers. Prepare for icy conditions on roads and sidewalks.";
      break;
    case 613:
      suggestion =
        "Sleet showers. Be cautious of icy surfaces and drive carefully.";
      break;
    case 615:
      suggestion =
        "Mix of light rain and snow. Watch for slippery conditions and potential mild accumulation.";
      break;
    case 616:
      suggestion =
        "Rain mixed with snow. Prepare for wet and potentially icy conditions.";
      break;
    case 620:
      suggestion = "Light snow showers. Be cautious of slippery conditions.";
      break;
    case 621:
      suggestion =
        "Snow showers. Expect snow accumulation and be cautious on the roads.";
      break;
    case 622:
      suggestion =
        "Heavy snow showers. Prepare for significant snow accumulation and potential travel disruptions.";
      break;

    // Atmosphere
    case 701:
      suggestion = "Light mist. Visibility may be reduced; drive cautiously.";
      break;
    case 711:
      suggestion =
        "Smoke in the air. Avoid outdoor activities if possible and be cautious of air quality.";
      break;
    case 721:
      suggestion =
        "Reduced visibility due to haze. Drive carefully and be aware of poor air quality.";
      break;
    case 731:
      suggestion =
        "Dust whirls. Be cautious of reduced visibility and potential dust in the air.";
      break;
    case 741:
      suggestion =
        "Dense fog. Visibility will be very limited; use fog lights and drive slowly.";
      break;
    case 751:
      suggestion =
        "Sand in the air. Be cautious of reduced visibility and potential sand accumulation.";
      break;
    case 761:
      suggestion =
        "General dust. Watch for reduced visibility and potential dust accumulation.";
      break;
    case 762:
      suggestion =
        "Volcanic ash. Avoid travel if possible and protect yourself from ash inhalation.";
      break;
    case 771:
      suggestion =
        "Sudden, strong gusts of wind. Secure loose objects and avoid outdoor activities.";
      break;
    case 781:
      suggestion =
        "Tornado conditions. Seek immediate shelter in a safe, sturdy structure.";
      break;

    // Clear
    case 800:
      suggestion =
        "Clear conditions. Enjoy outdoor activities and good visibility.";
      break;

    // Clouds
    case 801:
      suggestion =
        "Mostly clear with a few clouds. Generally pleasant weather for outdoor activities.";
      break;
    case 802:
      suggestion =
        "Partly cloudy. Expect some sunshine with occasional cloud cover.";
      break;
    case 803:
      suggestion = "Mostly cloudy. Cloudy skies with occasional breaks of sun.";
      break;
    case 804:
      suggestion =
        "Cloudy with no sun. Be prepared for cooler temperatures and possibly overcast conditions.";
      break;

    default:
      suggestion =
        "Weather code not recognized. Please check the code and try again.";
      break;
  }

  return suggestion;
}

app.post("/getWeather", async (req, res) => {
  const cityName = req.body.cityName.trim();
  const countryCode = req.body.countryCode.trim().toUpperCase();
  const place = `${cityName},${countryCode}`;
  const cacheKey = `${place}`;

  // Checking if the weather data for the requested place is already cached and still valid
  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_TTL) {
    // If valid cache exists, render the page with cached data
    return res.render("index.ejs", {
      weatherData: cache[cacheKey].data,
      suggestion: getWeatherSuggestion(cache[cacheKey].data.weather[0].id),
      error: null,
    });
  }

  try {
    const details = await axios.get(API_URL, {
      params: {
        q: place,
        appid: API_KEY,
      },
    });

    if (details.data.length === 0) {
      return res.render("index.ejs", {
        error: "City not found. Please check your city and country code.",
        weatherData: null,
        suggestion: null,
      });
    }

    const latitude = details.data[0].lat;
    const longitude = details.data[0].lon;

    const response = await axios.get(API_URL2, {
      params: {
        lat: latitude,
        lon: longitude,
        appid: API_KEY,
        units: "imperial",
      },
    });

    const weatherData = response.data;

    // Caching the weather data with a timestamp for future requests
    cache[cacheKey] = {
      data: weatherData,
      timestamp: Date.now(),
    };

    res.render("index.ejs", {
      weatherData: weatherData,
      suggestion: getWeatherSuggestion(weatherData.weather[0].id),
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.render("index.ejs", {
      error:
        "An error occurred while fetching the weather data. Please try again later.",
      weatherData: null,
      suggestion: null,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
