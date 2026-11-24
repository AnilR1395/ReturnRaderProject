// public/js/components/storeView.js - Flipkart Storefront Grid, Filters & Product Details
import { formatCurrency } from '../utils/helpers.js';

export function renderStoreView(container, products, state, handlers) {
  const { onAddToCart, onBuyNow, onFilterChange, onOpenDetail } = handlers;

  container.innerHTML = `
    <div class="space-y-6">
      
      <!-- Flipkart Hero Promotional Banner -->
      <div class="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 text-white p-6 sm:p-8 shadow-xl">
        <div class="absolute -right-10 -bottom-10 opacity-10 pointer-events-none text-9xl">🛍️</div>
        
        <div class="relative z-10 max-w-2xl space-y-3">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-blue-900 text-xs font-black tracking-wide uppercase shadow-sm">
            <span>⚡ Mega Tech Fest &amp; Electronics Super Sale</span>
            <span>•</span>
            <span>Live Now</span>
          </div>

          <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Next-Gen Flagships &amp; Premium Gear
          </h1>

          <p class="text-blue-100 text-xs sm:text-sm leading-relaxed">
            Every purchase is backed by <strong>⚡ Radar Assured</strong> quality inspection and tracked automatically inside <strong>ReturnRadar's</strong> return deadline engine.
          </p>

          <!-- Banner Feature Badges -->
          <div class="flex flex-wrap items-center gap-3 pt-2 text-xs">
            <span class="bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 font-semibold flex items-center gap-1.5">
              <span>🛡️</span> 7–14 Days Guaranteed Return
            </span>
            <span class="bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 font-semibold flex items-center gap-1.5">
              <span>💳</span> Reserve &amp; Pay Later Available
            </span>
            <span class="bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 font-semibold flex items-center gap-1.5">
              <span>🚚</span> Free Express Delivery
            </span>
          </div>
        </div>
      </div>

      <!-- Filter, Sort & Count Strip -->
      <div class="bg-white text-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div class="flex items-center gap-3 w-full sm:w-auto">
          <span class="font-bold text-slate-900 text-sm">
            ${state.activeCategory ? state.activeCategory : 'All Categories'}
          </span>
          <span class="text-slate-400">|</span>
          <span class="text-slate-500 font-medium">
            Showing <strong class="text-blue-600">${products.length}</strong> items
          </span>
        </div>

        <div class="flex items-center gap-3 w-full sm:w-auto justify-end flex-wrap">
          <label class="flex items-center gap-1.5 font-medium cursor-pointer text-slate-700">
            <input type="checkbox" id="fk-filter-assured" class="rounded text-blue-600 focus:ring-blue-500" ${state.assuredOnly ? 'checked' : ''}/>
            <span>⚡ Assured Only</span>
          </label>

          <div class="flex items-center gap-1.5">
            <span class="text-slate-500">Sort by:</span>
            <select id="fk-sort-select" class="bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option value="featured" ${state.sort === 'featured' ? 'selected' : ''}>Featured</option>
              <option value="price_asc" ${state.sort === 'price_asc' ? 'selected' : ''}>Price: Low to High</option>
              <option value="price_desc" ${state.sort === 'price_desc' ? 'selected' : ''}>Price: High to Low</option>
              <option value="discount" ${state.sort === 'discount' ? 'selected' : ''}>Biggest Discount</option>
              <option value="rating" ${state.sort === 'rating' ? 'selected' : ''}>Customer Rating</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Product Grid -->
      ${products.length === 0 ? `
        <div class="bg-white rounded-xl p-12 text-center border border-slate-200 space-y-3">
          <div class="text-5xl">🔍</div>
          <h3 class="text-base font-bold text-slate-800">No products found</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">Try clearing your search query or selecting a different category from the top strip.</p>
          <button id="fk-reset-filters" class="px-4 py-2 bg-blue-600 text-white rounded font-bold text-xs hover:bg-blue-700 transition-colors">
            View All Products
          </button>
        </div>
      ` : `
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          ${products.map(p => `
            <div class="group bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden relative" data-id="${p.id}">
              
              <!-- Card Top Header (Discount Badge & Assured) -->
              <div class="p-4 pb-0 flex items-start justify-between">
                <span class="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black px-2 py-0.5 rounded">
                  ${p.discount_percent}% OFF
                </span>
                ${p.is_assured ? `
                  <span class="text-[11px] font-extrabold italic text-blue-600 tracking-tight flex items-center gap-0.5">
                    <span class="text-amber-500">⚡</span>Assured
                  </span>
                ` : ''}
              </div>

              <!-- Product Image with Click Target -->
              <div class="p-4 flex items-center justify-center cursor-pointer product-click-target aspect-square bg-slate-50/50 m-3 rounded-lg group-hover:bg-blue-50/30 transition-colors">
                <img
                  src="${p.image_url}"
                  alt="${p.title}"
                  class="max-h-44 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  onerror="this.src='/images/products/airpods_max.svg'"
                />
              </div>

              <!-- Product Details -->
              <div class="p-4 pt-1 flex-1 flex flex-col justify-between space-y-3">
                <div class="space-y-1.5 cursor-pointer product-click-target">
                  <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">${p.brand}</div>
                  <h3 class="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors" title="${p.title}">
                    ${p.title}
                  </h3>

                  <!-- Rating Pill -->
                  <div class="flex items-center gap-2">
                    <span class="bg-emerald-600 text-white text-[11px] font-extrabold px-1.5 py-0.2 rounded flex items-center gap-0.5 shadow-xs">
                      <span>${p.rating}</span>
                      <span class="text-[9px]">★</span>
                    </span>
                    <span class="text-[11px] text-slate-400 font-medium">(${p.rating_count.toLocaleString()})</span>
                  </div>
                </div>

                <!-- Price Row -->
                <div class="space-y-1 pt-1 border-t border-slate-100">
                  <div class="flex items-baseline gap-2">
                    <span class="text-base sm:text-lg font-black text-slate-900 font-mono">
                      ${formatCurrency(p.price)}
                    </span>
                    <span class="text-xs text-slate-400 line-through font-mono">
                      ${formatCurrency(p.original_mrp)}
                    </span>
                  </div>

                  <!-- Return Policy & Delivery Badges -->
                  <div class="flex flex-col gap-1 text-[11px]">
                    <div class="text-emerald-600 font-semibold flex items-center gap-1">
                      <span>🛡️</span>
                      <span>${p.return_policy_type || `${p.return_policy_days} Days Policy`}</span>
                    </div>
                    <div class="text-slate-500 text-[10px]">
                      ${p.delivery_time || 'Delivery by Tomorrow'}
                    </div>
                  </div>
                </div>

                <!-- Action Buttons: Add to Cart & Buy Now -->
                <div class="grid grid-cols-2 gap-2 pt-2">
                  <button
                    class="btn-add-to-cart px-3 py-2 rounded bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-colors active:scale-95"
                    data-id="${p.id}"
                  >
                    <span>🛒</span>
                    <span>Add</span>
                  </button>
                  <button
                    class="btn-buy-now px-3 py-2 rounded bg-[#fb641b] hover:bg-[#e85913] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-colors active:scale-95"
                    data-id="${p.id}"
                  >
                    <span>⚡</span>
                    <span>Buy Now</span>
                  </button>
                </div>

              </div>

            </div>
          `).join('')}
        </div>
      `}

    </div>
  `;

  // Bind Events
  container.querySelectorAll('.btn-add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const prod = products.find(p => p.id === id);
      if (prod && onAddToCart) onAddToCart(prod);
    });
  });

  container.querySelectorAll('.btn-buy-now').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const prod = products.find(p => p.id === id);
      if (prod && onBuyNow) onBuyNow(prod);
    });
  });

  container.querySelectorAll('.product-click-target').forEach(el => {
    el.addEventListener('click', (e) => {
      const card = el.closest('[data-id]');
      if (card) {
        const id = card.getAttribute('data-id');
        const prod = products.find(p => p.id === id);
        if (prod && onOpenDetail) onOpenDetail(prod);
      }
    });
  });

  const sortSelect = container.querySelector('#fk-sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      if (onFilterChange) onFilterChange({ sort: e.target.value });
    });
  }

  const assuredCheck = container.querySelector('#fk-filter-assured');
  if (assuredCheck) {
    assuredCheck.addEventListener('change', (e) => {
      if (onFilterChange) onFilterChange({ assuredOnly: e.target.checked });
    });
  }

  const resetBtn = container.querySelector('#fk-reset-filters');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (onFilterChange) onFilterChange({ activeCategory: 'All', searchQuery: '', assuredOnly: false });
    });
  }
}

// Product Details Modal
export function renderProductDetailsModal(container, product, onAddToCart, onBuyNow) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn';

  modal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-2xl w-full text-slate-800 shadow-2xl overflow-hidden border border-slate-200 relative my-8">
      
      <!-- Close Button -->
      <button id="modal-close" class="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm z-10 transition-colors">
        ✕
      </button>

      <div class="grid grid-cols-1 md:grid-cols-2">
        <!-- Left Column: Image & Highlights -->
        <div class="p-6 bg-slate-50 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200">
          <img
            src="${product.image_url}"
            alt="${product.title}"
            class="max-h-64 object-contain rounded-lg shadow-sm"
            onerror="this.src='/images/products/airpods_max.svg'"
          />
          <div class="mt-4 flex items-center gap-2">
            <span class="bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
              ${product.rating} ★
            </span>
            <span class="text-xs text-slate-500 font-medium">${product.rating_count.toLocaleString()} Ratings &amp; Reviews</span>
          </div>
          ${product.is_assured ? `
            <div class="mt-2 text-xs font-extrabold text-blue-600 italic flex items-center gap-1">
              ⚡ Radar Assured Quality Checked
            </div>
          ` : ''}
        </div>

        <!-- Right Column: Specs, Return Guarantee, Actions -->
        <div class="p-6 flex flex-col justify-between space-y-4">
          <div class="space-y-3">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">${product.brand}</span>
            <h2 class="text-base sm:text-lg font-bold text-slate-900 leading-snug">${product.title}</h2>

            <!-- Price -->
            <div class="flex items-baseline gap-2.5">
              <span class="text-2xl font-black text-slate-900 font-mono">${formatCurrency(product.price)}</span>
              <span class="text-sm text-slate-400 line-through font-mono">${formatCurrency(product.original_mrp)}</span>
              <span class="text-xs font-bold text-emerald-600">${product.discount_percent}% off</span>
            </div>

            <!-- Description -->
            <p class="text-xs text-slate-600 leading-relaxed">${product.description || 'Premium authentic device with full manufacturer warranty and instant replacement guarantee.'}</p>

            <!-- Return Guarantee Badge Box -->
            <div class="bg-blue-50 border border-blue-200 rounded-xl p-3 space-y-1.5 text-xs">
              <div class="font-bold text-blue-900 flex items-center gap-1.5">
                <span>🛡️</span>
                <span>ReturnRadar Guarantee: ${product.return_policy_type || `${product.return_policy_days} Days Policy`}</span>
              </div>
              <p class="text-blue-700 text-[11px] leading-relaxed">
                Eligible for hassle-free replacement or full refund within <strong>${product.return_policy_days} days</strong> of delivery. Deadline tracking auto-synced upon purchase.
              </p>
            </div>

            <!-- Stock & Delivery -->
            <div class="flex items-center justify-between text-xs pt-1">
              <span class="text-emerald-700 font-semibold flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                In Stock (${product.stock} units remaining)
              </span>
              <span class="text-slate-500">${product.delivery_time || 'Delivery by Tomorrow'}</span>
            </div>
          </div>

          <!-- Buttons -->
          <div class="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
            <button id="modal-add-cart" class="py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95">
              <span>🛒</span>
              <span>Add to Cart</span>
            </button>
            <button id="modal-buy-now" class="py-2.5 px-4 rounded-xl bg-[#fb641b] hover:bg-[#e85913] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95">
              <span>⚡</span>
              <span>Buy Now</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  `;

  container.appendChild(modal);

  const close = () => {
    modal.classList.add('opacity-0');
    setTimeout(() => modal.remove(), 150);
  };

  modal.querySelector('#modal-close').addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  modal.querySelector('#modal-add-cart').addEventListener('click', () => {
    onAddToCart(product);
    close();
  });

  modal.querySelector('#modal-buy-now').addEventListener('click', () => {
    onBuyNow(product);
    close();
  });
}
