import React from "react";
import ActivityItem from "../ActivityItem/ActivityItem";
import styles from "./ActivityList.module.scss";

export default function ActivityList({ activities, getActivityStatus, currentTime }) {
    // Funkcja do sortowania aktywności
    const sortActivities = (activities) => {
        return activities.slice().sort((a, b) => {
            const now = currentTime.getHours() * 60 + currentTime.getMinutes();
            const getTime = (time) => {
                const [hours, minutes] = time.split(":").map(Number);
                return hours * 60 + minutes;
            };

            const aStart = getTime(a.start_time);
            const aEnd = getTime(a.closing_time);
            const bStart = getTime(b.start_time);
            const bEnd = getTime(b.closing_time);

            const aStatus = getActivityStatus(a.start_time, a.closing_time);
            const bStatus = getActivityStatus(b.start_time, b.closing_time);

            if (aStatus === "current") return -1;
            if (bStatus === "current") return 1;
            if (aStatus === "future" && bStatus === "past") return -1;
            if (aStatus === "past" && bStatus === "future") return 1;

            return aStart - bStart;
        });
    };

    return (
        <ul className={styles.activityList}>
            {sortActivities(activities).map((activity, index) => {
                const status = getActivityStatus(activity.start_time, activity.closing_time);
                return (
                    <ActivityItem
                        key={index}
                        activity={activity}
                        status={status}
                        currentTime={currentTime}
                    />
                );
            })}
        </ul>
    );
}
