// public/js/components/notifications.js - Alerts & Notification Drawer
import { escapeHtml, formatDate, showToast } from '../utils/helpers.js';
import { api } from '../api.js';

export function renderNotificationPanel(container, notificationsData, onClose, onRefresh) {
  const list = notificationsData.notifications || [];
  const unreadCount = notificationsData.unread_count || 0;

  container.innerHTML = `
    <div class="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm flex justify-end" id="notif-backdrop">
      <div class="w-full max-w-sm bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col h-full transform transition-transform duration-300">
        
        <div class="p-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-base">🔔</span>
            <h3 class="text-sm font-bold text-white">Notifications &amp; Alerts</h3>
            ${unreadCount > 0 ? `
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white font-mono">
                ${unreadCount}
              </span>
            ` : ''}
          </div>
          <button id="notif-close-btn" class="text-slate-400 hover:text-white font-bold text-sm">✕</button>
        </div>

        <!-- Push notification permission banner -->
        <div class="p-3 bg-indigo-950/40 border-b border-indigo-900/40 flex items-center justify-between text-xs text-indigo-200">
          <span>Enable desktop deadline alerts?</span>
          <button id="btn-request-push" class="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] transition-colors">
            Enable
          </button>
        </div>

        <!-- Notification List -->
        <div class="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar text-xs">
          ${list.length === 0 ? `
            <div class="text-center py-10 text-slate-500">
              No notifications yet. You're completely up to date!
            </div>
          ` : list.map(n => {
            let icon = 'ℹ️';
            let border = 'border-slate-800 bg-slate-800/40';
            if (n.type === 'critical') {
              icon = '🚨';
              border = 'border-red-500/40 bg-red-950/20';
            } else if (n.type === 'warning') {
              icon = '⚠️';
              border = 'border-amber-500/40 bg-amber-950/20';
            } else if (n.type === 'alert') {
              icon = '💥';
              border = 'border-rose-500/40 bg-rose-950/20';
            }

            return `
              <div class="p-3 rounded-xl border ${border} transition-all ${n.is_read ? 'opacity-60' : 'opacity-100'} cursor-pointer"
                   onclick="window.returnRadar.handleNotifClick('${n.id}', '${n.purchase_id || ''}')">
                <div class="flex items-start gap-2">
                  <span class="text-base flex-shrink-0">${icon}</span>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-1 mb-0.5">
                      <h4 class="font-bold text-white truncate text-[11px]">${escapeHtml(n.title)}</h4>
                      <span class="text-[9px] font-mono text-slate-400">${formatDate(n.created_at?.slice(0, 10))}</span>
                    </div>
                    <p class="text-[11px] text-slate-300 leading-relaxed">${escapeHtml(n.message)}</p>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Footer -->
        <div class="p-3 bg-slate-950/70 border-t border-slate-800 flex items-center justify-between text-xs">
          <button id="btn-mark-all-read" class="text-indigo-400 hover:text-indigo-300 font-semibold text-[11px]">
            Mark All as Read
          </button>
          <span class="text-slate-500 text-[10px] font-mono">ReturnRadar v1.0</span>
        </div>

      </div>
    </div>
  `;

  // Close handlers
  const close = () => {
    container.innerHTML = '';
    if (onClose) onClose();
  };
  container.querySelector('#notif-close-btn').addEventListener('click', close);
  container.querySelector('#notif-backdrop').addEventListener('click', (e) => {
    if (e.target.id === 'notif-backdrop') close();
  });

  // Mark all read
  container.querySelector('#btn-mark-all-read').addEventListener('click', async () => {
    await api.markAllNotificationsRead();
    showToast('All notifications marked as read', 'success');
    if (onRefresh) onRefresh();
    close();
  });

  // Push permission
  container.querySelector('#btn-request-push').addEventListener('click', () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          showToast('Desktop alerts activated!', 'success');
          new Notification('ReturnRadar', {
            body: 'You will receive timely alerts before purchase return deadlines!'
          });
        } else {
          showToast('Notification permission denied', 'warning');
        }
      });
    } else {
      showToast('Notifications not supported by this browser', 'info');
    }
  });
}
