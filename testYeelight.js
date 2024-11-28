const { Yeelight } = require('yeelight2');

const testConnection = async () => {
    try {
        const lamp = new Yeelight({ host: '192.168.0.185' }); // Brak portu
        await lamp.connect();
        console.log('Połączono z lampą!');

        const status = await lamp.get_prop(['power']);
        console.log('Status lampy:', status);

        await lamp.set_power('on');
        console.log('Lampa włączona!');
    } catch (error) {
        console.error('Błąd połączenia z lampą:', error);
    }
};

testConnection();
