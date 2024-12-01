import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const accessToken = req.cookies.get("access_token")?.value;

        if (!accessToken) {
            return NextResponse.json(
                { error: "Nie znaleziono ciasteczka access_token." },
                { status: 401 }
            );
        }

        return NextResponse.json({ accessToken });
    } catch (error) {
        console.error("Błąd podczas odczytu ciasteczka:", error);
        return NextResponse.json(
            { error: "Wystąpił błąd podczas odczytu ciasteczka." },
            { status: 500 }
        );
    }
}
