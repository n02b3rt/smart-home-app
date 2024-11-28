export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city') || 'Rzeszów'; // Domyślne miasto to Rzeszów
    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

    if (!apiKey) {
        return new Response(
            JSON.stringify({ error: 'Brak klucza API' }),
            { status: 500 }
        );
    }

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pl`;

    try {
        const response = await fetch(weatherUrl);
        const data = await response.json();

        if (response.ok) {
            return new Response(JSON.stringify(data), { status: 200 });
        } else {
            return new Response(
                JSON.stringify({ error: data.message }),
                { status: response.status }
            );
        }
    } catch (error) {
        console.error('Błąd podczas komunikacji z OpenWeatherMap:', error);
        return new Response(
            JSON.stringify({ error: 'Błąd podczas pobierania danych pogodowych' }),
            { status: 500 }
        );
    }
}
