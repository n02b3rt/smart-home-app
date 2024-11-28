"use client";

import { useEffect, useState } from 'react';

const useSensorData = () => {
    const [data, setData] = useState(null); // Aktualne dane z czujnika
    const [loading, setLoading] = useState(true); // Kontroluje stan ładowania
    const [error, setError] = useState(null); // Obsługuje błędy

    const fetchSensorData = async () => {
        setError(null); // Czyszczenie błędów przed próbą pobrania danych

        try {
            const response = await fetch('/api/sensor');
            const result = await response.json();

            if (response.ok) {
                setData(result); // Aktualizacja danych z czujnika
            } else {
                setError(result.error || 'Błąd podczas pobierania danych');
            }
        } catch (err) {
            setError('Nie udało się połączyć z API');
        } finally {
            setLoading(false); // Wyłączenie stanu ładowania
        }
    };

    useEffect(() => {
        fetchSensorData();

        // Odświeżanie co 10 sekund (10 000 ms)
        const interval = setInterval(fetchSensorData, 10000);

        return () => clearInterval(interval);
    }, []);

    return { data, loading, error };
};

export default useSensorData;
