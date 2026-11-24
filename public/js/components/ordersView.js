// public/js/components/ordersView.js - Flipkart "My Orders", Live Stepper, Status Tracking & Returns
import { formatCurrency, calculateDaysRemaining } from '../utils/helpers.js';

export function renderOrdersView(container, ordersData, state, handlers) {
  const { onPayOrder, onReturnOrder, onAdvanceStatus, onTrackInRadar, onShopNow } = handlers;
  const orders = ordersData.orders || [];

  let activeTab = state.orderTab || 'ALL'; // 'ALL' | 'PENDING' | 'TRANSIT' | 'DELIVERED' | 'RETURNED'

  const filteredOrders = orders.filter(o => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'PENDING') return o.payment_status === 'PENDING';
    if (activeTab === 'TRANSIT') return ['CONFIRMED', 'SHIPPED', 'OUT_FOR_DELIVERY'].includes(o.order_status);
    if (activeTab === 'DELIVERED') return o.order_status === 'DELIVERED';
    if (activeTab === 'RETURNED') return ['RETURN_INITIATED', 'REFUNDED'].includes(o.order_status);
    return true;
  });

  const pendingCount = orders.filter(o => o.payment_status === 'PENDING').length;

  container.innerHTML = `
    <div class="max-w-5xl mx-auto space-y-6">
      
      <!-- Top Title Bar -->
      <div class="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span>📦</span>
            <span>My Orders &amp; Delivery Status</span>
          </h1>
          <p class="text-xs text-slate-500">Track shipments, complete pending payment deadlines, and initiate guaranteed returns.</p>
        </div>

        <button id="btn-orders-shop" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5 shrink-0">
          <span>🛍️</span>
          <span>Explore Store</span>
        </button>
      </div>

      <!-- Filter Tabs -->
      <div class="bg-white rounded-xl p-1.5 shadow-sm border border-slate-200 flex items-center gap-1 overflow-x-auto custom-scrollbar text-xs">
        ${[
          { id: 'ALL', label: 'All Orders', count: orders.length },
          { id: 'PENDING', label: 'Payment Pending', count: pendingCount, highlight: pendingCount > 0 },
          { id: 'TRANSIT', label: 'On The Way', count: orders.filter(o => ['CONFIRMED', 'SHIPPED', 'OUT_FOR_DELIVERY'].includes(o.order_status)).length },
          { id: 'DELIVERED', label: 'Delivered', count: orders.filter(o => o.order_status === 'DELIVERED').length },
          { id: 'RETURNED', label: 'Returns & Refunds', count: orders.filter(o => ['RETURN_INITIATED', 'REFUNDED'].includes(o.order_status)).length }
        ].map(tab => `
          <button
            class="order-tab-btn px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }"
            data-tab="${tab.id}"
          >
            <span>${tab.label}</span>
            <span class="px-1.5 py-0.2 rounded-full text-[10px] ${
              activeTab === tab.id
                ? 'bg-white/20 text-white'
                : tab.highlight
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-slate-200 text-slate-700'
            }">
              ${tab.count}
            </span>
          </button>
        `).join('')}
      </div>

      <!-- Orders List -->
      ${filteredOrders.length === 0 ? `
        <div class="bg-white rounded-xl p-12 text-center border border-slate-200 space-y-3">
          <div class="text-5xl">📦</div>
          <h3 class="text-base font-bold text-slate-800">No orders found in this category</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">You don't have any orders matching the selected filter.</p>
        </div>
      ` : `
        <div class="space-y-6">
          ${filteredOrders.map(order => renderOrderCard(order)).join('')}
        </div>
      `}

    </div>
  `;

  // Bind Events
  container.querySelectorAll('.order-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      state.orderTab = tab;
      renderOrdersView(container, ordersData, state, handlers);
    });
  });

  const shopBtn = container.querySelector('#btn-orders-shop');
  if (shopBtn) {
    shopBtn.addEventListener('click', () => onShopNow());
  }

  // Bind Pay Now buttons
  container.querySelectorAll('.btn-order-pay-now').forEach(btn => {
    btn.addEventListener('click', () => {
      const orderId = btn.getAttribute('data-id');
      if (onPayOrder) onPayOrder(orderId);
    });
  });

  // Bind Advance Status Demo buttons
  container.querySelectorAll('.btn-advance-status').forEach(btn => {
    btn.addEventListener('click', () => {
      const orderId = btn.getAttribute('data-id');
      if (onAdvanceStatus) onAdvanceStatus(orderId);
    });
  });

  // Bind Return Request buttons
  container.querySelectorAll('.btn-order-return').forEach(btn => {
    btn.addEventListener('click', () => {
      const orderId = btn.getAttribute('data-id');
      const order = orders.find(o => o.id === orderId);
      if (order) openReturnRequestModal(order, onReturnOrder);
    });
  });

  // Bind Track in Radar
  container.querySelectorAll('.btn-track-radar').forEach(btn => {
    btn.addEventListener('click', () => {
      const purchaseId = btn.getAttribute('data-purchase-id');
      if (onTrackInRadar && purchaseId) onTrackInRadar(purchaseId);
    });
  });
}

function renderOrderCard(order) {
  const isPaymentPending = order.payment_status === 'PENDING';
  const isDelivered = order.order_status === 'DELIVERED';
  const isReturnInitiated = order.order_status === 'RETURN_INITIATED';
  const isRefunded = order.order_status === 'REFUNDED';
  const isShipped = ['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'RETURN_INITIATED', 'REFUNDED'].includes(order.order_status);
  const isOutForDelivery = ['OUT_FOR_DELIVERY', 'DELIVERED', 'RETURN_INITIATED', 'REFUNDED'].includes(order.order_status);

  const items = order.items || [];
  const primaryItem = items[0] || {};

  return `
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-100" data-order-id="${order.id}">
      
      <!-- Order Card Top Bar -->
      <div class="p-4 bg-slate-50/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-3">
          <span class="font-extrabold text-slate-900 font-mono text-sm">
            #${order.order_number}
          </span>
          <span class="text-slate-400">|</span>
          <span class="text-slate-500">Placed: ${new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>

        <div class="flex items-center gap-3">
          <span class="text-slate-500">Total:</span>
          <span class="font-black font-mono text-slate-900 text-sm">${formatCurrency(order.total_amount)}</span>

          ${isPaymentPending ? `
            <span class="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-700 border border-rose-300 animate-pulse">
              ⏳ PAYMENT PENDING
            </span>
          ` : `
            <span class="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
              ✓ PAID (${order.payment_method})
            </span>
          `}
        </div>
      </div>

      <!-- Payment Deadline Warning Banner (If Pending) -->
      ${isPaymentPending ? `
        <div class="p-4 bg-gradient-to-r from-amber-500 to-rose-500 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
          <div class="flex items-center gap-3">
            <span class="text-2xl animate-bounce">⏰</span>
            <div class="space-y-0.5">
              <h4 class="font-black text-xs sm:text-sm tracking-tight">Payment Deadline Active: Complete Payment to Lock Order</h4>
              <p class="text-[11px] text-amber-100">
                ${order.paymentDeadlineRemainingHours !== null && order.paymentDeadlineRemainingHours > 0
                  ? `Expires in <strong>${order.paymentDeadlineRemainingHours} hours</strong> (${new Date(order.payment_deadline).toLocaleTimeString()}). Order cancels automatically if unpaid.`
                  : 'Deadline expired! Pay immediately to prevent inventory release.'}
              </p>
            </div>
          </div>

          <button
            class="btn-order-pay-now px-5 py-2.5 bg-white hover:bg-slate-100 text-rose-600 font-black text-xs rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-1.5 shrink-0"
            data-id="${order.id}"
          >
            <span>⚡</span>
            <span>Pay Now (${formatCurrency(order.total_amount)})</span>
          </button>
        </div>
      ` : ''}

      <!-- Main Order Content & Items -->
      <div class="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Left: Items Info (col-span-2) -->
        <div class="md:col-span-2 space-y-4">
          <div class="space-y-3">
            ${items.map(item => `
              <div class="flex items-start gap-4">
                <img
                  src="${item.image_url}"
                  alt="${item.title}"
                  class="w-16 h-16 sm:w-20 sm:h-20 object-contain bg-slate-50 p-2 rounded-lg border border-slate-100 shrink-0"
                  onerror="this.src='/images/products/airpods_max.svg'"
                />
                <div class="space-y-1 text-xs">
                  <h3 class="font-bold text-slate-900 leading-snug">${item.title}</h3>
                  <div class="flex items-center gap-2 text-slate-500 text-[11px]">
                    <span>Qty: ${item.quantity || 1}</span>
                    <span>•</span>
                    <span class="font-mono font-bold text-slate-800">${formatCurrency(item.price)}</span>
                    <span>•</span>
                    <span class="text-emerald-600 font-semibold">⚡ Assured</span>
                  </div>
                  <div class="text-[11px] text-slate-500 pt-0.5">
                    Return Policy: <strong class="text-emerald-700">${item.return_policy_days || 7} Days Guarantee</strong>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Shipping Details & Carrier -->
          <div class="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500">
            <div>
              <span class="font-bold text-slate-700">Delivery Address:</span>
              <span>${order.shipping_address || 'Flat 402, Palm Heights, Bangalore'}</span>
            </div>
            ${order.tracking_number ? `
              <div class="font-mono bg-slate-100 px-2.5 py-1 rounded border border-slate-200 text-slate-800">
                📦 ${order.carrier || 'Radar Express'}: <strong>${order.tracking_number}</strong>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Right: Status Tracking Stepper & Actions -->
        <div class="border-t md:border-t-0 md:border-l border-slate-100 md:pl-6 space-y-5">
          
          <div class="space-y-1">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Tracking</span>
            <div class="text-xs font-extrabold ${isRefunded ? 'text-purple-600' : isDelivered ? 'text-emerald-600' : isReturnInitiated ? 'text-amber-600' : 'text-blue-600'}">
              ${order.order_status.replace(/_/g, ' ')}
            </div>
          </div>

          <!-- Stepper Checkpoints -->
          <div class="relative pl-6 space-y-4 text-xs">
            <!-- Vertical Line -->
            <div class="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-200"></div>

            <!-- Checkpoint 1: Order Placed -->
            <div class="relative flex items-start gap-2">
              <div class="absolute -left-6 mt-0.5 w-5 h-5 rounded-full ${order.order_status !== 'PAYMENT_PENDING' ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-slate-900'} flex items-center justify-center text-[10px] font-bold shadow-xs">
                ✓
              </div>
              <div>
                <p class="font-bold text-slate-800">Order Confirmed</p>
                <p class="text-[10px] text-slate-400">${new Date(order.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <!-- Checkpoint 2: Shipped -->
            <div class="relative flex items-start gap-2">
              <div class="absolute -left-6 mt-0.5 w-5 h-5 rounded-full ${isShipped ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'} flex items-center justify-center text-[10px] font-bold">
                ${isShipped ? '✓' : '2'}
              </div>
              <div>
                <p class="font-bold ${isShipped ? 'text-slate-800' : 'text-slate-400'}">Shipped</p>
                <p class="text-[10px] text-slate-400">${isShipped ? (order.carrier || 'Delhivery Express') : 'Pending dispatch'}</p>
              </div>
            </div>

            <!-- Checkpoint 3: Out for Delivery -->
            <div class="relative flex items-start gap-2">
              <div class="absolute -left-6 mt-0.5 w-5 h-5 rounded-full ${isOutForDelivery ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'} flex items-center justify-center text-[10px] font-bold">
                ${isOutForDelivery ? '✓' : '3'}
              </div>
              <div>
                <p class="font-bold ${isOutForDelivery ? 'text-slate-800' : 'text-slate-400'}">Out for Delivery</p>
                <p class="text-[10px] text-slate-400">${isOutForDelivery ? 'Courier on the way' : 'Expected soon'}</p>
              </div>
            </div>

            <!-- Checkpoint 4: Delivered / Return Window Active -->
            <div class="relative flex items-start gap-2">
              <div class="absolute -left-6 mt-0.5 w-5 h-5 rounded-full ${isDelivered || isReturnInitiated || isRefunded ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'} flex items-center justify-center text-[10px] font-bold">
                ${isDelivered || isReturnInitiated || isRefunded ? '✓' : '4'}
              </div>
              <div>
                <p class="font-bold ${isDelivered || isReturnInitiated || isRefunded ? 'text-slate-800' : 'text-slate-400'}">
                  ${isRefunded ? 'Refund Completed' : isReturnInitiated ? 'Return Requested' : 'Delivered'}
                </p>
                <p class="text-[10px] text-slate-400">
                  ${order.delivery_date ? `Delivered: ${order.delivery_date}` : 'Est: Tomorrow'}
                </p>
              </div>
            </div>

          </div>

          <!-- Return Window Countdown & Return Action Button -->
          ${isDelivered ? `
            <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-3 space-y-2 text-xs">
              <div class="flex items-center gap-1.5 font-bold text-emerald-900">
                <span>🛡️</span>
                <span>Return Window Active</span>
              </div>
              <p class="text-[11px] text-emerald-700">
                ${order.returnWindowRemainingDays !== null && order.returnWindowRemainingDays > 0
                  ? `Closes in <strong>${order.returnWindowRemainingDays} days</strong> (${order.return_deadline}).`
                  : 'Return window closes today!'}
              </p>
              <button
                class="btn-order-return w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5"
                data-id="${order.id}"
              >
                <span>🔄</span>
                <span>Return / Replace Item</span>
              </button>
            </div>
          ` : ''}

          ${isReturnInitiated ? `
            <div class="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs space-y-1">
              <span class="font-bold text-amber-900 flex items-center gap-1.5">
                <span>🔄</span> Return Pickup Scheduled
              </span>
              <p class="text-[11px] text-amber-700">Radar Express courier will arrive within 24-48 hours. Refund will be credited immediately upon inspection.</p>
            </div>
          ` : ''}

          ${isRefunded ? `
            <div class="bg-purple-50 border border-purple-200 rounded-xl p-3 text-xs space-y-1">
              <span class="font-bold text-purple-900 flex items-center gap-1.5">
                <span>✅</span> Full Refund Credited
              </span>
              <p class="text-[11px] text-purple-700">Refund of <strong>${formatCurrency(order.total_amount)}</strong> has been credited to original payment source.</p>
            </div>
          ` : ''}

          <!-- Demo Advance Status Simulation Button -->
          <div class="pt-2">
            <button
              class="btn-advance-status w-full py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 font-mono text-[11px] border border-slate-200 transition-colors flex items-center justify-center gap-1"
              data-id="${order.id}"
              title="Demo feature: Cycle through order lifecycle statuses"
            >
              <span>⏩ Next Status Simulation</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  `;
}

// Return Request Dialog
function openReturnRequestModal(order, onReturnOrder) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn';

  modal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-lg w-full text-slate-800 shadow-2xl overflow-hidden border border-slate-200 relative my-6">
      
      <div class="bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-xl">🔄</span>
          <div>
            <h3 class="font-black text-base">Request Return / Replacement</h3>
            <p class="text-xs text-blue-100">Order #${order.order_number}</p>
          </div>
        </div>
        <button id="return-close" class="text-white hover:text-blue-200 font-bold text-lg w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10">✕</button>
      </div>

      <form id="return-form" class="p-6 space-y-4 text-xs">
        
        <div class="space-y-1">
          <label class="font-bold text-slate-700">Reason for Return</label>
          <select id="return-reason" class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white">
            <option value="Defective or Malfunctioning">Defective / Malfunctioning product</option>
            <option value="Performance / Quality Not Adequate">Performance or Quality not as expected</option>
            <option value="Item Different from Description">Item different from catalog description</option>
            <option value="Missing Parts / Accessories">Missing accessories or parts</option>
            <option value="Wrong Size / Color">Wrong size or color variant received</option>
            <option value="Better Price Available">Found better price elsewhere</option>
          </select>
        </div>

        <div class="space-y-1">
          <label class="font-bold text-slate-700">Refund Method</label>
          <select id="refund-method" class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white">
            <option value="Original Payment Method">Original Payment Method (Refund to Card / Bank)</option>
            <option value="RadarStore Store Credit (Instant)">RadarStore Store Credit (Instant Refund + 2% Bonus)</option>
            <option value="Direct UPI Transfer">Direct UPI Transfer</option>
          </select>
        </div>

        <div class="space-y-1">
          <label class="font-bold text-slate-700">Detailed Feedback / Comments (Optional)</label>
          <textarea id="return-comments" rows="3" placeholder="Describe the issue you experienced..." class="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"></textarea>
        </div>

        <div class="bg-blue-50 p-3 rounded-xl border border-blue-200 text-blue-900 text-[11px] space-y-1">
          <span class="font-bold flex items-center gap-1">🛡️ ReturnRadar Synchronized:</span>
          <p>This request automatically syncs with your ReturnRadar Kanban pipeline and active deadline tracking.</p>
        </div>

        <div class="pt-2 flex items-center justify-end gap-3">
          <button type="button" id="return-cancel" class="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-slate-100">
            Cancel
          </button>
          <button type="submit" class="px-5 py-2 rounded-lg bg-[#fb641b] hover:bg-[#e85913] text-white font-black shadow-md">
            Submit Return Request
          </button>
        </div>
      </form>

    </div>
  `;

  document.body.appendChild(modal);

  const close = () => {
    modal.classList.add('opacity-0');
    setTimeout(() => modal.remove(), 150);
  };

  modal.querySelector('#return-close').addEventListener('click', close);
  modal.querySelector('#return-cancel').addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  modal.querySelector('#return-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const reason = modal.querySelector('#return-reason').value;
    const refundMethod = modal.querySelector('#refund-method').value;
    const comments = modal.querySelector('#return-comments').value;

    await onReturnOrder(order.id, { reason, refund_method: refundMethod, comments });
    close();
  });
}
