"use client";

import React from "react";
import './ScheduleList.scss'

// Indeksy dni tygodnia dla sortowania
const dayOrder = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
};

export default function ScheduleList({ schedule, setSchedule }) {
    // Usuwanie zajęć
    const handleRemoveClass = async (index) => {
        try {
            const response = await fetch(`/api/schedule?index=${index}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setSchedule((prev) => prev.filter((_, i) => i !== index));
            } else {
                const error = await response.json();
                console.error("Błąd podczas usuwania zajęć:", error.error);
            }
        } catch (error) {
            console.error("Błąd podczas usuwania zajęć:", error);
        }
    };

    // Sortowanie zajęć według dni tygodnia
    const sortedSchedule = [...schedule].sort((a, b) => {
        const dayA = dayOrder[a.day] || 0; // Domyślny indeks dla nieznanego dnia
        const dayB = dayOrder[b.day] || 0;
        return dayA - dayB;
    });

    return (
        <ul className="ScheduleList">
            {sortedSchedule.length > 0 ? (
                sortedSchedule.map((entry, index) => (
                    <li key={index} className="ScheduleList__item">
                        <span>
                            {entry.day}, {entry.startTime} - {entry.endTime}, {entry.subject}, Typ:{" "}
                            {entry.type}
                        </span>
                        <button onClick={() => handleRemoveClass(index)}>Usuń</button>
                    </li>
                ))
            ) : (
                <li>Brak zajęć do wyświetlenia.</li>
            )}
        </ul>
    );
}
