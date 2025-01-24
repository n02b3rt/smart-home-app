import { exec } from "child_process";
import dotenv from "dotenv";

dotenv.config(); // Wczytanie zmiennych środowiskowych z pliku .env

export async function POST(req) {
    try {
        const { host } = await req.json();

        if (!host) {
            return new Response(
                JSON.stringify({ error: "Nie podano adresu IP lampy." }),
                { status: 400 }
            );
        }

        // Wczytanie tokena z .env
        const tokenKey = `TOKEN_LAMP_${host.replace(/\./g, "_")}`;
        const token = process.env[tokenKey];
        if (!token) {
            return new Response(
                JSON.stringify({ error: "Nieznany host lub brak przypisanego tokena." }),
                { status: 400 }
            );
        }

        // console.log(`Pobieranie statusu lampy ${host}...`);

        // Komenda `miiocli` do pobierania statusu
        const command = `miiocli yeelight --ip ${host} --token ${token} status`;

        // Wykonanie komendy w terminalu
        const result = await new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error("Błąd podczas pobierania statusu lampy:", stderr);
                    reject(stderr.trim());
                } else {
                    resolve(stdout.trim());
                }
            });
        });

        // Parsowanie wyniku
        const statusLines = result.split("\n");
        const powerLine = statusLines.find((line) => line.includes("Power:"));
        const brightnessLine = statusLines.find((line) => line.includes("Brightness:"));

        const isOn = powerLine?.includes("True") || false;
        const brightness = brightnessLine
            ? parseInt(brightnessLine.split(":")[1].trim(), 10)
            : null;

        // Zwrócenie statusu
        return new Response(
            JSON.stringify({
                status: true,
                isOn,
                brightness,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Błąd API Yeelight (pobieranie statusu):", error);
        return new Response(JSON.stringify({ status: false, error: error.message }), {
            status: 500,
        });
    }
}
