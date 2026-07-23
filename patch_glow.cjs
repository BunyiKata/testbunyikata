const fs = require('fs');
let css = fs.readFileSync('public/styles.css', 'utf8');

const target = `.island-node { animation: soft-float 3.5s ease-in-out infinite;  
            position: relative; display: flex; flex-direction: column; align-items: center; 
            cursor: pointer; background: white; border: 2px solid var(--color-dark);
            border-radius: 12px; box-shadow: 2px 3px 0px rgba(0,0,0,0.8);
            padding: 12px 10px 10px; border-width: 3px; transition: all 0.2s; margin-top: 10px;
        }
        .island-node.locked { cursor: not-allowed; }
        .island-node:not(.locked):hover { 
            transform: translateY(-5px); 
             animation: glow-outline 1s infinite alternate;
        }
        @keyframes glow-outline {
            0% { box-shadow: 0 0 5px var(--color-green), 4px 6px 0px rgba(0,0,0,0.8); border-color: var(--color-dark); }
            100% { box-shadow: 0 0 20px var(--color-green), 4px 6px 0px rgba(0,0,0,0.8); border-color: var(--color-green); }
        }`;

const replacement = `.island-node { animation: soft-float 3.5s ease-in-out infinite, white-glow 2s infinite alternate;  
            position: relative; display: flex; flex-direction: column; align-items: center; 
            cursor: pointer; background: white; border: 2px solid var(--color-dark);
            border-radius: 12px; box-shadow: 2px 3px 0px rgba(0,0,0,0.8);
            padding: 12px 10px 10px; border-width: 3px; transition: transform 0.2s; margin-top: 10px;
        }
        .island-node.locked { cursor: not-allowed; animation: none; box-shadow: 2px 3px 0px rgba(0,0,0,0.8); }
        .island-node:not(.locked):hover { 
            animation: white-glow 2s infinite alternate; 
            transform: translateY(-5px) scale(1.02);
        }
        @keyframes white-glow {
            0% { box-shadow: 0 0 8px rgba(255, 255, 255, 0.6), 2px 3px 0px rgba(0,0,0,0.8); }
            100% { box-shadow: 0 0 25px rgba(255, 255, 255, 1), 2px 3px 0px rgba(0,0,0,0.8); }
        }`;

if(css.includes(target)) {
    css = css.replace(target, replacement);
    fs.writeFileSync('public/styles.css', css);
    console.log("Patched successfully!");
} else {
    console.log("Target not found!");
}
