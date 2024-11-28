import { Yeelight } from 'yeelight-awesome';

export async function POST(req) {
    try {
        const { action, host } = await req.json();

        if (!host || !action) {
            return new Response(
                JSON.stringify({ error: 'Nie podano hosta lub akcji.' }),
                { status: 400 }
            );
        }

        console.log(`Wykonywanie akcji "${action}" na lampie ${host}...`);

        const lamp = new Yeelight({ lightIp: host, lightPort: 55443 });
        await lamp.connect();

        if (action === 'turn_on') {
            await lamp.setPower(true);
        } else if (action === 'turn_off') {
            await lamp.setPower(false);
        } else {
            return new Response(
                JSON.stringify({ error: 'Nieznana akcja.' }),
                { status: 400 }
            );
        }

        lamp.disconnect();

        return new Response(
            JSON.stringify({ status: `Lampa ${action} na ${host}` }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Błąd API Yeelight:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
