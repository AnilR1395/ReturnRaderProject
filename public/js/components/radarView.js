// public/js/components/radarView.js - Visual concentric urgency radar with rich imagery
import { formatCurrency, calculateDaysRemaining, getUrgencyBadge, escapeHtml } from '../utils/helpers.js';

export function renderRadarView(container, purchases, onSelectPurchase) {
  // Categorize purchases into radar rings
  const critical = [];
  const warning = [];
  const safe = [];
  const inPipeline = [];

  purchases.forEach(p => {
    if (p.status === 'REFUNDED' || p.status === 'KEEP' || p.status === 'EXPIRED') {
      return;
    }
    if (['DROPPED_OFF', 'DELIVERED_TO_SELLER', 'REFUND_PENDING', 'DISPUTED'].includes(p.status)) {
      inPipeline.push(p);
      return;
    }

    const days = calculateDaysRemaining(p.return_deadline);
    if (days !== null && days <= 2) {
      critical.push(p);
    } else if (days !== null && days <= 7) {
      warning.push(p);
    } else {
      safe.push(p);
    }
  });

  // Calculate coordinates for radar blips
  function getCoordinates(index, total, ringRadius, center = 250) {
    if (total === 0) return { x: center, y: center };
    const angleStep = (2 * Math.PI) / total;
    const angle = index * angleStep - Math.PI / 2;
    return {
      x: center + ringRadius * Math.cos(angle),
      y: center + ringRadius * Math.sin(angle)
    };
  }

  const criticalCoords = critical.map((p, i) => ({ ...p, ...getCoordinates(i, critical.length, 65) }));
  const warningCoords = warning.map((p, i) => ({ ...p, ...getCoordinates(i, warning.length, 125) }));
  const safeCoords = safe.map((p, i) => ({ ...p, ...getCoordinates(i, safe.length, 180) }));
  const pipelineCoords = inPipeline.map((p, i) => ({ ...p, ...getCoordinates(i, inPipeline.length, 230) }));

  const allBlips = [...criticalCoords, ...warningCoords, ...safeCoords, ...pipelineCoords];

  container.innerHTML = `
    <div class="space-y-6">
      <!-- Radar Screen & Canvas -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div class="lg:col-span-7 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden shadow-2xl flex flex-col items-center justify-center">
          
          <div class="w-full flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <span class="relative flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
              </span>
              <h2 class="text-sm font-semibold tracking-wider uppercase text-slate-300">Active Return Radar</h2>
            </div>
            <span class="text-xs text-slate-400 font-mono">Reference Date: 2026-11-20</span>
          </div>

          <!-- Radar SVG Display -->
          <div class="relative w-full max-w-[480px] aspect-square flex items-center justify-center">
            <svg viewBox="0 0 500 500" class="w-full h-full overflow-visible">
              <defs>
                <radialGradient id="radarSweep" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#6366F1" stop-opacity="0.35" />
                  <stop offset="100%" stop-color="#6366F1" stop-opacity="0" />
                </radialGradient>
                <linearGradient id="sweepLine" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#818CF8" stop-opacity="0.9" />
                  <stop offset="100%" stop-color="#818CF8" stop-opacity="0" />
                </linearGradient>
              </defs>

              <!-- Concentric circles -->
              <circle cx="250" cy="250" r="230" fill="none" stroke="#334155" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.6"/>
              <circle cx="250" cy="250" r="180" fill="none" stroke="#10B981" stroke-width="1" opacity="0.35"/>
              <circle cx="250" cy="250" r="125" fill="none" stroke="#F59E0B" stroke-width="1.2" opacity="0.45"/>
              <circle cx="250" cy="250" r="65" fill="none" stroke="#EF4444" stroke-width="1.5" opacity="0.65"/>
              <circle cx="250" cy="250" r="4" fill="#6366F1" />

              <!-- Crosshairs -->
              <line x1="20" y1="250" x2="480" y2="250" stroke="#334155" stroke-width="0.8" stroke-dasharray="2 4" opacity="0.4"/>
              <line x1="250" y1="20" x2="250" y2="480" stroke="#334155" stroke-width="0.8" stroke-dasharray="2 4" opacity="0.4"/>

              <!-- Rotating sweep line -->
              <g class="radar-scanner">
                <line x1="250" y1="250" x2="480" y2="250" stroke="url(#sweepLine)" stroke-width="2"/>
                <path d="M 250 250 L 480 250 A 230 230 0 0 0 450 135 Z" fill="url(#radarSweep)" opacity="0.5"/>
              </g>

              <!-- Ring Labels -->
              <text x="250" y="244" font-size="9" fill="#94A3B8" font-family="monospace" text-anchor="middle">CENTER</text>
              <text x="250" y="194" font-size="9" fill="#EF4444" font-weight="700" font-family="monospace" text-anchor="middle">&lt; 48 HOURS (CRITICAL)</text>
              <text x="250" y="134" font-size="9" fill="#F59E0B" font-family="monospace" text-anchor="middle">3-7 DAYS (WARNING)</text>
              <text x="250" y="79" font-size="9" fill="#10B981" font-family="monospace" text-anchor="middle">&gt; 7 DAYS (SAFE)</text>
              <text x="250" y="28" font-size="9" fill="#A855F7" font-family="monospace" text-anchor="middle">IN-TRANSIT &amp; REFUND PIPELINE</text>

              <!-- Radar Blips -->
              ${allBlips.map(p => {
                let dotColor = '#10B981';
                let pulseClass = '';
                if (critical.includes(p)) {
                  dotColor = '#EF4444';
                  pulseClass = 'animate-ping';
                } else if (warning.includes(p)) {
                  dotColor = '#F59E0B';
                } else if (inPipeline.includes(p)) {
                  dotColor = '#A855F7';
                  if (p.is_refund_overdue || p.status === 'DISPUTED') {
                    dotColor = '#F43F5E';
                    pulseClass = 'animate-ping';
                  }
                }

                return `
                  <g class="radar-blip cursor-pointer group" data-id="${p.id}" transform="translate(${p.x}, ${p.y})">
                    ${pulseClass ? `<circle cx="0" cy="0" r="12" fill="${dotColor}" opacity="0.5" class="${pulseClass}"/>` : ''}
                    <circle cx="0" cy="0" r="7" fill="${dotColor}" stroke="#0F172A" stroke-width="2.5" class="transition-transform duration-200 group-hover:scale-150"/>
                    <text x="0" y="-12" font-size="9" font-weight="700" fill="#E2E8F0" text-anchor="middle" class="opacity-80 group-hover:opacity-100 font-sans pointer-events-none drop-shadow-md">
                      ${escapeHtml(p.retailer)}
                    </text>
                  </g>
                `;
              }).join('')}
            </svg>
          </div>

          <!-- Radar Legend -->
          <div class="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs">
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
              <span class="text-slate-300">Critical (&le;48h)</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span class="text-slate-300">Expiring (3-7d)</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span class="text-slate-300">Safe (&gt;7d)</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
              <span class="text-slate-300">In Refund Pipeline</span>
            </div>
          </div>
        </div>

        <!-- Right Side: Priority Action Feed with Real Product Photos -->
        <div class="lg:col-span-5 space-y-4">
          <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl">
            <h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Urgent Return Deadlines</span>
              <span class="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                ${critical.length} Critical
              </span>
            </h3>

            ${critical.length === 0 ? `
              <div class="text-center py-6 text-slate-400 text-xs">
                🎉 No purchases in critical window (&lt;48h). You're safe!
              </div>
            ` : `
              <div class="space-y-3">
                ${critical.map(p => {
                  const days = calculateDaysRemaining(p.return_deadline);
                  return `
                    <div class="p-3 rounded-xl border border-red-500/30 bg-red-950/20 hover:bg-red-950/30 transition-all cursor-pointer group flex items-center gap-3.5" onclick="window.returnRadar.openDetail('${p.id}')">
                      <!-- Product Image Thumbnail -->
                      <div class="w-14 h-14 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0 flex items-center justify-center p-1 relative">
                        <img src="${p.image_url}" alt="${escapeHtml(p.product_name)}" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"/>
                        <div class="absolute bottom-0 right-0 w-4 h-4 rounded-tl bg-slate-900 p-0.5">
                          <img src="${p.retailer_logo}" alt="" class="w-full h-full object-contain"/>
                        </div>
                      </div>

                      <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-2 mb-0.5">
                          <span class="px-1.5 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/30 text-red-200">
                            ${escapeHtml(p.retailer)}
                          </span>
                          <span class="text-xs font-mono font-bold text-red-400 animate-pulse">
                            ${days <= 0 ? 'Expires Today!' : `${days}d Left`}
                          </span>
                        </div>
                        <h4 class="text-xs font-bold text-white truncate group-hover:text-red-300 transition-colors">
                          ${escapeHtml(p.product_name)}
                        </h4>
                        <div class="flex items-center justify-between text-[11px] mt-1 text-slate-400">
                          <span class="font-mono text-red-300 font-bold">${formatCurrency(p.price)} at risk</span>
                          <span class="text-indigo-400 group-hover:underline">Action →</span>
                        </div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            `}
          </div>

          <!-- Refund Pipeline & Overdue Alert Card with Photos -->
          <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl">
            <h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Refund Pipeline &amp; Discrepancies</span>
              <span class="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                ${inPipeline.length} Active
              </span>
            </h3>

            ${inPipeline.length === 0 ? `
              <div class="text-center py-6 text-slate-400 text-xs">
                No returns currently waiting for merchant refund.
              </div>
            ` : `
              <div class="space-y-2.5 max-h-[290px] overflow-y-auto pr-1 custom-scrollbar">
                ${inPipeline.map(p => {
                  const isOverdue = p.is_refund_overdue;
                  const isDisputed = p.status === 'DISPUTED';
                  let border = 'border-slate-800 bg-slate-800/40';
                  if (isDisputed) border = 'border-rose-500/40 bg-rose-950/20';
                  else if (isOverdue) border = 'border-amber-500/40 bg-amber-950/20';

                  return `
                    <div class="p-2.5 rounded-xl border ${border} hover:bg-slate-800/60 transition-all cursor-pointer group flex items-center gap-3" onclick="window.returnRadar.openDetail('${p.id}')">
                      <!-- Product Thumbnail -->
                      <div class="w-12 h-12 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0 flex items-center justify-center p-1">
                        <img src="${p.image_url}" alt="" class="w-full h-full object-contain group-hover:scale-105 transition-transform"/>
                      </div>

                      <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-1.5 mb-0.5">
                          <span class="text-[11px] font-bold text-slate-300">${escapeHtml(p.retailer)}</span>
                          ${isOverdue ? '<span class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300">Overdue</span>' : ''}
                          ${isDisputed ? '<span class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300">Discrepancy</span>' : ''}
                        </div>
                        <div class="text-xs text-white truncate font-medium group-hover:text-indigo-300">
                          ${escapeHtml(p.product_name)}
                        </div>
                      </div>

                      <div class="text-right flex-shrink-0">
                        <div class="text-xs font-bold text-emerald-400">${formatCurrency(p.expected_refund_amount || p.price)}</div>
                        <div class="text-[10px] text-slate-400">${escapeHtml(p.status.replace(/_/g, ' '))}</div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            `}
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach click listeners to radar blips
  container.querySelectorAll('.radar-blip').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.getAttribute('data-id');
      if (id && onSelectPurchase) onSelectPurchase(id);
    });
  });
}
