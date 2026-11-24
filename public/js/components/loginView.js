// public/js/components/loginView.js - Dedicated Full-Page Login, Registration & Account Profile
import { showToast } from '../utils/helpers.js';

export function renderLoginView(container, currentUser, handlers) {
  const { onLoginSuccess, onLogout, onNavigate } = handlers;

  let activeTab = 'signin'; // 'signin' | 'signup'

  const render = () => {
    // If user is already logged in, show their full Account / Profile view with switch options
    if (currentUser) {
      container.innerHTML = `
        <div class="max-w-4xl mx-auto space-y-6 animate-fadeIn py-6">
          
          <!-- Breadcrumb -->
          <div class="flex items-center gap-2 text-xs text-slate-500">
            <button id="auth-nav-store" class="hover:text-blue-600 transition-colors">RadarStore</button>
            <span>/</span>
            <span class="text-slate-800 font-semibold">My Account &amp; Profile</span>
          </div>

          <!-- Profile Card -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-100">
            
            <div class="p-6 sm:p-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 text-white flex flex-col sm:flex-row items-center gap-6 justify-between">
              <div class="flex items-center gap-5">
                <div class="relative">
                  <img
                    src="${currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'}"
                    alt="${currentUser.name}"
                    class="w-20 h-20 rounded-full border-4 border-white/30 shadow-lg object-cover bg-white"
                  />
                  ${currentUser.is_plus_member ? `
                    <span class="absolute -bottom-1 -right-1 bg-amber-400 text-blue-950 font-black text-[10px] px-1.5 py-0.5 rounded-full shadow ring-2 ring-white" title="Radar Plus Member">
                      ⭐ PLUS
                    </span>
                  ` : ''}
                </div>
                <div class="space-y-1 text-center sm:text-left">
                  <h1 class="text-xl sm:text-2xl font-black tracking-tight">${currentUser.name}</h1>
                  <p class="text-xs text-blue-100">${currentUser.email || currentUser.phone}</p>
                  <div class="flex items-center gap-2 pt-1 justify-center sm:justify-start">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white border border-white/20">
                      ${currentUser.is_plus_member ? 'Radar Plus Elite Member' : 'Standard Shopper'}
                    </span>
                    <span class="text-xs text-emerald-300 font-medium">✓ Verified Account</span>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <button id="btn-sign-out" class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all">
                  Sign Out
                </button>
                <button id="btn-switch-account" class="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-blue-950 font-black text-xs shadow-md transition-all">
                  Switch User
                </button>
              </div>
            </div>

            <!-- Profile Details Grid -->
            <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div class="space-y-3">
                <h3 class="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] text-slate-400">Account Information</h3>
                <div class="space-y-2 text-slate-700">
                  <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span class="text-slate-500">Full Name</span>
                    <strong class="text-slate-900">${currentUser.name}</strong>
                  </div>
                  <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span class="text-slate-500">Email Address</span>
                    <strong class="text-slate-900 font-mono">${currentUser.email || 'N/A'}</strong>
                  </div>
                  <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span class="text-slate-500">Phone Number</span>
                    <strong class="text-slate-900 font-mono">${currentUser.phone || 'N/A'}</strong>
                  </div>
                </div>
              </div>

              <div class="space-y-3">
                <h3 class="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] text-slate-400">Default Delivery Address</h3>
                <div class="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-slate-900">Primary Residence</span>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">Default</span>
                  </div>
                  <p class="text-slate-600 leading-relaxed">${currentUser.address || 'Flat 402, Prestige Greenwoods, 100 Feet Rd, Indiranagar, Bengaluru, Karnataka 560038'}</p>
                  <p class="text-[11px] text-emerald-600 font-semibold">⚡ Eligible for Free Next-Day Radar Delivery</p>
                </div>
              </div>
            </div>

            <!-- Quick Action Links -->
            <div class="p-6 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <button id="btn-goto-orders" class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2">
                  <span>📦</span>
                  <span>View My Orders &amp; Track Status</span>
                </button>
                <button id="btn-goto-store" class="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-blue-950 font-bold text-xs shadow-sm transition-all flex items-center gap-2">
                  <span>🛍️</span>
                  <span>Explore RadarStore</span>
                </button>
              </div>

              <button id="btn-goto-radar" class="text-indigo-600 hover:underline font-bold text-xs flex items-center gap-1.5">
                <span>📡</span>
                <span>Switch to ReturnRadar Pro Dashboard ➔</span>
              </button>
            </div>

          </div>

        </div>
      `;

      container.querySelector('#auth-nav-store').addEventListener('click', () => onNavigate('store'));
      container.querySelector('#btn-goto-store').addEventListener('click', () => onNavigate('store'));
      container.querySelector('#btn-goto-orders').addEventListener('click', () => onNavigate('orders'));
      container.querySelector('#btn-goto-radar').addEventListener('click', () => onNavigate('radar'));

      container.querySelector('#btn-sign-out').addEventListener('click', () => {
        localStorage.removeItem('returnradar_user_id');
        if (onLogout) onLogout();
      });

      container.querySelector('#btn-switch-account').addEventListener('click', () => {
        currentUser = null;
        render();
      });

      return;
    }

    // Full Login / Registration Page (When logged out)
    container.innerHTML = `
      <div class="max-w-5xl mx-auto space-y-6 animate-fadeIn py-6">
        
        <!-- Breadcrumb Navigation -->
        <div class="flex items-center gap-2 text-xs text-slate-500">
          <button id="auth-nav-store" class="hover:text-blue-600 transition-colors">RadarStore</button>
          <span>/</span>
          <span class="text-slate-800 font-semibold">${activeTab === 'signin' ? 'Sign In' : 'Create Account'}</span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          
          <!-- Left Brand Showcase Panel (5 cols) -->
          <div class="lg:col-span-5 bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            <div class="space-y-6 relative z-10">
              
              <!-- Brand Identity -->
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-300 text-blue-950 font-black flex items-center justify-center text-xl shadow-lg">
                  ⚡
                </div>
                <div>
                  <div class="text-xl font-black italic tracking-tight text-white flex items-center gap-1">
                    RadarStore
                    <span class="not-italic text-xs px-1.5 py-0.2 rounded bg-amber-400 text-blue-950 font-extrabold">MART</span>
                  </div>
                  <p class="text-[11px] text-blue-200">Shop with Return Deadline Protection</p>
                </div>
              </div>

              <!-- Main Heading -->
              <div class="space-y-2">
                <h1 class="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
                  ${activeTab === 'signin' ? 'Welcome Back to Smart Shopping.' : 'Join RadarStore & Never Lose a Refund.'}
                </h1>
                <p class="text-blue-100 text-xs leading-relaxed">
                  Every order includes automatic return window tracking, live courier checkpoints, and reserve-and-pay-later security.
                </p>
              </div>

              <!-- Feature Highlights -->
              <div class="space-y-3.5 pt-2 text-xs">
                <div class="flex items-start gap-3">
                  <div class="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-xs shrink-0 mt-0.5">
                    🛡️
                  </div>
                  <div>
                    <h4 class="font-bold text-white">Radar Assured Guarantee</h4>
                    <p class="text-[11px] text-blue-200">7 to 30 days hassle-free return or instant replacement policy.</p>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <div class="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-xs shrink-0 mt-0.5">
                    ⏰
                  </div>
                  <div>
                    <h4 class="font-bold text-white">Payment Deadline Alert</h4>
                    <p class="text-[11px] text-blue-200">Lock your stock with Reserve &amp; Pay Later and live ticking reminders.</p>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <div class="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-xs shrink-0 mt-0.5">
                    📦
                  </div>
                  <div>
                    <h4 class="font-bold text-white">Interactive Order Stepper</h4>
                    <p class="text-[11px] text-blue-200">Real-time status updates from order placed to doorstep delivery.</p>
                  </div>
                </div>
              </div>

            </div>

            <!-- Bottom trust proof -->
            <div class="pt-8 border-t border-white/10 relative z-10 flex items-center justify-between text-[11px] text-blue-200">
              <span>🔒 256-Bit SSL Encrypted</span>
              <span>100% Authentic Products</span>
            </div>

            <!-- Background decorative glow -->
            <div class="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
          </div>

          <!-- Right Authentication Form Panel (7 cols) -->
          <div class="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6 bg-white">
            
            <div class="space-y-6">
              
              <!-- Tab Navigation Switcher: Sign In vs Create Account -->
              <div class="flex border-b border-slate-200">
                <button
                  id="tab-signin"
                  class="flex-1 pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                    activeTab === 'signin'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }"
                >
                  Sign In to Account
                </button>
                <button
                  id="tab-signup"
                  class="flex-1 pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                    activeTab === 'signup'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }"
                >
                  Create New Account
                </button>
              </div>

              <!-- 1-Click Instant Demo Login Profiles (Super useful for instant access) -->
              <div class="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="font-black text-amber-900 text-xs flex items-center gap-1.5">
                    <span>⚡</span> 1-Click Instant Demo Profiles
                  </span>
                  <span class="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                    No typing needed
                  </span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <button
                    class="btn-quick-demo p-2.5 rounded-xl bg-white hover:bg-amber-100/70 border border-amber-300 text-slate-900 font-bold transition-all text-left flex items-center gap-2.5 shadow-xs group"
                    data-email="rahul.sharma@example.com"
                  >
                    <div class="w-8 h-8 rounded-full bg-blue-600 text-white font-black flex items-center justify-center shrink-0 text-xs group-hover:scale-105 transition-transform">
                      R
                    </div>
                    <div class="overflow-hidden">
                      <div class="font-bold truncate text-[11px]">Rahul Sharma</div>
                      <div class="text-[10px] text-amber-700 font-semibold truncate">Plus Member ⭐</div>
                    </div>
                  </button>

                  <button
                    class="btn-quick-demo p-2.5 rounded-xl bg-white hover:bg-amber-100/70 border border-amber-300 text-slate-900 font-bold transition-all text-left flex items-center gap-2.5 shadow-xs group"
                    data-email="priya.patel@example.com"
                  >
                    <div class="w-8 h-8 rounded-full bg-purple-600 text-white font-black flex items-center justify-center shrink-0 text-xs group-hover:scale-105 transition-transform">
                      P
                    </div>
                    <div class="overflow-hidden">
                      <div class="font-bold truncate text-[11px]">Priya Patel</div>
                      <div class="text-[10px] text-purple-700 font-semibold truncate">Smart Shopper 🛍️</div>
                    </div>
                  </button>

                  <button
                    class="btn-quick-demo p-2.5 rounded-xl bg-white hover:bg-amber-100/70 border border-amber-300 text-slate-900 font-bold transition-all text-left flex items-center gap-2.5 shadow-xs group"
                    data-email="alex.chen@example.com"
                  >
                    <div class="w-8 h-8 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center shrink-0 text-xs group-hover:scale-105 transition-transform">
                      A
                    </div>
                    <div class="overflow-hidden">
                      <div class="font-bold truncate text-[11px]">Alex Chen</div>
                      <div class="text-[10px] text-emerald-700 font-semibold truncate">Tech Enthusiast 💻</div>
                    </div>
                  </button>
                </div>
              </div>

              <!-- Divider -->
              <div class="flex items-center gap-3 text-slate-400 text-xs">
                <hr class="flex-1 border-slate-200"/>
                <span class="font-medium text-slate-400">OR SIGN IN WITH CREDENTIALS</span>
                <hr class="flex-1 border-slate-200"/>
              </div>

              <!-- Sign In Form -->
              ${activeTab === 'signin' ? `
                <form id="form-signin" class="space-y-4 text-xs">
                  <div class="space-y-1.5">
                    <label class="font-bold text-slate-700">Email Address or 10-Digit Mobile</label>
                    <div class="relative">
                      <input
                        type="text"
                        id="signin-email"
                        placeholder="e.g. rahul.sharma@example.com or 9876543210"
                        required
                        value="rahul.sharma@example.com"
                        class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium placeholder-slate-400 transition-shadow"
                      />
                      <span class="absolute right-3.5 top-3.5 text-slate-400">👤</span>
                    </div>
                  </div>

                  <div class="space-y-1.5">
                    <div class="flex items-center justify-between">
                      <label class="font-bold text-slate-700">Password</label>
                      <button type="button" id="btn-forgot-pass" class="text-blue-600 hover:underline font-bold text-[11px]">
                        Forgot password?
                      </button>
                    </div>
                    <div class="relative">
                      <input
                        type="password"
                        id="signin-password"
                        placeholder="••••••••"
                        required
                        value="password123"
                        class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium placeholder-slate-400 transition-shadow"
                      />
                      <button type="button" id="btn-toggle-password" class="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 text-sm">
                        👁️
                      </button>
                    </div>
                  </div>

                  <div class="flex items-center justify-between text-xs pt-1">
                    <label class="flex items-center gap-2 cursor-pointer text-slate-600">
                      <input type="checkbox" checked class="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"/>
                      <span>Remember my login on this device</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    id="btn-submit-signin"
                    class="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all active:scale-98 flex items-center justify-center gap-2"
                  >
                    <span>SIGN IN TO RADARSTORE</span>
                    <span>➔</span>
                  </button>
                </form>
              ` : `
                <!-- Sign Up Form -->
                <form id="form-signup" class="space-y-4 text-xs">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="space-y-1.5">
                      <label class="font-bold text-slate-700">Full Name</label>
                      <input
                        type="text"
                        id="signup-name"
                        placeholder="e.g. Vikram Malhotra"
                        required
                        class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
                      />
                    </div>
                    <div class="space-y-1.5">
                      <label class="font-bold text-slate-700">Mobile Number</label>
                      <input
                        type="tel"
                        id="signup-phone"
                        placeholder="+91 98765 43210"
                        required
                        class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
                      />
                    </div>
                  </div>

                  <div class="space-y-1.5">
                    <label class="font-bold text-slate-700">Email Address</label>
                    <input
                      type="email"
                      id="signup-email"
                      placeholder="vikram@example.com"
                      required
                      class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
                    />
                  </div>

                  <div class="space-y-1.5">
                    <label class="font-bold text-slate-700">Delivery Address</label>
                    <input
                      type="text"
                      id="signup-address"
                      placeholder="Street, Apartment, City, Pincode"
                      required
                      class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
                    />
                  </div>

                  <div class="space-y-1.5">
                    <label class="font-bold text-slate-700">Create Password</label>
                    <input
                      type="password"
                      id="signup-password"
                      placeholder="Min. 6 characters"
                      required
                      value="password123"
                      class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
                    />
                  </div>

                  <p class="text-[11px] text-slate-500 leading-relaxed">
                    By signing up, you agree to RadarStore's <a href="#" class="text-blue-600 hover:underline">Terms of Service</a> and activate ReturnRadar return deadline tracking.
                  </p>

                  <button
                    type="submit"
                    id="btn-submit-signup"
                    class="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition-all active:scale-98 flex items-center justify-center gap-2"
                  >
                    <span>CREATE RADARSTORE ACCOUNT</span>
                    <span>➔</span>
                  </button>
                </form>
              `}

            </div>

            <!-- Footer Switch -->
            <div class="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
              ${activeTab === 'signin' ? `
                <span>Don't have an account yet? </span>
                <button id="btn-switch-to-signup" class="text-blue-600 font-bold hover:underline">
                  Sign up in 30 seconds
                </button>
              ` : `
                <span>Already have a RadarStore account? </span>
                <button id="btn-switch-to-signin" class="text-blue-600 font-bold hover:underline">
                  Log in now
                </button>
              `}
            </div>

          </div>

        </div>

      </div>
    `;

    // Bind Tab Click events
    const tabSignin = container.querySelector('#tab-signin');
    const tabSignup = container.querySelector('#tab-signup');
    const switchToSignup = container.querySelector('#btn-switch-to-signup');
    const switchToSignin = container.querySelector('#btn-switch-to-signin');

    if (tabSignin) tabSignin.addEventListener('click', () => { activeTab = 'signin'; render(); });
    if (tabSignup) tabSignup.addEventListener('click', () => { activeTab = 'signup'; render(); });
    if (switchToSignup) switchToSignup.addEventListener('click', () => { activeTab = 'signup'; render(); });
    if (switchToSignin) switchToSignin.addEventListener('click', () => { activeTab = 'signin'; render(); });

    const navStore = container.querySelector('#auth-nav-store');
    if (navStore) navStore.addEventListener('click', () => onNavigate('store'));

    // Toggle Password Visibility
    const togglePassBtn = container.querySelector('#btn-toggle-password');
    if (togglePassBtn) {
      togglePassBtn.addEventListener('click', () => {
        const passInput = container.querySelector('#signin-password');
        if (passInput) {
          passInput.type = passInput.type === 'password' ? 'text' : 'password';
        }
      });
    }

    // Forgot password alert
    const forgotBtn = container.querySelector('#btn-forgot-pass');
    if (forgotBtn) {
      forgotBtn.addEventListener('click', () => {
        showToast('Password reset link sent to registered email / phone', 'info');
      });
    }

    // Quick Demo Login Buttons
    container.querySelectorAll('.btn-quick-demo').forEach(btn => {
      btn.addEventListener('click', async () => {
        const email = btn.getAttribute('data-email');
        await handleLogin(email, 'password123');
      });
    });

    // Form Sign In submission
    const signinForm = container.querySelector('#form-signin');
    if (signinForm) {
      signinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailOrPhone = container.querySelector('#signin-email').value.trim();
        const password = container.querySelector('#signin-password').value;
        await handleLogin(emailOrPhone, password);
      });
    }

    // Form Sign Up submission
    const signupForm = container.querySelector('#form-signup');
    if (signupForm) {
      signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = container.querySelector('#signup-name').value.trim();
        const phone = container.querySelector('#signup-phone').value.trim();
        const email = container.querySelector('#signup-email').value.trim();
        const address = container.querySelector('#signup-address').value.trim();
        const password = container.querySelector('#signup-password').value;

        const submitBtn = container.querySelector('#btn-submit-signup');
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Creating Account...';

        try {
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, address, password })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Registration failed');

          localStorage.setItem('returnradar_user_id', data.user.id);
          showToast(`Welcome to RadarStore, ${data.user.name}! Account created. 🎉`, 'success');
          if (onLoginSuccess) onLoginSuccess(data.user);
        } catch (err) {
          showToast(err.message, 'error');
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'CREATE RADARSTORE ACCOUNT ➔';
        }
      });
    }
  };

  const handleLogin = async (emailOrPhone, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      localStorage.setItem('returnradar_user_id', data.user.id);
      showToast(`Welcome back, ${data.user.name}! ⭐`, 'success');
      if (onLoginSuccess) onLoginSuccess(data.user);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  render();
}
