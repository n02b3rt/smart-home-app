"use client";

import { useEffect } from "react";
import SpotifyPlayer from "@/components/SpotifyPlayer/SpotifyPlayer";
import WeatherWidget from "@/components/WeatherWidget/WeatherWidget";
import SensorData from "@/components/SensorData/SensorData";
import BedsideLampController from "@/components/YeelightController/BedsideLampController/BedsideLampController";
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

    // useEffect(() => {
    //     fetchInitialState();
    //     const interval = setInterval(() => {
    //         fetchInitialState();
    //     }, 60000); // Co 10 sekund
    //
    //     return () => clearInterval(interval); // Czyszczenie interwału przy odmontowaniu
    // }, []);

    return (
        <main className="home-page">
            <div className="home-page__spotify">
                <SpotifyPlayer/>
            </div>
            <div className="home-page__bedside-lamp">
                <BedsideLampController displayInformation={false} LAMP_IP="192.168.0.185"/>
            </div>
            <div className="home-page__temperatura home-page__temperatura--sensor">
                <SensorData/>
            </div>
            <div className="home-page__temperatura home-page__temperatura--api">
                <WeatherWidget/>
            </div>
        </main>
    );
}
