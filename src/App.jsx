import "./App.css"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async (location) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/today?unitGroup=metric&include=hours&key=${API_KEY}&contentType=json`
      );
      console.log(response.data);
      setWeatherData(response.data);
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (location) {
      fetchWeather(location);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(`${latitude},${longitude}`);
      },
      (err) => {
        setError("Unable to fetch your location. Please enter a location manually.");
      }
    );
  }, []);

  return (
    <div className="App">
      <h1>Weather App</h1>
      <input
        type="text"
        placeholder="Enter location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Loading..." : "Get Weather"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {weatherData && weatherData.days[0] ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2>{weatherData.resolvedAddress}</h2>
          <p>Temperature: {weatherData.days[0].temp}°C</p>
          <p>Wind Speed: {weatherData.days[0].windspeed} km/h</p>
          <p>Conditions: {weatherData.days[0].conditions}</p>
          <p>Chance of Rain: {weatherData.days[0].precip}%</p>

          <h3>24-Hour Forecast</h3>
          <div>
            {weatherData.days[0].hours.map((hour, index) => (
              <div key={index}>
                <p>
                  {new Date(hour.datetimeEpoch * 1000).toLocaleTimeString()}: {hour.temp}°C, {hour.conditions}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        !loading && <p>No weather data available. Please enter a valid location.</p>
      )}
    </div>
  );
}

export default App;