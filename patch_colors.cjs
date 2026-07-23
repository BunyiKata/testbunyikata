const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(
  '<button id="map-back-btn" className="neo-btn bg-orange back-icon-btn"',
  '<button id="map-back-btn" className="neo-btn back-icon-btn"'
);
content = content.replace(
  '<div id="map-title-bar" className="neo-btn bg-orange page-title"',
  '<div id="map-title-bar" className="neo-btn page-title"'
);
fs.writeFileSync('src/App.tsx', content);
