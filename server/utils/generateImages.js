// server/utils/generateImages.js - Generates high quality product images, retailer logos & carrier icons
const fs = require('node:fs');
const path = require('node:path');

const PRODUCTS_DIR = path.join(__dirname, '..', '..', 'public', 'images', 'products');
const RETAILERS_DIR = path.join(__dirname, '..', '..', 'public', 'images', 'retailers');
const CARRIERS_DIR = path.join(__dirname, '..', '..', 'public', 'images', 'carriers');

[PRODUCTS_DIR, RETAILERS_DIR, CARRIERS_DIR].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// Product Images Generator
const productImages = {
  'airpods_max.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <defs>
      <radialGradient id="apBg" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#1E293B"/>
        <stop offset="100%" stop-color="#0F172A"/>
      </radialGradient>
      <linearGradient id="metalSilver" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#94A3B8"/>
        <stop offset="50%" stop-color="#475569"/>
        <stop offset="100%" stop-color="#1E293B"/>
      </linearGradient>
      <linearGradient id="cushionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#334155"/>
        <stop offset="100%" stop-color="#1E293B"/>
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.6"/>
      </filter>
    </defs>
    <rect width="400" height="400" rx="24" fill="url(#apBg)"/>
    <!-- Headband Canopy Arch -->
    <path d="M 120 220 C 120 90, 280 90, 280 220" fill="none" stroke="#64748B" stroke-width="20" stroke-linecap="round" filter="url(#glow)"/>
    <path d="M 130 210 C 130 110, 270 110, 270 210" fill="none" stroke="#94A3B8" stroke-width="6" stroke-linecap="round" stroke-dasharray="3 3"/>
    <!-- Telescoping Arms -->
    <rect x="110" y="210" width="14" height="45" rx="5" fill="url(#metalSilver)"/>
    <rect x="276" y="210" width="14" height="45" rx="5" fill="url(#metalSilver)"/>
    <!-- Left Ear Cup -->
    <g transform="translate(75, 230)" filter="url(#glow)">
      <ellipse cx="40" cy="55" rx="38" ry="52" fill="url(#metalSilver)"/>
      <ellipse cx="40" cy="55" rx="30" ry="44" fill="url(#cushionGrad)" stroke="#475569" stroke-width="2"/>
      <ellipse cx="40" cy="55" rx="20" ry="32" fill="#0F172A" opacity="0.8"/>
      <!-- Digital Crown dial -->
      <rect x="18" y="8" width="12" height="6" rx="2" fill="#CBD5E1"/>
    </g>
    <!-- Right Ear Cup -->
    <g transform="translate(245, 230)" filter="url(#glow)">
      <ellipse cx="40" cy="55" rx="38" ry="52" fill="url(#metalSilver)"/>
      <ellipse cx="40" cy="55" rx="30" ry="44" fill="url(#cushionGrad)" stroke="#475569" stroke-width="2"/>
      <ellipse cx="40" cy="55" rx="20" ry="32" fill="#0F172A" opacity="0.8"/>
    </g>
    <!-- Highlight Reflection -->
    <ellipse cx="115" cy="275" rx="12" ry="25" fill="#FFFFFF" opacity="0.15" transform="rotate(-15, 115, 275)"/>
    <ellipse cx="285" cy="275" rx="12" ry="25" fill="#FFFFFF" opacity="0.15" transform="rotate(15, 285, 275)"/>
    <!-- Product Label Pill -->
    <rect x="24" y="24" width="130" height="26" rx="13" fill="#0F172A" stroke="#334155" stroke-width="1"/>
    <text x="89" y="41" font-family="-apple-system, sans-serif" font-size="11" font-weight="700" fill="#E2E8F0" text-anchor="middle">Apple AirPods Max</text>
  </svg>`,

  'sony_camera.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <defs>
      <radialGradient id="camBg" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#1E293B"/>
        <stop offset="100%" stop-color="#090D16"/>
      </radialGradient>
      <linearGradient id="lensGlass" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0284C7"/>
        <stop offset="50%" stop-color="#0F172A"/>
        <stop offset="100%" stop-color="#4F46E5"/>
      </linearGradient>
      <filter id="camDrop">
        <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000" flood-opacity="0.7"/>
      </filter>
    </defs>
    <rect width="400" height="400" rx="24" fill="url(#camBg)"/>
    <!-- Camera Body -->
    <g transform="translate(60, 110)" filter="url(#camDrop)">
      <!-- Main body block -->
      <path d="M 20 60 L 90 60 L 105 35 L 175 35 L 190 60 L 260 60 C 270 60, 275 68, 275 78 L 275 190 C 275 200, 268 208, 256 208 L 24 208 C 12 208, 5 200, 5 190 L 5 78 C 5 68, 10 60, 20 60 Z" fill="#18181B" stroke="#27272A" stroke-width="2"/>
      <!-- Right handgrip bump -->
      <path d="M 5 78 C 5 68, -8 75, -8 95 L -8 185 C -8 205, 5 208, 24 208 Z" fill="#09090B"/>
      <!-- Viewfinder prism peak -->
      <polygon points="110,35 170,35 158,12 122,12" fill="#27272A"/>
      <!-- Sony branding & Alpha red emblem -->
      <text x="140" y="27" font-family="-apple-system, sans-serif" font-size="9" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">SONY</text>
      <path d="M 45 80 L 52 95 L 48 95 L 40 80 Z" fill="#EF4444"/>
      <!-- Dials on top plate -->
      <rect x="210" y="48" width="28" height="12" rx="3" fill="#3F3F46"/>
      <rect x="245" y="52" width="20" height="8" rx="2" fill="#52525B"/>
      <circle cx="25" cy="52" r="7" fill="#EF4444" stroke="#7F1D1D" stroke-width="1.5"/>
      <!-- Massive Lens Mount & Front Element -->
      <circle cx="140" cy="135" r="70" fill="#27272A" stroke="#52525B" stroke-width="4"/>
      <circle cx="140" cy="135" r="58" fill="#18181B" stroke="#E11D48" stroke-width="1.5"/>
      <circle cx="140" cy="135" r="48" fill="url(#lensGlass)"/>
      <ellipse cx="125" cy="120" rx="22" ry="14" fill="#FFFFFF" opacity="0.25" transform="rotate(-30, 125, 120)"/>
      <ellipse cx="155" cy="150" rx="12" ry="8" fill="#38BDF8" opacity="0.35"/>
      <!-- Sensor Gold Pins indicator -->
      <circle cx="140" cy="135" r="10" fill="#F59E0B" opacity="0.4"/>
    </g>
    <!-- Badge -->
    <rect x="24" y="24" width="135" height="26" rx="13" fill="#0F172A" stroke="#334155" stroke-width="1"/>
    <text x="91" y="41" font-family="-apple-system, sans-serif" font-size="11" font-weight="700" fill="#E2E8F0" text-anchor="middle">Sony Alpha a7 IV</text>
  </svg>`,

  'zara_blazer.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <defs>
      <radialGradient id="bzBg" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#1E293B"/>
        <stop offset="100%" stop-color="#0F172A"/>
      </radialGradient>
      <linearGradient id="fabricNavy" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1E293B"/>
        <stop offset="50%" stop-color="#0F172A"/>
        <stop offset="100%" stop-color="#020617"/>
      </linearGradient>
      <filter id="bzDrop">
        <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#000" flood-opacity="0.6"/>
      </filter>
    </defs>
    <rect width="400" height="400" rx="24" fill="url(#bzBg)"/>
    <!-- Hanger Hook -->
    <path d="M 200 90 C 200 70, 215 65, 215 55 C 215 45, 205 40, 195 45 C 185 50, 185 60, 185 60" fill="none" stroke="#D97706" stroke-width="4" stroke-linecap="round"/>
    <path d="M 140 100 L 200 85 L 260 100" fill="none" stroke="#78350F" stroke-width="8" stroke-linecap="round"/>
    <!-- Tailored Blazer Jacket -->
    <g transform="translate(80, 95)" filter="url(#bzDrop)">
      <!-- Shoulders & Torso -->
      <path d="M 30 20 L 120 5 L 210 20 L 235 150 L 215 250 L 25 250 L 5 150 Z" fill="url(#fabricNavy)" stroke="#334155" stroke-width="1"/>
      <!-- Inner crisp white shirt & tie -->
      <polygon points="90,10 150,10 120,95" fill="#F8FAFC"/>
      <polygon points="115,35 125,35 128,110 120,125 112,110" fill="#991B1B"/>
      <!-- Left Lapel -->
      <path d="M 75 12 L 120 135 L 75 80 Z" fill="#334155" stroke="#1E293B" stroke-width="1.5"/>
      <!-- Right Lapel (overlapping) -->
      <path d="M 165 12 L 120 145 L 165 80 Z" fill="#1E293B" stroke="#0F172A" stroke-width="1.5"/>
      <!-- Chest Pocket with Silk Square -->
      <rect x="55" y="95" width="32" height="4" fill="#334155"/>
      <polygon points="65,95 72,82 78,95" fill="#FFFFFF"/>
      <!-- Buttons -->
      <circle cx="120" cy="165" r="5" fill="#0F172A" stroke="#475569" stroke-width="1.5"/>
      <circle cx="120" cy="195" r="5" fill="#0F172A" stroke="#475569" stroke-width="1.5"/>
      <!-- Side Flap Pockets -->
      <rect x="35" y="195" width="45" height="8" rx="2" fill="#1E293B" stroke="#334155" stroke-width="1"/>
      <rect x="160" y="195" width="45" height="8" rx="2" fill="#1E293B" stroke="#334155" stroke-width="1"/>
    </g>
    <!-- Badge -->
    <rect x="24" y="24" width="135" height="26" rx="13" fill="#0F172A" stroke="#334155" stroke-width="1"/>
    <text x="91" y="41" font-family="-apple-system, sans-serif" font-size="11" font-weight="700" fill="#E2E8F0" text-anchor="middle">Zara Wool Blazer</text>
  </svg>`,

  'nike_pegasus.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <defs>
      <radialGradient id="nkBg" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#1E293B"/>
        <stop offset="100%" stop-color="#020617"/>
      </radialGradient>
      <linearGradient id="soleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="70%" stop-color="#F1F5F9"/>
        <stop offset="100%" stop-color="#06B6D4"/>
      </linearGradient>
      <filter id="shoeDrop">
        <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#000" flood-opacity="0.65"/>
      </filter>
    </defs>
    <rect width="400" height="400" rx="24" fill="url(#nkBg)"/>
    <g transform="translate(45, 130)" filter="url(#shoeDrop)">
      <!-- Sneaker Silhouette Upper -->
      <path d="M 40 140 C 30 110, 45 70, 75 60 C 110 50, 140 85, 190 95 C 235 105, 275 115, 305 135 C 315 140, 310 155, 290 155 L 40 155 Z" fill="#0284C7"/>
      <!-- Mesh Texture Details -->
      <path d="M 75 60 C 95 80, 140 110, 220 125" fill="none" stroke="#38BDF8" stroke-width="3" opacity="0.7"/>
      <path d="M 120 75 L 140 135" fill="none" stroke="#0369A1" stroke-width="2"/>
      <path d="M 150 82 L 170 138" fill="none" stroke="#0369A1" stroke-width="2"/>
      <path d="M 180 90 L 200 140" fill="none" stroke="#0369A1" stroke-width="2"/>
      <!-- Collar & Heel Counter -->
      <path d="M 40 140 C 35 100, 50 65, 80 50 C 95 65, 110 80, 125 90" fill="none" stroke="#0F172A" stroke-width="12" stroke-linecap="round"/>
      <!-- Laces -->
      <line x1="130" y1="80" x2="155" y2="92" stroke="#FFFFFF" stroke-width="3"/>
      <line x1="150" y1="87" x2="175" y2="100" stroke="#FFFFFF" stroke-width="3"/>
      <line x1="170" y1="95" x2="195" y2="108" stroke="#FFFFFF" stroke-width="3"/>
      <!-- Nike Swoosh (Bold Lime Accent) -->
      <path d="M 80 105 C 130 100, 185 115, 245 80 C 220 125, 160 145, 110 135 Z" fill="#A3E635"/>
      <!-- Zoom Air Foam Midsole -->
      <path d="M 25 155 C 60 150, 110 152, 170 150 C 230 148, 280 150, 315 150 C 325 150, 320 172, 305 178 C 260 190, 130 190, 45 185 C 20 183, 10 165, 25 155 Z" fill="url(#soleGrad)"/>
      <!-- Zoom Air Pod Window -->
      <rect x="180" y="160" width="55" height="12" rx="6" fill="#0EA5E9" opacity="0.8"/>
      <!-- Black Rubber Outsole Tread -->
      <path d="M 28 184 C 110 190, 240 190, 308 178 L 310 184 C 240 196, 110 196, 26 189 Z" fill="#090D16"/>
    </g>
    <!-- Badge -->
    <rect x="24" y="24" width="135" height="26" rx="13" fill="#0F172A" stroke="#334155" stroke-width="1"/>
    <text x="91" y="41" font-family="-apple-system, sans-serif" font-size="11" font-weight="700" fill="#E2E8F0" text-anchor="middle">Nike Pegasus 40</text>
  </svg>`,

  'anker_powerbank.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <defs>
      <radialGradient id="akBg" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#1E293B"/>
        <stop offset="100%" stop-color="#020617"/>
      </radialGradient>
      <linearGradient id="bodyDark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#334155"/>
        <stop offset="50%" stop-color="#0F172A"/>
        <stop offset="100%" stop-color="#020617"/>
      </linearGradient>
      <filter id="bankDrop">
        <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#000" flood-opacity="0.6"/>
      </filter>
    </defs>
    <rect width="400" height="400" rx="24" fill="url(#akBg)"/>
    <!-- Anker Tower Power Bank -->
    <g transform="translate(130, 80)" filter="url(#bankDrop)">
      <!-- Main Upright Chassis -->
      <rect x="10" y="10" width="120" height="230" rx="18" fill="url(#bodyDark)" stroke="#475569" stroke-width="2"/>
      <!-- Metallic Ribs Pattern -->
      <line x1="15" y1="200" x2="125" y2="200" stroke="#1E293B" stroke-width="2"/>
      <line x1="15" y1="210" x2="125" y2="210" stroke="#1E293B" stroke-width="2"/>
      <line x1="15" y1="220" x2="125" y2="220" stroke="#1E293B" stroke-width="2"/>
      <!-- Glossy Smart TFT Color Screen -->
      <rect x="25" y="25" width="90" height="95" rx="10" fill="#020617" stroke="#1E293B" stroke-width="1.5"/>
      <!-- Battery Status Digital Graphic -->
      <circle cx="70" cy="65" r="28" fill="none" stroke="#1E293B" stroke-width="5"/>
      <path d="M 70 37 A 28 28 0 1 1 45 80" fill="none" stroke="#10B981" stroke-width="5" stroke-linecap="round"/>
      <text x="70" y="69" font-family="monospace" font-size="14" font-weight="900" fill="#FFFFFF" text-anchor="middle">88%</text>
      <!-- Watts indicator -->
      <text x="70" y="102" font-family="monospace" font-size="9" font-weight="700" fill="#38BDF8" text-anchor="middle">⚡ 134.5W</text>
      <!-- USB Ports below screen -->
      <rect x="35" y="135" width="30" height="8" rx="3" fill="#020617" stroke="#64748B" stroke-width="1"/>
      <text x="50" y="142" font-size="5" fill="#38BDF8" font-family="monospace" text-anchor="middle">C1 140W</text>
      <rect x="75" y="135" width="30" height="8" rx="3" fill="#020617" stroke="#64748B" stroke-width="1"/>
      <text x="90" y="142" font-size="5" fill="#38BDF8" font-family="monospace" text-anchor="middle">C2 140W</text>
      <rect x="45" y="155" width="50" height="10" rx="3" fill="#020617" stroke="#F59E0B" stroke-width="1.5"/>
      <text x="70" y="163" font-size="6" fill="#F59E0B" font-family="monospace" text-anchor="middle">USB-A 22.5W</text>
      <!-- Gold Branding -->
      <text x="70" y="185" font-family="-apple-system, sans-serif" font-size="9" font-weight="900" fill="#94A3B8" text-anchor="middle" letter-spacing="1">ANKER PRIME</text>
    </g>
    <!-- Badge -->
    <rect x="24" y="24" width="145" height="26" rx="13" fill="#0F172A" stroke="#334155" stroke-width="1"/>
    <text x="96" y="41" font-family="-apple-system, sans-serif" font-size="11" font-weight="700" fill="#E2E8F0" text-anchor="middle">Anker Prime 20,000mAh</text>
  </svg>`,

  'sephora_perfume.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <defs>
      <radialGradient id="spBg" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#2D1525"/>
        <stop offset="100%" stop-color="#0A0307"/>
      </radialGradient>
      <linearGradient id="amberPerfume" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FDE68A"/>
        <stop offset="50%" stop-color="#F59E0B"/>
        <stop offset="100%" stop-color="#D97706"/>
      </linearGradient>
      <filter id="perfDrop">
        <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#000" flood-opacity="0.65"/>
      </filter>
    </defs>
    <rect width="400" height="400" rx="24" fill="url(#spBg)"/>
    <!-- Luxury Perfume Bottle -->
    <g transform="translate(130, 80)" filter="url(#perfDrop)">
      <!-- Gold Spray Cap -->
      <rect x="52" y="15" width="36" height="40" rx="4" fill="#D97706" stroke="#FDE68A" stroke-width="2"/>
      <rect x="62" y="5" width="16" height="10" fill="#B45309"/>
      <!-- Glass Shoulder -->
      <polygon points="30,85 110,85 125,120 15,120" fill="#FFFFFF" opacity="0.3"/>
      <!-- Heavy Faceted Glass Bottle -->
      <rect x="15" y="110" width="110" height="145" rx="14" fill="#FFFFFF" opacity="0.2" stroke="#FFFFFF" stroke-width="2"/>
      <!-- Fragrance Liquid Inside -->
      <rect x="25" y="140" width="90" height="105" rx="8" fill="url(#amberPerfume)" opacity="0.85"/>
      <!-- Glass Straw Dip Tube -->
      <line x1="70" y1="55" x2="70" y2="235" stroke="#FFFFFF" stroke-width="3" opacity="0.5"/>
      <!-- Label Plaque -->
      <rect x="35" y="155" width="70" height="50" rx="4" fill="#FFFFFF" stroke="#000000" stroke-width="1"/>
      <text x="70" y="175" font-family="serif" font-size="10" font-weight="900" fill="#000000" text-anchor="middle">EAU DE</text>
      <text x="70" y="190" font-family="serif" font-size="11" font-weight="900" fill="#991B1B" text-anchor="middle">PARFUM</text>
      <text x="70" y="200" font-family="-apple-system, sans-serif" font-size="6" fill="#6B7280" text-anchor="middle">SEPHORA LUXE</text>
    </g>
    <!-- Badge -->
    <rect x="24" y="24" width="145" height="26" rx="13" fill="#0F172A" stroke="#334155" stroke-width="1"/>
    <text x="96" y="41" font-family="-apple-system, sans-serif" font-size="11" font-weight="700" fill="#E2E8F0" text-anchor="middle">Sephora Fragrance</text>
  </svg>`,

  'asos_puffer.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <defs>
      <radialGradient id="asBg" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#1E293B"/>
        <stop offset="100%" stop-color="#020617"/>
      </radialGradient>
      <linearGradient id="pufferNylon" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#334155"/>
        <stop offset="50%" stop-color="#0F172A"/>
        <stop offset="100%" stop-color="#020617"/>
      </linearGradient>
      <filter id="pufDrop">
        <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#000" flood-opacity="0.6"/>
      </filter>
    </defs>
    <rect width="400" height="400" rx="24" fill="url(#asBg)"/>
    <g transform="translate(85, 80)" filter="url(#pufDrop)">
      <!-- Oversized Puffer Hood -->
      <path d="M 60 70 C 50 15, 180 15, 170 70 Z" fill="#0F172A" stroke="#475569" stroke-width="2"/>
      <!-- Puffer Baffles (Horizontal Down Pillows) -->
      <!-- Baffle 1 -->
      <path d="M 30 75 Q 115 65 200 75 L 210 115 Q 115 105 20 115 Z" fill="url(#pufferNylon)" stroke="#1E293B"/>
      <!-- Baffle 2 -->
      <path d="M 20 115 Q 115 105 210 115 L 215 155 Q 115 145 15 155 Z" fill="url(#pufferNylon)" stroke="#1E293B"/>
      <!-- Baffle 3 -->
      <path d="M 15 155 Q 115 145 215 155 L 215 195 Q 115 185 15 195 Z" fill="url(#pufferNylon)" stroke="#1E293B"/>
      <!-- Baffle 4 -->
      <path d="M 15 195 Q 115 185 215 195 L 210 240 Q 115 230 20 240 Z" fill="url(#pufferNylon)" stroke="#1E293B"/>
      <!-- Sleeves with puffy elastic cuffs -->
      <path d="M 25 80 L -10 170 Q 0 185 15 180 L 30 120 Z" fill="#1E293B"/>
      <path d="M 205 80 L 240 170 Q 230 185 215 180 L 200 120 Z" fill="#1E293B"/>
      <!-- Center Chunky Silver Zipper -->
      <line x1="115" y1="70" x2="115" y2="235" stroke="#CBD5E1" stroke-width="3" stroke-dasharray="4 2"/>
      <rect x="111" y="85" width="8" height="14" rx="2" fill="#E2E8F0"/>
    </g>
    <!-- Badge -->
    <rect x="24" y="24" width="145" height="26" rx="13" fill="#0F172A" stroke="#334155" stroke-width="1"/>
    <text x="96" y="41" font-family="-apple-system, sans-serif" font-size="11" font-weight="700" fill="#E2E8F0" text-anchor="middle">ASOS Oversized Puffer</text>
  </svg>`,

  'dell_monitor.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <defs>
      <radialGradient id="dlBg" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#1E293B"/>
        <stop offset="100%" stop-color="#020617"/>
      </radialGradient>
      <linearGradient id="screenDisplay" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0284C7"/>
        <stop offset="50%" stop-color="#4F46E5"/>
        <stop offset="100%" stop-color="#EC4899"/>
      </linearGradient>
      <filter id="monDrop">
        <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#000" flood-opacity="0.6"/>
      </filter>
    </defs>
    <rect width="400" height="400" rx="24" fill="url(#dlBg)"/>
    <!-- 4K Monitor -->
    <g transform="translate(60, 90)" filter="url(#monDrop)">
      <!-- Monitor Bezel Frame -->
      <rect x="5" y="10" width="270" height="170" rx="6" fill="#0F172A" stroke="#334155" stroke-width="2"/>
      <!-- Gorgeous 4K IPS Panel Screen -->
      <rect x="10" y="15" width="260" height="160" rx="3" fill="url(#screenDisplay)"/>
      <path d="M 10 140 Q 80 80 180 120 T 270 90 L 270 175 L 10 175 Z" fill="#0F172A" opacity="0.3"/>
      <!-- Dell Logo Badge -->
      <circle cx="140" cy="172" r="3.5" fill="#CBD5E1"/>
      <!-- Ergonomic Articulating Stand -->
      <rect x="133" y="180" width="14" height="60" fill="#94A3B8"/>
      <!-- Aluminum Base Plate -->
      <polygon points="90,240 190,240 180,250 100,250" fill="#CBD5E1" stroke="#64748B" stroke-width="1"/>
    </g>
    <!-- Badge -->
    <rect x="24" y="24" width="145" height="26" rx="13" fill="#0F172A" stroke="#334155" stroke-width="1"/>
    <text x="96" y="41" font-family="-apple-system, sans-serif" font-size="11" font-weight="700" fill="#E2E8F0" text-anchor="middle">Dell UltraSharp 27" 4K</text>
  </svg>`,

  'bose_earbuds.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <defs>
      <radialGradient id="bsBg" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#1E293B"/>
        <stop offset="100%" stop-color="#020617"/>
      </radialGradient>
      <linearGradient id="earMatte" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#475569"/>
        <stop offset="100%" stop-color="#0F172A"/>
      </linearGradient>
      <filter id="earDrop">
        <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#000" flood-opacity="0.6"/>
      </filter>
    </defs>
    <rect width="400" height="400" rx="24" fill="url(#bsBg)"/>
    <!-- Bose Earbuds & Case -->
    <g transform="translate(100, 100)" filter="url(#earDrop)">
      <!-- Charging Case Open Base -->
      <rect x="30" y="70" width="140" height="110" rx="35" fill="#18181B" stroke="#3F3F46" stroke-width="2"/>
      <ellipse cx="100" cy="70" rx="60" ry="25" fill="#09090B"/>
      <circle cx="100" cy="140" r="3" fill="#38BDF8" opacity="0.9"/>
      <!-- Left Earbud Resting -->
      <g transform="translate(50, 45)">
        <ellipse cx="20" cy="20" rx="16" ry="22" fill="url(#earMatte)"/>
        <rect x="14" y="25" width="12" height="35" rx="6" fill="#27272A"/>
        <circle cx="20" cy="22" r="7" fill="#09090B"/>
      </g>
      <!-- Right Earbud Standing Out -->
      <g transform="translate(110, 30)">
        <ellipse cx="20" cy="20" rx="16" ry="22" fill="url(#earMatte)" stroke="#52525B" stroke-width="1"/>
        <rect x="14" y="25" width="12" height="35" rx="6" fill="#27272A"/>
        <circle cx="20" cy="22" r="7" fill="#09090B"/>
        <text x="20" y="45" font-family="-apple-system, sans-serif" font-size="5" fill="#94A3B8" text-anchor="middle" font-weight="900">BOSE</text>
      </g>
    </g>
    <!-- Badge -->
    <rect x="24" y="24" width="145" height="26" rx="13" fill="#0F172A" stroke="#334155" stroke-width="1"/>
    <text x="96" y="41" font-family="-apple-system, sans-serif" font-size="11" font-weight="700" fill="#E2E8F0" text-anchor="middle">Bose QC Ultra Earbuds</text>
  </svg>`,

  'patagonia_jacket.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <defs>
      <radialGradient id="ptBg" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#1E293B"/>
        <stop offset="100%" stop-color="#020617"/>
      </radialGradient>
      <linearGradient id="pataTeal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0D9488"/>
        <stop offset="50%" stop-color="#115E59"/>
        <stop offset="100%" stop-color="#134E4A"/>
      </linearGradient>
      <filter id="ptDrop">
        <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#000" flood-opacity="0.6"/>
      </filter>
    </defs>
    <rect width="400" height="400" rx="24" fill="url(#ptBg)"/>
    <g transform="translate(85, 90)" filter="url(#ptDrop)">
      <!-- Technical Brick Quilt Pattern Jacket -->
      <path d="M 40 40 L 115 25 L 190 40 L 210 140 L 195 230 L 35 230 L 20 140 Z" fill="url(#pataTeal)" stroke="#0F766E" stroke-width="1.5"/>
      <!-- Horizontal Quilting Grid -->
      <line x1="32" y1="70" x2="198" y2="70" stroke="#042F2E" stroke-width="1.5"/>
      <line x1="28" y1="105" x2="202" y2="105" stroke="#042F2E" stroke-width="1.5"/>
      <line x1="24" y1="140" x2="206" y2="140" stroke="#042F2E" stroke-width="1.5"/>
      <line x1="28" y1="175" x2="202" y2="175" stroke="#042F2E" stroke-width="1.5"/>
      <line x1="32" y1="205" x2="198" y2="205" stroke="#042F2E" stroke-width="1.5"/>
      <!-- Center Zipper with contrast orange pull -->
      <line x1="115" y1="25" x2="115" y2="230" stroke="#042F2E" stroke-width="3"/>
      <rect x="113" y="45" width="4" height="15" rx="1" fill="#F97316"/>
      <!-- Patagonia Mountain Sunset Crest Badge -->
      <rect x="60" y="80" width="28" height="12" rx="2" fill="#020617"/>
      <path d="M 62 88 L 68 83 L 74 88 L 82 81 L 86 88 Z" fill="#F97316"/>
    </g>
    <!-- Badge -->
    <rect x="24" y="24" width="145" height="26" rx="13" fill="#0F172A" stroke="#334155" stroke-width="1"/>
    <text x="96" y="41" font-family="-apple-system, sans-serif" font-size="11" font-weight="700" fill="#E2E8F0" text-anchor="middle">Patagonia Nano Puff</text>
  </svg>`,

  'dyson_vacuum.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <defs>
      <radialGradient id="dyBg" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#1E293B"/>
        <stop offset="100%" stop-color="#020617"/>
      </radialGradient>
      <filter id="dyDrop">
        <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#000" flood-opacity="0.6"/>
      </filter>
    </defs>
    <rect width="400" height="400" rx="24" fill="url(#dyBg)"/>
    <!-- Dyson V15 Stick Vacuum -->
    <g transform="translate(110, 70)" filter="url(#dyDrop)">
      <!-- Motor & Handle Trigger Body -->
      <rect x="20" y="20" width="55" height="70" rx="14" fill="#52525B" stroke="#71717A" stroke-width="2"/>
      <circle cx="48" cy="45" r="16" fill="#020617" stroke="#38BDF8" stroke-width="2"/>
      <text x="48" y="48" font-family="monospace" font-size="8" fill="#38BDF8" text-anchor="middle" font-weight="900">60m</text>
      <rect x="8" y="55" width="20" height="40" rx="6" fill="#FACC15"/>
      <!-- Radial Cyclones (Yellow & Nickel) -->
      <polygon points="75,25 125,15 125,95 75,85" fill="#EAB308" stroke="#CA8A04" stroke-width="1.5"/>
      <!-- Transparent Dust Bin -->
      <rect x="125" y="28" width="55" height="55" rx="6" fill="#FFFFFF" opacity="0.3" stroke="#CBD5E1" stroke-width="1.5"/>
      <!-- Nickel Extension Wand Rod -->
      <rect x="180" y="45" width="90" height="18" fill="#FACC15" stroke="#EAB308" stroke-width="1"/>
      <!-- Laser Fluffy Cleaner Head -->
      <rect x="270" y="30" width="15" height="48" rx="4" fill="#4338CA"/>
      <line x1="285" y1="54" x2="310" y2="54" stroke="#22C55E" stroke-width="3" stroke-dasharray="3 3"/>
    </g>
    <!-- Badge -->
    <rect x="24" y="24" width="145" height="26" rx="13" fill="#0F172A" stroke="#334155" stroke-width="1"/>
    <text x="96" y="41" font-family="-apple-system, sans-serif" font-size="11" font-weight="700" fill="#E2E8F0" text-anchor="middle">Dyson V15 Detect</text>
  </svg>`,

  'logitech_mouse.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <defs>
      <radialGradient id="lgBg" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#1E293B"/>
        <stop offset="100%" stop-color="#020617"/>
      </radialGradient>
      <filter id="lgDrop">
        <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#000" flood-opacity="0.6"/>
      </filter>
    </defs>
    <rect width="400" height="400" rx="24" fill="url(#lgBg)"/>
    <!-- Logitech MX Master 3S Ergonomic Mouse -->
    <g transform="translate(100, 90)" filter="url(#lgDrop)">
      <!-- Sculpted Ergonomic Palm Rest -->
      <path d="M 50 180 C 10 160, 20 80, 70 50 C 110 30, 160 30, 175 70 C 190 110, 170 190, 120 205 C 80 215, 60 190, 50 180 Z" fill="#27272A" stroke="#3F3F46" stroke-width="2"/>
      <!-- Thumb Rest Wing with Textured Diamond Grip -->
      <path d="M 50 140 C 20 135, 10 160, 15 180 C 25 195, 45 190, 55 180 Z" fill="#18181B"/>
      <!-- MagSpeed Steel Scroll Wheel -->
      <rect x="110" y="40" width="14" height="35" rx="4" fill="#CBD5E1" stroke="#475569" stroke-width="1.5"/>
      <!-- Thumb Side Scroll Wheel -->
      <rect x="42" y="115" width="8" height="22" rx="3" fill="#94A3B8"/>
      <!-- Click Splitter Line -->
      <line x1="117" y1="75" x2="117" y2="120" stroke="#18181B" stroke-width="2"/>
      <text x="120" y="155" font-family="-apple-system, sans-serif" font-size="8" font-weight="900" fill="#71717A" text-anchor="middle">logi</text>
    </g>
    <!-- Badge -->
    <rect x="24" y="24" width="145" height="26" rx="13" fill="#0F172A" stroke="#334155" stroke-width="1"/>
    <text x="96" y="41" font-family="-apple-system, sans-serif" font-size="11" font-weight="700" fill="#E2E8F0" text-anchor="middle">Logitech MX Master 3S</text>
  </svg>`
};

// Retailer Logos Generator
const retailerLogos = {
  'apple.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#000000"/><path d="M 50 28 C 53 23, 58 20, 63 20 C 64 25, 61 30, 57 32 C 54 34, 49 33, 50 28 Z M 67 52 C 67 43, 74 39, 75 38 C 70 32, 63 31, 60 31 C 54 30, 48 34, 45 34 C 41 34, 37 31, 32 31 C 24 31, 16 36, 12 45 C 4 60, 10 82, 18 92 C 22 97, 26 102, 32 102 C 37 102, 39 98, 45 98 C 51 98, 53 102, 58 102 C 64 102, 68 97, 72 92 C 77 84, 79 77, 79 76 C 79 76, 67 71, 67 52 Z" fill="#FFFFFF" transform="translate(6, -6) scale(0.85)"/></svg>`,
  'bestbuy.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#0046BE"/><polygon points="20,15 80,15 70,85 20,85" fill="#FFE000"/><text x="44" y="46" font-family="Impact, sans-serif" font-size="20" fill="#000000" text-anchor="middle">BEST</text><text x="44" y="66" font-family="Impact, sans-serif" font-size="20" fill="#000000" text-anchor="middle">BUY</text></svg>`,
  'amazon.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#131921"/><text x="50" y="48" font-family="-apple-system, sans-serif" font-size="24" font-weight="900" fill="#FFFFFF" text-anchor="middle">amazon</text><path d="M 25 58 Q 50 78 75 58" fill="none" stroke="#FF9900" stroke-width="4" stroke-linecap="round"/><polygon points="76,57 73,50 82,54" fill="#FF9900"/></svg>`,
  'target.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#CC0000"/><circle cx="50" cy="50" r="35" fill="#FFFFFF"/><circle cx="50" cy="50" r="22" fill="#CC0000"/><circle cx="50" cy="50" r="10" fill="#FFFFFF"/></svg>`,
  'walmart.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#0071DC"/><g transform="translate(50, 50)" stroke="#FFC220" stroke-width="8" stroke-linecap="round"><line x1="0" y1="-12" x2="0" y2="-32"/><line x1="10" y1="-6" x2="28" y2="-16"/><line x1="10" y1="6" x2="28" y2="16"/><line x1="0" y1="12" x2="0" y2="32"/><line x1="-10" y1="6" x2="-28" y2="16"/><line x1="-10" y1="-6" x2="-28" y2="-16"/></g></svg>`,
  'costco.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#FFFFFF" stroke="#E2E8F0"/><text x="50" y="55" font-family="-apple-system, sans-serif" font-size="18" font-weight="900" fill="#005DAA" text-anchor="middle">COSTCO</text><line x1="18" y1="65" x2="82" y2="65" stroke="#E31837" stroke-width="4"/></svg>`,
  'zara.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#000000"/><text x="50" y="58" font-family="serif" font-size="24" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="-2">ZARA</text></svg>`,
  'nike.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#000000"/><path d="M 20 52 C 38 48, 62 58, 85 30 C 72 58, 48 74, 30 68 Z" fill="#FFFFFF"/></svg>`,
  'sephora.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#000000"/><path d="M 45 25 Q 60 40 45 55 Q 30 70 55 80" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/></svg>`,
  'dell.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#007DB8"/><circle cx="50" cy="50" r="36" fill="none" stroke="#FFFFFF" stroke-width="4"/><text x="50" y="58" font-family="-apple-system, sans-serif" font-size="20" font-weight="900" fill="#FFFFFF" text-anchor="middle">DELL</text></svg>`,
  'rei.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#222222"/><polygon points="50,22 75,65 25,65" fill="#3B82F6" opacity="0.3"/><polygon points="50,28 70,65 30,65" fill="#FFFFFF"/><text x="50" y="82" font-family="sans-serif" font-size="12" font-weight="900" fill="#FFFFFF" text-anchor="middle">REI</text></svg>`,
  'asos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#2D2D2D"/><text x="50" y="58" font-family="sans-serif" font-size="24" font-weight="900" fill="#FFFFFF" text-anchor="middle">asos</text></svg>`
};

// Carrier Logos Generator
const carrierLogos = {
  'ups.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#351C15"/><path d="M 50 15 L 82 28 C 82 58, 68 80, 50 88 C 32 80, 18 58, 18 28 Z" fill="#FFB500"/><text x="50" y="58" font-family="sans-serif" font-size="24" font-weight="900" fill="#351C15" text-anchor="middle">UPS</text></svg>`,
  'fedex.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#4D148C"/><text x="35" y="58" font-family="sans-serif" font-size="24" font-weight="900" fill="#FFFFFF" text-anchor="middle">Fed</text><text x="70" y="58" font-family="sans-serif" font-size="24" font-weight="900" fill="#FF6600" text-anchor="middle">Ex</text></svg>`,
  'usps.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#333366"/><polygon points="25,35 65,35 50,70 25,70" fill="#E71921"/><text x="50" y="62" font-family="sans-serif" font-size="16" font-weight="900" fill="#FFFFFF" text-anchor="middle">USPS</text></svg>`,
  'dhl.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#FFCC00"/><text x="50" y="58" font-family="sans-serif" font-size="26" font-weight="900" fill="#D40511" text-anchor="middle" font-style="italic">DHL</text></svg>`,
  'instore.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#059669"/><text x="50" y="65" font-size="45" text-anchor="middle">🏬</text></svg>`
};

for (const [filename, svg] of Object.entries(productImages)) {
  fs.writeFileSync(path.join(PRODUCTS_DIR, filename), svg.trim());
}

for (const [filename, svg] of Object.entries(retailerLogos)) {
  fs.writeFileSync(path.join(RETAILERS_DIR, filename), svg.trim());
}

for (const [filename, svg] of Object.entries(carrierLogos)) {
  fs.writeFileSync(path.join(CARRIERS_DIR, filename), svg.trim());
}

console.log(`Generated ${Object.keys(productImages).length} product images, ${Object.keys(retailerLogos).length} retailer logos, and ${Object.keys(carrierLogos).length} carrier logos.`);
