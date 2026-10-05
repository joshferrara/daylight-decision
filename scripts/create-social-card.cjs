// Regenerates the social sharing image from the hero illustration.
// The card uses the site's web fonts, so it is rendered with headless Chrome (set CHROME to override the binary), then sized with sharp.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const sharp = require('sharp');
const html = fs.readFileSync('public/index.html','utf8');
const art=html.match(/<div class="hero-art">(<svg[\s\S]*?<\/svg>)/)[1];
const inner=art.replace(/^<svg[^>]+>/,'').replace(/<\/svg>$/,'').replace(/font-family="system-ui"/g,'font-family="IBM Plex Mono, monospace"');
const fonts=html.match(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]+>/)[0];
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#f3eee0"/>
<g transform="translate(446 38)" fill="none" stroke="#1e2924" stroke-width="1.6"><path d="M0 24h30M4 20a11 11 0 0 1 22 0M15 0v5M2 5l5 5M28 5l-5 5"/></g>
<text x="490" y="62" font-family="Fraunces, Georgia, serif" font-size="27" font-style="italic" font-weight="500" letter-spacing="-.4" fill="#1e2924">The Daylight Decision</text>
<path d="M64 92H1136M64 97H1136" stroke="#1e2924"/>
<g font-family="Fraunces, Georgia, serif" font-size="80" font-weight="300" letter-spacing="-3.6">
<text x="62" y="262" fill="#1e2924">Daylight Savings</text>
<text x="62" y="340" fill="#23594a" font-style="italic">or Standard Time</text>
</g>
<g font-family="Source Serif 4, Georgia, serif" font-size="23" fill="#1e2924">
<text x="66" y="404">Brighter mornings or longer evenings? See which</text>
<text x="66" y="438">permanent clock fits your life better.</text>
</g>
<g transform="translate(672 148) scale(1.06)">${inner}</g>
<path d="M64 532H1136M64 537H1136" stroke="#1e2924"/>
<g font-family="IBM Plex Mono, monospace" font-size="15" font-weight="500" letter-spacing="2.4">
<text x="64" y="580" fill="#1e2924">DAYLIGHTDECISION.COM</text>
<text x="1136" y="580" fill="#a65f1f" text-anchor="end">WHERE SHOULD THE HOUR GO?</text>
</g>
</svg>`;
fs.writeFileSync('public/social-card.svg',svg);
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'social-card-')),page=path.join(dir,'card.html'),shot=path.join(dir,'card.png');
fs.writeFileSync(page,`<!doctype html><meta charset="utf-8">${fonts}<style>html,body{margin:0;overflow:hidden}svg{display:block}</style>${svg}`);
const chrome=process.env.CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
execFileSync(chrome,['--headless=new','--hide-scrollbars','--force-device-scale-factor=2','--window-size=1200,630','--virtual-time-budget=8000','--screenshot='+shot,'file://'+page],{stdio:'ignore'});
sharp(shot).resize(1200,630).png().toFile('public/social-card.png').then(info=>{fs.rmSync(dir,{recursive:true});console.log(JSON.stringify(info));});
