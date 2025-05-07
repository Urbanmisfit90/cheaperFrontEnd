const fs = require('fs');
const path = require('path');

// Fix paths in index.html
const indexPath = path.join(__dirname, '../build/index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

indexHtml = indexHtml.replace(/\/static\//g, './static/');
indexHtml = indexHtml.replace(/\/favicon\.ico/g, './favicon.ico');
indexHtml = indexHtml.replace(/\/logo\d+\.png/g, (match) => `./${match.substring(1)}`);

fs.writeFileSync(indexPath, indexHtml, 'utf8');

// Update manifest.json paths
const manifestPath = path.join(__dirname, '../build/manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

manifest.action.default_popup = './index.html';

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

// eslint-disable-next-line no-console
console.log('Post-build modifications completed successfully');