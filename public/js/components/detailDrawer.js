// public/js/components/detailDrawer.js - Item detail side drawer with multi-slide gallery & transit stepper
import {
  formatCurrency,
  formatDate,
  calculateDaysRemaining,
  getUrgencyBadge,
  getStatusLabel,
  getCarrierTrackingUrl,
  escapeHtml
} from '../utils/helpers.js';
import { generateBarcodeSVG, generateQRCodeSVG } from '../utils/barcode.js';

export function renderDetailDrawer(drawerContainer, purchase, onAction) {
  const days = calculateDaysRemaining(purchase.return_deadline);
  const badge = getUrgencyBadge(purchase.urgency_level, days, purchase.status);
  const statusInfo = getStatusLabel(purchase.status);
  const trackingUrl = getCarrierTrackingUrl(purchase.return_carrier, purchase.return_tracking_number);
  const isOverdue = purchase.is_refund_overdue;
  const isDisputed = purchase.status === 'DISPUTED' || purchase.discrepancy_amount < -1;

  // Build slides collection for this item:
  // Slide 1: Product photo
  // Slide 2: Sales receipt
  // Slide 3: Shipping return label (if any)
  const slides = [
    { title: 'Product Photo', src: purchase.image_url, type: 'photo', icon: '📷' },
    { title: 'Official Receipt', src: purchase.receipt_url || '/uploads/receipt_apple_airpods.svg', type: 'receipt', icon: '🧾' }
  ];
  if (purchase.return_label_url) {
    slides.push({ title: 'Carrier Return Label', src: purchase.return_label_url, type: 'label', icon: '📦' });
  }

  drawerContainer.innerHTML = `
    <div class="fixed inset-0 z-50 overflow-hidden bg-slate-950/75 backdrop-blur-sm flex justify-end transition-opacity">
      <div class="w-full max-w-xl bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col h-full transform transition-transform duration-300">
        
        <!-- Drawer Header with Retailer Brand Logo -->
        <div class="p-5 bg-slate-950/70 border-b border-slate-800 flex items-start justify-between gap-4">
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 mb-2 flex-wrap">
              <div class="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700">
                <img src="${purchase.retailer_logo}" alt="" class="w-4 h-4 object-contain"/>
                <span class="text-[11px] font-bold uppercase tracking-wider text-slate-200">
                  ${escapeHtml(purchase.retailer)}
                </span>
              </div>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.bgClass}">
                ${escapeHtml(badge.text)}
              </span>
              <span class="px-2 py-0.5 rounded text-[11px] font-semibold border ${statusInfo.color}">
                ${escapeHtml(statusInfo.label)}
              </span>
            </div>
            <h2 class="text-base font-bold text-white leading-snug">
              ${escapeHtml(purchase.product_name)}
            </h2>
            ${purchase.order_number ? `
              <div class="text-xs text-slate-400 font-mono mt-1">
                Order #${escapeHtml(purchase.order_number)}
              </div>
            ` : ''}
          </div>

          <button id="drawer-close-btn" class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
            ✕
          </button>
        </div>

        <!-- Drawer Body -->
        <div class="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">

          <!-- Overdue or Discrepancy Banner -->
          ${isDisputed ? `
            <div class="p-4 rounded-xl bg-rose-500/15 border border-rose-500/40 text-xs text-rose-200 flex items-start justify-between gap-3 shadow-lg shadow-rose-950/20">
              <div>
                <strong class="font-bold text-rose-300 block mb-1">⚠️ Discrepancy Detected:</strong>
                Refund received is ${formatCurrency(Math.abs(purchase.discrepancy_amount))} less than purchase price. Unauthorized restocking fee or return shipping deduction.
              </div>
              <button onclick="window.returnRadar.openDisputeModal('${purchase.id}')" class="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold whitespace-nowrap shadow-md">
                Dispute Letter →
              </button>
            </div>
          ` : isOverdue ? `
            <div class="p-4 rounded-xl bg-amber-500/15 border border-amber-500/40 text-xs text-amber-200 flex items-start justify-between gap-3 shadow-lg shadow-amber-950/20">
              <div>
                <strong class="font-bold text-amber-300 block mb-1">🚨 Refund Overdue:</strong>
                Item was delivered to seller past their standard turnaround window without reimbursement credited.
              </div>
              <button onclick="window.returnRadar.openDisputeModal('${purchase.id}')" class="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold whitespace-nowrap shadow-md">
                Dispute Letter →
              </button>
            </div>
          ` : ''}

          <!-- Interactive Multi-Slide Image & Document Showcase -->
          <div class="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <span>🖼️ Media &amp; Document Showcase</span>
              </span>
              <!-- Slide Tabs -->
              <div class="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800" id="drawer-media-tabs">
                ${slides.map((s, idx) => `
                  <button class="drawer-tab-btn px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    idx === 0 ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }" data-idx="${idx}">
                    ${s.icon} ${escapeHtml(s.title)}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Slide Main Frame -->
            <div class="w-full h-64 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center p-3 relative group">
              <img id="drawer-active-image" src="${slides[0].src}" alt="${escapeHtml(slides[0].title)}" class="max-h-full max-w-full object-contain drop-shadow-xl transition-all duration-300"/>
              
              <!-- Zoom link -->
              <a id="drawer-zoom-link" href="${slides[0].src}" target="_blank" class="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-slate-950/80 hover:bg-slate-900 text-[10px] text-slate-300 font-mono border border-slate-700 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                🔍 Full Resolution ↗
              </a>
            </div>
          </div>

          <!-- Financial Breakdown Card -->
          <div class="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div>
              <div class="text-[10px] text-slate-400 font-mono uppercase">Original Price</div>
              <div class="text-sm font-bold text-white font-mono mt-0.5">${formatCurrency(purchase.price)}</div>
            </div>
            <div>
              <div class="text-[10px] text-slate-400 font-mono uppercase">Expected Refund</div>
              <div class="text-sm font-bold text-emerald-400 font-mono mt-0.5">${formatCurrency(purchase.expected_refund_amount || purchase.price)}</div>
            </div>
            <div>
              <div class="text-[10px] text-slate-400 font-mono uppercase">Actual Refund</div>
              <div class="text-sm font-bold ${purchase.actual_refund_amount ? 'text-white' : 'text-slate-500'} font-mono mt-0.5">
                ${purchase.actual_refund_amount !== null ? formatCurrency(purchase.actual_refund_amount) : 'Pending'}
              </div>
            </div>
            <div>
              <div class="text-[10px] text-slate-400 font-mono uppercase">Window Limit</div>
              <div class="text-sm font-bold text-indigo-300 font-mono mt-0.5">${purchase.return_policy_days} Days</div>
            </div>
          </div>

          <!-- Realistic Carrier Transit Checkpoint Stepper -->
          ${renderTransitStepper(purchase)}

          <!-- Quick Actions Bar -->
          <div class="flex flex-wrap items-center gap-2">
            <!-- Calendar .ics download -->
            <a href="/api/export/ics/${purchase.id}" download class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors">
              <span>📅 Add to Calendar (.ICS)</span>
            </a>

            <!-- Advance Status Buttons -->
            ${purchase.status === 'CONSIDERING' ? `
              <button onclick="window.returnRadar.quickAdvanceStatus('${purchase.id}', 'INITIATED')" class="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors">
                Initiate Return →
              </button>
              <button onclick="window.returnRadar.quickAdvanceStatus('${purchase.id}', 'KEEP')" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors">
                Decided to Keep ✓
              </button>
            ` : ''}

            ${purchase.status === 'INITIATED' ? `
              <button onclick="window.returnRadar.quickAdvanceStatus('${purchase.id}', 'DROPPED_OFF')" class="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors">
                Mark Dropped Off at Carrier →
              </button>
            ` : ''}

            ${purchase.status === 'DROPPED_OFF' ? `
              <button onclick="window.returnRadar.quickAdvanceStatus('${purchase.id}', 'DELIVERED_TO_SELLER')" class="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors">
                Delivered to Seller →
              </button>
            ` : ''}

            ${['DELIVERED_TO_SELLER', 'REFUND_PENDING', 'DISPUTED'].includes(purchase.status) ? `
              <button onclick="window.returnRadar.openRefundModal('${purchase.id}')" class="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-lg shadow-emerald-600/30">
                Record Refund Credit ✓
              </button>
            ` : ''}

            <button onclick="window.returnRadar.openDisputeModal('${purchase.id}')" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors">
              Draft Inquiry ✉️
            </button>
          </div>

          <!-- Digital Barcode & QR Code Section (In-Store Scan) -->
          <div class="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <span>📱 Scannable Return Codes (In-Store)</span>
              </span>
              <span class="text-[10px] text-slate-400 font-mono">Present to counter cashier</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 items-center pt-1">
              <div>
                ${generateBarcodeSVG(purchase.order_number || purchase.id, 240, 65)}
              </div>
              <div class="flex flex-col items-center justify-center">
                ${generateQRCodeSVG(purchase.return_tracking_number || purchase.order_number || purchase.id, 90)}
                <span class="text-[10px] text-slate-400 font-mono mt-1">Mobile Scan QR</span>
              </div>
            </div>
          </div>

          <!-- Logistics & Tracking Details -->
          <div class="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5 text-xs">
            <h4 class="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Logistics &amp; Tracking</h4>
            
            <div class="grid grid-cols-2 gap-2 text-slate-400">
              <div>
                <span class="block text-[10px] text-slate-500">RETURN METHOD</span>
                <span class="font-medium text-slate-200">${escapeHtml(purchase.return_method || 'Standard Store / Mail')}</span>
              </div>
              <div>
                <span class="block text-[10px] text-slate-500">CARRIER</span>
                <span class="font-medium text-slate-200 flex items-center gap-1">
                  <img src="${purchase.carrier_logo}" alt="" class="w-3.5 h-3.5 rounded object-contain"/>
                  ${escapeHtml(purchase.return_carrier || 'N/A')}
                </span>
              </div>
              <div>
                <span class="block text-[10px] text-slate-500">PURCHASE DATE</span>
                <span class="font-medium text-slate-200">${formatDate(purchase.purchase_date)}</span>
              </div>
              <div>
                <span class="block text-[10px] text-slate-500">RETURN DEADLINE</span>
                <span class="font-medium text-slate-200">${formatDate(purchase.return_deadline)}</span>
              </div>
            </div>

            ${purchase.return_tracking_number ? `
              <div class="pt-2 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span class="block text-[10px] text-slate-500">TRACKING NUMBER</span>
                  <span class="font-mono text-slate-200 font-bold">${escapeHtml(purchase.return_tracking_number)}</span>
                </div>
                <a href="${trackingUrl}" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white font-bold text-xs transition-colors">
                  Open Carrier Tracking ↗
                </a>
              </div>
            ` : ''}

            ${purchase.condition_required ? `
              <div class="pt-2 border-t border-slate-800">
                <span class="block text-[10px] text-slate-500">REQUIRED CONDITION / CHECKLIST</span>
                <p class="text-slate-300 italic text-[11px] mt-0.5">${escapeHtml(purchase.condition_required)}</p>
              </div>
            ` : ''}

            ${purchase.notes ? `
              <div class="pt-2 border-t border-slate-800">
                <span class="block text-[10px] text-slate-500">USER NOTES</span>
                <p class="text-slate-300 text-xs mt-0.5">${escapeHtml(purchase.notes)}</p>
              </div>
            ` : ''}
          </div>

          <!-- Lifecycle Timeline -->
          <div class="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <h4 class="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Audit Trail &amp; History</h4>
            <div class="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-800">
              ${(purchase.timeline || []).map(event => `
                <div class="relative pl-7 text-xs">
                  <div class="absolute left-1.5 top-1.5 -translate-x-1/2 w-3 h-3 rounded-full bg-indigo-500 border-2 border-slate-900"></div>
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-white">${escapeHtml(event.title)}</span>
                    <span class="text-[10px] font-mono text-slate-400">${formatDate(event.date)}</span>
                  </div>
                  ${event.note ? `<p class="text-[11px] text-slate-400 mt-0.5">${escapeHtml(event.note)}</p>` : ''}
                </div>
              `).join('')}
            </div>
          </div>

        </div>

        <!-- Drawer Footer -->
        <div class="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs">
          <button onclick="window.returnRadar.confirmDelete('${purchase.id}')" class="text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1">
            <span>🗑️ Delete Record</span>
          </button>
          <button onclick="window.returnRadar.openEditModal('${purchase.id}')" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors">
            Edit Information
          </button>
        </div>

      </div>
    </div>
  `;

  // Hook slide tab switching
  const tabBtns = drawerContainer.querySelectorAll('.drawer-tab-btn');
  const activeImg = drawerContainer.querySelector('#drawer-active-image');
  const zoomLink = drawerContainer.querySelector('#drawer-zoom-link');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-idx'), 10);
      const selected = slides[idx];
      if (selected) {
        activeImg.src = selected.src;
        zoomLink.href = selected.src;

        tabBtns.forEach(b => {
          b.className = 'drawer-tab-btn px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all text-slate-400 hover:text-white';
        });
        e.currentTarget.className = 'drawer-tab-btn px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all bg-indigo-600 text-white shadow-sm';
      }
    });
  });

  // Attach close listener
  const closeBtn = drawerContainer.querySelector('#drawer-close-btn');
  closeBtn.addEventListener('click', () => drawerContainer.innerHTML = '');
}

function renderTransitStepper(p) {
  const steps = [
    { key: 'PURCHASED', label: 'Ordered', done: true },
    { key: 'INITIATED', label: 'Return Initiated', done: ['INITIATED', 'DROPPED_OFF', 'DELIVERED_TO_SELLER', 'REFUND_PENDING', 'REFUNDED'].includes(p.status) },
    { key: 'DROPPED_OFF', label: 'Dropped Off', done: ['DROPPED_OFF', 'DELIVERED_TO_SELLER', 'REFUND_PENDING', 'REFUNDED'].includes(p.status) },
    { key: 'DELIVERED_TO_SELLER', label: 'Delivered', done: ['DELIVERED_TO_SELLER', 'REFUND_PENDING', 'REFUNDED'].includes(p.status) },
    { key: 'REFUNDED', label: 'Refund Credited', done: p.status === 'REFUNDED' }
  ];

  return `
    <div class="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold uppercase tracking-wider text-slate-300">Carrier Transit Checkpoints</span>
        <span class="text-[10px] text-slate-400 font-mono">${escapeHtml(p.return_carrier || 'Drop-off')}</span>
      </div>

      <div class="relative flex items-center justify-between pt-2">
        <div class="absolute left-2 right-2 top-4 h-0.5 bg-slate-800 -z-0"></div>
        ${steps.map((st, i) => `
          <div class="relative z-10 flex flex-col items-center">
            <div class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
              st.done
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 ring-2 ring-slate-950'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }">
              ${st.done ? '✓' : i + 1}
            </div>
            <span class="text-[9px] font-medium text-slate-400 mt-1.5 text-center whitespace-nowrap">
              ${st.label}
            </span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
