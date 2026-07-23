const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('import { TandukKataGame }')) {
    code = code.replace(/import React, { useEffect } from 'react';/, "import React, { useEffect, useState } from 'react';\nimport { TandukKataGame } from './components/TandukKataGame';");
}

if (!code.includes('<div id="view-tanduk-kata"')) {
    const tandukKataScreen = `
    <div id="view-tanduk-kata" className="screen" style={{ padding: 0, height: "100vh", width: "100vw", overflow: "hidden" }}>
        <TandukKataGame onClose={() => { 
            const event = new CustomEvent('tukar-skrin', { detail: { skrin: 'map-screen' } });
            window.dispatchEvent(event);
            if (window.paparSkrin) window.paparSkrin('map-screen');
         }} />
    </div>
    `;
    code = code.replace(/<div id="view-ar-abc"/, tandukKataScreen + '\n    <div id="view-ar-abc"');
}

fs.writeFileSync('src/App.tsx', code);
