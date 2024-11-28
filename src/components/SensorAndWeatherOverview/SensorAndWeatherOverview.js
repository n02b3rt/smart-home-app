"use client";

import React, { useState, useEffect } from 'react';
import useWeatherData from '@/hooks/useWeatherData';
import SensorData from './SensorData/SensorData';
import WeatherWidget from "./WeatherWidget/WeatherWidget";

import './SensorAndWeatherOverview.scss';

export default function SensorAndWeatherOverview({ city = 'Rzeszów' }) {
    const { weather, loading, error } = useWeatherData(city);
    const [description, setDescription] = useState('---'); // Opis pogody do wyświetlenia

    // Aktualizacja opisu pogody
    useEffect(() => {
        if (weather?.weather?.[0]?.description) {
            setDescription(weather.weather[0].description);
        }
    }, [weather]);

    if (error) return <div>Błąd: {error}</div>;

    return (
        <div className="SensorAndWeatherOverview">
            <div className="SensorAndWeatherOverview__container">
                <SensorData/>
                <WeatherWidget/>
            </div>
            <p className='SensorAndWeatherOverview__description'>{description}</p>
        </div>
    );
}