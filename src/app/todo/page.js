"use client";

import React, { useState, useEffect } from "react";
import FloatingButton from "@/components/ToDo/FloatingButton/FloatingButton";
import { useAuth } from "@/context/AuthContext";
import "./ToDo.scss";

export default function ToDoPage() {
    const { isLoggedIn } = useAuth(); // Pobierz `isLoggedIn` z kontekstu
    const [taskLists, setTaskLists] = useState([]);
    const [error, setError] = useState(null);

    // Funkcja do pobierania zadań z pliku
    const fetchTasksFromFile = async () => {
        try {
            console.log("Fetching tasks from file via API...");
            const response = await fetch("/api/googleTasks/getTasksFromFile");

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Nie udało się pobrać zadań z pliku.");
            }

            const data = await response.json();
            console.log("Tasks fetched from file:", data);
            setTaskLists(data || []);
        } catch (err) {
            console.error("Error fetching tasks from file:", err);
            setError("Nie udało się pobrać zadań z pliku.");
        }
    };

    // Obsługa aktualizacji zadań po odświeżeniu
    const handleTasksUpdated = (updatedTasks) => {
        setTaskLists(updatedTasks);
        setError(null);
    };

    // Obsługa błędów
    const handleError = (message) => {
        setError(message);
    };

    // Ładowanie zadań przy pierwszym renderowaniu strony
    useEffect(() => {
        fetchTasksFromFile();
    }, []);

    return (
        <div className="ToDoPage">
            <h1>Google Tasks</h1>
            {error && <p className="ToDoPage__error">{error}</p>}
            {!error && (
                <div className="ToDoPage__list">
                    {taskLists.length > 0 ? (
                        taskLists.map((list) => (
                            <div key={list.listId} className="ToDoPage__list-item">
                                <h3>{list.listTitle}</h3>
                                <ul>
                                    {list.tasks.map((task, index) => (
                                        <li key={index} className={`ToDoPage__task ${task.completed ? "completed" : "incomplete"}`}>
                                            <p><strong>Tytuł:</strong> {task.title}</p>
                                            <p><strong>Opis:</strong> {task.notes || "Brak"}</p>
                                            <p><strong>Termin:</strong> {task.due || "Brak"}</p>
                                            <p><strong>Status:</strong> {task.completed ? "Ukończone" : "Nieukończone"}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    ) : (
                        <p>Brak zadań do wyświetlenia.</p>
                    )}
                </div>
            )}
            <FloatingButton
                isLoggedIn={isLoggedIn}
                onTasksUpdated={handleTasksUpdated}
                onError={handleError}
            />
        </div>
    );
}
