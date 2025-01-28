import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data", "pomodoro.json");

export async function GET() {
    try {
        const fileContents = await fs.readFile(filePath, "utf-8");
        const stats = JSON.parse(fileContents);
        return new Response(JSON.stringify(stats), { status: 200 });
    } catch (error) {
        console.error("Błąd podczas odczytu statystyk:", error);
        return new Response(JSON.stringify([]), { status: 200 });
    }
}
