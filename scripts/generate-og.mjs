import sharp from 'sharp';
import fs from 'fs';

const width=1200, height=630;
const bg='#F4FBF7';
const green='#10B981';
const dark='#08090c';

const svg = `
<svg width='${width}' height='${height}' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' fill='${bg}'/>
  <rect x='0' y='0' width='100%' height='8' fill='${green}'/>
  <rect x='0' y='622' width='100%' height='8' fill='${green}'/>
  <g opacity='0.04'>
    <line x1='60' y1='0' x2='60' y2='630' stroke='${dark}' stroke-width='1'/>
    <line x1='180' y1='0' x2='180' y2='630' stroke='${dark}' stroke-width='1'/>
    <line x1='300' y1='0' x2='300' y2='630' stroke='${dark}' stroke-width='1'/>
    <line x1='0' y1='90' x2='1200' y2='90' stroke='${dark}' stroke-width='1'/>
    <line x1='0' y1='210' x2='1200' y2='210' stroke='${dark}' stroke-width='1'/>
  </g>
  <text x='60' y='110' font-family='Space Grotesk, sans-serif' font-size='22' font-weight='700' fill='${green}' letter-spacing='4'>JUNGLANS  SOLUTIONS</text>
  <text x='60' y='145' font-family='JetBrains Mono, monospace' font-size='12' fill='#059669' letter-spacing='3'>ENTERPRISE  SOFTWARE  ECOSYSTEMS</text>
  <text x='60' y='265' font-family='Space Grotesk, sans-serif' font-size='56' font-weight='800' fill='${dark}' letter-spacing='-2'>Architecting the</text>
  <text x='60' y='332' font-family='Space Grotesk, sans-serif' font-size='56' font-weight='800' fill='${green}' letter-spacing='-2'>future of software.</text>
  <text x='60' y='385' font-family='Inter, sans-serif' font-size='18' fill='#475569'>20 products  •  100% local-first  •  Zero cloud telemetry</text>
  <rect x='60' y='420' width='220' height='44' rx='12' fill='${green}'/>
  <text x='170' y='448' font-family='JetBrains Mono, monospace' font-size='13' font-weight='700' fill='white' text-anchor='middle'>junglans.in</text>
  <text x='60' y='520' font-family='JetBrains Mono, monospace' font-size='11' fill='#94A3B8' letter-spacing='2'>TRUSTED  BY  GLOBAL  ENGINEERING  ORGANIZATIONS</text>
  <g opacity='0.12'>
    <circle cx='1000' cy='180' r='220' fill='${green}'/>
    <circle cx='1080' cy='500' r='180' fill='#34D399'/>
  </g>
</svg>
`;

const svgBuffer = Buffer.from(svg);

async function build() {
  const base = await sharp(svgBuffer).png().toBuffer();
  let logoPath = 'public/squirrel_logo-128.png';
  if (!fs.existsSync(logoPath)) logoPath='public/squirrel_logo.png';
  let final = sharp(base);
  if (fs.existsSync(logoPath)) {
     const logo = await sharp(logoPath).resize(180,180, {fit:'contain', background:{r:0,g:0,b:0,alpha:0}}).png().toBuffer();
     final = final.composite([{input: logo, top: 380, left: 930}]);
  }
  await final.png().toFile('public/og-image.png');
  console.log('og-image.png created', fs.statSync('public/og-image.png').size);
  const meta = await sharp('public/og-image.png').metadata();
  console.log(meta.width, meta.height);
}
build().catch(e=>{console.error(e); process.exit(1)});
