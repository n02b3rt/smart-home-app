// src/app/day-planner/page.js

"use client";

import React, { useState } from "react";
import { generatePrompt } from "@/utils/generatePrompt";

export default function DayPlanner() {
    const [date, setDate] = useState("");
    const [hasBreakfast, setHasBreakfast] = useState(true);
    const [isLazyDay, setIsLazyDay] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [copySuccess, setCopySuccess] = useState("");
    const [gptResponse, setGptResponse] = useState("");
    const [saveStatus, setSaveStatus] = useState("");

    // Generowanie promptu
    const handleGeneratePrompt = () => {
        const generatedPrompt = generatePrompt(date, hasBreakfast, isLazyDay);
        setPrompt(generatedPrompt);
        setCopySuccess("");
    };

    // Kopiowanie promptu do schowka
    const handleCopyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(prompt);
            setCopySuccess("Prompt skopiowany do schowka!");
        } catch (err) {
            setCopySuccess("Nie udało się skopiować promptu.");
            console.error("Błąd podczas kopiowania:", err);
        }
    };

    // Zapisywanie planu do pliku
    const handleSavePlan = async () => {
        try {
            const parsedPlan = JSON.parse(gptResponse);
            const response = await fetch("/api/planner/saveDayPlan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ plan: parsedPlan }),
            });

            const result = await response.json();

            if (response.ok) {
                setSaveStatus("Plan dnia zapisany pomyślnie!");
            } else {
                setSaveStatus(`Błąd: ${result.error}`);
            }
        } catch (err) {
            setSaveStatus("Błąd podczas parsowania lub zapisywania planu.");
            console.error("Błąd:", err);
        }
    };

    return (
        <div>
            <h1>Day Planner</h1>

            <div>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>

            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={hasBreakfast}
                        onChange={(e) => setHasBreakfast(e.target.checked)}
                    />
                    Mam składniki na śniadanie
                </label>
            </div>

            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={isLazyDay}
                        onChange={(e) => setIsLazyDay(e.target.checked)}
                    />
                    Lazy Day Mode
                </label>
            </div>

            <button onClick={handleGeneratePrompt}>Generuj prompt</button>

            {prompt && (
                <div>
                    <h2>Wygenerowany prompt:</h2>
                    <pre style={{ maxHeight: "300px", overflowY: "scroll", border: "1px solid #ccc", padding: "10px" }}>
                        {prompt}
                    </pre>
                    <button onClick={handleCopyToClipboard}>Kopiuj prompt</button>
                    {copySuccess && <p>{copySuccess}</p>}
                </div>
            )}

            <div>
                <h2>Wklej odpowiedź z GPT (w formacie JSON):</h2>
                <textarea
                    rows="10"
                    cols="50"
                    value={gptResponse}
                    onChange={(e) => setGptResponse(e.target.value)}
                    placeholder="Wklej tutaj odpowiedź w formacie JSON..."
                    style={{ width: "100%", maxHeight: "300px" }}
                />
                <button onClick={handleSavePlan}>Zapisz plan</button>
                {saveStatus && <p>{saveStatus}</p>}
            </div>
        </div>
    );
}
