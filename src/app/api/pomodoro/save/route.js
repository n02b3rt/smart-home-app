import fs from "fs/promises";
import path from "path";

export async function POST(req) {
    try {
        const data = await req.json();
        const filePath = path.join(process.cwd(), "data", "pomodoro.json");

        // Wczytaj istniejące dane
        let currentData = [];
        try {
            const fileContents = await fs.readFile(filePath, "utf-8");
            currentData = JSON.parse(fileContents);
        } catch (err) {
            console.log("Plik nie istnieje, zostanie utworzony.");
        }

        // Dodaj nowe dane
        currentData.push(data);

        // Zapisz do pliku
        await fs.writeFile(filePath, JSON.stringify(currentData, null, 2), "utf-8");

        return new Response(
            JSON.stringify({ status: "success", message: "Pomodoro zapisane." }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Błąd zapisu:", error);
        return new Response(JSON.stringify({ error: "Błąd zapisu danych." }), {
            status: 500,
        });
    }
}
