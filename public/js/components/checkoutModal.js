// public/js/components/checkoutModal.js - RadarStore Checkout & Payment Deadline Selection
import { formatCurrency } from '../utils/helpers.js';

export function renderCheckoutModal(container, cart, user, onOrderComplete) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn';

  let totalAmount = 0;
  let originalMrpTotal = 0;
  cart.forEach(item => {
    const qty = item.quantity || 1;
    totalAmount += (item.price * qty);
    originalMrpTotal += ((item.original_mrp || item.price) * qty);
  });
  const totalDiscount = originalMrpTotal - totalAmount;

  modal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-2xl w-full text-slate-800 shadow-2xl overflow-hidden border border-slate-200 relative my-6">
      
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-xl">🛍️</span>
          <div>
            <h2 class="text-base sm:text-lg font-black tracking-tight">RadarStore Secure Checkout</h2>
            <p class="text-xs text-blue-100">Order verification &amp; payment deadline setup</p>
          </div>
        </div>
        <button id="checkout-close" class="text-white hover:text-blue-200 text-lg font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
          ✕
        </button>
      </div>

      <div class="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
        
        <!-- Step 1: Delivery Address -->
        <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
          <div class="flex items-center justify-between">
            <span class="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
              <span>📍</span> 1. Delivery Address
            </span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">Verified</span>
          </div>
          <div class="text-slate-700 pl-5 space-y-0.5">
            <p class="font-bold text-slate-900">${user ? user.name : 'Rahul Sharma'} <span class="font-normal text-slate-500">(${user ? user.phone : '+91 98765 43210'})</span></p>
            <p>${user ? user.address : 'Flat 402, Palm Heights, Outer Ring Road, Bangalore - 560103'}</p>
            <p class="text-[11px] text-emerald-600 font-semibold pt-1">⚡ Free delivery estimated by Tomorrow, 11 PM</p>
          </div>
        </div>

        <!-- Step 2: Order Summary -->
        <div class="space-y-3">
          <span class="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
            <span>📦</span> 2. Items in Order (${cart.length})
          </span>
          <div class="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
            ${cart.map(item => `
              <div class="p-3 flex items-center justify-between gap-3 bg-white">
                <div class="flex items-center gap-3">
                  <img src="${item.image_url}" class="w-10 h-10 object-contain rounded bg-slate-50 p-1 border border-slate-100" onerror="this.src='/images/products/airpods_max.svg'"/>
                  <div>
                    <h4 class="font-bold text-slate-800 line-clamp-1">${item.title}</h4>
                    <span class="text-[11px] text-slate-500">Qty: ${item.quantity || 1} • ${item.return_policy_days || 7} Days Return Policy</span>
                  </div>
                </div>
                <div class="text-right shrink-0">
                  <span class="font-bold font-mono text-slate-900">${formatCurrency(item.price * (item.quantity || 1))}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Step 3: Payment Options with Deadline Option -->
        <div class="space-y-3">
          <span class="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
            <span>💳</span> 3. Payment Method &amp; Deadlines
          </span>

          <div class="space-y-2.5">
            
            <!-- Option A: Reserve & Pay Later (Payment Deadline Lock) -->
            <label class="block cursor-pointer">
              <input type="radio" name="payment_choice" value="Reserve & Pay Later" class="sr-only peer" checked/>
              <div class="p-4 rounded-xl border-2 border-slate-200 peer-checked:border-amber-500 peer-checked:bg-amber-50/50 transition-all space-y-2 hover:border-slate-300">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-lg">⏳</span>
                    <div>
                      <span class="font-extrabold text-slate-900 text-xs sm:text-sm">Reserve &amp; Pay Later (with Deadline Lock)</span>
                      <span class="ml-2 px-1.5 py-0.2 rounded text-[10px] font-black bg-amber-400 text-blue-900">Recommended</span>
                    </div>
                  </div>
                  <span class="font-bold text-xs text-amber-700 font-mono">24h Deadline</span>
                </div>
                <p class="text-[11px] text-slate-600 leading-relaxed pl-6">
                  Locks stock and price immediately! You will receive a <strong>24-hour payment deadline notification</strong> with countdown. Pay anytime before the deadline to dispatch the shipment.
                </p>
                <div class="pl-6 text-[11px] text-amber-800 font-bold flex items-center gap-1">
                  <span>⏰</span> Includes live countdown banner &amp; ReturnRadar tracking.
                </div>
              </div>
            </label>

            <!-- Option B: UPI / Instant Pay -->
            <label class="block cursor-pointer">
              <input type="radio" name="payment_choice" value="UPI / Instant" class="sr-only peer"/>
              <div class="p-4 rounded-xl border-2 border-slate-200 peer-checked:border-blue-600 peer-checked:bg-blue-50/40 transition-all space-y-1 hover:border-slate-300">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-lg">⚡</span>
                    <span class="font-bold text-slate-900 text-xs sm:text-sm">Pay Now via UPI (Google Pay, PhonePe, Paytm)</span>
                  </div>
                  <span class="text-xs font-bold text-emerald-600">Instant</span>
                </div>
                <p class="text-[11px] text-slate-500 pl-6">Fastest checkout. Dispatches tomorrow morning with ReturnRadar return protection.</p>
              </div>
            </label>

            <!-- Option C: Credit / Debit Card -->
            <label class="block cursor-pointer">
              <input type="radio" name="payment_choice" value="Credit/Debit Card" class="sr-only peer"/>
              <div class="p-4 rounded-xl border-2 border-slate-200 peer-checked:border-blue-600 peer-checked:bg-blue-50/40 transition-all space-y-1 hover:border-slate-300">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-lg">💳</span>
                    <span class="font-bold text-slate-900 text-xs sm:text-sm">Credit / Debit / ATM Card</span>
                  </div>
                  <span class="text-xs font-bold text-slate-600">Visa / Mastercard / Rupay</span>
                </div>
                <p class="text-[11px] text-slate-500 pl-6">Zero transaction fee. 100% encrypted &amp; secure.</p>
              </div>
            </label>

          </div>
        </div>

        <!-- Price Breakdown Table -->
        <div class="bg-slate-50 rounded-xl p-4 space-y-2 text-xs border border-slate-200">
          <div class="flex justify-between text-slate-600">
            <span>Total MRP</span>
            <span class="font-mono">${formatCurrency(originalMrpTotal)}</span>
          </div>
          <div class="flex justify-between text-emerald-600 font-medium">
            <span>Special Store Discount</span>
            <span class="font-mono">-${formatCurrency(totalDiscount)}</span>
          </div>
          <div class="flex justify-between text-slate-600">
            <span>Delivery Fee</span>
            <span class="text-emerald-600 font-bold">FREE</span>
          </div>
          <div class="pt-2 border-t border-slate-200 flex justify-between font-black text-slate-900 text-sm">
            <span>Amount Payable</span>
            <span class="font-mono text-blue-600 text-base">${formatCurrency(totalAmount)}</span>
          </div>
        </div>

      </div>

      <!-- Footer Buttons -->
      <div class="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
        <button id="checkout-cancel-btn" class="px-4 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-100 font-bold text-xs text-slate-700 transition-colors">
          Cancel
        </button>
        <button id="checkout-confirm-btn" class="px-6 py-2.5 rounded-lg bg-[#fb641b] hover:bg-[#e85913] text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center gap-2">
          <span>CONFIRM &amp; PLACE ORDER</span>
          <span>➔</span>
        </button>
      </div>

    </div>
  `;

  container.appendChild(modal);

  const close = () => {
    modal.classList.add('opacity-0');
    setTimeout(() => modal.remove(), 150);
  };

  modal.querySelector('#checkout-close').addEventListener('click', close);
  modal.querySelector('#checkout-cancel-btn').addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  const confirmBtn = modal.querySelector('#checkout-confirm-btn');
  confirmBtn.addEventListener('click', async () => {
    try {
      confirmBtn.disabled = true;
      confirmBtn.innerHTML = `
        <span class="animate-spin">⚙️</span>
        <span>Processing Order...</span>
      `;

      const selectedPayment = modal.querySelector('input[name="payment_choice"]:checked')?.value || 'Reserve & Pay Later';
      
      const payload = {
        items: cart,
        shipping_address: user ? user.address : 'Flat 402, Palm Heights, Outer Ring Road, Bangalore - 560103',
        payment_method: selectedPayment,
        reserve_hours: 24
      };

      await onOrderComplete(payload);
      close();
    } catch (err) {
      alert('Order failed: ' + err.message);
      confirmBtn.disabled = false;
      confirmBtn.innerHTML = 'CONFIRM & PLACE ORDER ➔';
    }
  });
}
