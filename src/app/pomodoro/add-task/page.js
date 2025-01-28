"use client";

import React, { useState, useEffect } from "react";

const TasksManager = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch("/api/pomodoro/tasks");
                const data = await response.json();
                setTasks(data);
            } catch (error) {
                console.error("Błąd podczas pobierania zadań:", error);
            }
        };

        fetchTasks();
    }, []);

    const addTask = async () => {
        if (!newTask.trim()) {
            alert("Treść zadania nie może być pusta.");
            return;
        }

        try {
            const response = await fetch("/api/pomodoro/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ task: newTask }),
            });

            if (response.ok) {
                setTasks((prev) => [...prev, newTask]);
                setNewTask("");
            }
        } catch (error) {
            console.error("Błąd podczas dodawania zadania:", error);
        }
    };

    const deleteTask = async (task) => {
        try {
            const response = await fetch("/api/pomodoro/tasks", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ task }),
            });

            if (response.ok) {
                setTasks((prev) => prev.filter((t) => t !== task));
            }
        } catch (error) {
            console.error("Błąd podczas usuwania zadania:", error);
        }
    };

    return (
        <div className="tasks-manager">
            <h1>Zarządzanie zadaniami</h1>
            <div className="tasks-manager__input">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Nowe zadanie"
                />
                <button onClick={addTask}>Dodaj</button>
            </div>
            <ul className="tasks-manager__list">
                {tasks.map((task, index) => (
                    <li key={index}>
                        {task}
                        <button onClick={() => deleteTask(task)}>Usuń</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TasksManager;
