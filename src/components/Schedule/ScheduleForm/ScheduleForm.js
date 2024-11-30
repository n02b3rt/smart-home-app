"use client";

import React, { useState } from "react";
import './ScheduleForm.scss'

export default function ScheduleForm({ schedule, setSchedule, showNotification }) {
    const [form, setForm] = useState({
        day: "Monday",
        startTime: "",
        endTime: "",
        subject: "",
        type: "Lecture",
    });

    // Obsługa zmian w formularzu
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // Walidacja formularza
    const validateForm = () => {
        const { day, startTime, endTime, subject, type } = form;
        return day && startTime && endTime && subject && type;
    };

    // Dodawanie zajęć
    const handleAddClass = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            showNotification("Uzupełnij wszystkie pola przed dodaniem zajęć.", "error");
            return;
        }

        try {
            const response = await fetch("/api/schedule", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (response.ok) {
                setSchedule((prev) => [...prev, form]);
                showNotification(`Dodano zajęcia: ${form.subject}`, "success");
                setForm({
                    day: "Monday",
                    startTime: "",
                    endTime: "",
                    subject: "",
                    type: "Lecture",
                });
            } else {
                const error = await response.json();
                console.error("Błąd podczas dodawania zajęć:", error.error);
                showNotification("Błąd podczas dodawania zajęć.", "error");
            }
        } catch (error) {
            console.error("Błąd podczas dodawania zajęć:", error);
            showNotification("Błąd podczas dodawania zajęć.", "error");
        }
    };

    return (
        <form className="ScheduleForm" onSubmit={handleAddClass}>
            <label>
                Dzień:
                <select name="day" value={form.day} onChange={handleInputChange}>
                    <option value="Monday">Poniedziałek</option>
                    <option value="Tuesday">Wtorek</option>
                    <option value="Wednesday">Środa</option>
                    <option value="Thursday">Czwartek</option>
                    <option value="Friday">Piątek</option>
                </select>
            </label>
            <label>
                Godzina rozpoczęcia:
                <input
                    type="time"
                    name="startTime"
                    value={form.startTime}
                    onChange={handleInputChange}
                />
            </label>
            <label>
                Godzina zakończenia:
                <input
                    type="time"
                    name="endTime"
                    value={form.endTime}
                    onChange={handleInputChange}
                />
            </label>
            <label>
                Przedmiot:
                <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleInputChange}
                />
            </label>
            <label>
                Typ zajęć:
                <select name="type" value={form.type} onChange={handleInputChange}>
                    <option value="Lecture">Wykład</option>
                    <option value="Lab">Laboratorium</option>
                    <option value="Seminar">Seminarium</option>
                    <option value="Exercise">Ćwiczenia</option>
                </select>
            </label>
            <button type="submit">Dodaj zajęcia</button>
        </form>
    );
}
