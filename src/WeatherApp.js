import React, { useEffect, useState } from 'react';
import './WeatherApp.css';

const WeatherApp = () => {
    const cacheKey = "weatherDataCache";
    const [weatherData, setWeatherData] = useState([]);
    const colors = [
        "#388ee7",
        "#42b983",
        "#f39c12",
        "#e74c3c",
        "#9b59b6",
        "#3498db",
        "#a83256",
        "#087d8a"
    ];
    useEffect(() => {
        
        const apiKey = "aa1e409b7363b4542ba262bae3cbc73c";
        const apiUrl = "https://api.openweathermap.org/data/2.5/group?id=1248991,1850147,2644210,2988507,2147714,4930956,1796236,3143244&units=metric&appid=" + apiKey;
        const cacheExpiration = 300 * 1000; // 300 seconds = 5 minutes

        async function fetchDataWithCache(url) {
            const cachedData = localStorage.getItem(cacheKey);

            if (cachedData) {
                const { data, timestamp } = JSON.parse(cachedData);
                if (timestamp + cacheExpiration > Date.now()) {
                    setWeatherData(data.list);
                    return;
                }
            }

            try {
                const response = await fetch(url);
                const data = await response.json();

                localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
                setWeatherData(data.list);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchDataWithCache(apiUrl);
    }, []);

    return (
        <div>
            <div className="Main-title pb-5">
                <h1 className="pt-5 pb-lg-5"><img src="img/weatherLogo.png" className="img-responsive" width="4%" alt='weatherLogo' /> Weather App</h1>
            </div>

            <div id="weather-container" className="mb-5">
                {weatherData.map((city) => {
                    const randomColor = colors[Math.floor(Math.random() * colors.length)];
                    return (
                        <div className="card" key={city.id}>
                            <div className="card-header" style={{ backgroundColor: randomColor }}>
                                <div className="card-city">
                                    <h3>{city.name}</h3>
                                    <p>{new Date(city.dt * 1000).toLocaleString()}</p>
                                    <div className="card-weather">
                                        <img src={`img/${city.weather[0].description}.png`} style={{ alignSelf: 'flex-start' }} alt={city.weather[0].description} />
                                        <p>{city.weather[0].description}</p>
                                    </div>
                                </div>
                                <div className="card-temperature">
                                    <h3 className="temp">{city.main.temp} °C</h3>
                                    <p className="range">{city.main.temp_min} °C</p>
                                    <p className="range">{city.main.temp_max} °C</p>
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="card-details">
                                    <div style={{ borderRight: '1px solid #515566', paddingLeft: '10px', paddingRight: '10px' }}>
                                        <p><span className="bold">Pressure:</span> {city.main.pressure}hPa</p>
                                        <p><span className="bold">Humidity:</span> {city.main.humidity}%</p>
                                        <p><span className="bold">Visibility:</span> {city.visibility}m</p>
                                    </div>
                                    <div className="wind" style={{ borderRight: '1px solid #515566', paddingRight: '33px' }}>
                                        <img src="img/wind.png" alt="Wind" />
                                        <p>{city.wind.speed}m/s 120 Degree</p>
                                    </div>
                                    <div style={{ paddingRight: '10px' }}>
                                        <p><span className="bold">Sunrise:</span> {new Date(city.sys.sunrise * 1000).toLocaleTimeString()}</p>
                                        <p><span className="bold">Sunset:</span> {new Date(city.sys.sunset * 1000).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <footer>
                <p className="mt-2">2023 © M.S.M. Shiraf Shibly</p>
            </footer>
        </div>
    );
}

export default WeatherApp;
