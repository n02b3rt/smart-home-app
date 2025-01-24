"use client";

import React, { useState } from "react";
import kelvinToRgb from "@/components/YeelightController/LampController/kelvinToRgb";
import "./ColorTemperaturePicker.scss"; // Stylizacja komponentu

const ColorTemperaturePicker = ({ host }) => {
    const [selectedTemperature, setSelectedTemperature] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [loading, setLoading] = useState(false);

    // Zakres temperatur w kelwinach
    const TEMPERATURES = [
        { value: 2000 },
        { value: 2700 },
        { value: 3000 },
        { value: 4000 },
        { value: 5000 },
        { value: 6500 },
    ];
    const COLORS = [
        { r: 17, g: 253, b: 37 },
        { r: 26, g: 51, b: 255 },
        { r: 107, g: 0, b: 237 },
        { r: 249, g: 0, b: 197 },
        { r: 255, g: 0, b: 147 },
        { r: 255, g: 0, b: 0 },
    ];

    const handleTemperatureChange = async (temperature) => {
        console.log(kelvinToRgb(temperature));

        try {
            const response = await fetch("/api/yeelight/setColorTemperature", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ host, temperature }),
            });

            const data = await response.json();
            if (!data.status) {
                console.error("Nie udało się ustawić temperatury światła.");
            } else {
                console.log(`Temperatura ustawiona na ${temperature}K`);
            }
        } catch (error) {
            console.error("Błąd podczas ustawiania temperatury światła:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleColorChange = async (r,g,b) => {
        console.log(r,g,b);
        try {
            const response = await fetch("/api/yeelight/setColor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ host, r,g,b }),
            });

            const data = await response.json();
            if (!data.status) {
                console.error("Nie udało się ustawić temperatury światła.");
            } else {
                console.log(`Kolor Ustawiony`);
            }
        } catch (error) {
            console.error("Błąd podczas ustawiania temperatury światła:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ColorTemperaturePicker">
            <div className="ColorTemperaturePicker__buttons">
                {TEMPERATURES.map((temp) => (
                    <button
                        key={temp.value}
                        className={`ColorTemperaturePicker__button`}
                        style={{background: `rgb(${kelvinToRgb(temp.value)})`}}
                        onClick={() => handleTemperatureChange(temp.value)}
                        disabled={loading}
                    >
                    </button>
                ))}
                {COLORS.map((color) => (
                    <button
                        key={color.r+color.g+color.b}
                        className={`ColorTemperaturePicker__button`}
                        style={{background: `rgb(${color.r}, ${color.g}, ${color.b})`}}
                        onClick={() => handleColorChange(color.r, color.g, color.b)}
                        disabled={loading}
                    >
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ColorTemperaturePicker;
