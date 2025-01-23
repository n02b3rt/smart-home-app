import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
    try {
        const filePath = path.resolve("./data", "dayPlan.json");
        const fileContent = await fs.readFile(filePath, "utf-8");
        const plans = JSON.parse(fileContent);

        return NextResponse.json(plans);
    } catch (error) {
        console.error("Błąd podczas odczytu planów dnia:", error);
        return NextResponse.json({ error: "Błąd podczas odczytu planów dnia" }, { status: 500 });
    }
}
