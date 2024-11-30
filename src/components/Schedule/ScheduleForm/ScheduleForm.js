"use client";

import React, { useState } from "react";
import "./ScheduleForm.scss";

export default function ScheduleForm({ onAddClass }) {
    const [form, setForm] = useState({
        day: "Monday",
        startTime: "",
        endTime: "",
        subject: "",
        type: "Lecture",
        weekType: "A",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Walidacja formularza
        const { day, startTime, endTime, subject, type, weekType } = form;
        if (!day || !startTime || !endTime || !subject || !type || !weekType) {
            console.error("Uzupełnij wszystkie pola formularza");
            return;
        }

        try {
            await onAddClass(form); // Wywołanie funkcji przekazanej z komponentu nadrzędnego
            setForm({
                day: "Monday",
                startTime: "",
                endTime: "",
                subject: "",
                type: "Lecture",
                weekType: "A",
            });
        } catch (error) {
            console.error("Błąd podczas dodawania zajęć:", error);
        }
    };

    return (
        <form className="ScheduleForm" onSubmit={handleSubmit}>
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
            <label>
                Tydzień:
                <select name="weekType" value={form.weekType} onChange={handleInputChange}>
                    <option value="Both">Oba tygodnie</option>
                    <option value="A">Tydzień A</option>
                    <option value="B">Tydzień B</option>
                </select>
            </label>
            <button type="submit">Dodaj zajęcia</button>
        </form>
    );
}
