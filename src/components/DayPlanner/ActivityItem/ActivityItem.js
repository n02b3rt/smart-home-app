import React from "react";
import styles from "./ActivityItem.module.scss";

export default function ActivityItem({ activity, status, currentTime }) {
    const { start_time, closing_time, activity: activityName } = activity;

    // Funkcja do obliczenia procentu postępu dla aktualnej czynności
    const calculateProgress = () => {
        if (status !== "current") return 0;

        const getMinutes = (time) => {
            const [hours, minutes] = time.split(":").map(Number);
            return hours * 60 + minutes;
        };

        const current = currentTime.getHours() * 60 + currentTime.getMinutes();
        const start = getMinutes(start_time);
        const end = getMinutes(closing_time);

        return ((current - start) / (end - start)) * 100;
    };

    const progress = calculateProgress();

    return (
        <li className={`${styles.activity} ${styles[status]}`}>
            {status === "current" && (
                <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
            )}
            <div className={styles.content}>
                <strong>{start_time} - {closing_time}</strong>: {activityName}
            </div>
        </li>
    );
}
