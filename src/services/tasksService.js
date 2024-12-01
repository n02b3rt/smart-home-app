import { google } from "googleapis";

const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

export default oAuth2Client;

// Fetch tasks from Google Tasks API
export const getGoogleTasksWithDetails = async (authClient) => {
    try {
        console.log("Fetching task lists using Google API...");
        const tasksAPI = google.tasks({ version: "v1", auth: authClient });

        // Fetch all task lists
        const taskListsResult = await tasksAPI.tasklists.list();
        const taskLists = taskListsResult.data.items || [];
        console.log("Task lists fetched:", taskLists);

        const detailedTasks = [];

        // For each task list, fetch its tasks
        for (const list of taskLists) {
            console.log(`Fetching tasks for list: ${list.title}`);
            const tasksResult = await tasksAPI.tasks.list({ tasklist: list.id });
            const tasks = tasksResult.data.items || [];
            console.log(`Tasks for ${list.title}:`, tasks);

            detailedTasks.push({
                listTitle: list.title,
                listId: list.id,
                tasks: tasks.map((task) => ({
                    title: task.title,
                    notes: task.notes || "Brak opisu",
                    due: task.due || "Brak terminu",
                    completed: task.status === "completed", // Sprawdź status wykonania
                })),
            });
        }

        return detailedTasks;
    } catch (error) {
        console.error("Error fetching tasks with details:", error);
        throw error;
    }
};


// Token exchange for OAuth
export const exchangeCodeForTokens = async (code) => {
    try {
        console.log("Wymiana kodu na tokeny. Kod:", code);

        const { tokens } = await oAuth2Client.getToken(code);
        console.log("Tokeny uzyskane z kodu autoryzacyjnego:", tokens);

        if (!tokens || !tokens.access_token) {
            throw new Error("Nie udało się uzyskać tokena dostępu.");
        }

        return tokens;
    } catch (error) {
        console.error("Błąd podczas wymiany kodu na tokeny:", error.response?.data || error.message);
        throw error;
    }
};
