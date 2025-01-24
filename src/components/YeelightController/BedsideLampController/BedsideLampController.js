"use client";

import React, { useEffect, useState } from "react";
import "./BedsideLampController.scss"; // Stylizacja komponentu
import LampIcon from "/public/icons/light.svg"; // Ikona lampy

const BedsideLampController = () => {
    const LAMP_IP = "192.168.0.185"; // Adres IP lampy
    const [isOn, setIsOn] = useState(false); // Stan lampy
    const [brightness, setBrightness] = useState(50); // Jasność lampy
    const [loading, setLoading] = useState(false); // Flaga ładowania
    const [debounceTimer, setDebounceTimer] = useState(null); // Timer dla debouncingu

    // Pobieranie początkowego stanu lampy
    useEffect(() => {
        const fetchInitialState = async () => {
            try {
                const response = await fetch("/api/yeelight/getState", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ host: LAMP_IP }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (data.status) {
                    setIsOn(data.isOn ?? false); // Bezpieczna obsługa wartości null/undefined
                    setBrightness(data.brightness ?? 50); // Ustaw domyślną jasność na 50
                } else {
                    console.warn("Nie udało się pobrać danych o stanie lampy:", data.error);
                }
            } catch (error) {
                console.error("Błąd podczas pobierania początkowego stanu lampy:", error.message);
            }
        };

        fetchInitialState();
    }, [LAMP_IP]); // Dodanie zależności dla LAMP_IP


    // Funkcja do włączania/wyłączania lampy
    const toggleLamp = async () => {
        setLoading(true);
        try {
            const action = isOn ? "turn_off" : "turn_on";

            const response = await fetch("/api/yeelight", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action, host: LAMP_IP }),
            });

            const data = await response.json();
            if (data.status) {
                setIsOn(!isOn);
            }
        } catch (error) {
            console.error("Błąd podczas przełączania lampy:", error);
        } finally {
            setLoading(false);
        }
    };

    // Funkcja do ustawiania jasności z debouncingiem
    const handleBrightnessChange = (value) => {
        setBrightness(value);

        // Debouncing: Wyślij do API tylko po zatrzymaniu przesuwania
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        const timer = setTimeout(async () => {
            try {
                const response = await fetch("/api/yeelight/setBrightness", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        host: LAMP_IP,
                        brightness: parseInt(value, 10), // Jasność musi być liczbą
                    }),
                });

                const data = await response.json();
                if (!data.status) {
                    console.error("Nie udało się ustawić jasności lampy.");
                }
            } catch (error) {
                console.error("Błąd podczas ustawiania jasności:", error);
            }
        }, 50); // Opóźnienie 500 ms

        setDebounceTimer(timer);
    };

    return (
        <div
            className={`BedsideLampController ${
                isOn ? "BedsideLampController--on" : "BedsideLampController--off"
            }`}
        >
            {!isOn ? (
                <button
                    className="BedsideLampController__button"
                    onClick={toggleLamp}
                    disabled={loading}
                >
                    <img
                        src={LampIcon}
                        alt="Lamp Icon"
                        className="BedsideLampController__icon"
                    />
                </button>
            ) : (
                <div className="CustomRangeContainer">
                    <div
                        className="CustomRange"
                        style={{width: `${brightness}%`}} // Szerokość zależna od wartości
                    ></div>
                    <input
                        type="range"
                        min="1"
                        max="100"
                        value={brightness}
                        onChange={(e) => handleBrightnessChange(e.target.value)}
                        className="CustomRangeInput"
                    />
                </div>


            )}
        </div>
    );
};

export default BedsideLampController;
