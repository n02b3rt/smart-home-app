import { NextResponse } from "next/server";
import oAuth2Client, { getGoogleTasksWithDetails } from "@/services/tasksService";
import fs from "fs/promises";
import path from "path";

export async function GET(req) {
    try {
        const accessToken = req.cookies.get("access_token")?.value;

        if (!accessToken) {
            console.error("No access token in cookies.");
            return NextResponse.json(
                { error: "Brak autoryzacji. Zaloguj się ponownie." },
                { status: 401 }
            );
        }

        console.log("Setting access token for Google API...");
        oAuth2Client.setCredentials({ access_token: accessToken });

        console.log("Fetching tasks with details using getGoogleTasksWithDetails...");
        const detailedTasks = await getGoogleTasksWithDetails(oAuth2Client);

        console.log("Tasks with details fetched successfully:", detailedTasks);

        // Zapisanie szczegółowych danych do pliku
        const filePath = path.resolve("./data", "tasks.json");
        await fs.writeFile(filePath, JSON.stringify(detailedTasks, null, 2));
        console.log("Tasks saved to file:", filePath);

        return NextResponse.json(detailedTasks);
    } catch (error) {
        console.error("Error fetching tasks from Google Tasks API:", error);
        return NextResponse.json(
            { error: "Nie udało się pobrać zadań." },
            { status: 500 }
        );
    }
}
