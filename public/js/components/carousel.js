// public/js/components/carousel.js - Interactive Hero Spotlight Carousel / Slider
import { formatCurrency, calculateDaysRemaining, escapeHtml } from '../utils/helpers.js';

export class SpotlightCarousel {
  constructor(containerId, purchases, onSelectPurchase) {
    this.container = document.getElementById(containerId);
    this.purchases = purchases;
    this.onSelectPurchase = onSelectPurchase;
    this.currentIndex = 0;
    this.timer = null;
    this.autoplayInterval = 6000;
    this.isPaused = false;
    this.slides = this.buildSlides();
  }

  buildSlides() {
    const slides = [];

    // Slide 1: Critical Highest Capital at Risk
    const criticalItems = this.purchases.filter(p => {
      const days = calculateDaysRemaining(p.return_deadline);
      return days !== null && days <= 2 && !['REFUNDED', 'KEEP', 'EXPIRED'].includes(p.status);
    }).sort((a, b) => b.price - a.price);

    if (criticalItems.length > 0) {
      const topCrit = criticalItems[0];
      const days = calculateDaysRemaining(topCrit.return_deadline);
      slides.push({
        id: 'crit-spotlight',
        purchaseId: topCrit.id,
        tag: '🚨 CRITICAL DEADLINE SPOTLIGHT',
        tagBg: 'bg-red-500/20 text-red-300 border-red-500/30',
        title: topCrit.product_name,
        retailer: topCrit.retailer,
        retailerLogo: topCrit.retailer_logo,
        price: topCrit.price,
        daysRemaining: days,
        urgencyText: days <= 0 ? 'Return Window Closes Tonight!' : `Only ${days} Day${days > 1 ? 's' : ''} Left!`,
        urgencyColor: 'text-red-400',
        image: topCrit.image_url,
        caption: topCrit.notes || `15-day return policy for ${topCrit.retailer}. Return immediately to secure full refund.`,
        actionLabel: 'Initiate Return →',
        actionStatus: 'INITIATED',
        highlightType: 'critical'
      });
    }

    // Slide 2: Overdue Refund Dispute Spotlight
    const overdueItem = this.purchases.find(p => p.is_refund_overdue || p.status === 'DISPUTED');
    if (overdueItem) {
      slides.push({
        id: 'dispute-spotlight',
        purchaseId: overdueItem.id,
        tag: '⚖️ OVERDUE REFUND DISPUTE',
        tagBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        title: overdueItem.product_name,
        retailer: overdueItem.retailer,
        retailerLogo: overdueItem.retailer_logo,
        price: overdueItem.expected_refund_amount || overdueItem.price,
        daysRemaining: 0,
        urgencyText: overdueItem.status === 'DISPUTED' ? 'Discrepancy Detected (-$93.00)' : 'Refund Delayed by Merchant',
        urgencyColor: 'text-amber-400',
        image: overdueItem.image_url,
        caption: `Item delivered to ${overdueItem.retailer} warehouse past standard turnaround. Formal dispute demand letter pre-filled and ready to copy or send.`,
        actionLabel: 'Draft Dispute Letter ✉️',
        actionType: 'dispute',
        highlightType: 'warning'
      });
    }

    // Slide 3: In Transit Tracking Radar
    const inTransit = this.purchases.find(p => p.status === 'INITIATED' || p.status === 'DROPPED_OFF');
    if (inTransit) {
      slides.push({
        id: 'transit-spotlight',
        purchaseId: inTransit.id,
        tag: '📦 CARRIER DROP-OFF & TRANSIT',
        tagBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        title: inTransit.product_name,
        retailer: inTransit.retailer,
        retailerLogo: inTransit.retailer_logo,
        price: inTransit.expected_refund_amount || inTransit.price,
        daysRemaining: calculateDaysRemaining(inTransit.return_deadline),
        urgencyText: inTransit.status === 'INITIATED' ? 'Return Label Printed • Drop-Off Needed' : 'In Transit to Merchant Warehouse',
        urgencyColor: 'text-indigo-400',
        image: inTransit.image_url,
        caption: `Carrier: ${inTransit.return_carrier || 'UPS'} (Tracking: ${inTransit.return_tracking_number || 'Receipt Generated'}). Drop off at any authorized drop-off box or counter.`,
        actionLabel: 'View Drop-off Barcode 📱',
        actionType: 'detail',
        highlightType: 'info'
      });
    }

    // Slide 4: Recently Recovered Celebration
    const recovered = this.purchases.find(p => p.status === 'REFUNDED');
    if (recovered) {
      slides.push({
        id: 'recovered-spotlight',
        purchaseId: recovered.id,
        tag: '💰 CAPITAL PRESERVED & REFUNDED',
        tagBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        title: recovered.product_name,
        retailer: recovered.retailer,
        retailerLogo: recovered.retailer_logo,
        price: recovered.actual_refund_amount || recovered.price,
        daysRemaining: 0,
        urgencyText: '100% Full Refund Reconciled',
        urgencyColor: 'text-emerald-400',
        image: recovered.image_url,
        caption: `Successfully recovered ${formatCurrency(recovered.actual_refund_amount || recovered.price)} from ${recovered.retailer}. Credited back to original payment method.`,
        actionLabel: 'View Audit Trail ✓',
        actionType: 'detail',
        highlightType: 'success'
      });
    }

    // Fallback slide if few items
    if (slides.length === 0) {
      slides.push({
        id: 'welcome-spotlight',
        purchaseId: null,
        tag: '📡 RETURNRADAR INTELLIGENCE',
        tagBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        title: 'Track Every Return Window & Recover Forgotten Refunds',
        retailer: 'ReturnRadar Pro',
        retailerLogo: '/images/retailers/apple.svg',
        price: 0,
        daysRemaining: 0,
        urgencyText: 'Zero Capital Lost to Expired Deadlines',
        urgencyColor: 'text-indigo-400',
        image: '/images/products/airpods_max.svg',
        caption: 'Built-in retailer intelligence for 15+ major retailers, scannable in-store barcodes, automated dispute generation, and iCalendar deadline sync.',
        actionLabel: '+ Track First Purchase',
        actionType: 'add',
        highlightType: 'info'
      });
    }

    return slides;
  }

  render() {
    if (!this.container) return;
    if (this.slides.length === 0) {
      this.container.innerHTML = '';
      return;
    }

    const slide = this.slides[this.currentIndex];

    this.container.innerHTML = `
      <div class="relative bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-950/90 border border-slate-800/90 rounded-3xl p-6 backdrop-blur-2xl overflow-hidden shadow-2xl transition-all duration-500 group"
           id="spotlight-carousel-card">
        
        <!-- Ambient glow accent in background -->
        <div class="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none ${
          slide.highlightType === 'critical' ? 'bg-red-500' :
          slide.highlightType === 'warning' ? 'bg-amber-500' :
          slide.highlightType === 'success' ? 'bg-emerald-500' : 'bg-indigo-500'
        }"></div>

        <!-- Top Row: Tag, Progress & Controls -->
        <div class="flex items-center justify-between gap-4 mb-4 relative z-10">
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 rounded-full text-xs font-mono font-extrabold uppercase tracking-wider border ${slide.tagBg}">
              ${escapeHtml(slide.tag)}
            </span>
            <span class="text-xs text-slate-400 font-mono hidden sm:inline">
              Spotlight ${this.currentIndex + 1} of ${this.slides.length}
            </span>
          </div>

          <!-- Slider Nav Controls -->
          <div class="flex items-center gap-2">
            <button id="carousel-prev" class="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors text-xs" title="Previous Slide">
              ◀
            </button>
            <!-- Dot indicators -->
            <div class="flex items-center gap-1.5 px-2">
              ${this.slides.map((s, idx) => `
                <button class="carousel-dot transition-all duration-300 rounded-full ${
                  idx === this.currentIndex ? 'w-6 h-2 bg-indigo-500' : 'w-2 h-2 bg-slate-700 hover:bg-slate-500'
                }" data-index="${idx}"></button>
              `).join('')}
            </div>
            <button id="carousel-next" class="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors text-xs" title="Next Slide">
              ▶
            </button>
          </div>
        </div>

        <!-- Slide Main Content Grid -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
          
          <!-- Left: Hero Product Image Display with Zoom -->
          <div class="md:col-span-5 flex items-center justify-center">
            <div class="relative w-full max-w-[280px] aspect-square rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-950/70 shadow-xl group-hover:border-slate-600 transition-all flex items-center justify-center p-3 cursor-pointer"
                 onclick="window.returnRadar.openDetail('${slide.purchaseId}')">
              
              <img src="${slide.image}" alt="${escapeHtml(slide.title)}" class="w-full h-full object-contain drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-500"/>
              
              <!-- Retailer Logo Badge in corner -->
              <div class="absolute top-3 left-3 w-9 h-9 rounded-xl bg-slate-900/90 border border-slate-700 p-1.5 shadow-md flex items-center justify-center">
                <img src="${slide.retailerLogo}" alt="${escapeHtml(slide.retailer)}" class="w-full h-full object-contain"/>
              </div>

              <!-- Price Tag overlay in bottom right -->
              ${slide.price > 0 ? `
                <div class="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-slate-900/95 border border-slate-700 font-mono font-bold text-xs text-white shadow-md">
                  ${formatCurrency(slide.price)}
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Right: Information & Call to Action -->
          <div class="md:col-span-7 space-y-3.5">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-bold text-slate-300 uppercase tracking-wider">${escapeHtml(slide.retailer)}</span>
                <span class="text-slate-600">•</span>
                <span class="text-xs font-mono font-bold ${slide.urgencyColor} animate-pulse">
                  ${escapeHtml(slide.urgencyText)}
                </span>
              </div>
              <h3 class="text-xl md:text-2xl font-extrabold text-white tracking-tight leading-snug cursor-pointer hover:text-indigo-300 transition-colors"
                  onclick="window.returnRadar.openDetail('${slide.purchaseId}')">
                ${escapeHtml(slide.title)}
              </h3>
            </div>

            <p class="text-xs md:text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80">
              ${escapeHtml(slide.caption)}
            </p>

            <!-- Action Buttons Strip -->
            <div class="flex flex-wrap items-center gap-3 pt-1">
              <button id="carousel-action-btn" class="px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-lg transition-all flex items-center gap-2 ${
                slide.highlightType === 'critical' ? 'bg-red-600 hover:bg-red-500 shadow-red-600/30' :
                slide.highlightType === 'warning' ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30' :
                slide.highlightType === 'success' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30' :
                'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
              }">
                <span>${escapeHtml(slide.actionLabel)}</span>
              </button>

              ${slide.purchaseId ? `
                <button onclick="window.returnRadar.openDetail('${slide.purchaseId}')" class="px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs border border-slate-700/80 transition-colors flex items-center gap-1.5">
                  <span>Full Specs &amp; Receipt</span>
                  <span>↗</span>
                </button>

                <a href="/api/export/ics/${slide.purchaseId}" download class="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs transition-colors" title="Add to Calendar">
                  📅
                </a>
              ` : ''}
            </div>

          </div>

        </div>

        <!-- Slide Progress Bar at bottom -->
        <div class="absolute bottom-0 left-0 w-full h-1 bg-slate-800">
          <div id="carousel-progress-bar" class="h-full bg-indigo-500 transition-all duration-300" style="width: ${((this.currentIndex + 1) / this.slides.length) * 100}%"></div>
        </div>

      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const prevBtn = this.container.querySelector('#carousel-prev');
    const nextBtn = this.container.querySelector('#carousel-next');
    const actionBtn = this.container.querySelector('#carousel-action-btn');
    const card = this.container.querySelector('#spotlight-carousel-card');

    if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
    if (nextBtn) nextBtn.addEventListener('click', () => this.next());

    this.container.querySelectorAll('.carousel-dot').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.getAttribute('data-index'), 10);
        this.goTo(idx);
      });
    });

    if (actionBtn) {
      const slide = this.slides[this.currentIndex];
      actionBtn.addEventListener('click', () => {
        if (slide.actionType === 'dispute') {
          window.returnRadar.openDisputeModal(slide.purchaseId);
        } else if (slide.actionType === 'add') {
          window.returnRadar.openAddModal();
        } else if (slide.actionStatus) {
          window.returnRadar.quickAdvanceStatus(slide.purchaseId, slide.actionStatus);
        } else if (slide.purchaseId) {
          window.returnRadar.openDetail(slide.purchaseId);
        }
      });
    }

    // Pause on hover
    if (card) {
      card.addEventListener('mouseenter', () => this.isPaused = true);
      card.addEventListener('mouseleave', () => this.isPaused = false);
    }
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.render();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.render();
  }

  goTo(index) {
    if (index >= 0 && index < this.slides.length) {
      this.currentIndex = index;
      this.render();
    }
  }

  startAutoplay() {
    this.stopAutoplay();
    this.timer = setInterval(() => {
      if (!this.isPaused && this.slides.length > 1) {
        this.next();
      }
    }, this.autoplayInterval);
  }

  stopAutoplay() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
