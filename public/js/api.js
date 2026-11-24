// public/js/api.js - Frontend HTTP Client for ReturnRadar REST API

const API_BASE = '/api';

export const api = {
  async getPurchases(params = {}) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        qs.append(k, v);
      }
    });
    const url = `${API_BASE}/purchases${qs.toString() ? '?' + qs.toString() : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch purchases: ${res.statusText}`);
    return res.json();
  },

  async getPurchase(id) {
    const res = await fetch(`${API_BASE}/purchases/${id}`);
    if (!res.ok) throw new Error(`Purchase ${id} not found`);
    return res.json();
  },

  async createPurchase(purchaseData) {
    const res = await fetch(`${API_BASE}/purchases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(purchaseData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create purchase');
    }
    return res.json();
  },

  async updatePurchase(id, purchaseData) {
    const res = await fetch(`${API_BASE}/purchases/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(purchaseData)
    });
    if (!res.ok) throw new Error('Failed to update purchase');
    return res.json();
  },

  async deletePurchase(id) {
    const res = await fetch(`${API_BASE}/purchases/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete purchase');
    return res.json();
  },

  async updateStatus(id, { status, note, carrier, tracking_number }) {
    const res = await fetch(`${API_BASE}/purchases/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note, carrier, tracking_number })
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
  },

  async recordRefund(id, refundData) {
    const res = await fetch(`${API_BASE}/purchases/${id}/refund`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(refundData)
    });
    if (!res.ok) throw new Error('Failed to record refund');
    return res.json();
  },

  async getRetailers() {
    const res = await fetch(`${API_BASE}/retailers`);
    if (!res.ok) throw new Error('Failed to fetch retailers');
    return res.json();
  },

  async createRetailer(retailerData) {
    const res = await fetch(`${API_BASE}/retailers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(retailerData)
    });
    if (!res.ok) throw new Error('Failed to save retailer');
    return res.json();
  },

  async getAnalytics() {
    const res = await fetch(`${API_BASE}/analytics`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  async getNotifications() {
    const res = await fetch(`${API_BASE}/notifications`);
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },

  async markNotificationRead(id) {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, { method: 'POST' });
    return res.json();
  },

  async markAllNotificationsRead() {
    const res = await fetch(`${API_BASE}/notifications/mark-all-read`, { method: 'POST' });
    return res.json();
  },

  async getDisputeTemplates() {
    const res = await fetch(`${API_BASE}/dispute-templates`);
    if (!res.ok) throw new Error('Failed to fetch dispute templates');
    return res.json();
  },

  async generateDispute(payload) {
    const res = await fetch(`${API_BASE}/dispute-generator`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to generate dispute');
    return res.json();
  },

  async uploadReceipt(fileOrBase64) {
    let payload;
    let headers = {};

    if (typeof fileOrBase64 === 'string') {
      // base64
      payload = JSON.stringify({ image_base64: fileOrBase64 });
      headers['Content-Type'] = 'application/json';
    } else {
      // FormData
      const formData = new FormData();
      formData.append('file', fileOrBase64);
      payload = formData;
    }

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers,
      body: payload
    });
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  },

  async seedData() {
    const res = await fetch(`${API_BASE}/seed`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to seed data');
    return res.json();
  },

  // --- Flipkart Store & Auth API ---
  getAuthHeaders() {
    const userId = localStorage.getItem('returnradar_user_id') || 'usr-rahul';
    return {
      'Content-Type': 'application/json',
      'x-user-id': userId
    };
  },

  async getCurrentUser() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  },

  async loginUser(credentials) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  async registerUser(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  async getDemoUsers() {
    const res = await fetch(`${API_BASE}/auth/users`);
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  async getProducts(params = {}) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        qs.append(k, v);
      }
    });
    const url = `${API_BASE}/products${qs.toString() ? '?' + qs.toString() : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async getProduct(id) {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json();
  },

  async getOrders() {
    const res = await fetch(`${API_BASE}/orders`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  async getOrder(id) {
    const res = await fetch(`${API_BASE}/orders/${id}`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error('Order not found');
    return res.json();
  },

  async createOrder(orderPayload) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(orderPayload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to place order');
    }
    return res.json();
  },

  async payOrder(orderId) {
    const res = await fetch(`${API_BASE}/orders/${orderId}/pay`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to complete payment');
    }
    return res.json();
  },

  async requestReturn(orderId, returnPayload) {
    const res = await fetch(`${API_BASE}/orders/${orderId}/return`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(returnPayload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to submit return request');
    }
    return res.json();
  },

  async advanceOrderStatus(orderId, targetStatus) {
    const res = await fetch(`${API_BASE}/orders/${orderId}/advance-status`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ targetStatus })
    });
    return res.json();
  }
};
