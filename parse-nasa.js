import fs from 'fs';
const data = fs.readFileSync('nasa.html', 'utf8');
const regex = /<img[^>]+src="([^">]+)"/gi;
let match;
while(match = regex.exec(data)) {
    if (match[1].includes('jpg') || match[1].includes('png')) {
       console.log(match[1]);
    }
}
