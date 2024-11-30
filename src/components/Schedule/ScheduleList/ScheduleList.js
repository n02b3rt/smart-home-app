"use client";

import React from "react";
import "./ScheduleList.scss";

export default function ScheduleList({ schedule, setSchedule }) {
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

    // Sortowanie zajęć według dnia tygodnia
    const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const sortedSchedule = [...schedule].sort(
        (a, b) => daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day)
    );

    return (
        <ul className="ScheduleList">
            {sortedSchedule.length > 0 ? (
                sortedSchedule.map((entry, index) => (
                    <li key={index} className="ScheduleList__item">
                        <span>
                            {entry.day}, {entry.startTime} - {entry.endTime},{" "}
                            {entry.subject}, Typ: {entry.type}, Tydzień: {entry.weekType}
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
