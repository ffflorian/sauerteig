import '@testing-library/jest-dom';
import {vi} from 'vitest';

function createMemoryStorage(): Storage {
  const store = new Map<string, string>();
  return {
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.get(key) ?? null;
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null;
    },
    get length() {
      return store.size;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
  };
}

const localStorageMock = createMemoryStorage();

Object.defineProperty(window, 'localStorage', {configurable: true, value: localStorageMock});
Object.defineProperty(globalThis, 'localStorage', {configurable: true, value: localStorageMock});

// matchMedia (not in jsdom)
Object.defineProperty(window, 'matchMedia', {
  configurable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    addEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    matches: false,
    media: query,
    onchange: null,
    removeEventListener: vi.fn(),
  })),
  writable: true,
});

// Notification API (not in jsdom)
class MockNotification {
  static permission: NotificationPermission = 'default';
  static requestPermission = vi.fn<[], Promise<NotificationPermission>>().mockResolvedValue('granted');
  options?: NotificationOptions;
  title: string;
  constructor(title: string, options?: NotificationOptions) {
    this.title = title;
    this.options = options;
  }
}
Object.defineProperty(window, 'Notification', {configurable: true, value: MockNotification, writable: true});

// PushManager + serviceWorker — so pushSupported=true in ReminderTimer
class MockPushManager {}
Object.defineProperty(window, 'PushManager', {configurable: true, value: MockPushManager, writable: true});
Object.defineProperty(navigator, 'serviceWorker', {
  configurable: true,
  value: {
    ready: Promise.resolve({
      pushManager: {
        getSubscription: vi.fn().mockResolvedValue(null),
        subscribe: vi.fn().mockResolvedValue({
          toJSON: () => ({endpoint: 'https://push.example.com', keys: {auth: 'auth', p256dh: 'p256dh'}}),
        }),
      },
    }),
  },
});

// fetch
global.fetch = vi.fn().mockResolvedValue({
  json: vi.fn().mockResolvedValue({timerId: 'mock-timer-id'}),
  ok: true,
});
