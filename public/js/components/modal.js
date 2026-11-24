// public/js/components/modal.js - Smart Purchase Add/Edit Wizard with Product Image Selection
import { escapeHtml, calculateDaysRemaining, formatDate } from '../utils/helpers.js';

const PRESET_IMAGES = [
  { label: 'AirPods Max', url: '/images/products/airpods_max.svg' },
  { label: 'Sony Alpha Camera', url: '/images/products/sony_camera.svg' },
  { label: 'Zara Blazer', url: '/images/products/zara_blazer.svg' },
  { label: 'Nike Pegasus', url: '/images/products/nike_pegasus.svg' },
  { label: 'Anker Power Bank', url: '/images/products/anker_powerbank.svg' },
  { label: 'Sephora Perfume', url: '/images/products/sephora_perfume.svg' },
  { label: 'ASOS Puffer', url: '/images/products/asos_puffer.svg' },
  { label: 'Dell 4K Monitor', url: '/images/products/dell_monitor.svg' },
  { label: 'Bose QC Earbuds', url: '/images/products/bose_earbuds.svg' },
  { label: 'Patagonia Jacket', url: '/images/products/patagonia_jacket.svg' },
  { label: 'Dyson Vacuum', url: '/images/products/dyson_vacuum.svg' },
  { label: 'Logitech Mouse', url: '/images/products/logitech_mouse.svg' }
];

export function renderPurchaseModal(modalContainer, retailers, existingPurchase = null, onSave) {
  const isEdit = !!existingPurchase;
  const p = existingPurchase || {};
  let currentProductImage = p.image_url || '/images/products/airpods_max.svg';

  modalContainer.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div class="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8 transform transition-all">
        
        <!-- Modal Header -->
        <div class="px-6 py-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-lg">${isEdit ? '✏️' : '➕'}</span>
            <h3 class="text-base font-bold text-white">
              ${isEdit ? 'Edit Tracked Purchase' : 'Track New Purchase Return Window'}
            </h3>
          </div>
          <button id="modal-close-btn" class="text-slate-400 hover:text-white text-lg font-bold">✕</button>
        </div>

        <!-- Modal Form -->
        <form id="purchase-form" class="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          
          <!-- Product Image & Live Preview Strip -->
          <div class="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center gap-4">
            <div class="w-16 h-16 rounded-xl bg-slate-900 border border-slate-700 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden shadow-inner">
              <img id="modal-product-preview-img" src="${currentProductImage}" alt="Product preview" class="w-full h-full object-contain"/>
            </div>
            <div class="flex-1 min-w-0">
              <label class="block text-[11px] font-bold uppercase text-slate-300 font-mono mb-1">Product Showcase Image</label>
              <div class="flex flex-wrap items-center gap-1.5" id="preset-image-chips">
                ${PRESET_IMAGES.slice(0, 6).map(pi => `
                  <button type="button" class="preset-img-btn px-2 py-0.5 rounded-md text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors" data-url="${pi.url}">
                    ${pi.label}
                  </button>
                `).join('')}
              </div>
              <input type="hidden" id="inp-product-image" value="${currentProductImage}"/>
            </div>
          </div>

          <!-- Product Name & Retailer -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Product Name *</label>
              <input type="text" id="inp-product-name" required value="${escapeHtml(p.product_name || '')}"
                     placeholder="e.g. Sony WH-1000XM5 Headphones"
                     class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Retailer / Store *</label>
              <div class="relative">
                <input type="text" id="inp-retailer" required list="retailers-datalist" value="${escapeHtml(p.retailer || '')}"
                       placeholder="Select or type store (e.g. Apple, Best Buy)"
                       class="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                <div class="absolute left-2 top-2 w-5 h-5 flex items-center justify-center">
                  <img id="modal-retailer-logo" src="${p.retailer_logo || '/images/retailers/apple.svg'}" alt="" class="w-4 h-4 object-contain opacity-75"/>
                </div>
              </div>
              <datalist id="retailers-datalist">
                ${retailers.map(r => `<option value="${escapeHtml(r.name)}">${r.return_days} days policy</option>`).join('')}
              </datalist>
            </div>
          </div>

          <!-- Retailer Policy Hint Banner -->
          <div id="retailer-policy-hint" class="hidden p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200">
            <!-- Dynamically populated -->
          </div>

          <!-- Price & Order Number -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Purchase Price ($) *</label>
              <input type="number" step="0.01" min="0" id="inp-price" required value="${p.price !== undefined ? p.price : ''}"
                     placeholder="0.00"
                     class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"/>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Order / Receipt Number</label>
              <input type="text" id="inp-order-number" value="${escapeHtml(p.order_number || '')}"
                     placeholder="e.g. BBY01-998822"
                     class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"/>
            </div>
          </div>

          <!-- Purchase Date, Delivery Date & Policy Days -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Purchase Date *</label>
              <input type="date" id="inp-purchase-date" required value="${p.purchase_date || '2026-11-20'}"
                     class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Delivery Date</label>
              <input type="date" id="inp-delivery-date" value="${p.delivery_date || ''}"
                     class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Policy Window (Days)</label>
              <input type="number" min="1" id="inp-policy-days" value="${p.return_policy_days || 30}"
                     class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"/>
            </div>
          </div>

          <!-- Auto-Calculated Return Deadline Box -->
          <div class="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <div class="text-[11px] uppercase font-mono font-bold text-slate-400">Calculated Return Deadline</div>
              <div id="deadline-preview-text" class="text-sm font-bold text-white font-mono mt-0.5">
                Calculating...
              </div>
            </div>
            <div id="deadline-urgency-badge" class="px-2.5 py-1 rounded-full text-xs font-bold">
              --
            </div>
          </div>

          <!-- Category & Payment Method -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select id="inp-category" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="Electronics" ${p.category === 'Electronics' ? 'selected' : ''}>Electronics</option>
                <option value="Clothing & Apparel" ${p.category === 'Clothing & Apparel' ? 'selected' : ''}>Clothing &amp; Apparel</option>
                <option value="Footwear" ${p.category === 'Footwear' ? 'selected' : ''}>Footwear</option>
                <option value="Home & Kitchen" ${p.category === 'Home & Kitchen' ? 'selected' : ''}>Home &amp; Kitchen</option>
                <option value="Beauty & Health" ${p.category === 'Beauty & Health' ? 'selected' : ''}>Beauty &amp; Health</option>
                <option value="Sports & Outdoors" ${p.category === 'Sports & Outdoors' ? 'selected' : ''}>Sports &amp; Outdoors</option>
                <option value="Other" ${!p.category || p.category === 'Other' ? 'selected' : ''}>Other</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Payment Method</label>
              <select id="inp-payment-method" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="Credit Card (Visa)" ${p.payment_method?.includes('Visa') ? 'selected' : ''}>Credit Card (Visa)</option>
                <option value="Credit Card (Mastercard)" ${p.payment_method?.includes('Mastercard') ? 'selected' : ''}>Credit Card (Mastercard)</option>
                <option value="Credit Card (Amex)" ${p.payment_method?.includes('Amex') ? 'selected' : ''}>Credit Card (Amex)</option>
                <option value="Apple Pay" ${p.payment_method === 'Apple Pay' ? 'selected' : ''}>Apple Pay</option>
                <option value="PayPal" ${p.payment_method === 'PayPal' ? 'selected' : ''}>PayPal</option>
                <option value="Debit Card" ${p.payment_method === 'Debit Card' ? 'selected' : ''}>Debit Card</option>
                <option value="Store Credit / Gift Card" ${p.payment_method === 'Store Credit / Gift Card' ? 'selected' : ''}>Store Credit / Gift Card</option>
              </select>
            </div>
          </div>

          <!-- Return Details: Reason, Carrier & Tracking -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Return Reason</label>
              <select id="inp-return-reason" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">(None / Undecided)</option>
                <option value="Wrong Size/Fit" ${p.return_reason === 'Wrong Size/Fit' ? 'selected' : ''}>Wrong Size/Fit</option>
                <option value="Defective" ${p.return_reason === 'Defective' ? 'selected' : ''}>Defective / Broken</option>
                <option value="Found Better Price" ${p.return_reason === 'Found Better Price' ? 'selected' : ''}>Found Better Price</option>
                <option value="Changed Mind" ${p.return_reason === 'Changed Mind' ? 'selected' : ''}>Changed Mind</option>
                <option value="Not as Pictured" ${p.return_reason === 'Not as Pictured' ? 'selected' : ''}>Not as Pictured</option>
                <option value="Late Arrival" ${p.return_reason === 'Late Arrival' ? 'selected' : ''}>Late Arrival</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Return Carrier</label>
              <select id="inp-carrier" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="UPS" ${p.return_carrier === 'UPS' ? 'selected' : ''}>UPS</option>
                <option value="FedEx" ${p.return_carrier === 'FedEx' ? 'selected' : ''}>FedEx</option>
                <option value="USPS" ${p.return_carrier === 'USPS' ? 'selected' : ''}>USPS</option>
                <option value="In-Store" ${p.return_carrier === 'In-Store' ? 'selected' : ''}>In-Store Drop-off</option>
                <option value="DHL" ${p.return_carrier === 'DHL' ? 'selected' : ''}>DHL</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Return Tracking #</label>
              <input type="text" id="inp-tracking" value="${escapeHtml(p.return_tracking_number || '')}"
                     placeholder="e.g. 1Z999999..."
                     class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"/>
            </div>
          </div>

          <!-- Receipt Upload & Preview -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Digital Receipt / Drop-off Slip</label>
            <div class="flex items-center gap-3">
              <input type="file" id="inp-receipt-file" accept="image/*" class="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-indigo-300 hover:file:bg-slate-700 cursor-pointer"/>
              <input type="hidden" id="inp-receipt-url" value="${escapeHtml(p.receipt_url || '')}"/>
            </div>
            <div id="receipt-upload-preview" class="mt-2 ${p.receipt_url ? '' : 'hidden'} flex items-center gap-3 p-2 rounded-xl bg-slate-800/60 border border-slate-700">
              <img id="receipt-thumb" src="${p.receipt_url || ''}" alt="Receipt Thumbnail" class="w-12 h-14 object-cover rounded bg-white border border-slate-700"/>
              <span class="text-xs text-slate-300 font-mono">Receipt image attached</span>
            </div>
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Notes &amp; Reminders</label>
            <textarea id="inp-notes" rows="2" placeholder="e.g. Keep original box, test noise cancelling over weekend..."
                      class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">${escapeHtml(p.notes || '')}</textarea>
          </div>

          <!-- Action Buttons -->
          <div class="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button type="button" id="modal-cancel-btn" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors">
              Cancel
            </button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all">
              ${isEdit ? 'Save Changes' : 'Start Tracking Return'}
            </button>
          </div>
        </form>

      </div>
    </div>
  `;

  // Hook elements
  const retailerInp = modalContainer.querySelector('#inp-retailer');
  const policyDaysInp = modalContainer.querySelector('#inp-policy-days');
  const purchaseDateInp = modalContainer.querySelector('#inp-purchase-date');
  const deliveryDateInp = modalContainer.querySelector('#inp-delivery-date');
  const deadlineText = modalContainer.querySelector('#deadline-preview-text');
  const deadlineBadge = modalContainer.querySelector('#deadline-urgency-badge');
  const hintBox = modalContainer.querySelector('#retailer-policy-hint');
  const receiptFileInput = modalContainer.querySelector('#inp-receipt-file');
  const receiptUrlInput = modalContainer.querySelector('#inp-receipt-url');
  const receiptPreview = modalContainer.querySelector('#receipt-upload-preview');
  const receiptThumb = modalContainer.querySelector('#receipt-thumb');
  const productImgInput = modalContainer.querySelector('#inp-product-image');
  const productPreviewImg = modalContainer.querySelector('#modal-product-preview-img');
  const retailerLogoImg = modalContainer.querySelector('#modal-retailer-logo');

  // Preset image chips selection
  modalContainer.querySelectorAll('.preset-img-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.getAttribute('data-url');
      productImgInput.value = url;
      productPreviewImg.src = url;
    });
  });

  // Retailer auto-fill policy logic
  function checkRetailerMatch(name) {
    const clean = name.trim().toLowerCase();
    const matched = retailers.find(r => r.name.toLowerCase() === clean);
    const cleanSlug = clean.replace(/[^a-z0-9]/g, '');
    retailerLogoImg.src = `/images/retailers/${cleanSlug}.svg`;

    if (matched) {
      if (!isEdit || policyDaysInp.value === '30') {
        policyDaysInp.value = matched.return_days;
      }
      hintBox.classList.remove('hidden');
      hintBox.innerHTML = `
        <div class="flex items-start gap-2">
          <span>💡</span>
          <div>
            <strong>${escapeHtml(matched.name)} Policy Preset:</strong> ${matched.return_days} days.
            ${matched.restocking_fee_note ? `<br/><span class="text-amber-300">⚠️ ${escapeHtml(matched.restocking_fee_note)}</span>` : ''}
            ${matched.return_shipping_fee > 0 ? `<br/><span class="text-amber-300">🏷️ Return fee: $${matched.return_shipping_fee.toFixed(2)}</span>` : ''}
          </div>
        </div>
      `;
    } else {
      hintBox.classList.add('hidden');
    }
    updateDeadlineCalculation();
  }

  function updateDeadlineCalculation() {
    const baseDateStr = deliveryDateInp.value || purchaseDateInp.value;
    const days = parseInt(policyDaysInp.value, 10) || 30;

    if (!baseDateStr) return;

    const [y, m, d] = baseDateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + days);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const calculatedDeadline = `${year}-${month}-${day}`;

    const daysRemaining = calculateDaysRemaining(calculatedDeadline);
    deadlineText.textContent = `${formatDate(calculatedDeadline)} (${daysRemaining} days remaining)`;

    if (daysRemaining <= 2) {
      deadlineBadge.className = 'px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/30';
      deadlineBadge.textContent = '🚨 Critical (<48h)';
    } else if (daysRemaining <= 7) {
      deadlineBadge.className = 'px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30';
      deadlineBadge.textContent = '⚡ Expiring Soon';
    } else {
      deadlineBadge.className = 'px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
      deadlineBadge.textContent = '🟢 Safe Window';
    }

    return calculatedDeadline;
  }

  retailerInp.addEventListener('input', (e) => checkRetailerMatch(e.target.value));
  policyDaysInp.addEventListener('input', updateDeadlineCalculation);
  purchaseDateInp.addEventListener('input', updateDeadlineCalculation);
  deliveryDateInp.addEventListener('input', updateDeadlineCalculation);

  // File upload reader
  receiptFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        receiptUrlInput.value = event.target.result;
        receiptThumb.src = event.target.result;
        receiptPreview.classList.remove('hidden');
      };
      reader.readAsDataURL(file);
    }
  });

  // Initial calculation
  if (retailerInp.value) checkRetailerMatch(retailerInp.value);
  updateDeadlineCalculation();

  // Close handlers
  const closeModal = () => modalContainer.innerHTML = '';
  modalContainer.querySelector('#modal-close-btn').addEventListener('click', closeModal);
  modalContainer.querySelector('#modal-cancel-btn').addEventListener('click', closeModal);

  // Submit handler
  modalContainer.querySelector('#purchase-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const deadline = updateDeadlineCalculation();

    const data = {
      product_name: modalContainer.querySelector('#inp-product-name').value.trim(),
      retailer: modalContainer.querySelector('#inp-retailer').value.trim(),
      price: parseFloat(modalContainer.querySelector('#inp-price').value),
      order_number: modalContainer.querySelector('#inp-order-number').value.trim(),
      purchase_date: purchaseDateInp.value,
      delivery_date: deliveryDateInp.value || null,
      return_policy_days: parseInt(policyDaysInp.value, 10) || 30,
      return_deadline: deadline,
      category: modalContainer.querySelector('#inp-category').value,
      payment_method: modalContainer.querySelector('#inp-payment-method').value,
      return_reason: modalContainer.querySelector('#inp-return-reason').value || null,
      return_carrier: modalContainer.querySelector('#inp-carrier').value || null,
      return_tracking_number: modalContainer.querySelector('#inp-tracking').value.trim() || null,
      receipt_url: receiptUrlInput.value || null,
      image_url: productImgInput.value || '/images/products/airpods_max.svg',
      notes: modalContainer.querySelector('#inp-notes').value.trim()
    };

    onSave(data, existingPurchase?.id);
    closeModal();
  });
}
