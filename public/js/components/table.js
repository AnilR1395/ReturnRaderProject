// public/js/components/table.js - Interactive sortable inventory table with rich imagery
import {
  formatCurrency,
  formatDate,
  calculateDaysRemaining,
  getUrgencyBadge,
  getStatusLabel,
  getCarrierTrackingUrl,
  escapeHtml
} from '../utils/helpers.js';

export function renderTableView(container, purchases, currentFilters, onFilterChange) {
  container.innerHTML = `
    <div class="space-y-4">
      <!-- Search & Filters Toolbar -->
      <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-xl space-y-3">
        <div class="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          <!-- Search input -->
          <div class="relative flex-1 max-w-md">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              🔍
            </span>
            <input type="text" id="table-search" value="${escapeHtml(currentFilters.search || '')}"
                   placeholder="Search product, retailer, order #, or tags..."
                   class="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"/>
          </div>

          <!-- Retailer & Category Dropdowns -->
          <div class="flex flex-wrap items-center gap-2">
            <select id="table-retailer-filter" class="bg-slate-800/80 border border-slate-700/80 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">All Retailers</option>
              ${getUniqueRetailers(purchases).map(r => `
                <option value="${escapeHtml(r)}" ${currentFilters.retailer === r ? 'selected' : ''}>${escapeHtml(r)}</option>
              `).join('')}
            </select>

            <select id="table-status-filter" class="bg-slate-800/80 border border-slate-700/80 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">All Statuses</option>
              <option value="CONSIDERING" ${currentFilters.status === 'CONSIDERING' ? 'selected' : ''}>Considering / Trial</option>
              <option value="INITIATED" ${currentFilters.status === 'INITIATED' ? 'selected' : ''}>Return Initiated</option>
              <option value="DROPPED_OFF" ${currentFilters.status === 'DROPPED_OFF' ? 'selected' : ''}>Dropped Off</option>
              <option value="DELIVERED_TO_SELLER" ${currentFilters.status === 'DELIVERED_TO_SELLER' ? 'selected' : ''}>Delivered to Seller</option>
              <option value="REFUND_PENDING" ${currentFilters.status === 'REFUND_PENDING' ? 'selected' : ''}>Refund Pending</option>
              <option value="REFUNDED" ${currentFilters.status === 'REFUNDED' ? 'selected' : ''}>Refunded</option>
              <option value="KEEP" ${currentFilters.status === 'KEEP' ? 'selected' : ''}>Decided to Keep</option>
              <option value="DISPUTED" ${currentFilters.status === 'DISPUTED' ? 'selected' : ''}>Disputed</option>
              <option value="EXPIRED" ${currentFilters.status === 'EXPIRED' ? 'selected' : ''}>Expired</option>
            </select>

            <select id="table-sort" class="bg-slate-800/80 border border-slate-700/80 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="deadline_asc" ${currentFilters.sort === 'deadline_asc' ? 'selected' : ''}>Deadline: Soonest</option>
              <option value="deadline_desc" ${currentFilters.sort === 'deadline_desc' ? 'selected' : ''}>Deadline: Furthest</option>
              <option value="price_desc" ${currentFilters.sort === 'price_desc' ? 'selected' : ''}>Price: High to Low</option>
              <option value="price_asc" ${currentFilters.sort === 'price_asc' ? 'selected' : ''}>Price: Low to High</option>
              <option value="purchase_desc" ${currentFilters.sort === 'purchase_desc' ? 'selected' : ''}>Newest Purchased</option>
            </select>
          </div>
        </div>

        <!-- Filter Chips Strip -->
        <div class="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/80 text-xs">
          <span class="text-[11px] font-bold uppercase text-slate-400 mr-1 font-mono">Quick Filters:</span>
          ${renderFilterChip('ALL', 'All Items', !currentFilters.urgency && !currentFilters.status)}
          ${renderFilterChip('CRITICAL', '🚨 Critical (<48h)', currentFilters.urgency === 'CRITICAL')}
          ${renderFilterChip('WARNING', '⚡ Expiring (3-7d)', currentFilters.urgency === 'WARNING')}
          ${renderFilterChip('OVERDUE', '⚠️ Overdue Refund', currentFilters.urgency === 'OVERDUE')}
          ${renderFilterChip('DISPUTED', '💥 Discrepancy / Disputed', currentFilters.status === 'DISPUTED')}
          ${renderFilterChip('REFUNDED', '✅ Fully Refunded', currentFilters.status === 'REFUNDED')}
        </div>
      </div>

      <!-- Batch Actions Bar -->
      <div id="batch-actions-bar" class="hidden bg-indigo-950/80 border border-indigo-500/40 rounded-xl p-3 flex items-center justify-between text-xs backdrop-blur-md">
        <span class="text-indigo-200 font-bold font-mono" id="selected-count">0 items selected</span>
        <div class="flex items-center gap-2">
          <button id="batch-mark-keep" class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors">
            Mark as Kept
          </button>
          <button id="batch-delete" class="px-3 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600 text-rose-200 hover:text-white font-semibold transition-colors">
            Delete Selected
          </button>
        </div>
      </div>

      <!-- Inventory Table -->
      <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-xl shadow-xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-950/70 border-b border-slate-800 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <th class="p-3.5 w-10 text-center">
                  <input type="checkbox" id="select-all-purchases" class="rounded bg-slate-800 border-slate-700 text-indigo-500 focus:ring-0 cursor-pointer"/>
                </th>
                <th class="p-3.5">Item</th>
                <th class="p-3.5">Product &amp; Retailer</th>
                <th class="p-3.5">Price</th>
                <th class="p-3.5">Deadline &amp; Urgency</th>
                <th class="p-3.5">Status</th>
                <th class="p-3.5">Tracking / Method</th>
                <th class="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              ${purchases.length === 0 ? `
                <tr>
                  <td colspan="8" class="p-8 text-center text-slate-400">
                    No purchases found matching your filter criteria.
                  </td>
                </tr>
              ` : purchases.map(p => {
                const days = calculateDaysRemaining(p.return_deadline);
                const badge = getUrgencyBadge(p.urgency_level, days, p.status);
                const statusInfo = getStatusLabel(p.status);
                const trackingUrl = getCarrierTrackingUrl(p.return_carrier, p.return_tracking_number);

                return `
                  <tr class="hover:bg-slate-800/40 transition-colors cursor-pointer group" onclick="window.returnRadar.openDetail('${p.id}')">
                    <!-- Checkbox -->
                    <td class="p-3.5 text-center" onclick="event.stopPropagation()">
                      <input type="checkbox" class="purchase-select-box rounded bg-slate-800 border-slate-700 text-indigo-500 focus:ring-0 cursor-pointer" data-id="${p.id}"/>
                    </td>

                    <!-- Image Thumbnail -->
                    <td class="p-3.5 w-14">
                      <div class="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden p-1 flex items-center justify-center relative group-hover:scale-110 transition-transform shadow-md">
                        <img src="${p.image_url}" alt="" class="w-full h-full object-contain"/>
                        <div class="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-tl bg-slate-900 p-0.5">
                          <img src="${p.retailer_logo}" alt="" class="w-full h-full object-contain"/>
                        </div>
                      </div>
                    </td>

                    <!-- Product & Store -->
                    <td class="p-3.5">
                      <div class="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        ${escapeHtml(p.product_name)}
                      </div>
                      <div class="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                        <span class="font-bold text-slate-300">${escapeHtml(p.retailer)}</span>
                        ${p.order_number ? `<span>• Order #${escapeHtml(p.order_number)}</span>` : ''}
                      </div>
                    </td>

                    <!-- Price -->
                    <td class="p-3.5 whitespace-nowrap">
                      <div class="font-bold text-white font-mono">${formatCurrency(p.price)}</div>
                      ${p.expected_refund_amount && p.expected_refund_amount !== p.price ? `
                        <div class="text-[10px] text-slate-400 font-mono">Exp. Refund: ${formatCurrency(p.expected_refund_amount)}</div>
                      ` : ''}
                    </td>

                    <!-- Deadline & Urgency -->
                    <td class="p-3.5 whitespace-nowrap">
                      <div class="flex items-center gap-2">
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bgClass}">
                          ${escapeHtml(badge.text)}
                        </span>
                      </div>
                      <div class="text-[11px] text-slate-400 font-mono mt-0.5">
                        ${p.return_deadline ? formatDate(p.return_deadline) : 'N/A'}
                      </div>
                    </td>

                    <!-- Status -->
                    <td class="p-3.5 whitespace-nowrap">
                      <span class="px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${statusInfo.color}">
                        ${escapeHtml(statusInfo.label)}
                      </span>
                      ${p.is_refund_overdue ? `
                        <div class="text-[10px] text-amber-400 font-semibold mt-1">⚠️ Overdue</div>
                      ` : ''}
                    </td>

                    <!-- Tracking / Return Method -->
                    <td class="p-3.5 whitespace-nowrap">
                      ${p.return_tracking_number ? `
                        <div class="flex items-center gap-1.5 font-mono text-[11px]" onclick="event.stopPropagation()">
                          <img src="${p.carrier_logo}" alt="" class="w-4 h-4 rounded object-contain flex-shrink-0"/>
                          <a href="${trackingUrl}" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:text-indigo-300 font-bold underline">
                            ${escapeHtml(p.return_tracking_number.slice(0, 10))}...
                          </a>
                        </div>
                      ` : `
                        <div class="text-slate-400 text-[11px] flex items-center gap-1">
                          <img src="${p.carrier_logo}" alt="" class="w-3.5 h-3.5 rounded object-contain opacity-70"/>
                          <span>${escapeHtml(p.return_method || 'Store / Mail')}</span>
                        </div>
                      `}
                    </td>

                    <!-- Actions -->
                    <td class="p-3.5 text-right whitespace-nowrap" onclick="event.stopPropagation()">
                      <div class="flex items-center justify-end gap-1.5">
                        <!-- Add to Calendar -->
                        <a href="/api/export/ics/${p.id}" download title="Add deadline to Calendar" class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors">
                          📅
                        </a>
                        <!-- Detail Drawer -->
                        <button onclick="window.returnRadar.openDetail('${p.id}')" title="View Details" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium transition-colors">
                          View
                        </button>
                        <!-- Delete -->
                        <button onclick="window.returnRadar.confirmDelete('${p.id}')" title="Delete Purchase" class="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 transition-colors">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  // Attach search and filter events
  const searchInput = container.querySelector('#table-search');
  searchInput.addEventListener('input', (e) => {
    onFilterChange({ search: e.target.value });
  });

  const retailerSelect = container.querySelector('#table-retailer-filter');
  retailerSelect.addEventListener('change', (e) => {
    onFilterChange({ retailer: e.target.value });
  });

  const statusSelect = container.querySelector('#table-status-filter');
  statusSelect.addEventListener('change', (e) => {
    onFilterChange({ status: e.target.value });
  });

  const sortSelect = container.querySelector('#table-sort');
  sortSelect.addEventListener('change', (e) => {
    onFilterChange({ sort: e.target.value });
  });

  // Checkbox batch handling
  const selectAll = container.querySelector('#select-all-purchases');
  const rowBoxes = container.querySelectorAll('.purchase-select-box');
  const batchBar = container.querySelector('#batch-actions-bar');
  const countSpan = container.querySelector('#selected-count');

  function updateBatchBar() {
    const checked = Array.from(rowBoxes).filter(b => b.checked);
    if (checked.length > 0) {
      batchBar.classList.remove('hidden');
      countSpan.textContent = `${checked.length} item${checked.length > 1 ? 's' : ''} selected`;
    } else {
      batchBar.classList.add('hidden');
    }
  }

  selectAll.addEventListener('change', (e) => {
    rowBoxes.forEach(b => b.checked = e.target.checked);
    updateBatchBar();
  });

  rowBoxes.forEach(b => {
    b.addEventListener('change', updateBatchBar);
  });

  container.querySelector('#batch-mark-keep').addEventListener('click', async () => {
    const ids = Array.from(rowBoxes).filter(b => b.checked).map(b => b.getAttribute('data-id'));
    if (ids.length > 0) {
      await window.returnRadar.batchUpdateStatus(ids, 'KEEP');
    }
  });

  container.querySelector('#batch-delete').addEventListener('click', async () => {
    const ids = Array.from(rowBoxes).filter(b => b.checked).map(b => b.getAttribute('data-id'));
    if (ids.length > 0 && confirm(`Are you sure you want to delete ${ids.length} selected items?`)) {
      await window.returnRadar.batchDelete(ids);
    }
  });
}

function renderFilterChip(key, label, isActive) {
  return `
    <button class="px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
      isActive
        ? 'bg-indigo-600 text-white shadow-sm'
        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
    }" onclick="window.returnRadar.setQuickFilter('${key}')">
      ${label}
    </button>
  `;
}

function getUniqueRetailers(purchases) {
  const set = new Set();
  purchases.forEach(p => {
    if (p.retailer) set.add(p.retailer);
  });
  return Array.from(set).sort();
}
