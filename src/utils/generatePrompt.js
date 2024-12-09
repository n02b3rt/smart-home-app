import { filterTasksByDate, filterScheduleByDate } from "./filterData";
import tasksData from "/data/tasks.json";

// Funkcja do znalezienia następnego dnia
const getNextDay = (date) => {
    const currentDate = new Date(date);

    // Sprawdzenie, czy data jest prawidłowa
    if (isNaN(currentDate.getTime())) {
        return null;
    }

    currentDate.setDate(currentDate.getDate() + 1);
    return currentDate.toISOString().split("T")[0];
};

// Funkcja do znalezienia najwcześniejszej godziny rozpoczęcia zajęć
const getNextDayStartTime = (date) => {
    const nextDay = getNextDay(date);

    if (!nextDay) {
        return "Nieprawidłowa data.";
    }

    const scheduleForNextDay = filterScheduleByDate(nextDay);

    if (scheduleForNextDay.length === 0) {
        return "Dzień wolny";
    }

    const startTimes = scheduleForNextDay.map((lesson) => lesson.startTime);
    startTimes.sort();

    return `Zajęcia zaczynają się o ${startTimes[0]} (${nextDay}).`;
};

// Funkcja do filtrowania zadań z listy "Moje zadania"
const getExtraTasks = () => {
    const myTasksList = tasksData.find((list) => list.listTitle === "Moje zadania");

    if (!myTasksList) return [];

    return myTasksList.tasks;
};

// Główna funkcja generująca prompt
export const generatePrompt = (date, hasBreakfast, isLazyDay) => {
    if (!date) {
        return "Proszę podać prawidłową datę.";
    }

    const tasksForDate = filterTasksByDate(date);
    const scheduleForDate = filterScheduleByDate(date);
    const nextDayStartInfo = getNextDayStartTime(date);

    const extraTasks = getExtraTasks();
    const extraTasksWithDueDate = extraTasks.filter((task) => task.due && task.due !== "Brak terminu");
    const extraTasksWithoutDueDate = extraTasks.filter((task) => !task.due || task.due === "Brak terminu");

    const breakfastInfo = hasBreakfast
        ? ""
        : "Nie masz składników na śniadanie. Zaplanuj zakupy lub alternatywne śniadanie.";

    const lazyDayInfo = isLazyDay
        ? "Uwzględnij więcej przerw i odpoczynku w ciągu dnia, aby zredukować stres."
        : "";

    const extraTasksInfo = `
Jeśli masz dużo wolnego czasu, oto sugerowane zadania do wykonania z wyprzedzeniem:

Zadania z terminem:
${extraTasksWithDueDate.length > 0 ? extraTasksWithDueDate.map((task) => `- ${task.title} (Termin: ${task.due})`).join("\n") : "Brak zadań z terminem."}

Zadania bez terminu:
${extraTasksWithoutDueDate.length > 0 ? extraTasksWithoutDueDate.map((task) => `- ${task.title}`).join("\n") : "Brak zadań bez terminu."}
`;

    const prompt = `
Na podstawie poniższych danych wygeneruj plan dnia na ${date}.

Plan lekcji:
${scheduleForDate.length > 0 ? scheduleForDate.map((lesson) => `${lesson.startTime} - ${lesson.endTime}: ${lesson.subject} (${lesson.type})`).join("\n") : "Brak zajęć na uczelni."}

Zadania do wykonania:
${tasksForDate.length > 0 ? tasksForDate.map((task) => `- ${task.title} (Termin: ${task.due || "Brak terminu"})`).join("\n") : "Brak zadań na ten dzień."}

${breakfastInfo}
${lazyDayInfo}

Informacja o rozpoczęciu dnia następnego dnia:
${nextDayStartInfo}

${extraTasksInfo}

Zwróć dane w formacie JSON. Przykład:
{
  "day": "${date}",
  "schedule": [
    {
      "start_time": "czas rozpoczęcia",
      "closing_time": "czas zakończenia",
      "activity": "opis aktywności"
    }
  ]
}
`;

    return prompt;
};
