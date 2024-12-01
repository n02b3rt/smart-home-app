"use client";

import React from "react";
import Task from "./Task/Task";
import "./TasksList.scss";

export default function TasksList({ listTitle, tasks }) {
    // Funkcja sortująca
    const sortTasks = (tasks) => {
        return [...tasks].sort((a, b) => {
            // Zadania zakończone na samym dole
            if (a.completed && !b.completed) return 1;
            if (!a.completed && b.completed) return -1;

            // Zadania bez daty na dole
            if (!a.due && b.due) return 1;
            if (a.due && !b.due) return -1;

            // Sortuj po dacie (wcześniejsze daty na górze)
            if (a.due && b.due) {
                const dateA = new Date(a.due);
                const dateB = new Date(b.due);
                return dateA - dateB;
            }

            // Jeśli oba są bez daty, zachowaj porządek
            return 0;
        });
    };

    // Posortowane zadania
    const sortedTasks = sortTasks(tasks);

    return (
        <div className="List">
            <h3>{listTitle}</h3>
            <ul>
                {sortedTasks.map((task, index) => (
                    <Task
                        key={index}
                        title={task.title}
                        notes={task.notes}
                        due={task.due}
                        completed={task.completed}
                    />
                ))}
            </ul>
        </div>
    );
}
