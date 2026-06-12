import {useState, useEffect} from 'react';
import {formatDuration, intervalToDuration} from 'date-fns';
import {de as deLocale} from 'date-fns/locale/de';

import {InstallPrompt} from './InstallPrompt';
import {shouldSuggestInstall} from './iosPwa';

interface ReminderTimerProps {
  disabled?: boolean;
  minutes: number;
  onExpire?: () => void;
  storageKey: string;
}

// iOS Safari (outside the installed PWA) does not expose the Notification API.
const notificationsSupported = typeof Notification !== 'undefined';

// Once dismissed, do not nag the user with the install hint on every timer.
const installPromptDismissedKey = 'SauerteigInstallPromptDismissed';

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

export const ReminderTimer = ({disabled, minutes, onExpire, storageKey}: ReminderTimerProps) => {
  const [endTime, setEndTime] = useState<number | null>(() => {
    const stored = localStorage.getItem(storageKey);
    return stored ? parseInt(stored, 10) : null;
  });
  const [remaining, setRemaining] = useState<number | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>(
    notificationsSupported ? Notification.permission : 'default'
  );
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [installDismissed, setInstallDismissed] = useState(
    () => localStorage.getItem(installPromptDismissedKey) === 'true'
  );

  useEffect(() => {
    if (!disabled || endTime === null) {
      return;
    }
    const id = setTimeout(() => {
      localStorage.removeItem(storageKey);
      setEndTime(null);
      setRemaining(null);
    }, 0);
    return () => clearTimeout(id);
  }, [disabled, endTime, storageKey]);

  useEffect(() => {
    if (!endTime || disabled) {
      return;
    }

    const tick = () => {
      const diff = endTime - Date.now();
      if (diff <= 0) {
        if (notificationsSupported && Notification.permission === 'granted') {
          new Notification('Sauerteig-Erinnerung', {
            body: `Die Wartezeit von ${labelForMinutes(minutes)} ist abgelaufen!`,
          });
        }
        localStorage.removeItem(storageKey);
        setEndTime(null);
        setRemaining(null);
        onExpire?.();
      } else {
        setRemaining(diff);
      }
    };

    const immediateId = setTimeout(tick, 0);
    const intervalId = setInterval(tick, 1000);

    return () => {
      clearTimeout(immediateId);
      clearInterval(intervalId);
    };
  }, [endTime, storageKey, minutes, onExpire, disabled]);

  const startTimer = async () => {
    if (notificationsSupported && permission === 'default') {
      setPermission(await Notification.requestPermission());
    }
    const end = Date.now() + minutes * 60 * 1000;
    localStorage.setItem(storageKey, String(end));
    setEndTime(end);
    if (shouldSuggestInstall() && localStorage.getItem(installPromptDismissedKey) !== 'true') {
      setShowInstallPrompt(true);
    }
  };

  const dismissInstallPrompt = () => {
    localStorage.setItem(installPromptDismissedKey, 'true');
    setInstallDismissed(true);
    setShowInstallPrompt(false);
  };

  const cancel = () => {
    localStorage.removeItem(storageKey);
    setEndTime(null);
    setRemaining(null);
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
            <button className="reminder-cancel" onClick={cancel}>
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
      {showInstallPrompt && <InstallPrompt onClose={dismissInstallPrompt} />}
    </>
  );
};
