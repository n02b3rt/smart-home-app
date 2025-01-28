import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data", "tasks.json");

export async function GET() {
    try {
        // Wczytaj listę zadań z pliku
        const fileContents = await fs.readFile(filePath, "utf-8");
        const tasks = JSON.parse(fileContents);
        return new Response(JSON.stringify(tasks), { status: 200 });
    } catch (error) {
        console.error("Błąd podczas odczytu zadań:", error);
        return new Response(JSON.stringify([]), { status: 200 }); // Jeśli plik nie istnieje, zwróć pustą tablicę
    }
}

export async function POST(req) {
    try {
        const { task } = await req.json();

        if (!task) {
            return new Response(JSON.stringify({ error: "Brak treści zadania." }), {
                status: 400,
            });
        }

        let tasks = [];
        try {
            const fileContents = await fs.readFile(filePath, "utf-8");
            tasks = JSON.parse(fileContents);
        } catch (error) {
            console.log("Plik z zadaniami nie istnieje. Zostanie utworzony.");
        }

        tasks.push(task);

        // Zapisz do pliku
        await fs.writeFile(filePath, JSON.stringify(tasks, null, 2), "utf-8");

        return new Response(JSON.stringify({ message: "Zadanie dodane." }), { status: 200 });
    } catch (error) {
        console.error("Błąd podczas zapisu zadania:", error);
        return new Response(JSON.stringify({ error: "Błąd zapisu zadania." }), {
            status: 500,
        });
    }
}

export async function DELETE(req) {
    try {
        const { task } = await req.json();

        if (!task) {
            return new Response(JSON.stringify({ error: "Brak treści zadania." }), {
                status: 400,
            });
        }

        let tasks = [];
        try {
            const fileContents = await fs.readFile(filePath, "utf-8");
            tasks = JSON.parse(fileContents);
        } catch (error) {
            console.log("Plik z zadaniami nie istnieje.");
        }

        tasks = tasks.filter((t) => t !== task);

        // Zapisz do pliku
        await fs.writeFile(filePath, JSON.stringify(tasks, null, 2), "utf-8");

        return new Response(JSON.stringify({ message: "Zadanie usunięte." }), { status: 200 });
    } catch (error) {
        console.error("Błąd podczas usuwania zadania:", error);
        return new Response(JSON.stringify({ error: "Błąd usuwania zadania." }), {
            status: 500,
        });
    }
}
