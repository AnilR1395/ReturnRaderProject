// public/js/components/disputeModal.js - Customer service dispute & demand generator
import { escapeHtml, showToast } from '../utils/helpers.js';
import { api } from '../api.js';

export async function renderDisputeModal(container, purchaseId) {
  container.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div class="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl p-6 text-center text-slate-400">
        Loading dispute generator...
      </div>
    </div>
  `;

  try {
    const templatesData = await api.getDisputeTemplates();
    const templates = templatesData.templates || [];

    // Initial dispute generation
    const genData = await api.generateDispute({
      purchase_id: purchaseId,
      customer_name: 'Valued Shopper'
    });

    renderContent(container, templates, genData, purchaseId);
  } catch (err) {
    showToast(err.message, 'error');
    container.innerHTML = '';
  }
}

function renderContent(container, templates, genData, purchaseId) {
  container.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div class="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8 transform transition-all">
        
        <!-- Header -->
        <div class="px-6 py-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-rose-400 text-lg">⚖️</span>
            <div>
              <h3 class="text-sm font-bold text-white">Dispute &amp; Refund Demand Letter Generator</h3>
              <div class="text-[11px] text-slate-400 font-mono">Retailer: ${escapeHtml(genData.retailer)} • Order #${escapeHtml(genData.order_number || 'N/A')}</div>
            </div>
          </div>
          <button id="dispute-close-btn" class="text-slate-400 hover:text-white font-bold text-base">✕</button>
        </div>

        <!-- Body -->
        <div class="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          <!-- Template Selector & Customer Name -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block font-semibold text-slate-300 mb-1">Dispute Template</label>
              <select id="sel-template" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500">
                ${templates.map(t => `
                  <option value="${t.id}" ${t.id === genData.template_id ? 'selected' : ''}>
                    ${escapeHtml(t.title)}
                  </option>
                `).join('')}
              </select>
            </div>

            <div>
              <label class="block font-semibold text-slate-300 mb-1">Your Full Name (Sign-off)</label>
              <input type="text" id="inp-cust-name" value="Valued Shopper"
                     class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"/>
            </div>
          </div>

          <!-- Subject Line -->
          <div>
            <label class="block font-semibold text-slate-300 mb-1">Subject Line</label>
            <input type="text" id="inp-subject" value="${escapeHtml(genData.subject)}"
                   class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"/>
          </div>

          <!-- Letter Body Preview -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="font-semibold text-slate-300">Formal Inquiry Letter</label>
              <span class="text-[10px] text-slate-400 font-mono">Editable</span>
            </div>
            <textarea id="txt-body" rows="11"
                      class="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-rose-500">${escapeHtml(genData.body)}</textarea>
          </div>

          <!-- Quick Actions -->
          <div class="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between flex-wrap gap-2">
            <span class="text-[11px] text-slate-400">
              💡 Tip: Send to retailer customer chat, email support, or save as evidence for bank dispute.
            </span>
            <div class="flex items-center gap-2">
              <button id="btn-copy-letter" class="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors flex items-center gap-1.5">
                <span>📋 Copy to Clipboard</span>
              </button>
              <button id="btn-email-letter" class="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold transition-colors flex items-center gap-1.5">
                <span>✉️ Open Mail Client</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  `;

  const close = () => container.innerHTML = '';
  container.querySelector('#dispute-close-btn').addEventListener('click', close);

  // Template switch
  const selTmpl = container.querySelector('#sel-template');
  const custNameInp = container.querySelector('#inp-cust-name');
  const subjInp = container.querySelector('#inp-subject');
  const bodyTxt = container.querySelector('#txt-body');

  async function refreshDispute() {
    try {
      const updated = await api.generateDispute({
        purchase_id: purchaseId,
        template_id: selTmpl.value,
        customer_name: custNameInp.value.trim()
      });
      subjInp.value = updated.subject;
      bodyTxt.value = updated.body;
    } catch (e) {
      showToast(e.message, 'error');
    }
  }

  selTmpl.addEventListener('change', refreshDispute);
  custNameInp.addEventListener('blur', refreshDispute);

  // Copy button
  container.querySelector('#btn-copy-letter').addEventListener('click', () => {
    const textToCopy = `Subject: ${subjInp.value}\n\n${bodyTxt.value}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast('Dispute letter copied to clipboard!', 'success');
    }).catch(() => {
      showToast('Please copy manually', 'info');
    });
  });

  // Mailto button
  container.querySelector('#btn-email-letter').addEventListener('click', () => {
    const mailto = `mailto:support@retailer.com?subject=${encodeURIComponent(subjInp.value)}&body=${encodeURIComponent(bodyTxt.value)}`;
    window.open(mailto, '_blank');
  });
}
