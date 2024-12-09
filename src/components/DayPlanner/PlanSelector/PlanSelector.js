import React from "react";
import styles from "./PlanSelector.module.scss";

export default function PlanSelector({ plans, selectedDate, onDateChange }) {
    return (
        <div className={styles.planSelector}>
            <label htmlFor="date-select">Wybierz datę: </label>
            <select
                id="date-select"
                value={selectedDate}
                onChange={onDateChange}
            >
                {plans.map((plan) => (
                    <option key={plan.day} value={plan.day}>
                        {plan.day}
                    </option>
                ))}
            </select>
        </div>
    );
}
