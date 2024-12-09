// src/utils/generatePrompt.js

import { filterTasksByDate, filterScheduleByDate } from "./filterData";

// Funkcja do pobrania dnia tygodnia na podstawie daty
const getDayOfWeek = (date) => {
    return new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
};

// Funkcja do obliczenia następnego dnia
// Funkcja do obliczenia następnego dnia
const getNextDay = (date) => {
    const currentDate = new Date(date);

    // Sprawdzenie, czy data jest prawidłowa
    if (isNaN(currentDate.getTime())) {
        return null; // Zwraca null, jeśli data jest nieprawidłowa
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

    return `Zajęcia zaczynają się o ${startTimes[0]} (${getDayOfWeek(nextDay)}).`;
};


export const generatePrompt = (date, hasBreakfast, isLazyDay) => {
    if (!date) {
        return "Proszę podać prawidłową datę.";
    }

    const tasksForDate = filterTasksByDate(date);
    const scheduleForDate = filterScheduleByDate(date);
    const nextDayStartInfo = getNextDayStartTime(date);

    const breakfastInfo = hasBreakfast
        ? ""
        : "Nie masz składników na śniadanie. Zaplanuj zakupy lub alternatywne śniadanie.";

    const lazyDayInfo = isLazyDay
        ? "Uwzględnij więcej przerw i odpoczynku w ciągu dnia, aby zredukować stres."
        : "";

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

