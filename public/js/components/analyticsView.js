// public/js/components/analyticsView.js - Financial recovery & retailer performance
import { formatCurrency, escapeHtml } from '../utils/helpers.js';

export function renderAnalyticsView(container, analyticsData) {
  if (!analyticsData || !analyticsData.summary) {
    container.innerHTML = `<div class="p-8 text-center text-slate-400">Loading analytics...</div>`;
    return;
  }

  const s = analyticsData.summary;
  const retailers = analyticsData.retailers || [];
  const categories = analyticsData.categories || { counts: {}, values: {} };
  const returnReasons = analyticsData.return_reasons || {};

  container.innerHTML = `
    <div class="space-y-6">
      <div>
        <h2 class="text-base font-bold text-white flex items-center gap-2">
          <span>Financial Recovery &amp; Return Intelligence</span>
        </h2>
        <p class="text-xs text-slate-400">Track capital preserved, refund bottlenecks, and merchant return behavior</p>
      </div>

      <!-- High-Impact KPI Tiles -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        
        <!-- Tile 1: Capital at Risk -->
        <div class="bg-slate-900/60 border border-red-500/30 rounded-2xl p-4 backdrop-blur-xl relative overflow-hidden shadow-lg shadow-red-950/20">
          <div class="flex items-center justify-between text-xs text-red-300 font-semibold mb-1">
            <span>Capital at Risk</span>
            <span>🚨</span>
          </div>
          <div class="text-xl md:text-2xl font-extrabold text-white font-mono tracking-tight">
            ${formatCurrency(s.capital_at_risk)}
          </div>
          <div class="text-[11px] text-red-400/80 mt-1">
            ${s.critical_items_count} item(s) expiring within 48h
          </div>
        </div>

        <!-- Tile 2: Pending Refunds -->
        <div class="bg-slate-900/60 border border-purple-500/30 rounded-2xl p-4 backdrop-blur-xl relative overflow-hidden shadow-lg shadow-purple-950/20">
          <div class="flex items-center justify-between text-xs text-purple-300 font-semibold mb-1">
            <span>Pending Reimbursements</span>
            <span>💳</span>
          </div>
          <div class="text-xl md:text-2xl font-extrabold text-white font-mono tracking-tight">
            ${formatCurrency(s.pending_refunds_total)}
          </div>
          <div class="text-[11px] text-purple-400/80 mt-1">
            ${s.overdue_refunds_count > 0 ? `<span class="text-amber-400 font-bold font-mono">⚠️ ${s.overdue_refunds_count} overdue</span>` : 'All in normal processing'}
          </div>
        </div>

        <!-- Tile 3: Total Recovered -->
        <div class="bg-slate-900/60 border border-emerald-500/30 rounded-2xl p-4 backdrop-blur-xl relative overflow-hidden shadow-lg shadow-emerald-950/20">
          <div class="flex items-center justify-between text-xs text-emerald-300 font-semibold mb-1">
            <span>Total Recovered</span>
            <span>💰</span>
          </div>
          <div class="text-xl md:text-2xl font-extrabold text-emerald-400 font-mono tracking-tight">
            ${formatCurrency(s.total_refunded)}
          </div>
          <div class="text-[11px] text-emerald-400/80 mt-1">
            Successfully credited to accounts
          </div>
        </div>

        <!-- Tile 4: Recovery Rate -->
        <div class="bg-slate-900/60 border border-indigo-500/30 rounded-2xl p-4 backdrop-blur-xl relative overflow-hidden shadow-lg shadow-indigo-950/20">
          <div class="flex items-center justify-between text-xs text-indigo-300 font-semibold mb-1">
            <span>Recovery Success Rate</span>
            <span>🎯</span>
          </div>
          <div class="text-xl md:text-2xl font-extrabold text-white font-mono tracking-tight">
            ${s.recovery_rate_percentage}%
          </div>
          <div class="text-[11px] text-indigo-300/80 mt-1">
            Of initiated returns completed
          </div>
        </div>

        <!-- Tile 5: Expired Loss -->
        <div class="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-4 backdrop-blur-xl relative overflow-hidden shadow-lg">
          <div class="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
            <span>Window Expired Losses</span>
            <span>⏳</span>
          </div>
          <div class="text-xl md:text-2xl font-extrabold text-slate-300 font-mono tracking-tight">
            ${formatCurrency(s.total_expired_loss)}
          </div>
          <div class="text-[11px] text-slate-500 mt-1">
            Missed return deadlines
          </div>
        </div>

      </div>

      <!-- Charts & Tables Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- Retailer Return Rate Leaderboard -->
        <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl">
          <h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center justify-between">
            <span>Return Behavior by Retailer</span>
            <span class="text-xs text-slate-400 font-mono font-normal">Ranked by volume</span>
          </h3>

          <div class="space-y-3.5">
            ${retailers.map(r => {
              const rate = r.returnRate || 0;
              let barColor = 'bg-indigo-500';
              if (rate > 50) barColor = 'bg-amber-500';
              if (rate >= 80) barColor = 'bg-rose-500';

              return `
                <div class="space-y-1">
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-bold text-slate-200">${escapeHtml(r.retailer)}</span>
                    <span class="font-mono text-slate-400">
                      ${r.returnedCount} returned / ${r.totalPurchases} purchases (${rate}%)
                    </span>
                  </div>
                  <div class="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
                    <div class="${barColor} h-full rounded-full transition-all duration-500" style="width: ${rate}%"></div>
                  </div>
                  <div class="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>Spent: ${formatCurrency(r.totalSpent)}</span>
                    <span>Refunded: ${formatCurrency(r.refundedAmount)}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Return Reasons & Category Breakdown -->
        <div class="space-y-6">
          <!-- Return Reasons -->
          <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl">
            <h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Primary Return Reasons
            </h3>
            <div class="grid grid-cols-2 gap-2.5">
              ${Object.entries(returnReasons).length === 0 ? `
                <div class="col-span-2 text-xs text-slate-500 py-3 text-center">No return reasons recorded yet.</div>
              ` : Object.entries(returnReasons).map(([reason, count]) => `
                <div class="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between">
                  <span class="text-xs text-slate-300 font-medium truncate">${escapeHtml(reason)}</span>
                  <span class="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-indigo-500/20 text-indigo-300">
                    ${count}
                  </span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Category Breakdown -->
          <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl">
            <h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Merchandise Categories
            </h3>
            <div class="space-y-2">
              ${Object.entries(categories.counts).map(([cat, count]) => {
                const val = categories.values[cat] || 0;
                return `
                  <div class="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-800/40">
                    <span class="font-medium text-slate-200">${escapeHtml(cat)}</span>
                    <div class="flex items-center gap-3 font-mono">
                      <span class="text-slate-400">${count} item${count > 1 ? 's' : ''}</span>
                      <span class="font-bold text-white">${formatCurrency(val)}</span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}
