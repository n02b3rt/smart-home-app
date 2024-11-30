"use client";

import React, { useState, useEffect } from "react";
import ScheduleForm from "@/components/Schedule/ScheduleForm/ScheduleForm";
import ScheduleList from "@/components/Schedule/ScheduleList/ScheduleList";
import './schedule-editor.scss'

export default function ScheduleEditorPage() {
    const [schedule, setSchedule] = useState([]);
    const [notification, setNotification] = useState({ message: "", type: "" }); // Powiadomienie z typem

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

    // Funkcja do wyświetlania powiadomienia
    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: "", type: "" }), 3000); // Usuwa powiadomienie po 3 sekundach
    };

    return (
        <div className="ScheduleEditorPage">
            <h1>Edytor Planu Zajęć</h1>
            {notification.message && (
                <div className={`Notification ${notification.type}`}>{notification.message}</div>
            )}
            <ScheduleForm
                schedule={schedule}
                setSchedule={setSchedule}
                showNotification={showNotification}
            />
            <ScheduleList schedule={schedule} setSchedule={setSchedule} />
        </div>
    );
}