"use client";

import React, { useState, useEffect } from "react";
import ScheduleForm from "@/components/Schedule/ScheduleForm/ScheduleForm";
import ScheduleList from "@/components/Schedule/ScheduleList/ScheduleList";

export default function ScheduleEditorPage() {
    const [schedule, setSchedule] = useState([]);

    // Pobieranie danych z API
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

    return (
        <div className="ScheduleEditorPage">
            <h1>Edytor Planu Zajęć</h1>
            <ScheduleForm schedule={schedule} setSchedule={setSchedule} />
            <ScheduleList schedule={schedule} setSchedule={setSchedule} />
        </div>
    );
}
