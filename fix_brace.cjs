const fs = require('fs');
let code = fs.readFileSync('src/components/TandukKataGame.tsx', 'utf-8');
const lastClosingDivIndex = code.lastIndexOf('</div>');
code = code.substring(0, lastClosingDivIndex) + code.substring(lastClosingDivIndex + 6);
fs.writeFileSync('src/components/TandukKataGame.tsx', code);
