"use client";

import React, { useEffect, useState } from "react";
import BedsideLampController from "@/components/YeelightController/BedsideLampController/BedsideLampController";
import BedsideLampIcon from "/public/icons/floor_lamp.svg";
import LampIcon from "/public/icons/light.svg";
import "./LampPage.scss";
import ColorPicker from "@/components/YeelightController/LampController/ColorPicker";

const LampPage = ({ params }) => {
    const [LAMP_IP, setLampIP] = useState(null); // Trzymamy IP w stanie
    const [lampData, setLampData] = useState(null); // Dane o lampie
    const [isOn, setIsOn] = useState(false); // Status lampy
    const [loading, setLoading] = useState(false); // Ładowanie dla przycisku

    // Rozpakowanie `params` jako Promise
    useEffect(() => {
        const resolveParams = async () => {
            const resolvedParams = await params;
            setLampIP(resolvedParams.LAMP_IP);
        };

        resolveParams();
    }, [params]);

    // Pobranie stanu lampy
    useEffect(() => {
        if (LAMP_IP) {
            const fetchLampDetails = async () => {
                try {
                    const response = await fetch(`/api/yeelight/getState`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ host: LAMP_IP }),
                    });

                    const data = await response.json();
                    if (data.status) {
                        setLampData(data);
                        setIsOn(data.isOn ?? false); // Ustaw status lampy
                    } else {
                        console.warn("Nie udało się pobrać danych o lampie:", data.error);
                    }
                } catch (error) {
                    console.error("Błąd podczas pobierania danych o lampie:", error);
                }
            };

            fetchLampDetails();
        }
    }, [LAMP_IP]);

    // Funkcja do włączania/wyłączania lampy
    const toggleLamp = async () => {
        if (!LAMP_IP) return;
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
            } else {
                console.warn("Nie udało się zmienić stanu lampy:", data.error);
            }
        } catch (error) {
            console.error("Błąd podczas zmiany stanu lampy:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!LAMP_IP) {
        return <p>Ładowanie adresu IP lampy...</p>;
    }

    if (!lampData) {
        return <p>Ładowanie danych lampy...</p>;
    }

    return (
        <div className="LampPage">
            <div className="LampPage__infoContainer">
                <div className="LampPage__info">
                    <h1>{LAMP_IP === "192.168.0.185" ? "Bedside Lamp" : "Ceiling Lamp"}</h1>
                    <button
                        onClick={toggleLamp}
                        className={`LampPage__iconButton`}
                        disabled={loading}
                    >
                        {LAMP_IP === "192.168.0.185" ? (
                            <BedsideLampIcon className={`LampPage__icon ${isOn ? "LampPage__icon--on" : "LampPage__icon--off" }`} />
                        ) : (
                            <LampIcon className={`LampPage__icon ${isOn ? "LampPage__icon--on" : "LampPage__icon--off" }`} />
                        )}
                    </button>
                    <div className="LampPage__container">
                        <BedsideLampController LAMP_IP={LAMP_IP} className="lampPage__component" />
                    </div>
                </div>
            </div>
            <div className="LampPage__colorContainer">
                <ColorPicker host={LAMP_IP}/>
            </div>
        </div>
    );
};

export default LampPage;
