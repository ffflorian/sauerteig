import {useState, useEffect, useCallback} from 'react';
import {formatDuration, intervalToDuration} from 'date-fns';
import {de as deLocale} from 'date-fns/locale/de';

import {InstallPrompt} from './InstallPrompt';
import {shouldSuggestInstall} from './iosPwa';

const API_URL = import.meta.env.VITE_BACKEND_URL!;
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY!;

// iOS Safari (outside the installed PWA) does not expose the Notification API.
const notificationsSupported = typeof Notification !== 'undefined';
const pushSupported = 'serviceWorker' in navigator && 'PushManager' in window;

// Once dismissed, do not nag the user with the install hint on every timer.
const installPromptDismissedKey = 'SauerteigInstallPromptDismissed';

// An on-time expiry (app open) is detected within one tick. A larger gap means
// the app was backgrounded across the expiry, so the backend push already
// delivered the notification and the local one would be a duplicate.
const onTimeExpiryToleranceMs = 2000;

interface ReminderTimerProps {
  disabled?: boolean;
  minutes: number;
  onExpire?: () => void;
  storageKey: string;
}

const InfoIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

function labelForMinutes(minutes: number): string {
  return formatDuration(intervalToDuration({start: 0, end: minutes * 60 * 1000}), {locale: deLocale}).replace(
    'Tage',
    'Tagen'
  );
}

function labelForRemaining(ms: number): string {
  if (ms < 1000) {
    return formatDuration({seconds: 1}, {locale: deLocale});
  }
  return formatDuration(intervalToDuration({start: 0, end: ms}), {
    locale: deLocale,
    format: ['hours', 'minutes', 'seconds'],
  });
}

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
}

async function getPushSubscription(): Promise<PushSubscription | null> {
  if (!pushSupported || !VAPID_PUBLIC_KEY) {
    return null;
  }
  try {
    const registration = await navigator.serviceWorker.ready;
    const existing = await registration.pushManager.getSubscription();
    if (existing) {
      return existing;
    }
    return await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
  } catch {
    return null;
  }
}

async function scheduleBackendNotification(
  subscription: PushSubscription,
  expiresAt: number,
  label: string
): Promise<string | null> {
  try {
    const response = await fetch(`${API_URL}/push/schedule`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({subscription: subscription.toJSON(), expiresAt, label}),
    });
    if (!response.ok) {
      return null;
    }
    const data = (await response.json()) as {timerId: string};
    return data.timerId;
  } catch {
    return null;
  }
}

async function cancelBackendNotification(timerId: string): Promise<void> {
  try {
    await fetch(`${API_URL}/push/schedule/${timerId}`, {method: 'DELETE'});
  } catch {
    // ignore
  }
}

// iOS Safari does not support the Notification constructor (it throws a
// TypeError), so notifications must be shown through the service worker
// registration. Prefer it everywhere and only fall back to the constructor
// when no service worker is available.
async function showLocalNotification(body: string): Promise<void> {
  if (!notificationsSupported || Notification.permission !== 'granted') {
    return;
  }
  if (pushSupported) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification('Sauerteig-Erinnerung', {body});
      return;
    } catch {
      // fall back to the constructor below
    }
  }
  new Notification('Sauerteig-Erinnerung', {body});
}

export const ReminderTimer = ({disabled, minutes, onExpire, storageKey}: ReminderTimerProps) => {
  const timerIdKey = `${storageKey}_timerId`;

  const [endTime, setEndTime] = useState<number | null>(() => {
    const stored = window.localStorage.getItem(storageKey);
    return stored ? parseInt(stored, 10) : null;
  });
  const [remaining, setRemaining] = useState<number | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>(
    notificationsSupported ? Notification.permission : 'default'
  );
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [installDismissed, setInstallDismissed] = useState(
    () => window.localStorage.getItem(installPromptDismissedKey) === 'true'
  );
  const [backendUnreachable, setBackendUnreachable] = useState(false);

  const clearTimer = useCallback(
    (cancelBackend = true) => {
      const timerId = window.localStorage.getItem(timerIdKey);
      if (timerId) {
        if (cancelBackend) {
          cancelBackendNotification(timerId);
        }
        window.localStorage.removeItem(timerIdKey);
      }
      window.localStorage.removeItem(storageKey);
      setEndTime(null);
      setRemaining(null);
      setBackendUnreachable(false);
    },
    [storageKey, timerIdKey]
  );

  useEffect(() => {
    if (!disabled || endTime === null) {
      return;
    }
    const id = setTimeout(clearTimer, 0);
    return () => clearTimeout(id);
  }, [disabled, endTime, clearTimer]);

  useEffect(() => {
    if (!endTime || disabled) {
      return;
    }

    const tick = () => {
      const diff = endTime - Date.now();
      if (diff > 0) {
        setRemaining(diff);
        return;
      }

      // If a backend push was scheduled and the timer expired while the app was
      // backgrounded, the server push already showed the notification. Clear the
      // local state but leave the push in place instead of showing a duplicate.
      const scheduledBackend = window.localStorage.getItem(timerIdKey) !== null;

      if (scheduledBackend && Date.now() - endTime > onTimeExpiryToleranceMs) {
        clearTimer(false);
      } else {
        void showLocalNotification(`Die Wartezeit von ${labelForMinutes(minutes)} ist abgelaufen!`);
        clearTimer();
      }
      onExpire?.();
    };

    const immediateId = setTimeout(tick, 0);
    const intervalId = setInterval(tick, 1000);

    return () => {
      clearTimeout(immediateId);
      clearInterval(intervalId);
    };
  }, [endTime, clearTimer, minutes, onExpire, disabled, timerIdKey]);

  const startTimer = async () => {
    if (notificationsSupported && permission === 'default') {
      setPermission(await Notification.requestPermission());
    }

    const end = Date.now() + minutes * 60 * 1000;
    window.localStorage.setItem(storageKey, end.toString());
    setEndTime(end);

    const subscription = await getPushSubscription();

    if (subscription) {
      const timerId = await scheduleBackendNotification(subscription, end, labelForMinutes(minutes));
      if (timerId) {
        window.localStorage.setItem(timerIdKey, timerId);
        setBackendUnreachable(false);
      } else {
        setBackendUnreachable(true);
      }
    }

    if (shouldSuggestInstall() && window.localStorage.getItem(installPromptDismissedKey) !== 'true') {
      setShowInstallPrompt(true);
    }
  };

  const dismissInstallPrompt = () => {
    window.localStorage.setItem(installPromptDismissedKey, 'true');
    setInstallDismissed(true);
    setShowInstallPrompt(false);
  };

  // Only hide when the user actively denied notifications.
  // If the API is missing entirely (iOS Safari), keep the timer as an in-app countdown.
  if (notificationsSupported && permission === 'denied') {
    return null;
  }

  return (
    <>
      <span className="reminder-timer-row">
        {endTime !== null && remaining !== null && !disabled ? (
          <div className="reminder-timer reminder-timer--active">
            <span>🕐 Noch {labelForRemaining(remaining)}</span>
            <button className="reminder-cancel" onClick={() => clearTimer()}>
              Abbrechen
            </button>
          </div>
        ) : (
          <button className="reminder-timer" onClick={startTimer} disabled={disabled}>
            🕐 Erinnere mich in {labelForMinutes(minutes)}
          </button>
        )}
        {installDismissed && shouldSuggestInstall() && (
          <button
            className="reminder-info"
            onClick={() => setShowInstallPrompt(true)}
            aria-label="Installationshinweis erneut anzeigen"
            title="Installationshinweis erneut anzeigen"
          >
            <InfoIcon />
          </button>
        )}
      </span>
      {endTime !== null && backendUnreachable && (
        <span className="reminder-warning" role="alert">
          ⚠️ Server nicht erreichbar - die Erinnerung im Hintergrund ist nicht aktiv.
        </span>
      )}
      {showInstallPrompt && <InstallPrompt onClose={dismissInstallPrompt} />}
    </>
  );
};
