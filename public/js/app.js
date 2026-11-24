// public/js/app.js - Main Application Orchestrator for ReturnRadar & Flipkart Storefront
import { api } from './api.js';
import { showToast, formatCurrency, calculateDaysRemaining } from './utils/helpers.js';

// Existing ReturnRadar Components
import { renderRadarView } from './components/radarView.js';
import { renderKanbanBoard } from './components/kanban.js';
import { renderTableView } from './components/table.js';
import { renderAnalyticsView } from './components/analyticsView.js';
import { renderRetailersView } from './components/retailersView.js';
import { renderPurchaseModal } from './components/modal.js';
import { renderDetailDrawer } from './components/detailDrawer.js';
import { renderRefundModal } from './components/refundModal.js';
import { renderDisputeModal } from './components/disputeModal.js';
import { renderNotificationPanel } from './components/notifications.js';
import { SpotlightCarousel } from './components/carousel.js';

// Flipkart / RadarStore Storefront & Orders Components
import { renderStoreNavbar } from './components/storeNavbar.js';
import { renderStoreView, renderProductDetailsModal } from './components/storeView.js';
import { renderCartView } from './components/cartDrawer.js';
import { renderCheckoutModal } from './components/checkoutModal.js';
import { renderOrdersView } from './components/ordersView.js';
import { renderLoginModal } from './components/loginModal.js';
import { renderLoginView } from './components/loginView.js';
import { renderPaymentDeadlineBanner } from './components/paymentDeadlineBanner.js';

class ReturnRadarApp {
  constructor() {
    this.currentView = 'store'; // 'store' | 'orders' | 'cart' | 'radar' | 'kanban' | 'table' | 'analytics' | 'retailers'
    this.activeMode = 'store';  // 'store' | 'radar'

    this.currentUser = null;
    this.products = [];
    this.ordersData = { orders: [], activePendingPaymentOrder: null };
    this.cart = this.loadCartFromStorage();

    this.storeFilters = {
      activeCategory: 'All',
      searchQuery: '',
      sort: 'featured',
      assuredOnly: false
    };

    // ReturnRadar state
    this.purchases = [];
    this.retailers = [];
    this.analytics = null;
    this.notificationsData = { notifications: [], unread_count: 0 };
    this.filters = {
      search: '',
      retailer: '',
      status: '',
      urgency: '',
      sort: 'deadline_asc'
    };

    // DOM containers
    this.deadlineBannerSlot = document.getElementById('payment-deadline-banner-slot');
    this.storeNavbarSlot = document.getElementById('store-navbar-slot');
    this.proHeader = document.getElementById('pro-header');
    this.mainViewContainer = document.getElementById('main-view');
    this.modalContainer = document.getElementById('modal-container');
    this.drawerContainer = document.getElementById('drawer-container');
    this.notifContainer = document.getElementById('notif-container');
    this.carouselSlot = document.getElementById('hero-carousel-slot');
    this.carousel = null;

    // Header badges & stats
    this.statCapitalAtRisk = document.getElementById('stat-capital-risk');
    this.statActiveWindows = document.getElementById('stat-active-windows');
    this.statPendingRefunds = document.getElementById('stat-pending-refunds');
    this.statTotalRefunded = document.getElementById('stat-total-refunded');
    this.notifBadge = document.getElementById('notif-unread-badge');

    this.bindGlobalEvents();
  }

  loadCartFromStorage() {
    try {
      const saved = localStorage.getItem('flipkart_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  saveCartToStorage() {
    localStorage.setItem('flipkart_cart', JSON.stringify(this.cart));
  }

  async init() {
    try {
      await this.loadCurrentUser();
      await this.loadProducts();
      await this.loadOrders();
      await this.loadRetailers();
      await this.loadPurchases();
      await this.loadAnalytics();
      await this.loadNotifications();

      this.updateNavbar();
      this.updateDeadlineBanner();
      this.render();
      console.log('ReturnRadar & Flipkart Storefront Initialized Successfully');
    } catch (err) {
      console.error('Initialization error:', err);
      showToast('Error connecting to backend: ' + err.message, 'error');
    }
  }

  async loadCurrentUser() {
    try {
      const data = await api.getCurrentUser();
      this.currentUser = data.user;
    } catch (e) {
      this.currentUser = {
        id: 'usr-rahul',
        name: 'Rahul Sharma',
        email: 'rahul.sharma@example.com',
        phone: '+91 98765 43210',
        is_plus_member: 1,
        address: 'Flat 402, Palm Heights, Outer Ring Road, Bangalore - 560103'
      };
    }
  }

  async loadProducts() {
    const params = {};
    if (this.storeFilters.activeCategory && this.storeFilters.activeCategory !== 'All') {
      params.category = this.storeFilters.activeCategory;
    }
    if (this.storeFilters.searchQuery) {
      params.search = this.storeFilters.searchQuery;
    }
    if (this.storeFilters.sort) {
      params.sort = this.storeFilters.sort;
    }
    if (this.storeFilters.assuredOnly) {
      params.assured = '1';
    }

    const data = await api.getProducts(params);
    this.products = data.products || [];
  }

  async loadOrders() {
    try {
      this.ordersData = await api.getOrders();
    } catch (e) {
      console.error('Failed to load orders:', e);
      this.ordersData = { orders: [], activePendingPaymentOrder: null };
    }
  }

  async loadPurchases() {
    const data = await api.getPurchases(this.filters);
    this.purchases = data.purchases || [];
    this.updateHeaderStats();
  }

  async loadRetailers() {
    const data = await api.getRetailers();
    this.retailers = data.retailers || [];
  }

  async loadAnalytics() {
    this.analytics = await api.getAnalytics();
    this.updateHeaderStats();
  }

  async loadNotifications() {
    this.notificationsData = await api.getNotifications();
    if (this.notifBadge) {
      const count = this.notificationsData.unread_count || 0;
      if (count > 0) {
        this.notifBadge.textContent = count;
        this.notifBadge.classList.remove('hidden');
      } else {
        this.notifBadge.classList.add('hidden');
      }
    }
  }

  updateHeaderStats() {
    if (!this.analytics || !this.analytics.summary) return;
    const s = this.analytics.summary;

    if (this.statCapitalAtRisk) this.statCapitalAtRisk.textContent = formatCurrency(s.capital_at_risk);
    if (this.statActiveWindows) this.statActiveWindows.textContent = s.active_tracked_count;
    if (this.statPendingRefunds) this.statPendingRefunds.textContent = formatCurrency(s.pending_refunds_total);
    if (this.statTotalRefunded) this.statTotalRefunded.textContent = formatCurrency(s.total_refunded);
  }

  updateNavbar() {
    if (!this.storeNavbarSlot) return;

    renderStoreNavbar(
      this.storeNavbarSlot,
      {
        currentUser: this.currentUser,
        cart: this.cart,
        activeCategory: this.storeFilters.activeCategory,
        searchQuery: this.storeFilters.searchQuery,
        activeMode: this.activeMode
      },
      (view) => this.switchView(view),
      async (search) => {
        this.storeFilters.searchQuery = search;
        await this.loadProducts();
        if (this.currentView !== 'store') this.switchView('store');
        else this.render();
      },
      async (cat) => {
        this.storeFilters.activeCategory = cat;
        await this.loadProducts();
        if (this.currentView !== 'store') this.switchView('store');
        else this.render();
      },
      () => this.switchView('cart'),
      () => this.switchView('login'),
      () => this.toggleMode(),
      () => this.handleLogout()
    );
  }

  updateDeadlineBanner() {
    if (!this.deadlineBannerSlot) return;

    // Find pending payment order
    const pendingOrder = this.ordersData.activePendingPaymentOrder ||
      this.ordersData.orders.find(o => o.payment_status === 'PENDING');

    renderPaymentDeadlineBanner(
      this.deadlineBannerSlot,
      pendingOrder,
      (orderId) => this.quickPayOrder(orderId),
      (orderId) => {
        this.switchView('orders');
      }
    );
  }

  renderCarousel() {
    if (!this.carouselSlot) return;
    if (this.carousel) {
      this.carousel.stopAutoplay();
    }

    if (['radar', 'kanban', 'table'].includes(this.currentView) && this.purchases.length > 0) {
      this.carouselSlot.classList.remove('hidden');
      this.carousel = new SpotlightCarousel('hero-carousel-slot', this.purchases, (id) => this.openDetail(id));
      this.carousel.render();
      this.carousel.startAutoplay();
    } else {
      this.carouselSlot.classList.add('hidden');
    }
  }

  toggleMode() {
    if (this.activeMode === 'store') {
      this.activeMode = 'radar';
      this.switchView('radar');
    } else {
      this.activeMode = 'store';
      this.switchView('store');
    }
  }

  switchView(viewName) {
    this.currentView = viewName;

    const isStoreFamily = ['store', 'orders', 'cart', 'login'].includes(viewName);
    if (isStoreFamily) {
      this.activeMode = 'store';
      if (this.proHeader) this.proHeader.classList.add('hidden');
      if (this.storeNavbarSlot) this.storeNavbarSlot.classList.remove('hidden');
    } else {
      this.activeMode = 'radar';
      if (this.proHeader) this.proHeader.classList.remove('hidden');
      if (this.storeNavbarSlot) this.storeNavbarSlot.classList.remove('hidden');
    }

    // Update Pro Navigation Active Tabs
    document.querySelectorAll('.nav-tab').forEach(btn => {
      const target = btn.getAttribute('data-view');
      if (target === viewName) {
        btn.className = 'nav-tab px-3.5 py-1.5 rounded-xl font-bold text-xs bg-indigo-600 text-white shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5';
      } else {
        btn.className = 'nav-tab px-3.5 py-1.5 rounded-xl font-medium text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5';
      }
    });

    this.updateNavbar();
    this.renderCarousel();
    this.render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  handleLogout() {
    this.currentUser = null;
    localStorage.removeItem('returnradar_user_id');
    this.updateNavbar();
    showToast('You have been signed out. Please log in or select a demo profile.', 'info');
    this.switchView('login');
  }

  render() {
    if (!this.mainViewContainer) return;

    if (this.currentView === 'login') {
      renderLoginView(
        this.mainViewContainer,
        this.currentUser,
        {
          onLoginSuccess: async (user) => {
            this.currentUser = user;
            await this.loadOrders();
            await this.loadPurchases();
            this.updateNavbar();
            this.updateDeadlineBanner();
            this.switchView('store');
          },
          onLogout: () => this.handleLogout(),
          onNavigate: (view) => this.switchView(view)
        }
      );
    } else if (this.currentView === 'store') {
      renderStoreView(
        this.mainViewContainer,
        this.products,
        this.storeFilters,
        {
          onAddToCart: (prod) => this.addToCart(prod),
          onBuyNow: (prod) => this.buyNow(prod),
          onFilterChange: async (newFilters) => {
            this.storeFilters = { ...this.storeFilters, ...newFilters };
            await this.loadProducts();
            this.render();
          },
          onOpenDetail: (prod) => {
            renderProductDetailsModal(
              this.modalContainer,
              prod,
              (p) => this.addToCart(p),
              (p) => this.buyNow(p)
            );
          }
        }
      );
    } else if (this.currentView === 'cart') {
      renderCartView(
        this.mainViewContainer,
        this.cart,
        this.currentUser,
        {
          onUpdateQuantity: (productId, qty) => this.updateCartQuantity(productId, qty),
          onRemoveItem: (productId) => this.removeFromCart(productId),
          onProceedToCheckout: () => this.openCheckout(),
          onContinueShopping: () => this.switchView('store')
        }
      );
    } else if (this.currentView === 'orders') {
      renderOrdersView(
        this.mainViewContainer,
        this.ordersData,
        { orderTab: 'ALL' },
        {
          onPayOrder: (orderId) => this.quickPayOrder(orderId),
          onReturnOrder: (orderId, payload) => this.processReturnOrder(orderId, payload),
          onAdvanceStatus: (orderId) => this.advanceOrderStatus(orderId),
          onTrackInRadar: (purchaseId) => {
            this.switchView('radar');
            setTimeout(() => this.openDetail(purchaseId), 100);
          },
          onShopNow: () => this.switchView('store')
        }
      );
    } else if (this.currentView === 'radar') {
      renderRadarView(this.mainViewContainer, this.purchases, (id) => this.openDetail(id));
    } else if (this.currentView === 'kanban') {
      renderKanbanBoard(
        this.mainViewContainer,
        this.purchases,
        (id) => this.openDetail(id),
        (id, nextStatus) => this.quickAdvanceStatus(id, nextStatus)
      );
    } else if (this.currentView === 'table') {
      renderTableView(
        this.mainViewContainer,
        this.purchases,
        this.filters,
        (newFilters) => this.updateFilters(newFilters)
      );
    } else if (this.currentView === 'analytics') {
      renderAnalyticsView(this.mainViewContainer, this.analytics);
    } else if (this.currentView === 'retailers') {
      renderRetailersView(this.mainViewContainer, this.retailers, () => this.openAddRetailerModal());
    }
  }

  // --- Cart Actions ---
  addToCart(product) {
    const existing = this.cart.find(item => item.product_id === product.id);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      this.cart.push({
        product_id: product.id,
        title: product.title,
        price: product.price,
        original_mrp: product.original_mrp,
        discount_percent: product.discount_percent,
        image_url: product.image_url,
        return_policy_days: product.return_policy_days,
        return_policy_type: product.return_policy_type,
        category: product.category,
        quantity: 1
      });
    }

    this.saveCartToStorage();
    this.updateNavbar();
    showToast(`Added "${product.title.slice(0, 32)}..." to Cart! 🛒`, 'success');

    if (this.currentView === 'cart') {
      this.render();
    }
  }

  buyNow(product) {
    const existing = this.cart.find(item => item.product_id === product.id);
    if (!existing) {
      this.cart.push({
        product_id: product.id,
        title: product.title,
        price: product.price,
        original_mrp: product.original_mrp,
        discount_percent: product.discount_percent,
        image_url: product.image_url,
        return_policy_days: product.return_policy_days,
        return_policy_type: product.return_policy_type,
        category: product.category,
        quantity: 1
      });
      this.saveCartToStorage();
      this.updateNavbar();
    }

    this.openCheckout();
  }

  updateCartQuantity(productId, quantity) {
    const item = this.cart.find(i => i.product_id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.saveCartToStorage();
        this.updateNavbar();
        this.render();
      }
    }
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter(i => i.product_id !== productId);
    this.saveCartToStorage();
    this.updateNavbar();
    showToast('Item removed from cart', 'info');
    this.render();
  }

  clearCart() {
    this.cart = [];
    this.saveCartToStorage();
    this.updateNavbar();
  }

  // --- Checkout Flow ---
  openCheckout() {
    if (this.cart.length === 0) {
      showToast('Your cart is empty! Add items first.', 'warning');
      return;
    }

    renderCheckoutModal(
      this.modalContainer,
      this.cart,
      this.currentUser,
      async (orderPayload) => {
        try {
          const res = await api.createOrder(orderPayload);
          this.clearCart();
          await this.loadOrders();
          await this.loadPurchases();
          await this.loadNotifications();
          this.updateDeadlineBanner();

          showToast(res.message || 'Order placed successfully! 🎉', 'success');
          this.switchView('orders');
        } catch (err) {
          showToast(err.message, 'error');
        }
      }
    );
  }

  // --- Orders & Payment Deadlines ---
  async quickPayOrder(orderId) {
    try {
      const res = await api.payOrder(orderId);
      showToast(res.message || 'Payment completed! Order confirmed. ⚡', 'success');
      await this.loadOrders();
      await this.loadPurchases();
      await this.loadNotifications();
      this.updateDeadlineBanner();
      if (this.currentView === 'orders') this.render();
    } catch (err) {
      showToast('Payment failed: ' + err.message, 'error');
    }
  }

  async processReturnOrder(orderId, payload) {
    try {
      const res = await api.requestReturn(orderId, payload);
      showToast(res.message || 'Return request submitted successfully! 🔄', 'success');
      await this.loadOrders();
      await this.loadPurchases();
      await this.loadNotifications();
      if (this.currentView === 'orders') this.render();
    } catch (err) {
      showToast('Failed to request return: ' + err.message, 'error');
    }
  }

  async advanceOrderStatus(orderId) {
    try {
      await api.advanceOrderStatus(orderId);
      await this.loadOrders();
      await this.loadPurchases();
      this.updateDeadlineBanner();
      if (this.currentView === 'orders') this.render();
      showToast('Simulated order status advance! ⏩', 'info');
    } catch (err) {
      showToast('Failed to advance status: ' + err.message, 'error');
    }
  }

  openLoginModal() {
    this.switchView('login');
  }

  // --- ReturnRadar Original Logic ---
  async updateFilters(newFilters) {
    this.filters = { ...this.filters, ...newFilters };
    await this.loadPurchases();
    this.render();
  }

  async quickAdvanceStatus(id, nextStatus) {
    try {
      await api.updateStatus(id, {
        status: nextStatus,
        note: `Moved to ${nextStatus} via Kanban Pipeline`
      });
      showToast(`Status updated to ${nextStatus}`, 'success');
      await this.refreshAll();
    } catch (e) {
      showToast(e.message, 'error');
    }
  }

  async refreshAll() {
    await this.loadPurchases();
    await this.loadAnalytics();
    await this.loadNotifications();
    await this.loadOrders();
    this.updateDeadlineBanner();
    this.renderCarousel();
    this.render();
  }

  openAddModal(presetRetailer = null) {
    renderPurchaseModal(
      this.modalContainer,
      this.retailers,
      presetRetailer ? { retailer: presetRetailer } : null,
      async (data, id) => {
        try {
          if (id) {
            await api.updatePurchase(id, data);
            showToast('Purchase updated', 'success');
          } else {
            await api.createPurchase(data);
            showToast('New return deadline tracked!', 'success');
          }
          await this.refreshAll();
        } catch (e) {
          showToast(e.message, 'error');
        }
      }
    );
  }

  async openEditModal(id) {
    try {
      const p = await api.getPurchase(id);
      renderPurchaseModal(
        this.modalContainer,
        this.retailers,
        p,
        async (data) => {
          await api.updatePurchase(id, data);
          showToast('Changes saved', 'success');
          await this.refreshAll();
          this.openDetail(id);
        }
      );
    } catch (e) {
      showToast(e.message, 'error');
    }
  }

  async openDetail(id) {
    try {
      const p = await api.getPurchase(id);
      renderDetailDrawer(this.drawerContainer, p);
    } catch (e) {
      showToast(e.message, 'error');
    }
  }

  async openRefundModal(id) {
    try {
      const p = await api.getPurchase(id);
      renderRefundModal(this.modalContainer, p, async (pId, refundData) => {
        try {
          await api.recordRefund(pId, refundData);
          showToast('Refund recorded and reconciled', 'success');
          await this.refreshAll();
        } catch (e) {
          showToast(e.message, 'error');
        }
      });
    } catch (e) {
      showToast(e.message, 'error');
    }
  }

  async openDisputeModal(purchaseId) {
    await renderDisputeModal(this.modalContainer, purchaseId);
  }

  openAddRetailerModal() {
    this.openAddModal();
  }

  bindGlobalEvents() {
    // Navigation view pills
    document.querySelectorAll('.nav-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetView = btn.getAttribute('data-view');
        this.switchView(targetView);
      });
    });

    const proLogoBtn = document.getElementById('btn-pro-logo');
    if (proLogoBtn) {
      proLogoBtn.addEventListener('click', () => this.switchView('radar'));
    }

    // + Track Purchase button
    const addBtn = document.getElementById('btn-add-purchase');
    if (addBtn) addBtn.addEventListener('click', () => this.openAddModal());

    // Notifications panel
    const notifBtn = document.getElementById('btn-notifications');
    if (notifBtn) {
      notifBtn.addEventListener('click', () => {
        renderNotificationPanel(
          this.notifContainer,
          this.notificationsData,
          async (notifId) => {
            await api.markNotificationRead(notifId);
            await this.loadNotifications();
          },
          async () => {
            await api.markAllNotificationsRead();
            await this.loadNotifications();
          },
          (purchaseId) => {
            if (purchaseId) this.openDetail(purchaseId);
          }
        );
      });
    }

    // Seed / Reset demo data button
    const seedBtn = document.getElementById('btn-seed-data');
    if (seedBtn) {
      seedBtn.addEventListener('click', async () => {
        if (confirm('Reset database to pre-seeded demo state?')) {
          try {
            await api.seedData();
            showToast('Demo data reloaded!', 'success');
            await this.init();
          } catch (e) {
            showToast('Reset failed: ' + e.message, 'error');
          }
        }
      });
    }

    // Theme Toggle
    const themeBtn = document.getElementById('btn-theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        if (html.classList.contains('dark')) {
          html.classList.remove('dark');
          localStorage.setItem('returnradar_theme', 'light');
        } else {
          html.classList.add('dark');
          localStorage.setItem('returnradar_theme', 'dark');
        }
      });
    }

    // Listen to custom events from detailDrawer and components
    window.addEventListener('open-edit-modal', (e) => this.openEditModal(e.detail.id));
    window.addEventListener('open-refund-modal', (e) => this.openRefundModal(e.detail.id));
    window.addEventListener('open-dispute-modal', (e) => this.openDisputeModal(e.detail.id));
    window.addEventListener('purchase-updated', () => this.refreshAll());
    window.addEventListener('open-add-purchase', (e) => {
      this.openAddModal(e.detail ? e.detail.retailer : null);
    });
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.app = new ReturnRadarApp();
  window.app.init();
});
