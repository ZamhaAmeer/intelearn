const fs = require('fs');
const path = require('path');
const imgPath = path.join(__dirname, 'starry_small.jpg');
const targetPath = path.join(__dirname, 'bubbleHtml.js');

const img = fs.readFileSync(imgPath);
const base64 = img.toString('base64');
let html = fs.readFileSync(targetPath, 'utf8');

const replacement = `background-image: url('data:image/jpeg;base64,${base64}');
      background-size: cover;
      background-position: center;`;

html = html.replace('background-color: #1e1e2f;', replacement);

fs.writeFileSync(targetPath, html);
console.log('Injected starry night bg!');
