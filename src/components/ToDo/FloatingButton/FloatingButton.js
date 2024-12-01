"use client";

import React, { useState } from "react";
import PropTypes from "prop-types";
import "./FloatingButton.scss";

export default function FloatingButton({ isLoggedIn, onError, onTasksUpdated }) {
    const [authLoading, setAuthLoading] = useState(false);

    // Funkcja do autoryzacji użytkownika
    const handleAuthorize = async () => {
        try {
            setAuthLoading(true);
            const authUrlResponse = await fetch("/api/googleTasks/authUrl");

            if (!authUrlResponse.ok) {
                const errorData = await authUrlResponse.json();
                console.error("Error fetching authorization URL:", errorData);
                onError("Nie udało się uzyskać URL-a autoryzacyjnego.");
                return;
            }

            const { authUrl } = await authUrlResponse.json();
            if (authUrl) {
                window.location.href = authUrl; // Przekierowanie do Google
            } else {
                onError("Nie udało się uzyskać URL-a autoryzacyjnego.");
            }
        } catch (err) {
            console.error("Error during authorization:", err);
            onError("Wystąpił problem z autoryzacją.");
        } finally {
            setAuthLoading(false);
        }
    };

    // Funkcja do odświeżania zadań
    const refreshTasks = async () => {
        try {
            const response = await fetch("/api/googleTasks/getTasks");
            if (!response.ok) {
                throw new Error("Nie udało się odświeżyć zadań.");
            }

            const updatedTasks = await response.json();
            onTasksUpdated(updatedTasks); // Wywołanie funkcji przekazanej w propsach
        } catch (err) {
            console.error("Błąd podczas odświeżania zadań:", err);
            onError("Nie udało się odświeżyć zadań.");
        }
    };

    // Obsługa kliknięcia przycisku
    const handleButtonClick = () => {
        if (isLoggedIn) {
            refreshTasks(); // Jeśli zalogowany, odśwież zadania
        } else {
            handleAuthorize(); // Jeśli niezalogowany, autoryzacja
        }
    };

    return (
        <button
            className="FloatingButton"
            onClick={handleButtonClick}
            disabled={authLoading} // Przy autoryzacji przycisk zablokowany
        >
            <img
                src={isLoggedIn ? "/icons/refresh.svg" : "/icons/key.svg"}
                alt={isLoggedIn ? "Odśwież" : "Autoryzuj"}
            />
        </button>
    );
}

FloatingButton.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired, // Informacja, czy użytkownik jest zalogowany
    onError: PropTypes.func.isRequired, // Funkcja do obsługi błędów
    onTasksUpdated: PropTypes.func.isRequired, // Funkcja wywoływana po odświeżeniu zadań
};
