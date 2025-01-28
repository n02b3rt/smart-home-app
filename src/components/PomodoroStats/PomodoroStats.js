"use client";

import React, { useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import "chart.js/auto";
import "./pomodoroStats.scss"
import Icon from "/public/icons/check_circle.svg"

const PomodoroStats = () => {
    const [stats, setStats] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch("/api/pomodoro/stats");
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error("Błąd podczas pobierania statystyk:", error);
            }
        };

        fetchStats();
    }, []);

    // Obliczanie łącznego czasu spędzonego na Pomodoro
    const totalTime = stats.reduce((acc, session) => {
        const startTime = session.startTime ? new Date(session.startTime) : null;
        const endTime = session.endTime ? new Date(session.endTime) : null;

        if (startTime && endTime) {
            const duration = (endTime - startTime) / (1000 * 60); // Konwersja z ms na minuty
            return acc + duration;
        }

        return acc + 25; // Jeśli nie ma czasu zakończenia, dodajemy 25 minut
    }, 0);

    // Przetwarzanie danych do wykresów
    const tasksSummary = stats.reduce((acc, session) => {
        acc[session.task] = (acc[session.task] || 0) + 25; // 25 minut na sesję
        return acc;
    }, {});

    const dailySummary = stats.reduce((acc, session) => {
        const day = session.startTime
            ? new Date(session.startTime).toLocaleDateString()
            : session.date
                ? new Date(session.date).toLocaleDateString()
                : "Invalid Date";

        if (day !== "Invalid Date") {
            acc[day] = (acc[day] || 0) + 25;
        }
        return acc;
    }, {});

    const dayOfWeekSummary = stats.reduce((acc, session) => {
        const dayOfWeek = session.startTime
            ? new Date(session.startTime).toLocaleDateString("en-US", { weekday: "long" })
            : session.date
                ? new Date(session.date).toLocaleDateString("en-US", { weekday: "long" })
                : "Invalid Date";

        if (dayOfWeek !== "Invalid Date") {
            acc[dayOfWeek] = (acc[dayOfWeek] || 0) + 1;
        }
        return acc;
    }, {});

    // Dane do wykresów
    const taskChartData = {
        labels: Object.keys(tasksSummary),
        datasets: [
            {
                label: "Czas spędzony na zadaniach (minuty)",
                data: Object.values(tasksSummary),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            },
        ],
    };

    const dailyChartData = {
        labels: Object.keys(dailySummary),
        datasets: [
            {
                label: "Sesje Pomodoro na dzień",
                data: Object.values(dailySummary),
                borderColor: "#36A2EB",
                fill: true,
            },
        ],
    };

    const dayOfWeekChartData = {
        labels: Object.keys(dayOfWeekSummary),
        datasets: [
            {
                label: "Najbardziej produktywne dni",
                data: Object.values(dayOfWeekSummary),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#66BB6A", "#FFA726", "#AB47BC", "#EC407A"],
            },
        ],
    };

    return (
        <div className={"pomodoroStats"}>
            <div className={"pomodoroStats__header"}>
                <h2>
                    <Icon className={"pomodoroStats__header__icon"}/><br/>
                    <span className={"pomodoroStats__header__number"}>{Math.round(totalTime)} minut</span><br/>
                    Łączny czas spędzony na Pomodoro
                </h2>
                <div className={"pomodoroStats__header__chart"}>
                    <h2>Najbardziej produktywne dni</h2>
                    <Pie data={dayOfWeekChartData}/>
                </div>
            </div>
            <div className={"pomodoroStats__charts"}>
                <div>
                    <h2>Czas spędzony na zadaniach</h2>
                    <Bar data={taskChartData}/>
                </div>
                <div>
                    <h2>Liczba sesji na dzień</h2>
                    <Line data={dailyChartData}/>
                </div>
            </div>
        </div>
    );
};

export default PomodoroStats;
