// public/js/components/cartDrawer.js - RadarStore Dedicated Cart View
import { formatCurrency } from '../utils/helpers.js';

export function renderCartView(container, cart, user, handlers) {
  const { onUpdateQuantity, onRemoveItem, onProceedToCheckout, onContinueShopping } = handlers;

  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  let originalMrpTotal = 0;
  let totalAmount = 0;

  cart.forEach(item => {
    const qty = item.quantity || 1;
    totalAmount += (item.price * qty);
    originalMrpTotal += ((item.original_mrp || item.price) * qty);
  });

  const totalDiscount = originalMrpTotal - totalAmount;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="max-w-4xl mx-auto py-12 px-4 text-center space-y-4">
        <div class="bg-white rounded-2xl p-12 border border-slate-200 shadow-sm space-y-4">
          <div class="text-6xl animate-bounce">🛒</div>
          <h2 class="text-xl font-bold text-slate-800">Your RadarStore Cart is empty!</h2>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">
            Explore our curated catalog of smartphones, laptops, audio gear, and apparel with 7–30 days guaranteed return protection.
          </p>
          <button id="cart-shop-now" class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition-colors">
            Shop Today's Deals
          </button>
        </div>
      </div>
    `;

    const shopBtn = container.querySelector('#cart-shop-now');
    if (shopBtn) shopBtn.addEventListener('click', () => onContinueShopping());
    return;
  }

  container.innerHTML = `
    <div class="max-w-6xl mx-auto space-y-6">
      
      <!-- Top Delivery Address Bar -->
      <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-2">
          <span class="text-base text-blue-600">📍</span>
          <div>
            <span class="text-slate-500">Deliver to: </span>
            <strong class="text-slate-900">${user ? user.name : 'Rahul Sharma'}, 560103</strong>
            <span class="text-slate-500 hidden sm:inline"> - Flat 402, Palm Heights, Outer Ring Road, Bangalore</span>
          </div>
        </div>
        <span class="px-2.5 py-1 bg-blue-50 text-blue-600 font-bold rounded border border-blue-200 text-[11px]">
          Home (Default)
        </span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Left: Cart Items List -->
        <div class="lg:col-span-2 space-y-4">
          <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            
            <div class="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 class="text-sm font-bold text-slate-900">
                RadarStore Basket (${totalItems} ${totalItems === 1 ? 'item' : 'items'})
              </h2>
              <span class="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <span>⚡</span> Assured Delivery
              </span>
            </div>

            <!-- Items -->
            <div class="divide-y divide-slate-100">
              ${cart.map(item => `
                <div class="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 justify-between" data-id="${item.product_id}">
                  
                  <!-- Thumbnail & Stepper -->
                  <div class="flex sm:flex-col items-center gap-4 sm:gap-3 shrink-0">
                    <img
                      src="${item.image_url}"
                      alt="${item.title}"
                      class="w-20 h-20 sm:w-24 sm:h-24 object-contain bg-slate-50 p-2 rounded-lg border border-slate-100"
                      onerror="this.src='/images/products/airpods_max.svg'"
                    />

                    <!-- Quantity Stepper -->
                    <div class="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-slate-50">
                      <button class="btn-qty-minus px-2.5 py-1 hover:bg-slate-200 font-bold text-slate-700 text-xs transition-colors" data-id="${item.product_id}">
                        -
                      </button>
                      <span class="px-3 py-1 font-mono font-bold text-xs text-slate-900 bg-white">
                        ${item.quantity || 1}
                      </span>
                      <button class="btn-qty-plus px-2.5 py-1 hover:bg-slate-200 font-bold text-slate-700 text-xs transition-colors" data-id="${item.product_id}">
                        +
                      </button>
                    </div>
                  </div>

                  <!-- Details -->
                  <div class="flex-1 space-y-2">
                    <div class="flex items-start justify-between gap-2">
                      <h3 class="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        ${item.title}
                      </h3>
                      <span class="text-xs text-slate-400 font-mono hidden sm:block">Delivery: Tomorrow</span>
                    </div>

                    <div class="text-[11px] text-slate-500 flex items-center gap-2">
                      <span>Seller: RetailNet</span>
                      <span class="text-blue-600 font-bold italic">⚡Assured</span>
                    </div>

                    <!-- Price Row -->
                    <div class="flex items-baseline gap-2 pt-1">
                      <span class="text-base font-black text-slate-900 font-mono">
                        ${formatCurrency(item.price)}
                      </span>
                      <span class="text-xs text-slate-400 line-through font-mono">
                        ${formatCurrency(item.original_mrp || item.price)}
                      </span>
                      ${item.discount_percent ? `
                        <span class="text-xs font-bold text-emerald-600">${item.discount_percent}% Off</span>
                      ` : ''}
                    </div>

                    <!-- Return Policy Info -->
                    <div class="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 pt-1">
                      <span>🛡️</span>
                      <span>${item.return_policy_type || `${item.return_policy_days || 7} Days Return Policy`}</span>
                    </div>

                    <!-- Actions: Remove -->
                    <div class="pt-3 flex items-center gap-4 text-xs font-bold">
                      <button class="btn-cart-remove text-rose-600 hover:text-rose-700 transition-colors" data-id="${item.product_id}">
                        🗑️ REMOVE
                      </button>
                      <span class="text-slate-300">|</span>
                      <button class="btn-cart-save-later text-slate-600 hover:text-blue-600 transition-colors">
                        SAVE FOR LATER
                      </button>
                    </div>

                  </div>

                </div>
              `).join('')}
            </div>

            <!-- Place Order Floating / Bottom Strip -->
            <div class="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button id="cart-continue-shopping" class="text-blue-600 hover:underline font-bold text-xs">
                ← Continue Shopping
              </button>
              <button id="btn-place-order" class="px-6 py-3 bg-[#fb641b] hover:bg-[#e85913] text-white font-extrabold text-xs sm:text-sm rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-2">
                <span>PLACE ORDER</span>
                <span>➔</span>
              </button>
            </div>

          </div>
        </div>

        <!-- Right: Flipkart Iconic Price Details Sidebar -->
        <div class="space-y-4">
          <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
            
            <div class="p-4 border-b border-slate-100 font-bold text-slate-400 text-xs tracking-wider uppercase">
              Price Details
            </div>

            <div class="p-4 space-y-3 text-xs">
              <div class="flex items-center justify-between text-slate-700">
                <span>Price (${totalItems} items)</span>
                <span class="font-mono font-medium">${formatCurrency(originalMrpTotal)}</span>
              </div>

              <div class="flex items-center justify-between text-emerald-600">
                <span>Discount</span>
                <span class="font-mono font-medium">-${formatCurrency(totalDiscount)}</span>
              </div>

              <div class="flex items-center justify-between text-slate-700">
                <span>Delivery Charges</span>
                <span class="text-emerald-600 font-bold">FREE</span>
              </div>

              <div class="flex items-center justify-between text-slate-700">
                <span>Secured Packaging Fee</span>
                <span class="text-emerald-600 font-bold">FREE</span>
              </div>

              <div class="pt-3 border-t border-dashed border-slate-200 flex items-center justify-between text-sm sm:text-base font-extrabold text-slate-900">
                <span>Total Amount</span>
                <span class="font-mono text-blue-600 font-black">${formatCurrency(totalAmount)}</span>
              </div>

              <div class="pt-2 text-[11px] text-emerald-700 font-bold bg-emerald-50 p-2.5 rounded-lg border border-emerald-100 text-center">
                🎉 You will save ${formatCurrency(totalDiscount)} on this order
              </div>
            </div>

            <!-- Safe & Secure Payment Trust Seal -->
            <div class="p-4 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 space-y-2">
              <div class="flex items-center gap-2 text-slate-700 font-semibold">
                <span>🛡️</span>
                <span>Safe and Secure Payments</span>
              </div>
              <p class="leading-relaxed">
                100% Authentic Products. Automatic synchronization with ReturnRadar for real-time deadline protection.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  `;

  // Bind Events
  container.querySelectorAll('.btn-qty-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const item = cart.find(i => i.product_id === id);
      if (item && onUpdateQuantity) onUpdateQuantity(id, (item.quantity || 1) + 1);
    });
  });

  container.querySelectorAll('.btn-qty-minus').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const item = cart.find(i => i.product_id === id);
      if (item && onUpdateQuantity) {
        const nextQty = (item.quantity || 1) - 1;
        if (nextQty <= 0) {
          if (onRemoveItem) onRemoveItem(id);
        } else {
          onUpdateQuantity(id, nextQty);
        }
      }
    });
  });

  container.querySelectorAll('.btn-cart-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      if (onRemoveItem) onRemoveItem(id);
    });
  });

  const placeOrderBtn = container.querySelector('#btn-place-order');
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', () => {
      if (onProceedToCheckout) onProceedToCheckout();
    });
  }

  const continueBtn = container.querySelector('#cart-continue-shopping');
  if (continueBtn) {
    continueBtn.addEventListener('click', () => onContinueShopping());
  }
}
