// public/js/components/kanban.js - Return Lifecycle Pipeline Board with Rich Imagery & Checkpoints
import { formatCurrency, calculateDaysRemaining, getUrgencyBadge, getCarrierTrackingUrl, escapeHtml } from '../utils/helpers.js';

const STAGES = [
  { key: 'CONSIDERING', label: 'Considering / Trial', color: 'amber', icon: '⏳' },
  { key: 'INITIATED', label: 'Return Initiated', color: 'blue', icon: '📋' },
  { key: 'DROPPED_OFF', label: 'Dropped Off / Carrier', color: 'indigo', icon: '📦' },
  { key: 'DELIVERED_TO_SELLER', label: 'Delivered to Seller', color: 'purple', icon: '🏢' },
  { key: 'REFUND_PENDING', label: 'Refund Pending', color: 'cyan', icon: '💳' },
  { key: 'REFUNDED', label: 'Refunded & Resolved', color: 'emerald', icon: '✅' }
];

export function renderKanbanBoard(container, purchases, onSelectPurchase, onAdvanceStatus) {
  // Group purchases by stage
  const columns = {};
  STAGES.forEach(s => columns[s.key] = []);

  purchases.forEach(p => {
    if (columns[p.status]) {
      columns[p.status].push(p);
    } else if (p.status === 'DISPUTED') {
      columns['REFUND_PENDING'].push(p);
    }
  });

  container.innerHTML = `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-base font-bold text-white flex items-center gap-2">
            <span>Return Lifecycle Pipeline</span>
          </h2>
          <p class="text-xs text-slate-400">Track and advance merchandise through each phase of return and refund</p>
        </div>
        <div class="text-xs text-slate-400 font-mono">
          Total items in pipeline: ${purchases.filter(p => !['KEEP', 'EXPIRED'].includes(p.status)).length}
        </div>
      </div>

      <!-- Kanban Column Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
        ${STAGES.map(stage => {
          const items = columns[stage.key] || [];
          const totalVal = items.reduce((acc, curr) => acc + curr.price, 0);

          return `
            <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 flex flex-col min-w-[250px] max-w-full backdrop-blur-xl">
              <!-- Column Header -->
              <div class="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800">
                <div class="flex items-center gap-1.5 min-w-0">
                  <span class="text-sm">${stage.icon}</span>
                  <span class="text-xs font-bold text-slate-200 truncate uppercase tracking-wider">${stage.label}</span>
                </div>
                <span class="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-slate-800 text-slate-300">
                  ${items.length}
                </span>
              </div>

              <!-- Column Total -->
              <div class="text-[11px] text-slate-400 font-mono mb-3 px-1 flex justify-between">
                <span>Value:</span>
                <span class="text-slate-200 font-bold">${formatCurrency(totalVal)}</span>
              </div>

              <!-- Cards Container -->
              <div class="space-y-3 flex-1 min-h-[350px]">
                ${items.length === 0 ? `
                  <div class="h-28 rounded-xl border border-dashed border-slate-800/80 flex items-center justify-center text-xs text-slate-500 font-mono">
                    Empty Stage
                  </div>
                ` : `
                  ${items.map(p => {
                    const days = calculateDaysRemaining(p.return_deadline);
                    const badge = getUrgencyBadge(p.urgency_level, days, p.status);
                    const trackingUrl = getCarrierTrackingUrl(p.return_carrier, p.return_tracking_number);
                    const isDisputed = p.status === 'DISPUTED';
                    const isOverdue = p.is_refund_overdue;

                    return `
                      <div class="bg-slate-800/80 hover:bg-slate-800 border ${isDisputed ? 'border-rose-500/50 shadow-sm shadow-rose-950' : 'border-slate-700/60'} rounded-2xl overflow-hidden transition-all cursor-pointer shadow-lg group relative"
                           onclick="window.returnRadar.openDetail('${p.id}')">
                        
                        <!-- Product Image Banner Header -->
                        <div class="w-full h-28 bg-slate-950/80 relative overflow-hidden flex items-center justify-center p-2 border-b border-slate-700/50">
                          <img src="${p.image_url}" alt="${escapeHtml(p.product_name)}" class="h-full max-h-24 object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"/>
                          
                          <!-- Retailer Logo Badge (Floating Top Left) -->
                          <div class="absolute top-2 left-2 w-7 h-7 rounded-lg bg-slate-900/90 border border-slate-700 p-1 shadow">
                            <img src="${p.retailer_logo}" alt="" class="w-full h-full object-contain"/>
                          </div>

                          <!-- Urgency Badge (Floating Top Right) -->
                          <div class="absolute top-2 right-2">
                            <span class="px-2 py-0.5 rounded-full text-[9px] font-bold border ${badge.bgClass}">
                              ${escapeHtml(badge.text)}
                            </span>
                          </div>
                        </div>

                        <!-- Card Body -->
                        <div class="p-3">
                          <div class="flex items-center justify-between text-[11px] text-slate-400 mb-1 font-mono">
                            <span class="font-bold text-slate-300 uppercase">${escapeHtml(p.retailer)}</span>
                            <span class="text-white font-bold">${formatCurrency(p.price)}</span>
                          </div>

                          <!-- Title -->
                          <h4 class="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 mb-2 leading-snug">
                            ${escapeHtml(p.product_name)}
                          </h4>

                          <!-- Carrier Tracking with Logo -->
                          ${p.return_tracking_number ? `
                            <div class="mt-2 text-[10px] flex items-center justify-between bg-slate-900/70 p-1.5 rounded-lg border border-slate-700/50" onclick="event.stopPropagation()">
                              <div class="flex items-center gap-1.5 min-w-0">
                                <img src="${p.carrier_logo}" alt="" class="w-4 h-4 rounded object-contain flex-shrink-0"/>
                                <span class="text-slate-400 font-mono truncate">${escapeHtml(p.return_tracking_number.slice(0, 10))}...</span>
                              </div>
                              <a href="${trackingUrl}" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:text-indigo-300 font-bold ml-1">Track ↗</a>
                            </div>
                          ` : ''}

                          <!-- Discrepancy Alert -->
                          ${isDisputed ? `
                            <div class="mt-2 p-1.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-[10px] text-rose-300 font-semibold flex items-center justify-between" onclick="event.stopPropagation(); window.returnRadar.openDisputeModal('${p.id}')">
                              <span>Shortfall: ${formatCurrency(Math.abs(p.discrepancy_amount))}</span>
                              <span class="underline hover:text-white">Dispute →</span>
                            </div>
                          ` : ''}

                          <!-- Overdue Notice -->
                          ${isOverdue && !isDisputed ? `
                            <div class="mt-2 p-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-[10px] text-amber-300 font-semibold flex items-center justify-between" onclick="event.stopPropagation(); window.returnRadar.openDisputeModal('${p.id}')">
                              <span>Overdue refund</span>
                              <span class="underline hover:text-white">Dispute →</span>
                            </div>
                          ` : ''}

                          <!-- Quick Move Action Button -->
                          <div class="mt-2.5 pt-2 border-t border-slate-700/40 flex justify-end gap-1.5" onclick="event.stopPropagation()">
                            ${renderQuickActionButton(p)}
                          </div>
                        </div>

                      </div>
                    `;
                  }).join('')}
                `}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderQuickActionButton(p) {
  if (p.status === 'CONSIDERING') {
    return `
      <button class="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white text-[10px] font-semibold transition-colors"
              onclick="window.returnRadar.quickAdvanceStatus('${p.id}', 'INITIATED')">
        Initiate Return →
      </button>
    `;
  }
  if (p.status === 'INITIATED') {
    return `
      <button class="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white text-[10px] font-semibold transition-colors"
              onclick="window.returnRadar.quickAdvanceStatus('${p.id}', 'DROPPED_OFF')">
        Mark Dropped Off →
      </button>
    `;
  }
  if (p.status === 'DROPPED_OFF') {
    return `
      <button class="px-2.5 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white text-[10px] font-semibold transition-colors"
              onclick="window.returnRadar.quickAdvanceStatus('${p.id}', 'DELIVERED_TO_SELLER')">
        Delivered to Seller →
      </button>
    `;
  }
  if (p.status === 'DELIVERED_TO_SELLER' || p.status === 'REFUND_PENDING' || p.status === 'DISPUTED') {
    return `
      <button class="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-200 hover:text-white text-[10px] font-semibold transition-colors shadow-sm"
              onclick="window.returnRadar.openRefundModal('${p.id}')">
        Record Refund ✓
      </button>
    `;
  }
  return '';
}
