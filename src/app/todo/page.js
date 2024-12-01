"use client";

import React, { useState, useEffect } from "react";
import FloatingButton from "@/components/ToDo/FloatingButton/FloatingButton";
import TasksList from "@/components/ToDo/TasksList/TasksList";
import { useAuth } from "@/context/AuthContext";
import "./ToDo.scss";

export default function ToDoPage() {
    const { isLoggedIn } = useAuth(); // Pobierz `isLoggedIn` z kontekstu
    const [taskLists, setTaskLists] = useState([]);
    const [error, setError] = useState(null);

    const fetchTasksFromFile = async () => {
        try {
            console.log("Fetching tasks from file via API...");
            const response = await fetch("/api/googleTasks/getTasksFromFile");

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Nie udało się pobrać zadań z pliku.");
            }

            const data = await response.json();
            // console.log("Tasks fetched from file:", data);
            setTaskLists(data || []);
        } catch (err) {
            console.error("Error fetching tasks from file:", err);
            setError("Nie udało się pobrać zadań z pliku.");
        }
    };

    const handleTasksUpdated = (updatedTasks) => {
        setTaskLists(updatedTasks);
        setError(null);
    };

    const handleError = (message) => {
        setError(message);
    };

    useEffect(() => {
        fetchTasksFromFile();
    }, []);

    return (
        <div className="ToDoPage">
            {error && <p className="ToDoPage__error">{error}</p>}
            {!error && (
                <div className="ToDoPage__list">
                    {taskLists.length > 0 ? (
                        taskLists.map((list) => (
                            <TasksList key={list.listId} listTitle={list.listTitle} tasks={list.tasks} />
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
