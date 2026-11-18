const https = require('https');

https.get('https://cdpn.io/zadvorsky/fullpage/xxwbBQV', (res) => {
  let data = '';
  res.on('data', (c) => data += c);
  res.on('end', () => {
    const regex = /https?:\/\/[^\s"'<>]+\.(?:png|jpg|jpeg|svg)/gi;
    console.log('FOUND:', data.match(regex));
    // also search for all-peeps
    const idx = data.indexOf('all-peeps');
    if (idx !== -1) {
      console.log('ALL-PEEPS SURROUNDING:', data.substring(idx - 60, idx + 60));
    }
    const cfgIdx = data.indexOf('config');
    if (cfgIdx !== -1) {
      console.log('CONFIG SURROUNDING:', data.substring(cfgIdx, cfgIdx + 120));
    }
  });
}).on('error', console.error);
