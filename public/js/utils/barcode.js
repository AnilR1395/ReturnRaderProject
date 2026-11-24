// public/js/utils/barcode.js - SVG barcode & visual QR generator for in-store returns

export function generateBarcodeSVG(code, width = 300, height = 70) {
  if (!code) code = '0000000000';
  const cleanCode = String(code).toUpperCase().replace(/[^A-Z0-9-]/g, '');

  // Deterministic bar widths derived from string hash
  const bars = [];
  let hash = 0;
  for (let i = 0; i < cleanCode.length; i++) {
    hash = (hash << 5) - hash + cleanCode.charCodeAt(i);
    hash |= 0;
  }

  // Generate pseudo Code-128 sequence
  let x = 10;
  const usableWidth = width - 20;
  const numModules = 65;
  const moduleWidth = usableWidth / numModules;

  // Start guard
  bars.push({ x, w: moduleWidth * 2 });
  x += moduleWidth * 3;
  bars.push({ x, w: moduleWidth });
  x += moduleWidth * 2;

  for (let i = 0; i < 20; i++) {
    const bit = Math.abs(Math.sin(hash + i * 1.7) * 10) % 3;
    const barW = Math.max(1, Math.floor(bit) + 1) * moduleWidth;
    bars.push({ x, w: barW });
    x += barW + moduleWidth * (1 + (i % 2));
    if (x >= width - 20) break;
  }

  // Stop guard
  bars.push({ x: width - 25, w: moduleWidth * 2 });
  bars.push({ x: width - 18, w: moduleWidth });

  const rects = bars
    .map(b => `<rect x="${b.x.toFixed(1)}" y="5" width="${b.w.toFixed(1)}" height="${height - 20}" fill="#0F172A" />`)
    .join('');

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" class="w-full max-w-xs mx-auto drop-shadow-sm bg-white p-2 rounded border border-zinc-200">
      ${rects}
      <text x="${width / 2}" y="${height - 2}" font-family="monospace" font-size="10" font-weight="700" fill="#475569" text-anchor="middle">${cleanCode}</text>
    </svg>
  `;
}

export function generateQRCodeSVG(text, size = 120) {
  if (!text) text = 'RETURNRADAR';
  const seed = text.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const matrixSize = 21;
  const cellSize = size / matrixSize;

  let rects = '';

  // Draw 3 corner finder patterns
  function drawFinder(startX, startY) {
    let out = '';
    out += `<rect x="${startX * cellSize}" y="${startY * cellSize}" width="${7 * cellSize}" height="${7 * cellSize}" fill="#0F172A" rx="2" />`;
    out += `<rect x="${(startX + 1) * cellSize}" y="${(startY + 1) * cellSize}" width="${5 * cellSize}" height="${5 * cellSize}" fill="#FFFFFF" />`;
    out += `<rect x="${(startX + 2) * cellSize}" y="${(startY + 2) * cellSize}" width="${3 * cellSize}" height="${3 * cellSize}" fill="#0F172A" rx="1" />`;
    return out;
  }

  rects += drawFinder(1, 1);
  rects += drawFinder(matrixSize - 8, 1);
  rects += drawFinder(1, matrixSize - 8);

  // Timing patterns
  for (let i = 8; i < matrixSize - 8; i++) {
    if (i % 2 === 0) {
      rects += `<rect x="${i * cellSize}" y="${6 * cellSize}" width="${cellSize}" height="${cellSize}" fill="#0F172A" />`;
      rects += `<rect x="${6 * cellSize}" y="${i * cellSize}" width="${cellSize}" height="${cellSize}" fill="#0F172A" />`;
    }
  }

  // Data modules
  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      // Skip finder zones
      if ((r < 9 && c < 9) || (r < 9 && c > matrixSize - 9) || (r > matrixSize - 9 && c < 9)) {
        continue;
      }
      if (r === 6 || c === 6) continue;

      const val = Math.sin(seed * (r + 1) + c * 31);
      if (val > 0.1) {
        rects += `<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize * 0.9}" height="${cellSize * 0.9}" fill="#0F172A" rx="0.5" />`;
      }
    }
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" class="w-28 h-28 bg-white p-2 rounded-lg border border-zinc-200 shadow-sm mx-auto">
      ${rects}
    </svg>
  `;
}
