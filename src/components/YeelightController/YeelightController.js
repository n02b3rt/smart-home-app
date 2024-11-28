"use client";

import React, { useState } from 'react';
import LampController from './LampController/LampController';
import './YeelightController.scss'

// Lista lamp z przypisanymi ikonami
const LAMPS = [
    { name: 'Lampa w salonie', host: '192.168.0.185', icon: 'floor_lamp.svg' },
    { name: 'Lampa w sypialni', host: '192.168.0.186', icon: 'light.svg' },
];

const YeelightController = () => {
    const [loading, setLoading] = useState(false);
    const [lampStates, setLampStates] = useState(
        LAMPS.reduce((acc, lamp) => {
            acc[lamp.host] = false; // Domyślnie lampy są wyłączone
            return acc;
        }, {})
    );

    const toggleLamp = async (host) => {
        setLoading(true);
        try {
            const currentState = lampStates[host];
            const action = currentState ? 'turn_off' : 'turn_on';

            const response = await fetch('/api/yeelight', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, host }),
            });

            const data = await response.json();
            console.log(`Odpowiedź dla ${host}:`, data);

            if (data.status) {
                setLampStates((prevStates) => ({
                    ...prevStates,
                    [host]: !currentState, // Zmień stan lampy
                }));
            }
        } catch (error) {
            console.error(`Błąd podczas wysyłania akcji do ${host}:`, error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="YeelightController">
            {LAMPS.map((lamp, index) => (
                <LampController
                    key={index}
                    lamp={lamp}
                    isOn={lampStates[lamp.host]}
                    toggleLamp={toggleLamp}
                    loading={loading}
                />
            ))}
        </div>
    );
};

export default YeelightController;
