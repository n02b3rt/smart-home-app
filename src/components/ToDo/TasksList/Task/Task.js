"use client";

import React, { useState } from "react";
import "./Task.scss";

export default function Task({ title, notes, due, completed }) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Formatuj datę
    const formatDueDate = (due) => {
        if (!due) return ""; // Jeżeli brak daty, zwróć pusty string
        const date = new Date(due);
        if (isNaN(date)) return ""; // Jeśli data jest nieprawidłowa
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };

    return (
        <li
            className={`Task ${completed ? "Task--completed" : "Task--incomplete"}`}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className="Task__summary">
                <span className="Task__title">{title}</span>
                <span className="Task__due">{formatDueDate(due)}</span>
                <span className={`Task__status ${completed ? "Task__status--completed" : "Task__status--incomplete"}`}>
                    {completed ? "Ukończone" : "Nieukończone"}
                </span>
            </div>
            {isExpanded && notes && (
                <div className="Task__details">
                    <p>{notes}</p>
                </div>
            )}
        </li>
    );
}
