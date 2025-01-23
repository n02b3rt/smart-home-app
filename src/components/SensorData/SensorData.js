"use client";

import React from 'react';
import useSensorData from '@/hooks/useSensorData';
import './SensorData.scss'
import TempIcon from '/public/icons/thermostat.svg'

const SensorData = () => {
    const { data, loading, error } = useSensorData();

    // Wyświetlanie błędu
    if (error) return <div>Błąd: {error}</div>;

    // Wyświetlanie w trakcie pierwszego ładowania
    if (loading && !data) return <div>Ładowanie danych z czujnika...</div>;

    return (
        <div className="SensorData">
            <div className="SensorData__overlay">
                <TempIcon className="SensorData__icon" />
                <p className='SensorData__temperature'>{data?.temperature || 'Brak danych'}°C</p>
                <p className='SensorData__humidity'>{data?.humidity || 'Brak danych'}%</p>
                <p className="SensorData__description"><strong>W pomieszeniu</strong></p>
                {loading && <p>Odświeżanie danych...</p>}
            </div>
        </div>
    );
};

export default SensorData;
