"use client";

import React, {useState, useEffect, useRef} from "react";
import "./Pomodoro.scss";
import Link from "next/link";
import StatsIcon from "/public/icons/trending.svg"
import AddIcon from "/public/icons/add.svg"

const Pomodoro = () => {
    const [tasks, setTasks] = useState([]); // Lista zadań
    const [selectedTask, setSelectedTask] = useState(""); // Wybrane zadanie
    const [timeLeft, setTimeLeft] = useState(1500); // 25 minut w sekundach
    const [isRunning, setIsRunning] = useState(false); // Czy timer działa
    const [mode, setMode] = useState("work"); // 'work' lub 'break'
    const [startTime, setStartTime] = useState(null); // Czas rozpoczęcia
    const [endTime, setEndTime] = useState(null); // Czas zakończenia
    const audioRef = useRef(null); // Referencja do dźwięku

    useEffect(() => {
        let timer;
        if (isRunning && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(timer);
            if (mode === "work") {
                handleWorkComplete();
            } else {
                handleBreakComplete();
            }
        }

        return () => clearInterval(timer); // Czyszczenie timera
    }, [isRunning, timeLeft, mode]);

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


    const handleStart = () => {
        if (!selectedTask) {
            alert("Wybierz zadanie przed rozpoczęciem!");
            return;
        }
        setIsRunning(true);
        setStartTime(new Date());
    };

    const handlePause = () => {
        setIsRunning(false);
    };

    const handleReset = () => {
        setIsRunning(false);
        setTimeLeft(mode === "work" ? 1500 : 300); // Reset w zależności od trybu
    };

    const handleWorkComplete = async () => {
        setIsRunning(false);
        setEndTime(new Date());
        // alert("Czas na przerwę!");
        playSound();
        await savePomodoro("completed");
        setMode("break");
        setTimeLeft(300); // 5 minut przerwy
    };

    const handleBreakComplete = () => {
        setIsRunning(false);
        // alert("Przerwa zakończona! Czas wrócić do pracy.");
        playSound();
        setMode("work");
        setTimeLeft(1500); // Reset do 25 minut pracy
    };

    const playSound = () => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    };

    const savePomodoro = async (status) => {
        try {
            const response = await fetch("/api/pomodoro/save", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    task: selectedTask,
                    status,
                    startTime: startTime.toISOString(),
                    endTime: new Date().toISOString(),
                }),
            });
            if (!response.ok) {
                throw new Error("Błąd podczas zapisu danych.");
            }
        } catch (error) {
            console.error("Błąd zapisu Pomodoro:", error);
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    return (
        <div className="pomodoro">
            <div className="pomodoro__timer">
                <div className={"pomodoro__timer__container"}>
                    <img
                        src="/photos/pexels-emma-jones-259946-793266.webp"
                        alt="Opis zdjęcia"
                        className="pomodoro__timer__photo"
                    />

                    <h2>{mode === "work" ? "Praca" : "Przerwa"}</h2>
                    <p className="pomodoro__timer__time">{formatTime(timeLeft)}</p>
                </div>

                <div className="pomodoro__task-selection">
                    <select
                        value={selectedTask}
                        onChange={(e) => setSelectedTask(e.target.value)}
                    >
                        <option value="">Wybierz zadanie...</option>
                        {tasks.map((task, index) => (
                            <option key={index} value={task}>
                                {task}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="pomodoro__controls">
                    {isRunning ? (
                        <button className="button-77" role="button" onClick={handlePause}>Pauza</button>
                    ) : (
                        <button className="button-77" role="button" onClick={handleStart}>Start</button>
                    )}
                    <button className="button-77" role="button" onClick={handleReset}>Reset</button>
                </div>

            </div>

            <Link href={"/pomodoro/stats"} className={"pomodoro__stats"}>
                <StatsIcon className={"pomodoro__stats__icon"}/>
            </Link>
            <Link href={"/pomodoro/add-task"} className={"pomodoro__add-task"}>
                <AddIcon className={"pomodoro__add-task__icon"}/>
            </Link>
            <audio ref={audioRef} src="/sounds/notification.mp3"/>
        </div>
    );
};

export default Pomodoro;
