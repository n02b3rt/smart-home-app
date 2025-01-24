"use client";

import React, {useEffect, useState} from "react";
import "./BedsideLampController.scss"; // Stylizacja komponentu
import LampIcon from "/public/icons/floor_lamp.svg";
import Link from "next/link"; // Ikona lampy

const BedsideLampController = ({displayInformation = true, LAMP_IP}) => {
    const [isOn, setIsOn] = useState(false); // Stan lampy
    const [brightness, setBrightness] = useState(50); // Jasność lampy
    const [loading, setLoading] = useState(false); // Flaga ładowania
    const [debounceTimer, setDebounceTimer] = useState(null); // Timer dla debouncingu

    const LAMP_NAME = "Lampka nocna"; // Nazwa lampy
    const ROOM_NAME = "Biuro / Sypialnia"; // Nazwa pokoju

    // Pobieranie początkowego stanu lampy
    const fetchInitialState = async () => {
        try {
            const response = await fetch("/api/yeelight/getState", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({host: LAMP_IP}),
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

    useEffect(() => {
        fetchInitialState();
        const interval = setInterval(() => {
            fetchInitialState();
        }, 10000); // Co 10 sekund

        return () => clearInterval(interval); // Czyszczenie interwału przy odmontowaniu
    }, []);

    // Funkcja do włączania/wyłączania lampy
    const toggleLamp = async () => {
        setLoading(true);
        try {
            const action = isOn ? "turn_off" : "turn_on";

            const response = await fetch("/api/yeelight", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({action, host: LAMP_IP}),
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
                    headers: {"Content-Type": "application/json"},
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
        }, 500); // Opóźnienie 500 ms

        setDebounceTimer(timer);
    };

    const navigateTo = () => {
        if (router && router.push) {
            router.push(`/lamps/${LAMP_IP}`); // Przejście do dynamicznej strony
        } else {
            console.error("Router nie jest dostępny.");
        }
    };

    return (
        <div className="BedsideLampController">
            {!isOn ? (
                <button
                    onClick={toggleLamp}
                    className="BedsideLampController__button"
                >
                    {displayInformation ?
                        <p className="BedsideLampController__info--off">{isOn ? "ON" : "OFF"}</p>
                        :
                        <div className="BedsideLampController__info">
                            <><LampIcon className="BedsideLampController__icon"/>
                                <p className="BedsideLampController__info__brightness">
                                    {isOn ? "ON" : "OFF"} : {brightness}%
                                </p>
                                <div className="BedsideLampController__info__details">
                                    <p className="BedsideLampController__info__name">
                                        <strong>{LAMP_NAME}</strong>
                                    </p>
                                    <p className="BedsideLampController__info__room">{ROOM_NAME}</p>
                                </div>
                            </>

                        </div>
                    }
                </button>
            ) : (
                <>
                    {displayInformation ?
                        <p className="BedsideLampController__info--on">
                            {isOn ? "ON" : "OFF"} : {brightness}%
                        </p>
                        :
                        <div className="BedsideLampController__info">
                            <LampIcon className="BedsideLampController__icon"/>
                            <p className="BedsideLampController__info__brightness">
                                {isOn ? "ON" : "OFF"} : {brightness}%
                            </p>
                            <div className="BedsideLampController__info__details">
                                <p className="BedsideLampController__info__name">
                                    <strong>{LAMP_NAME}</strong>
                                </p>
                                <p className="BedsideLampController__info__room">{ROOM_NAME}</p>
                            </div>
                        </div>
                    }
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
                    {displayInformation ? "" :
                        <Link href={`/lamps/${LAMP_IP}`} className="BedsideLampController__settings"
                              onClick={navigateTo}>
                            <p>.</p>
                            <p>.</p>
                            <p>.</p>
                        </Link>
                    }
                </>
            )}
        </div>
    );
};

export default BedsideLampController;
