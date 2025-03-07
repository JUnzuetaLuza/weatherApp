import "./App.css"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import cloud1 from "./assets/cloud1.png";
import cloud2 from "./assets/cloud2.png";
import cloud3 from "./assets/cloud3.png";

const API_KEY =  encodeURIComponent(import.meta.env.VITE_API_KEY);

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

      <div
        className="cloud"
        style={{
          top: "10%",
          left: "-10%",
          width: "150px",
          height: "100px",
          backgroundImage: `url(${cloud1})`,
          animationDuration: "20s",
        }}
      ></div>
      <div
        className="cloud"
        style={{
          top: "30%",
          right: "-10%",
          width: "200px",
          height: "120px",
          backgroundImage: `url(${cloud2})`,
          animationDuration: "25s",
        }}
      ></div>
      <div
        className="cloud"
        style={{
          top: "50%",
          left: "-10%",
          width: "180px",
          height: "110px",
          backgroundImage: `url(${cloud3})`,
          animationDuration: "10s",
        }}
      ></div>
      
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
        </motion.div>
      ) : (
        !loading && <p>No weather data available. Please enter a valid location.</p>
      )}
    </div>
  );
}

export default App;