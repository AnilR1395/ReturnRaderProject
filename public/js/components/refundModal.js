// public/js/components/refundModal.js - Record refund credit & reconciliation
import { formatCurrency, escapeHtml } from '../utils/helpers.js';

export function renderRefundModal(container, purchase, onConfirmRefund) {
  const expected = purchase.expected_refund_amount || purchase.price;

  container.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div class="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl transform transition-all">
        
        <div class="px-5 py-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-emerald-400 text-lg">💰</span>
            <h3 class="text-sm font-bold text-white">Record Received Refund Credit</h3>
          </div>
          <button id="refund-modal-close" class="text-slate-400 hover:text-white font-bold">✕</button>
        </div>

        <form id="refund-form" class="p-5 space-y-4 text-xs">
          <div>
            <div class="text-slate-400 mb-1">Item to Reconcile:</div>
            <div class="font-bold text-white text-sm">${escapeHtml(purchase.product_name)}</div>
            <div class="text-slate-400 text-[11px] font-mono">${escapeHtml(purchase.retailer)} • Expected: ${formatCurrency(expected)}</div>
          </div>

          <div>
            <label class="block font-semibold text-slate-300 mb-1">Actual Refund Amount Credited ($) *</label>
            <input type="number" step="0.01" min="0" id="inp-actual-amount" required value="${expected.toFixed(2)}"
                   class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
          </div>

          <!-- Discrepancy indicator box -->
          <div id="discrepancy-box" class="hidden p-3 rounded-xl border">
            <!-- Dynamic calculation -->
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-300 mb-1">Date Received *</label>
              <input type="date" id="inp-refund-date" required value="2026-11-20"
                     class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
            </div>

            <div>
              <label class="block font-semibold text-slate-300 mb-1">Refund Method</label>
              <select id="inp-refund-method" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="Original Payment">Original Payment</option>
                <option value="Store Credit">Store Credit / Gift Card</option>
                <option value="PayPal">PayPal</option>
                <option value="Check">Check</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-300 mb-1">Reconciliation Notes</label>
            <textarea id="inp-refund-note" rows="2" placeholder="e.g. Credited to Visa ending in 4092..."
                      class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
          </div>

          <div class="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button type="button" id="refund-modal-cancel" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors">
              Cancel
            </button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-600/30">
              Confirm &amp; Resolve ✓
            </button>
          </div>
        </form>

      </div>
    </div>
  `;

  const amountInp = container.querySelector('#inp-actual-amount');
  const discBox = container.querySelector('#discrepancy-box');

  function checkDiscrepancy() {
    const val = parseFloat(amountInp.value) || 0;
    const diff = val - expected;

    if (diff < -0.5) {
      discBox.className = 'p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-xs text-rose-200 block';
      discBox.innerHTML = `
        <div class="font-bold text-rose-300">⚠️ Discrepancy Alert: -${formatCurrency(Math.abs(diff))}</div>
        <div class="text-[11px] text-rose-200/90 mt-0.5">
          You are receiving less than expected. Status will automatically be flagged as <strong>DISPUTED</strong> for further customer service follow-up.
        </div>
      `;
    } else if (diff > 0.5) {
      discBox.className = 'p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-xs text-emerald-200 block';
      discBox.innerHTML = `<div class="font-bold text-emerald-300">🎉 Bonus: +${formatCurrency(diff)} over expected!</div>`;
    } else {
      discBox.className = 'hidden';
    }
  }

  amountInp.addEventListener('input', checkDiscrepancy);
  checkDiscrepancy();

  const close = () => container.innerHTML = '';
  container.querySelector('#refund-modal-close').addEventListener('click', close);
  container.querySelector('#refund-modal-cancel').addEventListener('click', close);

  container.querySelector('#refund-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const actual = parseFloat(amountInp.value) || 0;
    const date = container.querySelector('#inp-refund-date').value;
    const method = container.querySelector('#inp-refund-method').value;
    const note = container.querySelector('#inp-refund-note').value.trim();

    onConfirmRefund(purchase.id, {
      actual_refund_amount: actual,
      refund_received_date: date,
      refund_method: method,
      note
    });
    close();
  });
}
