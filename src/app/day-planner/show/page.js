"use client";

import React, { useState, useEffect } from "react";
import styles from "./ShowDayPlanner.module.scss";
import PlanSelector from "@/components/DayPlanner/PlanSelector/PlanSelector";
import ActivityList from "@/components/DayPlanner/ActivityList/ActivityList";

export default function ShowDayPlanner() {
    const [plans, setPlans] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [currentPlan, setCurrentPlan] = useState(null);
    const [error, setError] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Pobieranie planów dnia z API
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await fetch("/api/planner/getDayPlans");
                if (!response.ok) {
                    throw new Error("Nie udało się pobrać planów dnia");
                }
                const data = await response.json();
                setPlans(data);

                if (data.length > 0) {
                    setSelectedDate(data[0].day);
                    setCurrentPlan(data[0]);
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchPlans();
    }, []);

    // Aktualizacja czasu co minutę
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    // Sprawdzenie, czy wybrana data jest przyszła
    const isFutureDate = (date) => {
        const selected = new Date(date);
        selected.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selected > today;
    };

    // Obsługa zmiany wybranego dnia
    const handleDateChange = (e) => {
        const selected = e.target.value;
        setSelectedDate(selected);
        const plan = plans.find((plan) => plan.day === selected);
        setCurrentPlan(plan);
    };

    // Funkcja do określenia statusu aktywności
    const getActivityStatus = (startTime, closingTime) => {
        if (isFutureDate(selectedDate)) return "future";

        const current = currentTime.getHours() * 60 + currentTime.getMinutes();

        const getMinutes = (time) => {
            const [hours, minutes] = time.split(":").map(Number);
            return hours * 60 + minutes;
        };

        const start = getMinutes(startTime);
        const end = getMinutes(closingTime);

        // Obsługa aktywności przechodzących przez północ
        if (start > end) {
            if (current >= start || current <= end) {
                return "current";
            } else if (current > end && current < start) {
                return "future";
            } else {
                return "past";
            }
        }

        // Standardowa obsługa aktywności w ciągu dnia
        if (current >= start && current <= end) {
            return "current";
        } else if (current > end) {
            return "past";
        } else {
            return "future";
        }
    };

    return (
        <div className={styles.sectionContainer}>
            <h1>Wyświetl Plan Dnia</h1>
            {error && <p className={styles.error}>{error}</p>}

            {plans.length > 0 && (
                <PlanSelector
                    plans={plans}
                    selectedDate={selectedDate}
                    onDateChange={handleDateChange}
                />
            )}

            {currentPlan && (
                <div className={styles.planContainer}>
                    <ActivityList
                        activities={currentPlan.schedule}
                        getActivityStatus={getActivityStatus}
                        currentTime={currentTime}
                    />
                </div>
            )}
        </div>
    );
}
