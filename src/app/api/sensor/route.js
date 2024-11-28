export async function GET() {
    const sensorApiUrl = 'http://192.168.0.180:5000/data'; // Adres serwera Flask

    try {
        const response = await fetch(sensorApiUrl);

        if (!response.ok) {
            throw new Error(`Błąd serwera Flask: ${response.statusText}`);
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error('Błąd podczas komunikacji z serwerem Flask:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500 }
        );
    }
}
