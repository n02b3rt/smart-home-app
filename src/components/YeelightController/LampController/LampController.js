"use client";

import React from 'react';
import './LampController.scss'

const LampController = ({ lamp, isOn, toggleLamp, loading }) => {
    return (
        <div
            className={`LampController ${isOn ? 'LampController--on' : 'LampController--off'}`}
            onClick={() => !loading && toggleLamp(lamp.host)}
        >
            <img
                src={`/icons/${lamp.icon}`}
                alt={`${lamp.name} icon`}
                className="LampController__icon"
            />
            <div className="LampController__name">{lamp.name}</div>
        </div>
    );
};

export default LampController;
