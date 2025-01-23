// src/utils/filterData.js

import scheduleData from "/data/schedule.json";
import tasksData from "/data/tasks.json";

// Funkcja do filtrowania zadań na podstawie daty
export const filterTasksByDate = (date) => {
    return tasksData.flatMap((list) =>
        list.tasks.filter((task) => {
            if (!task.due) return false; // Pomijamy zadania bez daty

            const taskDate = new Date(task.due);

            // Sprawdź, czy data jest prawidłowa
            if (isNaN(taskDate)) return false;

            // Porównaj tylko część daty (YYYY-MM-DD)
            return taskDate.toISOString().split("T")[0] === date;
        })
    );
};

// Funkcja do filtrowania planu lekcji na podstawie dnia tygodnia
export const filterScheduleByDate = (date) => {
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });

    // Funkcja do sprawdzenia, czy tydzień jest parzysty czy nieparzysty
    const isEvenWeek = (date) => {
        const startOfYear = new Date(new Date(date).getFullYear(), 0, 1);
        const weekNumber = Math.ceil(((new Date(date) - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
        return weekNumber % 2 === 0;
    };

    return scheduleData.filter((lesson) => {
        if (lesson.day !== dayOfWeek) return false;

        // Uwzględnij zajęcia na każdy tydzień ("Both") lub tylko na odpowiedni typ tygodnia
        if (lesson.weekType === "Both") return true;
        if (lesson.weekType === "A" && !isEvenWeek(date)) return true;
        if (lesson.weekType === "B" && isEvenWeek(date)) return true;

        return false;
    });
};
