import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(req) {
    try {
        const filePath = path.resolve("./data", "tasks.json");
        const fileData = await fs.readFile(filePath, "utf8");
        const tasks = JSON.parse(fileData);

        console.log("Tasks fetched from file:", tasks);
        return NextResponse.json(tasks);
    } catch (error) {
        console.error("Error reading tasks from file:", error);
        return NextResponse.json(
            { error: "Nie udało się odczytać zadań z pliku." },
            { status: 500 }
        );
    }
}
