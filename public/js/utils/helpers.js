// public/js/utils/helpers.js - Formatting, dates, relative time, currency & alerts

export const REFERENCE_DATE = '2026-11-20';

export function formatCurrency(amount, currency = 'USD') {
  if (amount === null || amount === undefined || isNaN(amount)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const [y, m, d] = dateStr.split('-');
    if (y && m && d) {
      const date = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return dateStr;
  } catch (e) {
    return dateStr;
  }
}

export function calculateDaysRemaining(deadlineStr) {
  if (!deadlineStr) return null;
  const [dy, dm, dd] = deadlineStr.split('-').map(Number);
  const [ry, rm, rd] = REFERENCE_DATE.split('-').map(Number);

  const deadline = new Date(dy, dm - 1, dd, 23, 59, 59);
  const ref = new Date(ry, rm - 1, rd, 0, 0, 0);

  const diffMs = deadline.getTime() - ref.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function getUrgencyBadge(urgencyLevel, daysRemaining, status) {
  if (status === 'REFUNDED') {
    return {
      text: 'Refunded',
      bgClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      dotClass: 'bg-emerald-400',
      icon: 'check-circle'
    };
  }
  if (status === 'KEEP') {
    return {
      text: 'Keeping',
      bgClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      dotClass: 'bg-blue-400',
      icon: 'shield-check'
    };
  }
  if (status === 'DISPUTED') {
    return {
      text: 'Disputed',
      bgClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30 font-semibold animate-pulse',
      dotClass: 'bg-rose-500',
      icon: 'alert-triangle'
    };
  }
  if (['DROPPED_OFF', 'DELIVERED_TO_SELLER', 'REFUND_PENDING'].includes(status)) {
    return {
      text: 'In Refund Pipeline',
      bgClass: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      dotClass: 'bg-purple-400',
      icon: 'truck'
    };
  }

  if (urgencyLevel === 'EXPIRED' || (daysRemaining !== null && daysRemaining < 0)) {
    return {
      text: 'Expired',
      bgClass: 'bg-zinc-700/20 text-zinc-400 border-zinc-600/30',
      dotClass: 'bg-zinc-500',
      icon: 'clock'
    };
  }
  if (urgencyLevel === 'CRITICAL' || (daysRemaining !== null && daysRemaining <= 2)) {
    const text = daysRemaining <= 0 ? 'Expires Today!' : `${daysRemaining}d Left (Critical)`;
    return {
      text,
      bgClass: 'bg-red-500/20 text-red-400 border-red-500/30 font-semibold shadow-sm shadow-red-500/20 animate-pulse',
      dotClass: 'bg-red-500',
      icon: 'alert-circle'
    };
  }
  if (urgencyLevel === 'WARNING' || (daysRemaining !== null && daysRemaining <= 7)) {
    return {
      text: `${daysRemaining}d Left (Soon)`,
      bgClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      dotClass: 'bg-amber-400',
      icon: 'clock'
    };
  }

  return {
    text: `${daysRemaining}d Left (Safe)`,
    bgClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    dotClass: 'bg-emerald-400',
    icon: 'calendar'
  };
}

export function getStatusLabel(status) {
  const map = {
    CONSIDERING: { label: 'Considering / Trial', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    INITIATED: { label: 'Return Initiated', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    DROPPED_OFF: { label: 'Dropped Off / Carrier', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
    DELIVERED_TO_SELLER: { label: 'Delivered to Seller', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    REFUND_PENDING: { label: 'Refund Pending', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
    REFUNDED: { label: 'Refund Received', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    KEEP: { label: 'Decided to Keep', color: 'text-zinc-300 bg-zinc-700/30 border-zinc-600/30' },
    EXPIRED: { label: 'Window Expired', color: 'text-zinc-500 bg-zinc-800/40 border-zinc-700/40' },
    DISPUTED: { label: 'Dispute / Discrepancy', color: 'text-rose-400 bg-rose-500/15 border-rose-500/30' }
  };
  return map[status] || { label: status, color: 'text-zinc-400 bg-zinc-800 border-zinc-700' };
}

export function getCarrierTrackingUrl(carrier, trackingNumber) {
  if (!trackingNumber) return null;
  const c = (carrier || '').toUpperCase();
  if (c.includes('UPS')) {
    return `https://www.ups.com/track?tracknum=${encodeURIComponent(trackingNumber)}`;
  }
  if (c.includes('FEDEX')) {
    return `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(trackingNumber)}`;
  }
  if (c.includes('USPS')) {
    return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodeURIComponent(trackingNumber)}`;
  }
  if (c.includes('DHL')) {
    return `https://www.dhl.com/en/express/tracking.html?AWB=${encodeURIComponent(trackingNumber)}`;
  }
  return `https://www.google.com/search?q=${encodeURIComponent(`${carrier || ''} tracking ${trackingNumber}`)}`;
}

export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const typeStyles = {
    success: 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40 shadow-emerald-950/50',
    error: 'bg-rose-950/90 text-rose-200 border-rose-500/40 shadow-rose-950/50',
    warning: 'bg-amber-950/90 text-amber-200 border-amber-500/40 shadow-amber-950/50',
    info: 'bg-slate-900/90 text-slate-200 border-slate-700 shadow-slate-950/50'
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-lg transform transition-all duration-300 translate-y-4 opacity-0 pointer-events-auto ${typeStyles[type] || typeStyles.info}`;
  toast.innerHTML = `
    <span class="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 font-bold text-xs">${icons[type] || 'ℹ'}</span>
    <span class="text-sm font-medium pr-2">${escapeHtml(message)}</span>
    <button class="ml-auto text-xs text-zinc-400 hover:text-white" onclick="this.parentElement.remove()">✕</button>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
