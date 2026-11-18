const https = require('https');
const fs = require('fs');

fs.mkdirSync('public/images/peeps', { recursive: true });
const file = fs.createWriteStream('public/images/peeps/all-peeps.png');

https.get('https://s3-us-west-2.amazonaws.com/s.cdpn.io/175711/open-peeps-sheet.png', (res) => {
  if (res.statusCode === 200) {
    res.pipe(file);
    file.on('finish', () => console.log('OPEN-PEEPS-SHEET SUCCESSFULLY DOWNLOADED'));
  } else {
    console.error('FAILED STATUS:', res.statusCode);
  }
}).on('error', console.error);
