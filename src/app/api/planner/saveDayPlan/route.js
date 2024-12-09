import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req) {
    try {
        const { plan } = await req.json();

        if (!plan || !plan.day) {
            return NextResponse.json({ error: "Brak danych lub daty do zapisania" }, { status: 400 });
        }

        const filePath = path.resolve("./data", "dayPlan.json");

        let existingData = [];

        try {
            const fileContent = await fs.readFile(filePath, "utf-8");
            existingData = JSON.parse(fileContent);
        } catch (err) {
            console.warn("Plik nie istnieje lub jest pusty. Tworzenie nowego pliku.");
        }

        // Sprawdzenie, czy plan na dany dzień już istnieje
        const planIndex = existingData.findIndex((item) => item.day === plan.day);

        if (planIndex !== -1) {
            existingData[planIndex] = plan; // Aktualizacja istniejącego planu
        } else {
            existingData.push(plan); // Dodanie nowego planu
        }

        // Zapisanie zaktualizowanych danych do pliku
        await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));

        return NextResponse.json({ message: "Plan dnia zapisany pomyślnie!" });
    } catch (error) {
        console.error("Błąd podczas zapisywania planu dnia:", error);
        return NextResponse.json({ error: "Błąd podczas zapisywania planu" }, { status: 500 });
    }
}
