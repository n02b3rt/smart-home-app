"use client";

import React, { useEffect, useState } from 'react';
import { useWeather } from '@/context/WeatherContext';
import SnowIcon from '/public/icons/weather/ac_unit.svg';
import CloudIcon from '/public/icons/weather/cloud.svg';
import RainyIcon from '/public/icons/weather/rainy.svg';
import SunnyIcon from '/public/icons/weather/sunny.svg';
import DrizzleIcon from '/public/icons/weather/drizzle.svg';
import ThunderIcon from '/public/icons/weather/thunderstorm.svg';
import DefaultIcon from '/public/icons/weather/default.svg';
import './WeatherWidget.scss';

// Clear: Czyste niebo.
// Clouds: Zachmurzenie.
// Rain: Deszcz.
// Drizzle: Mżawka.
// Thunderstorm: Burza.
// Snow: Śnieg.
const WeatherWidget = () => {
    const { weather, loading, error } = useWeather(); // Dane z kontekstu
    const [displayData, setDisplayData] = useState(null);

    const weatherDataMap = {
        Clear: { icon: SunnyIcon, className: "WeatherWidget--clear" },
        Clouds: { icon: CloudIcon, className: "WeatherWidget--clouds" },
        Rain: { icon: RainyIcon, className: "WeatherWidget--rain" },
        Drizzle: { icon: DrizzleIcon, className: "WeatherWidget--drizzle" },
        Thunderstorm: { icon: ThunderIcon, className: "WeatherWidget--thunderstorm" },
        Snow: { icon: SnowIcon, className: "WeatherWidget--snow" },
        Default: { icon: DefaultIcon, className: "WeatherWidget--default" },
    };

    const getWeatherData = (main) =>
        weatherDataMap[main] || weatherDataMap["Default"];

    // Aktualizacja danych do wyświetlenia, zaokrąglając temperaturę
    useEffect(() => {
        if (weather) {
            setDisplayData({
                ...weather,
                main: {
                    ...weather.main,
                    temp: Math.round(weather.main.temp), // Zaokrąglenie temperatury
                },
            });
            console.log(weather.weather[0]);

        }
        console.log(displayData)
    }, [weather]);



    // Obsługa błędu
    if (error) {
        return <div className="WeatherWidget WeatherWidget--error">Błąd: {error}</div>;
    }

    // Obsługa ładowania danych
    if (loading && !displayData) {
        return <div className="WeatherWidget WeatherWidget--loading">Ładowanie pogody...</div>;
    }

    // Pobierz dane dla obecnych warunków pogodowych
    const weatherType = displayData?.weather?.[0]?.main || "Default";
    const { icon: WeatherIcon, className } = getWeatherData(weatherType);

    // Wyświetlanie danych
    return (
        <div className={`WeatherWidget ${className}`}>
            <div className="WeatherWidget__overlay">
                <WeatherIcon className="WeatherWidget__icon" />
                <p className="WeatherWidget__temperature">
                    {displayData?.main?.temp || '---'}°
                </p>
                <p className="WeatherWidget__humidity">
                    {displayData?.main?.humidity || '---'}%
                </p>
                <p className="WeatherWidget__description">
                    <strong>{displayData?.weather?.[0].description || '---'}%</strong>
                </p>
                {loading && <p>Odświeżanie danych...</p>}
            </div>
        </div>
    );
};

export default WeatherWidget;
