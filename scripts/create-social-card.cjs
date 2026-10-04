const fs = require('node:fs');
const sharp = require('sharp');
const html = fs.readFileSync('public/index.html','utf8');
const art=html.match(/<div class="hero-art">(<svg[\s\S]*?<\/svg>)/)[1];
const inner=art.replace(/^<svg[^>]+>/,'').replace(/<\/svg>$/,'');
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#f5f3eb"/>
<g transform="translate(64 61)" fill="none" stroke="#286251" stroke-width="2"><path d="M0 24h30M4 20a11 11 0 0 1 22 0M15 0v5M2 5l5 5M28 5l-5 5"/></g>
<text x="108" y="84" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#273b31">Daylight Decision</text>
<path d="M64 114H1136" stroke="#dce1d6"/>
<g font-family="Georgia, serif" font-size="66" letter-spacing="-2">
<text x="64" y="235" fill="#273b31">Daylight Savings</text>
<text x="64" y="316" fill="#286251" font-style="italic">or Standard Time</text>
</g>
<g font-family="Arial, sans-serif" font-size="23" fill="#667169">
<text x="67" y="382">Brighter mornings or longer evenings?</text>
<text x="67" y="425" font-size="20">See whether permanent daylight saving time</text>
<text x="67" y="456" font-size="20">or permanent standard time fits your life better.</text>
</g>
<g transform="translate(691 185) scale(1.04)">${inner}</g>
<path d="M64 527H1136" stroke="#dce1d6"/>
<text x="66" y="570" font-family="Arial, sans-serif" font-size="18" fill="#286251">DaylightDecision.com</text>
</svg>`;
fs.writeFileSync('public/social-card.svg',svg);
sharp(Buffer.from(svg)).png().toFile('public/social-card.png').then(info=>console.log(JSON.stringify(info)));
