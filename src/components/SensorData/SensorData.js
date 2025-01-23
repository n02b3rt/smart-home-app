"use client";

import React from 'react';
import useSensorData from '@/hooks/useSensorData';
import './SensorData.scss'

const SensorData = () => {
    const { data, loading, error } = useSensorData();

    // Wyświetlanie błędu
    if (error) return <div>Błąd: {error}</div>;

    // Wyświetlanie w trakcie pierwszego ładowania
    if (loading && !data) return <div>Ładowanie danych z czujnika...</div>;

    return (
        <div className="SensorData">
            <p className='SensorData__title'>w pomieszczeniu</p>
            <p className='SensorData__temperature'>{data?.temperature || 'Brak danych'}°C</p>
            <p className='SensorData__humidity'>{data?.humidity || 'Brak danych'}%</p>
            {loading && <p>Odświeżanie danych...</p>}
        </div>
    );
};

export default SensorData;
