const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const targetStr = `        <div id="surih-container" style={{"display": "flex", "flexDirection": "column", "alignItems": "center", "gap": "15px", "width": "100%", "maxWidth": "650px", "margin": "0 auto", "padding": "25px", "backgroundColor": "#168f81", "backgroundImage": "radial-gradient(circle, rgba(255,255,255,0.15) 2px, transparent 2px)", "backgroundSize": "20px 20px", "borderRadius": "24px", "border": "4px solid var(--color-dark)", "boxShadow": "var(--shadow-hard)"}}>
            {/* Navigasi Huruf */}
            <div id="surih-nav-bar" style={{"display": "flex", "gap": "5px", "overflowX": "auto", "width": "100%", "padding": "10px", "background": "#ffffff", "borderRadius": "12px", "border": "2px solid var(--color-dark)", "fontFamily": "var(--font-main)"}}>
                {/* Dijana oleh JS */}
            </div>
            
            <div style={{"display": "flex", "gap": "10px", "alignItems": "center", "justifyContent": "center", "width": "100%"}}>
                <button id="surih-prev-btn" className="neo-btn bg-blue" onClick={(e) => { window.surihTukarHuruf && window.surihTukarHuruf(-1) }}><i className="fa-solid fa-arrow-left"></i></button>
                <select id="surih-jenis-huruf" className="neo-input" style={{"margin": "0", "minWidth": "150px", }} onChange={(e) => { window.surihSetJenis && window.surihSetJenis(e.target.value) }}>
                    <option value="both">Besar & Kecil</option>
                    <option value="uppercase">Huruf Besar Sahaja</option>
                    <option value="lowercase">Huruf Kecil Sahaja</option>
                </select>
                <button id="surih-next-btn" className="neo-btn bg-blue" onClick={(e) => { window.surihTukarHuruf && window.surihTukarHuruf(1) }}><i className="fa-solid fa-arrow-right"></i></button>
            </div>
            
            {/* Canvas Area */}
            <div style={{"position": "relative", "width": "100%", "display": "flex", "justifyContent": "center", "maxWidth": "600px"}}>
                <canvas id="surih-canvas" width="600" height="400" style={{"background": "#ffffff", "borderRadius": "16px", "border": "4px solid #8b5a2b", "boxShadow": "inset 4px 4px 0px rgba(0,0,0,0.1)", "cursor": "crosshair", "width": "100%", "aspectRatio": "3/2", "touchAction": "none"}}></canvas>
                <div id="surih-confetti" style={{"position": "absolute", "top": 0, "left": 0, "width": "100%", "height": "100%", "pointerEvents": "none", "zIndex": 10}}></div>
            </div>
            
            {/* Status & Controls */}
            <div style={{"display": "flex", "justifyContent": "space-between", "alignItems": "center", "width": "100%", "maxWidth": "600px"}}>
                <div id="surih-score" className="score-pill" style={{"fontSize": "1.2rem", "display": "inline-flex", "alignItems": "center", "gap": "8px", "background": "var(--color-yellow)", "border": "3px solid var(--color-dark)", "borderRadius": "var(--radius-full)", "padding": "8px 14px", "fontWeight": "900"}}><i className="fa-solid fa-star" style={{"color": "#fbbf24"}}></i> <span id="surih-stars">0</span></div>
                <div style={{"display": "flex", "gap": "10px"}}>
                    <button className="neo-btn bg-orange" onClick={(e) => { window.surihTunjukCara && window.surihTunjukCara() }}><i className="fa-solid fa-play"></i> Tunjuk Cara</button>
                    <button className="neo-btn bg-green" onClick={(e) => { window.surihReset && window.surihReset() }}><i className="fa-solid fa-rotate-right"></i> Cuba Lagi</button>
                </div>
            </div>
        </div>`;

const newStr = `        <div id="surih-container" style={{"display": "flex", "flexDirection": "column", "alignItems": "center", "gap": "12px", "width": "100%", "maxWidth": "650px", "margin": "0 auto", "padding": "clamp(12px, 4vw, 25px)", "backgroundColor": "#168f81", "backgroundImage": "radial-gradient(circle, rgba(255,255,255,0.15) 2px, transparent 2px)", "backgroundSize": "20px 20px", "borderRadius": "24px", "border": "4px solid var(--color-dark)", "boxShadow": "var(--shadow-hard)"}}>
            {/* Navigasi Huruf */}
            <div id="surih-nav-bar" style={{"display": "flex", "gap": "5px", "overflowX": "auto", "width": "100%", "padding": "10px", "background": "#ffffff", "borderRadius": "12px", "border": "2px solid var(--color-dark)", "fontFamily": "var(--font-main)"}}>
                {/* Dijana oleh JS */}
            </div>
            
            <div style={{"display": "flex", "gap": "8px", "alignItems": "center", "justifyContent": "center", "width": "100%"}}>
                <button id="surih-prev-btn" className="neo-btn bg-blue" style={{"padding": "8px 16px", "minWidth": "auto"}} onClick={(e) => { window.surihTukarHuruf && window.surihTukarHuruf(-1) }}><i className="fa-solid fa-arrow-left"></i></button>
                <select id="surih-jenis-huruf" className="neo-input" style={{"margin": "0", "flex": "1", "maxWidth": "250px", "padding": "8px 12px", "fontSize": "0.95rem"}} onChange={(e) => { window.surihSetJenis && window.surihSetJenis(e.target.value) }}>
                    <option value="both">Besar & Kecil</option>
                    <option value="uppercase">Besar Sahaja</option>
                    <option value="lowercase">Kecil Sahaja</option>
                </select>
                <button id="surih-next-btn" className="neo-btn bg-blue" style={{"padding": "8px 16px", "minWidth": "auto"}} onClick={(e) => { window.surihTukarHuruf && window.surihTukarHuruf(1) }}><i className="fa-solid fa-arrow-right"></i></button>
            </div>
            
            {/* Canvas Area */}
            <div style={{"position": "relative", "width": "100%", "display": "flex", "justifyContent": "center", "maxWidth": "600px"}}>
                <canvas id="surih-canvas" width="600" height="400" style={{"background": "#ffffff", "borderRadius": "16px", "border": "4px solid #8b5a2b", "boxShadow": "inset 4px 4px 0px rgba(0,0,0,0.1)", "cursor": "crosshair", "width": "100%", "height": "auto", "aspectRatio": "3/2", "touchAction": "none"}}></canvas>
                <div id="surih-confetti" style={{"position": "absolute", "top": 0, "left": 0, "width": "100%", "height": "100%", "pointerEvents": "none", "zIndex": 10}}></div>
            </div>
            
            {/* Status & Controls */}
            <div style={{"display": "flex", "justifyContent": "center", "alignItems": "center", "width": "100%", "maxWidth": "600px", "gap": "10px", "flexWrap": "wrap"}}>
                <button className="neo-btn bg-orange" style={{"flex": "1", "minWidth": "140px"}} onClick={(e) => { window.surihTunjukCara && window.surihTunjukCara() }}><i className="fa-solid fa-play"></i> Tunjuk Cara</button>
                <button className="neo-btn bg-green" style={{"flex": "1", "minWidth": "140px"}} onClick={(e) => { window.surihReset && window.surihReset() }}><i className="fa-solid fa-rotate-right"></i> Cuba Lagi</button>
                <div id="surih-score" style={{"display": "none"}}><span id="surih-stars"></span></div>
            </div>
        </div>`;

code = code.replace(targetStr, newStr);

fs.writeFileSync('src/App.tsx', code);
