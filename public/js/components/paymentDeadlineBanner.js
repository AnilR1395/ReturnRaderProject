// public/js/components/paymentDeadlineBanner.js - Live Ticking Payment Deadline Alert Banner
import { formatCurrency } from '../utils/helpers.js';

let timerInterval = null;

export function renderPaymentDeadlineBanner(container, pendingOrder, onPayNow, onViewOrder) {
  if (!container) return;

  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  if (!pendingOrder || pendingOrder.payment_status !== 'PENDING' || !pendingOrder.payment_deadline) {
    container.innerHTML = '';
    container.classList.add('hidden');
    return;
  }

  container.classList.remove('hidden');

  const deadlineDate = new Date(pendingOrder.payment_deadline);

  const updateCountdown = () => {
    const now = new Date();
    const diffMs = deadlineDate.getTime() - now.getTime();

    if (diffMs <= 0) {
      if (timerInterval) clearInterval(timerInterval);
      const countdownEl = container.querySelector('#deadline-countdown-display');
      if (countdownEl) countdownEl.textContent = 'EXPIRED';
      return;
    }

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diffMs % (1000 * 60)) / 1000);

    const pad = (n) => n.toString().padStart(2, '0');
    const countdownEl = container.querySelector('#deadline-countdown-display');
    if (countdownEl) {
      countdownEl.textContent = `${pad(hours)}h : ${pad(mins)}m : ${pad(secs)}s`;
    }
  };

  container.innerHTML = `
    <div class="bg-gradient-to-r from-rose-600 via-amber-600 to-rose-600 text-white shadow-lg border-b border-rose-400/30">
      <div class="max-w-7xl mx-auto px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        
        <!-- Left: Warning & Ticking Countdown -->
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-lg animate-pulse shrink-0">
            ⏰
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-black uppercase tracking-wider text-[11px] bg-rose-950/40 px-2 py-0.5 rounded border border-white/20">
                Payment Deadline Alert
              </span>
              <span class="font-bold text-slate-100">Order #${pendingOrder.order_number}</span>
              <span class="text-white/80">•</span>
              <span class="font-black font-mono text-amber-200 text-xs sm:text-sm bg-black/30 px-2 py-0.5 rounded" id="deadline-countdown-display">
                Loading...
              </span>
            </div>
            <p class="text-[11px] text-amber-100 pt-0.5">
              Complete payment before timer expires to reserve inventory &amp; activate 7-day return guarantee.
            </p>
          </div>
        </div>

        <!-- Right: Action Buttons -->
        <div class="flex items-center gap-2 shrink-0">
          <button id="banner-view-order-btn" class="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 font-bold text-white text-[11px] border border-white/20 transition-colors">
            View Details
          </button>
          <button id="banner-pay-btn" class="px-4 py-1.5 rounded-lg bg-white hover:bg-amber-50 text-rose-700 font-black text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5">
            <span>⚡</span>
            <span>Pay ${formatCurrency(pendingOrder.total_amount)} Now</span>
          </button>
        </div>

      </div>
    </div>
  `;

  updateCountdown();
  timerInterval = setInterval(updateCountdown, 1000);

  const payBtn = container.querySelector('#banner-pay-btn');
  if (payBtn) {
    payBtn.addEventListener('click', () => {
      if (onPayNow) onPayNow(pendingOrder.id);
    });
  }

  const viewBtn = container.querySelector('#banner-view-order-btn');
  if (viewBtn) {
    viewBtn.addEventListener('click', () => {
      if (onViewOrder) onViewOrder(pendingOrder.id);
    });
  }
}
