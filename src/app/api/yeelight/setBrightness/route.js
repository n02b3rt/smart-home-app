import { exec } from "child_process";
import dotenv from "dotenv";

dotenv.config(); // Załaduj zmienne z .env.local

export async function POST(req) {
    try {
        const { host, brightness } = await req.json();

        if (!host || brightness === undefined) {
            return new Response(
                JSON.stringify({ error: "Nie podano hosta lub jasności." }),
                { status: 400 }
            );
        }

        // Pobranie tokena z .env.local
        const tokenKey = `TOKEN_LAMP_${host.replace(/\./g, "_")}`;
        const token = process.env[tokenKey];

        if (!token) {
            return new Response(
                JSON.stringify({ error: "Nieznany host lub brak przypisanego tokena." }),
                { status: 400 }
            );
        }

        console.log(`Ustawianie jasności na ${brightness}% dla lampy ${host}...`);

        // Komenda do ustawienia jasności
        const command = `miiocli yeelight --ip ${host} --token ${token} set_brightness ${brightness}`;

        // Wykonanie polecenia
        const result = await new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error("Błąd podczas ustawiania jasności:", stderr);
                    reject(stderr.trim());
                } else {
                    console.log("Odpowiedź terminala:", stdout);
                    resolve(stdout.trim());
                }
            });
        });

        return new Response(
            JSON.stringify({
                status: true,
                message: `Brightness set to ${brightness} for lamp ${host}`,
                result,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Błąd API Yeelight (ustawianie jasności):", error);
        return new Response(JSON.stringify({ status: false, error: error.message }), {
            status: 500,
        });
    }
}
