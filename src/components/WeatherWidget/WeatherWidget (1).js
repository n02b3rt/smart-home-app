"use client";

import React, { useState, useEffect } from 'react';
import useWeatherData from '@/hooks/useWeatherData';
import './WeatherWidget.scss'

const WeatherWidget = ({ city = 'Rzeszów' }) => {
    const { weather, loading, error } = useWeatherData(city);
    const [displayData, setDisplayData] = useState(null); // Dane do wyświetlenia

    // Aktualizacja danych do wyświetlenia
    useEffect(() => {
        if (weather) {
            // Kopia danych z zaokrągloną temperaturą
            const roundedWeather = {
                ...weather,
                main: {
                    ...weather.main,
                    temp: Math.round(weather.main.temp), // Zaokrąglona temperatura
                },
            };

            setDisplayData(roundedWeather); // Ustaw zaokrąglone dane
        }
    }, [weather]);

    // Wyświetlanie błędu
    if (error) return <div>Błąd: {error}</div>;

    // Wyświetlanie w trakcie pierwszego ładowania
    if (loading && !displayData) return <div>Ładowanie pogody...</div>;

    return (
        <div className="WeatherWidget">
            <p className='WeatherWidget__title'>na zewnątrz</p>
            <p className='WeatherWidget__temperature'>{displayData?.main?.temp || '---'}°C</p>
            <p className='WeatherWidget__humidity'>{displayData?.main?.humidity || '---'}%</p>
            {loading && <p>Odświeżanie danych...</p>}
        </div>
    );
};

export default WeatherWidget;
