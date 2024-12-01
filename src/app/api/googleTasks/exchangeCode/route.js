import { NextResponse } from "next/server";
import oAuth2Client, { exchangeCodeForTokens } from "@/services/tasksService";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
        console.error("Brak kodu autoryzacyjnego w parametrach URL.");
        return NextResponse.json({ error: "Brak kodu autoryzacyjnego." }, { status: 400 });
    }

    try {
        console.log("Wymienianie kodu na tokeny...");
        const tokens = await exchangeCodeForTokens(code);

        console.log("Tokeny uzyskane:", tokens);

        if (!tokens || !tokens.access_token) {
            console.error("Tokeny nie zostały poprawnie wygenerowane.");
            return NextResponse.json({ error: "Token exchange failed" }, { status: 500 });
        }

        // Tworzenie odpowiedzi bez przekierowania
        const response = NextResponse.json({ message: "Authorization successful" });

        response.cookies.set("access_token", tokens.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 3600, // 1 godzina
            sameSite: "lax",
        });

        if (tokens.refresh_token) {
            response.cookies.set("refresh_token", tokens.refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                path: "/",
                maxAge: 30 * 24 * 60 * 60, // 30 dni
                sameSite: "lax",
            });
        }

        console.log("Ciasteczka ustawione:", {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
        });

        return response;
    } catch (error) {
        if (error.response?.data?.error === "invalid_grant") {
            console.error("Kod autoryzacyjny jest nieprawidłowy lub wygasł.");
            return NextResponse.json({ error: "Kod autoryzacyjny jest nieprawidłowy lub wygasł." }, { status: 400 });
        }

        console.error("Błąd podczas wymiany kodu na tokeny:", error);
        return NextResponse.json({ error: "Nie udało się wymienić kodu na tokeny." }, { status: 500 });
    }
}
