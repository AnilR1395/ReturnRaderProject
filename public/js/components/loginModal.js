// public/js/components/loginModal.js - Flipkart Split Login & Registration Dialog

export function renderLoginModal(container, onLoginSuccess) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn';

  let isRegisterMode = false;

  const renderContent = () => {
    modal.innerHTML = `
      <div class="bg-white rounded-2xl max-w-3xl w-full text-slate-800 shadow-2xl overflow-hidden border border-slate-200 relative my-6">
        
        <!-- Close Button -->
        <button id="auth-close" class="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm z-10 transition-colors">
          ✕
        </button>

        <div class="grid grid-cols-1 md:grid-cols-5 min-h-[480px]">
          
          <!-- Left Column: Flipkart Blue Banner (40%) -->
          <div class="md:col-span-2 bg-[#2874f0] text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            <div class="space-y-4 relative z-10">
              <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
                ${isRegisterMode ? 'Looks like you’re new here!' : 'Login'}
              </h2>
              <p class="text-blue-100 text-xs sm:text-sm leading-relaxed">
                ${isRegisterMode
                  ? 'Sign up with your mobile number to get started with Flipkart Store & ReturnRadar.'
                  : 'Get access to your Orders, Wishlist, Return Deadlines, and Recommendations.'}
              </p>
            </div>

            <div class="pt-8 relative z-10 space-y-3">
              <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-800/80 border border-blue-400/30 text-xs text-blue-100">
                <span class="text-amber-300">⭐</span>
                <span>Flipkart Plus Assured</span>
              </div>
              <div class="text-6xl text-blue-400/30 select-none">🛍️</div>
            </div>

            <!-- Background decorative blob -->
            <div class="absolute -right-12 -bottom-12 w-48 h-48 bg-blue-500/30 rounded-full blur-2xl pointer-events-none"></div>
          </div>

          <!-- Right Column: Login / Sign Up Form (60%) -->
          <div class="md:col-span-3 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            
            <div class="space-y-4">
              
              <!-- Quick 1-Click Demo Login as Rahul (Plus Member) -->
              <div class="bg-amber-50 border border-amber-200 rounded-xl p-3.5 space-y-2">
                <div class="flex items-center justify-between text-xs font-bold text-amber-900">
                  <span class="flex items-center gap-1.5">
                    <span>⚡</span> 1-Click Instant Demo Login
                  </span>
                  <span class="px-1.5 py-0.5 rounded text-[10px] bg-amber-200 text-amber-800">Plus Member</span>
                </div>
                <p class="text-[11px] text-amber-800">Log in as <strong>Rahul Sharma</strong> with 5 pre-seeded orders and active payment deadline.</p>
                <button id="btn-quick-login-rahul" class="w-full py-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-xs rounded-lg shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5">
                  <span>Log in as Rahul Sharma ⭐</span>
                </button>
              </div>

              <div class="flex items-center gap-3 text-slate-400 text-xs">
                <hr class="flex-1 border-slate-200"/>
                <span>OR</span>
                <hr class="flex-1 border-slate-200"/>
              </div>

              <!-- Main Input Form -->
              <form id="auth-form" class="space-y-4 text-xs">
                ${isRegisterMode ? `
                  <div class="space-y-1">
                    <label class="font-bold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      id="auth-name"
                      placeholder="e.g. Priya Patel"
                      required
                      class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                    />
                  </div>
                ` : ''}

                <div class="space-y-1">
                  <label class="font-bold text-slate-700">Email or Mobile Number</label>
                  <input
                    type="text"
                    id="auth-email-phone"
                    placeholder="Enter Email or 10-digit mobile number"
                    required
                    value="rahul.sharma@example.com"
                    class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>

                <div class="space-y-1">
                  <label class="font-bold text-slate-700">${isRegisterMode ? 'Create Password' : 'Password / OTP'}</label>
                  <input
                    type="password"
                    id="auth-password"
                    placeholder="••••••••"
                    value="password123"
                    class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>

                <p class="text-[11px] text-slate-500 leading-relaxed">
                  By continuing, you agree to Flipkart's <a href="#" class="text-blue-600 hover:underline">Terms of Use</a> and <a href="#" class="text-blue-600 hover:underline">Privacy Policy</a>.
                </p>

                <button
                  type="submit"
                  id="auth-submit-btn"
                  class="w-full py-3 bg-[#fb641b] hover:bg-[#e85913] text-white font-extrabold text-xs sm:text-sm rounded-lg shadow-md transition-all active:scale-95"
                >
                  ${isRegisterMode ? 'CONTINUE & SIGN UP' : 'LOGIN'}
                </button>
              </form>

            </div>

            <!-- Footer Toggle between Login & Register -->
            <div class="pt-2 text-center text-xs">
              ${isRegisterMode ? `
                <span class="text-slate-500">Existing User? </span>
                <button id="toggle-auth-mode" class="text-blue-600 font-bold hover:underline">
                  Log in
                </button>
              ` : `
                <span class="text-slate-500">New to Flipkart? </span>
                <button id="toggle-auth-mode" class="text-blue-600 font-bold hover:underline">
                  Create an account
                </button>
              `}
            </div>

          </div>

        </div>

      </div>
    `;

    // Attach listeners
    modal.querySelector('#auth-close').addEventListener('click', close);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });

    const toggleBtn = modal.querySelector('#toggle-auth-mode');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        isRegisterMode = !isRegisterMode;
        renderContent();
      });
    }

    const quickBtn = modal.querySelector('#btn-quick-login-rahul');
    if (quickBtn) {
      quickBtn.addEventListener('click', () => {
        localStorage.setItem('returnradar_user_id', 'usr-rahul');
        if (onLoginSuccess) {
          onLoginSuccess({
            id: 'usr-rahul',
            name: 'Rahul Sharma',
            email: 'rahul.sharma@example.com',
            is_plus_member: 1
          });
        }
        close();
      });
    }

    const form = modal.querySelector('#auth-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = modal.querySelector('#auth-submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Authenticating...';

        try {
          const emailOrPhone = modal.querySelector('#auth-email-phone').value.trim();
          const password = modal.querySelector('#auth-password').value;
          const nameInput = modal.querySelector('#auth-name');
          const name = nameInput ? nameInput.value.trim() : null;

          let res;
          if (isRegisterMode) {
            res = await fetch('/api/auth/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name, email: emailOrPhone.includes('@') ? emailOrPhone : undefined, phone: !emailOrPhone.includes('@') ? emailOrPhone : undefined, password })
            });
          } else {
            res = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ emailOrPhone, password })
            });
          }

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Authentication failed');

          localStorage.setItem('returnradar_user_id', data.user.id);
          if (onLoginSuccess) onLoginSuccess(data.user);
          close();
        } catch (err) {
          alert(err.message);
          submitBtn.disabled = false;
          submitBtn.textContent = isRegisterMode ? 'CONTINUE & SIGN UP' : 'LOGIN';
        }
      });
    }
  };

  const close = () => {
    modal.classList.add('opacity-0');
    setTimeout(() => modal.remove(), 150);
  };

  container.appendChild(modal);
  renderContent();
}
