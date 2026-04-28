import https from 'https';
import fs from 'fs';

https.get('https://earthobservatory.nasa.gov/features/ABC', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('nasa.html', data);
    console.log('done');
  })
});
