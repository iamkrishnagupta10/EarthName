import fs from 'fs';

async function run() {
  const res = await fetch('https://earthobservatory.nasa.gov/features/ABC');
  const data = await res.text();
  console.log('Size:', data.length);
  const regex = /<img[^>]+src="([^">]+)"/gi;
  let match;
  while(match = regex.exec(data)) {
      if (match[1].includes('jpg') || match[1].includes('png')) {
         console.log(match[1]);
      }
  }
}
run();
