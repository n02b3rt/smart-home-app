import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req) {
    try {
        const { plan } = await req.json();

        if (!plan) {
            return NextResponse.json({ error: "Brak danych do zapisania" }, { status: 400 });
        }

        const filePath = path.resolve("./data", "dayPlan.json");
        await fs.writeFile(filePath, JSON.stringify(plan, null, 2));

        return NextResponse.json({ message: "Plan dnia zapisany pomyślnie!" });
    } catch (error) {
        console.error("Błąd podczas zapisywania planu dnia:", error);
        return NextResponse.json({ error: "Błąd podczas zapisywania planu" }, { status: 500 });
    }
}
