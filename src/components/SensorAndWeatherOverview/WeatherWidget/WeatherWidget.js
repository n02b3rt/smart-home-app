"use client";

import React, { useEffect, useState } from 'react';
import { useWeather } from '@/context/WeatherContext'; // Pobieramy dane z kontekstu
import './WeatherWidget.scss';

const WeatherWidget = () => {
    const { weather, loading, error } = useWeather(); // Dane z kontekstu
    const [displayData, setDisplayData] = useState(null);

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
        }
    }, [weather]);

    // Obsługa błędu
    if (error) {
        return <div className="WeatherWidget WeatherWidget--error">Błąd: {error}</div>;
    }

    // Obsługa ładowania danych
    if (loading && !displayData) {
        return <div className="WeatherWidget WeatherWidget--loading">Ładowanie pogody...</div>;
    }

    // Wyświetlanie danych
    return (
        <div className="WeatherWidget">
            <p className="WeatherWidget__title">na zewnątrz</p>
            <p className="WeatherWidget__temperature">
                {displayData?.main?.temp || '---'}°C
            </p>
            <p className="WeatherWidget__humidity">
                {displayData?.main?.humidity || '---'}%
            </p>
            {loading && <p>Odświeżanie danych...</p>}
        </div>
    );
};

export default WeatherWidget;
