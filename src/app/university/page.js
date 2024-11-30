"use client";

import React, { useEffect, useState } from "react";
import "./Schedule.scss";

export default function Schedule() {
    const [schedule, setSchedule] = useState([]);

    // Pobieranie planu lekcji
    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await fetch("/api/schedule");
                const data = await response.json();
                if (Array.isArray(data)) {
                    setSchedule(data);
                } else {
                    console.error("Nieprawidłowy format danych:", data);
                }
            } catch (error) {
                console.error("Błąd podczas pobierania planu lekcji:", error);
            }
        };

        fetchSchedule();
    }, []);

    // Grupowanie zajęć według dnia tygodnia
    const groupByDay = (schedule) => {
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
        const grouped = {};

        days.forEach((day) => {
            grouped[day] = schedule.filter((item) => item.day === day);
        });

        return grouped;
    };

    const groupedSchedule = groupByDay(schedule);

    return (
        <div className="SchedulePage">
            <h1>Plan Zajęć</h1>
            <div className="Schedule">
                {Object.entries(groupedSchedule).map(([day, classes]) => (
                    <div key={day} className="Schedule__day">
                        <h2>{day}</h2>
                        {classes.length > 0 ? (
                            classes.map((entry, index) => (
                                <div key={index}
                                     className={`Schedule__entry ${entry.weekType == 'A' ? 'Schedule__entry--A' : ''} ${entry.weekType == 'B' ? 'Schedule__entry--B' : ''}`}>
                                    <p>
                                        {entry.startTime} - {entry.endTime}
                                    </p>
                                    <p>{entry.subject}</p>
                                    <div className={`Schedule__box`}>
                                        <p>{entry.type}</p>
                                        {entry.weekType === "A" && <p className="Schedule__week">Tydzień A</p>}
                                        {entry.weekType === "B" && <p className="Schedule__week">Tydzień B</p>}
                                    </div>

                                </div>
                            ))
                        ) : (
                            <p className="Schedule__no-classes">Brak zajęć</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
