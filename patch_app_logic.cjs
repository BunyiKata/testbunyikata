const fs = require('fs');
let content = fs.readFileSync('public/app-logic.js', 'utf8');

content = content.replace(
  "const event = new CustomEvent('start-cabaran-suku-kata', { detail: { id: id, title: title } });",
  "const displayTitle = (modSemasa === 'belajar') ? title.replace(/^Cabaran\\s+/i, '') : title;\n                    const event = new CustomEvent('start-cabaran-suku-kata', { detail: { id: id, title: displayTitle } });"
);

fs.writeFileSync('public/app-logic.js', content);
