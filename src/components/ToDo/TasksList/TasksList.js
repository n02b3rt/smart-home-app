"use client";

import React, { useEffect, useState } from "react";

export default function TasksList({ onError }) {
    const [taskLists, setTaskLists] = useState([]);

    const fetchTasksFromFile = async () => {
        try {
            const response = await fetch("/api/googleTasks/getTasksFromFile");
            if (!response.ok) {
                throw new Error("Nie udało się odczytać zadań z pliku.");
            }
            const data = await response.json();
            setTaskLists(data);
        } catch (err) {
            console.error("Błąd podczas odczytu zadań z pliku:", err);
            onError("Nie udało się odczytać zadań.");
        }
    };

    useEffect(() => {
        fetchTasksFromFile();
    }, []);

    if (!taskLists || taskLists.length === 0) {
        return <p>Brak zadań do wyświetlenia.</p>;
    }

    return (
        <div className="ToDoPage__list">
            {taskLists.map((list) => (
                <div key={list.listId} className="ToDoPage__list-item">
                    <h3>{list.listTitle}</h3>
                    <ul>
                        {list.tasks.map((task, index) => (
                            <li key={index}>
                                <p><strong>Tytuł:</strong> {task.title}</p>
                                <p><strong>Opis:</strong> {task.notes || "Brak"}</p>
                                <p><strong>Termin:</strong> {task.due || "Brak"}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}
