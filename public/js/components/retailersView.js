// public/js/components/retailersView.js - Retailer policy knowledge base with brand logos
import { escapeHtml } from '../utils/helpers.js';

export function renderRetailersView(container, retailers, onAddRetailer) {
  container.innerHTML = `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-base font-bold text-white flex items-center gap-2">
            <span>Retailer Return Policy Intelligence Engine</span>
          </h2>
          <p class="text-xs text-slate-400">Preloaded policies, restocking fees, and drop-off guidelines for major stores</p>
        </div>
        <button id="btn-add-custom-retailer" class="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5">
          <span>+ Add Custom Store</span>
        </button>
      </div>

      <!-- Retailer Cards Grid with Brand Logos -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${retailers.map(r => {
          const cleanName = r.name.toLowerCase().replace(/[^a-z0-9]/g, '');
          const logoUrl = `/images/retailers/${cleanName}.svg`;

          return `
            <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl hover:border-slate-700 transition-all flex flex-col justify-between shadow-lg group">
              <div>
                <!-- Card Header with Brand Logo -->
                <div class="flex items-start justify-between gap-3 mb-3">
                  <div class="flex items-center gap-2.5">
                    <div class="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 p-1.5 flex items-center justify-center flex-shrink-0 shadow-inner">
                      <img src="${logoUrl}" alt="${escapeHtml(r.name)}" class="w-full h-full object-contain" onerror="this.src='/images/retailers/apple.svg'"/>
                    </div>
                    <div>
                      <h3 class="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                        ${escapeHtml(r.name)}
                      </h3>
                      <div class="text-[11px] text-slate-400 font-mono">
                        Avg refund: ~${r.average_refund_days || 4} business days
                      </div>
                    </div>
                  </div>

                  <span class="px-2.5 py-1 rounded-xl text-xs font-extrabold font-mono ${
                    r.return_days <= 15 ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                    r.return_days <= 30 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }">
                    ${r.return_days} DAYS
                  </span>
                </div>

                <!-- Drop-off & Fee Specs -->
                <div class="space-y-2 text-xs text-slate-300 my-3 bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
                  <div class="flex items-start gap-1.5">
                    <span class="text-slate-500 flex-shrink-0">📦 Drop-off:</span>
                    <span class="text-slate-300 font-medium">${escapeHtml(r.dropoff_locations || 'In-store or mail')}</span>
                  </div>

                  <div class="flex items-center gap-1.5">
                    <span class="text-slate-500">🏷️ Return fee:</span>
                    <span class="font-semibold ${r.return_shipping_fee > 0 ? 'text-amber-400' : 'text-emerald-400'}">
                      ${r.return_shipping_fee > 0 ? `$${r.return_shipping_fee.toFixed(2)}` : 'FREE'}
                    </span>
                  </div>

                  ${r.restocking_fee_note ? `
                    <div class="flex items-start gap-1.5 text-[11px] text-amber-300/90 pt-1 border-t border-slate-700/40">
                      <span class="flex-shrink-0">⚠️ Fee alert:</span>
                      <span>${escapeHtml(r.restocking_fee_note)}</span>
                    </div>
                  ` : ''}
                </div>

                <!-- Condition Notes -->
                ${r.condition_notes ? `
                  <p class="text-[11px] text-slate-400 line-clamp-2 italic mb-3">
                    "${escapeHtml(r.condition_notes)}"
                  </p>
                ` : ''}
              </div>

              <!-- Card Footer -->
              <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                ${r.website ? `
                  <a href="${r.website}" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1">
                    <span>Official Policy</span>
                    <span>↗</span>
                  </a>
                ` : '<span class="text-slate-500 text-[11px]">In-store policy</span>'}

                <button class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        onclick="window.returnRadar.openAddModalWithRetailer('${escapeHtml(r.name)}')">
                  Track Return +
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  container.querySelector('#btn-add-custom-retailer').addEventListener('click', () => {
    if (onAddRetailer) onAddRetailer();
  });
}
