"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const WeatherContext = createContext();

export const WeatherProvider = ({ city = 'Rzeszów', children }) => {
    const [weather, setWeather] = useState(null); // Aktualne dane pogodowe
    const [loading, setLoading] = useState(true); // Kontroluje stan ładowania
    const [error, setError] = useState(null); // Obsługuje błędy

    const fetchWeather = async () => {
        setError(null);

        try {
            const response = await fetch(`/api/weather?city=${city}`);
            const data = await response.json();

            if (response.ok) {
                setWeather(data); // Aktualizacja danych pogodowych
            } else {
                setError(data.error || 'Błąd podczas pobierania danych pogodowych');
            }
        } catch (err) {
            setError('Nie udało się połączyć z API pogodowym.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather();

        // Odświeżanie co 15 minut (900 000 ms)
        const interval = setInterval(fetchWeather, 900000);

        return () => clearInterval(interval);
    }, [city]);

    return (
        <WeatherContext.Provider value={{ weather, loading, error }}>
            {children}
        </WeatherContext.Provider>
    );
};

// Custom hook do pobierania danych z kontekstu
export const useWeather = () => useContext(WeatherContext);
