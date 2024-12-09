// src/app/day-planner/page.js

"use client";

import React, { useState } from "react";
import { generatePrompt } from "@/utils/generatePrompt";

export default function DayPlanner() {
    const [date, setDate] = useState("");
    const [hasBreakfast, setHasBreakfast] = useState(true);
    const [isLazyDay, setIsLazyDay] = useState(false);
    const [prompt, setPrompt] = useState("");

    const handleGeneratePrompt = () => {
        const generatedPrompt = generatePrompt(date, hasBreakfast, isLazyDay);
        setPrompt(generatedPrompt);
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
                    <pre>{prompt}</pre>
                </div>
            )}
        </div>
    );
}
