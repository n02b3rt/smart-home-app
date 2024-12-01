"use client";

import { useEffect } from "react";
import YeelightController from "@/components/YeelightController/YeelightController";
import SensorAndWeatherOverview from "@/components/SensorAndWeatherOverview/SensorAndWeatherOverview";
import "@/styles/homePage.scss";

export default function Home() {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        if (code) {
            console.log("Kod autoryzacyjny znaleziony na stronie głównej:", code);

            const exchangeCode = async () => {
                try {
                    const response = await fetch(`/api/googleTasks/exchangeCode?code=${code}`);
                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error("Błąd podczas wymiany kodu na tokeny:", errorData);
                        return;
                    }

                    console.log("Tokeny wymienione pomyślnie. Ustawianie ciasteczek...");
                    window.history.replaceState({}, document.title, "/"); // Usuń `code` z URL
                } catch (error) {
                    console.error("Błąd podczas wymiany kodu na tokeny:", error);
                }
            };

            exchangeCode();
        }
    }, []);

    return (
        <main className="home-page">
            <SensorAndWeatherOverview />
            <YeelightController />
        </main>
    );
}
