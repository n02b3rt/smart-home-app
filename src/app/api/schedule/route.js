import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const jsonFilePath = path.join(process.cwd(), "data", "schedule.json");

// Odczyt pliku JSON
const readJSON = async () => {
    try {
        const data = await fs.readFile(jsonFilePath, "utf8");
        return JSON.parse(data || "[]");
    } catch (err) {
        // Jeśli plik nie istnieje, zwróć pustą tablicę
        if (err.code === "ENOENT") {
            return [];
        }
        throw err; // Inny błąd
    }
};

// Zapis do pliku JSON
const writeJSON = async (data) => {
    try {
        await fs.writeFile(jsonFilePath, JSON.stringify(data, null, 2), "utf8");
    } catch (err) {
        throw new Error("Nie udało się zapisać pliku JSON.");
    }
};

// Pobieranie zajęć
export async function GET() {
    try {
        const schedule = await readJSON();
        return NextResponse.json(schedule, { status: 200 });
    } catch (error) {
        console.error("Błąd podczas odczytu pliku JSON:", error);
        return NextResponse.json(
            { error: "Nie udało się odczytać planu zajęć." },
            { status: 500 }
        );
    }
}

// Dodawanie zajęć
export async function POST(req) {
    try {
        const body = await req.json();
        const { day, startTime, endTime, subject, type, weekType } = body;

        // Walidacja danych wejściowych
        if (!day || !startTime || !endTime || !subject || !type || !weekType) {
            return NextResponse.json(
                { error: "Brak wymaganych pól. Uzupełnij wszystkie pola." },
                { status: 400 }
            );
        }

        const schedule = await readJSON();
        const newEntry = { day, startTime, endTime, subject, type, weekType };
        schedule.push(newEntry);

        await writeJSON(schedule);
        return NextResponse.json(newEntry, { status: 201 });
    } catch (error) {
        console.error("Błąd podczas dodawania zajęć:", error);
        return NextResponse.json(
            { error: "Nie udało się dodać zajęć." },
            { status: 500 }
        );
    }
}

// Usuwanie zajęć
export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const index = parseInt(searchParams.get("index"), 10);

        if (isNaN(index)) {
            return NextResponse.json(
                { error: "Nieprawidłowy indeks. Podaj poprawny indeks zajęć." },
                { status: 400 }
            );
        }

        const schedule = await readJSON();

        if (index < 0 || index >= schedule.length) {
            return NextResponse.json(
                { error: "Indeks poza zakresem." },
                { status: 400 }
            );
        }

        const removedEntry = schedule.splice(index, 1); // Usuń zajęcia

        await writeJSON(schedule);
        return NextResponse.json(
            { message: "Zajęcia usunięte pomyślnie.", removedEntry },
            { status: 200 }
        );
    } catch (error) {
        console.error("Błąd podczas usuwania zajęć:", error);
        return NextResponse.json(
            { error: "Nie udało się usunąć zajęć." },
            { status: 500 }
        );
    }
}
