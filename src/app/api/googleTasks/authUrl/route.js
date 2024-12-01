import { NextResponse } from "next/server";
import oAuth2Client from "@/services/tasksService";

export async function GET() {
    try {
        console.log("Generowanie Google Auth URL...");
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: "offline",
            scope: ["https://www.googleapis.com/auth/tasks.readonly"],
        });
        console.log("Wygenerowany URL autoryzacyjny:", authUrl);
        return NextResponse.json({ authUrl });
    } catch (error) {
        console.error("Błąd podczas generowania URL-a autoryzacyjnego:", error);
        return NextResponse.json({ error: "Nie udało się wygenerować URL-a autoryzacyjnego." }, { status: 500 });
    }
}
