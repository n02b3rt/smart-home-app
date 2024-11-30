"use client";

import React, { useState, useEffect } from "react";
import ScheduleForm from "@/components/Schedule/ScheduleForm/ScheduleForm";
import ScheduleList from "@/components/Schedule/ScheduleList/ScheduleList";
import "./schedule-editor.scss";

export default function ScheduleEditorPage() {
    const [schedule, setSchedule] = useState([]);

    // Pobieranie planu zajęć
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
                console.error("Błąd podczas pobierania planu zajęć:", error);
            }
        };

        fetchSchedule();
    }, []);

    // Obsługa dodawania zajęć
    const handleAddClass = async (newClass) => {
        try {
            const response = await fetch("/api/schedule", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newClass),
            });

            if (response.ok) {
                setSchedule((prev) => [...prev, newClass]);
            } else {
                const error = await response.json();
                console.error("Błąd podczas dodawania zajęć:", error.error);
            }
        } catch (error) {
            console.error("Błąd podczas dodawania zajęć:", error);
        }
    };

    return (
        <div className="ScheduleEditorPage">
            <h1>Edytor Planu Zajęć</h1>
            <ScheduleForm onAddClass={handleAddClass} />
            <ScheduleList schedule={schedule} setSchedule={setSchedule} />
        </div>
    );
}
