"use client";

import React, { useEffect, useState } from "react";
import BedsideLampIcon from "/public/icons/floor_lamp.svg";
import LampIcon from "/public/icons/light.svg";
import "./LampControlPage.scss";
import Link from "next/link";

const LampControlPage = () => {
    // IP i nazwy lamp
    const LAMPS = [
        { name: "Lampka nocna", host: "192.168.0.185" },
        { name: "Lampa sufitowa", host: "192.168.0.186" },
    ];

    const [lampStates, setLampStates] = useState({});
    const [loading, setLoading] = useState(false);

    // Pobranie stanu lamp
    const fetchLampStates = async () => {
        try {
            const states = {};

            // Pobierz stan każdej lampy
            for (const lamp of LAMPS) {
                const response = await fetch("/api/yeelight/getState", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ host: lamp.host }),
                });

                const data = await response.json();
                if (data.status) {
                    states[lamp.host] = {
                        isOn: data.isOn ?? false,
                        brightness: data.brightness ?? 50,
                    };
                } else {
                    console.warn(`Nie udało się pobrać danych o lampie ${lamp.name}`);
                }
            }

            setLampStates(states);
        } catch (error) {
            console.error("Błąd podczas pobierania stanów lamp:", error);
        }
    };

    // Aktualizacja stanu lamp co określony czas
    useEffect(() => {
        fetchLampStates();
        const interval = setInterval(fetchLampStates, 10000); // Aktualizuj co 10 sekund
        return () => clearInterval(interval);
    }, []);

    // Funkcja do włączania/wyłączania lampy
    const toggleLamp = async (host, isOn) => {
        setLoading(true);
        try {
            const action = isOn ? "turn_off" : "turn_on";

            const response = await fetch("/api/yeelight", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action, host }),
            });

            const data = await response.json();
            if (data.status) {
                setLampStates((prevStates) => ({
                    ...prevStates,
                    [host]: { ...prevStates[host], isOn: !isOn },
                }));
            }
        } catch (error) {
            console.error(`Błąd podczas przełączania lampy ${host}:`, error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="LampControlPanel">
            {LAMPS.map((lamp) => {
                const lampState = lampStates[lamp.host] || {};

                return (
                    <div key={lamp.host} className={`LampControlPanel__lamp ${lamp.host === "192.168.0.185" ? "LampControlPanel__lamp--bedside" : "LampControlPanel__lamp--ceiling"}`}>
                        <h3>{lamp.name}</h3>
                        <button
                            onClick={() => toggleLamp(lamp.host, lampState.isOn)}
                            disabled={loading}
                            className={`LampControlPanel__button`}
                        >
                            {
                                lamp.host === "192.168.0.185" ?
                                    <BedsideLampIcon className={`LampControlPanel__button__icon 
                                    ${lampState.isOn ? "LampControlPanel__button__icon--on" : "LampControlPanel__button__icon--off"} `}/>
                                    : <LampIcon className={`LampControlPanel__button__icon 
                                    ${lampState.isOn ? "LampControlPanel__button__icon--on" : "LampControlPanel__button__icon--off"} `}/>}
                        </button>
                        <p>{lampState.isOn ? "ON" : "OFF"} : {lampState.brightness}%</p>
                        <Link href={"/lamps/" + lamp.host} className={"LampControlPanel__button--settings"}>Settings</Link>
                    </div>
                );
            })}
        </div>
    );
};

export default LampControlPage;
