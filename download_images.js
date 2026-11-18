const https = require('https');
const fs = require('fs');
const path = require('path');

const images = {
  'portrait-maya.jpg': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85',
  'portrait-arjun.jpg': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85',
  'portrait-priya.jpg': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=85',
  'portrait-rohan.jpg': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=85',
  'portrait-ananya.jpg': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=85',
  'portrait-vikram.jpg': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=85',
  'hero-cafe.jpg': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=85',
  'experience-coffee.jpg': 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=85',
  'experience-walk.jpg': 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=85',
  'experience-gallery.jpg': 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&w=800&q=85',
  'journal-feature.jpg': 'https://images.unsplash.com/photo-1445116572660-238439889988?auto=format&fit=crop&w=800&q=85',
  'kolkata-city.jpg': 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=85'
};

const dir = path.join(__dirname, 'public', 'images');

function download(filename, url) {
  return new Promise((resolve, reject) => {
    const dest = path.join(dir, filename);
    const file = fs.createWriteStream(dest);
    
    https.get(url, (response) => {
      // Handle redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        https.get(response.headers.location, (res) => {
          res.pipe(file);
          file.on('finish', () => { file.close(); resolve(filename); });
        }).on('error', reject);
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(filename); });
    }).on('error', reject);
  });
}

async function run() {
  for (const [name, url] of Object.entries(images)) {
    try {
      await download(name, url);
      console.log('Downloaded:', name);
    } catch (err) {
      console.error('Error downloading:', name, err.message);
    }
  }
  console.log('ALL COMPLETE');
}

run();
