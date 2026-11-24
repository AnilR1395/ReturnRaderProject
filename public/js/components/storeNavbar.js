// public/js/components/storeNavbar.js - RadarStore Top Navigation & Category Bar

export function renderStoreNavbar(container, state, onNavigate, onSearch, onCategorySelect, onOpenCart, onOpenLogin, onSwitchMode, onLogout) {
  const user = state.currentUser;
  const cartCount = state.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const isPlus = user && user.is_plus_member;

  container.innerHTML = `
    <!-- Top RadarStore Modern Navy / Indigo Bar -->
    <div class="bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-white shadow-lg border-b border-blue-900/40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 gap-3 sm:gap-6">
          
          <!-- RadarStore Brand Logo -->
          <div class="flex items-center gap-3 cursor-pointer shrink-0" id="rs-logo-btn">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-amber-300 to-orange-500 text-blue-950 font-black flex items-center justify-center text-xl shadow-md ring-2 ring-white/10">
              ⚡
            </div>
            <div class="flex flex-col">
              <div class="flex items-center gap-1.5">
                <span class="text-xl sm:text-2xl font-black italic tracking-tight text-white">
                  RadarStore
                </span>
                <span class="px-1.5 py-0.2 rounded text-[10px] font-black bg-amber-400 text-blue-950 not-italic tracking-wider uppercase shadow-xs">
                  MART
                </span>
              </div>
              <div class="flex items-center gap-1 text-[11px] font-semibold text-blue-200">
                <span>By ReturnRadar</span>
                <span class="text-amber-400 font-bold">• Radar Assured 🛡️</span>
              </div>
            </div>
          </div>

          <!-- Search Bar -->
          <div class="flex-1 max-w-2xl relative">
            <div class="relative flex items-center">
              <input
                type="text"
                id="rs-search-input"
                placeholder="Search smartphones, laptops, audio gear, apparel..."
                value="${state.searchQuery || ''}"
                class="w-full bg-slate-900/90 text-white placeholder-slate-400 text-xs sm:text-sm pl-4 pr-10 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
              />
              <button id="rs-search-btn" class="absolute right-0 top-0 bottom-0 px-3.5 text-blue-400 hover:text-white font-bold transition-colors">
                🔍
              </button>
            </div>
          </div>

          <!-- Right Action Items -->
          <div class="flex items-center gap-2 sm:gap-3 shrink-0">
            
            <!-- Dual Mode Toggle Pill -->
            <button id="rs-mode-toggle" class="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${state.activeMode === 'radar' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'} border border-slate-700 transition-all" title="Toggle between Storefront and ReturnRadar Pro Dashboard">
              <span>${state.activeMode === 'radar' ? '📡 Pro Mode' : '🛍️ Store Mode'}</span>
            </button>

            <!-- User Login / Profile Dropdown -->
            <div class="relative group">
              ${user ? `
                <button id="rs-user-btn" class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm border border-slate-700 transition-all">
                  <div class="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-amber-300 text-blue-950 flex items-center justify-center font-black text-xs shadow-sm">
                    ${user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span class="hidden sm:inline">${user.name.split(' ')[0]}</span>
                  ${isPlus ? '<span class="text-amber-400 text-xs" title="Radar Plus Member">⭐</span>' : ''}
                  <span class="text-[10px] text-slate-400">▼</span>
                </button>
                <div class="hidden group-hover:block absolute right-0 top-full pt-1.5 w-60 z-50 animate-fadeIn">
                  <div class="bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 py-1 text-xs overflow-hidden">
                    <div class="px-4 py-3 border-b border-slate-100 bg-slate-50">
                      <p class="font-bold text-slate-900">${user.name}</p>
                      <p class="text-[11px] text-slate-500 font-mono">${user.email || user.phone}</p>
                      ${isPlus ? '<span class="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">Radar Plus Elite ⭐</span>' : ''}
                    </div>
                    <button id="rs-menu-profile" class="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center gap-2 text-slate-700 font-medium">
                      <span>👤</span>
                      <span>My Profile &amp; Login Page</span>
                    </button>
                    <button id="rs-menu-orders" class="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center gap-2 text-slate-700 font-medium">
                      <span>📦</span>
                      <span>My Orders &amp; Returns</span>
                    </button>
                    <button id="rs-menu-radar" class="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center gap-2 text-slate-700 font-medium">
                      <span>📡</span>
                      <span>ReturnRadar Pro Dashboard</span>
                    </button>
                    <div class="border-t border-slate-100 mt-1"></div>
                    <button id="rs-menu-signout" class="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 font-bold">
                      <span>🚪</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ` : `
                <button id="rs-login-btn" class="bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-blue-950 px-4 py-1.5 rounded-xl font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center gap-1.5">
                  <span>🔑</span>
                  <span>Login / Register</span>
                </button>
              `}
            </div>

            <!-- "My Orders" Header Button -->
            <button id="rs-orders-btn" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-xs sm:text-sm border border-slate-700/80 transition-all">
              <span class="text-base">📦</span>
              <span class="hidden sm:inline">Orders</span>
            </button>

            <!-- Cart Header Button with Live Badge -->
            <button id="rs-cart-btn" class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm relative shadow-md shadow-blue-600/30 transition-all active:scale-95">
              <span class="text-base">🛒</span>
              <span class="hidden sm:inline">Cart</span>
              ${cartCount > 0 ? `
                <span id="rs-cart-count" class="bg-amber-400 text-blue-950 text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-sm ring-1 ring-white">
                  ${cartCount}
                </span>
              ` : `
                <span id="rs-cart-count" class="hidden bg-amber-400 text-blue-950 text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-sm">
                  0
                </span>
              `}
            </button>

          </div>
        </div>
      </div>
    </div>

    <!-- Secondary Categories Strip -->
    <div class="bg-white text-slate-800 border-b border-slate-200 shadow-xs overflow-x-auto custom-scrollbar">
      <div class="max-w-7xl mx-auto px-4 flex items-center justify-between gap-6 py-2.5 min-w-max text-xs font-semibold">
        ${[
          { id: 'All', label: 'Top Offers', icon: '🏷️' },
          { id: 'Mobiles', label: 'Mobiles & Tablets', icon: '📱' },
          { id: 'Electronics', label: 'Electronics', icon: '💻' },
          { id: 'Fashion', label: 'Fashion', icon: '👕' },
          { id: 'Footwear', label: 'Footwear', icon: '👟' },
          { id: 'Home & Kitchen', label: 'Home & Kitchen', icon: '🏠' },
          { id: 'Beauty', label: 'Beauty & Grooming', icon: '✨' }
        ].map(cat => `
          <button
            class="rs-cat-btn flex items-center gap-2 px-3.5 py-1.5 rounded-full transition-all ${
              (state.activeCategory === cat.id || (!state.activeCategory && cat.id === 'All'))
                ? 'bg-blue-50 text-blue-600 font-extrabold border border-blue-200 shadow-xs'
                : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
            }"
            data-category="${cat.id}"
          >
            <span class="text-sm">${cat.icon}</span>
            <span>${cat.label}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;

  // Bind Events
  const searchInput = container.querySelector('#rs-search-input');
  const searchBtn = container.querySelector('#rs-search-btn');
  const logoBtn = container.querySelector('#rs-logo-btn');
  const cartBtn = container.querySelector('#rs-cart-btn');
  const ordersBtn = container.querySelector('#rs-orders-btn');
  const loginBtn = container.querySelector('#rs-login-btn');
  const modeToggleBtn = container.querySelector('#rs-mode-toggle');

  if (logoBtn) logoBtn.addEventListener('click', () => onNavigate('store'));
  if (cartBtn) cartBtn.addEventListener('click', () => onOpenCart());
  if (ordersBtn) ordersBtn.addEventListener('click', () => onNavigate('orders'));
  if (loginBtn) loginBtn.addEventListener('click', () => onNavigate('login'));

  const menuProfile = container.querySelector('#rs-menu-profile');
  const menuOrders = container.querySelector('#rs-menu-orders');
  const menuRadar = container.querySelector('#rs-menu-radar');
  const menuSignout = container.querySelector('#rs-menu-signout');

  if (menuProfile) menuProfile.addEventListener('click', () => onNavigate('login'));
  if (menuOrders) menuOrders.addEventListener('click', () => onNavigate('orders'));
  if (menuRadar) menuRadar.addEventListener('click', () => onNavigate('radar'));
  if (menuSignout) menuSignout.addEventListener('click', () => {
    if (onLogout) onLogout();
  });

  if (modeToggleBtn) {
    modeToggleBtn.addEventListener('click', () => {
      onSwitchMode();
    });
  }

  const triggerSearch = () => {
    if (onSearch) onSearch(searchInput.value.trim());
  };

  if (searchBtn) searchBtn.addEventListener('click', triggerSearch);
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') triggerSearch();
    });
  }

  container.querySelectorAll('.rs-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-category');
      if (onCategorySelect) onCategorySelect(cat);
    });
  });
}
