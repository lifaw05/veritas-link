
const https = require('https');

const url = 'https://gamma-api.polymarket.com/events?closed=false&limit=1';

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const events = JSON.parse(data);
            if (events.length > 0 && events[0].markets.length > 0) {
                console.log(JSON.stringify(events[0].markets[0], null, 2));
            } else {
                console.log('No markets found');
            }
        } catch (e) {
            console.error(e.message);
        }
    });
}).on('error', (err) => {
    console.error('Error: ' + err.message);
});
