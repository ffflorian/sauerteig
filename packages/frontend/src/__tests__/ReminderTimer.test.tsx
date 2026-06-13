import {render, screen, fireEvent, act} from '@testing-library/react';
import {describe, expect, it, vi, beforeEach, afterEach} from 'vitest';
import {ReminderTimer} from '../ReminderTimer';

vi.mock('../InstallPrompt', () => ({
  InstallPrompt: ({onClose}: {onClose: () => void}) => (
    <div data-testid="install-prompt">
      <button onClick={onClose}>close</button>
    </div>
  ),
}));
vi.mock('../iosPwa', () => ({shouldSuggestInstall: () => false}));

const MockNotification = window.Notification as unknown as {
  permission: NotificationPermission;
  requestPermission: ReturnType<typeof vi.fn>;
};

const startTimer = async (_minutes = 5) => {
  await act(async () => {
    fireEvent.click(screen.getByRole('button', {name: /Erinnere mich/}));
  });
  // Fire the immediate setTimeout(tick, 0) that sets `remaining`
  act(() => vi.advanceTimersByTime(0));
};

describe('ReminderTimer', () => {
  beforeEach(() => {
    window.localStorage.clear();
    MockNotification.permission = 'default';
    MockNotification.requestPermission = vi.fn().mockResolvedValue('granted');
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('renders the start button with the formatted duration', () => {
    render(<ReminderTimer minutes={30} storageKey="test-timer" />);
    expect(screen.getByRole('button', {name: /Erinnere mich/})).toBeInTheDocument();
    expect(screen.getByText(/30 Minuten/)).toBeInTheDocument();
  });

  it('start button is disabled when disabled prop is true', () => {
    render(<ReminderTimer minutes={30} storageKey="test-timer" disabled />);
    expect(screen.getByRole('button', {name: /Erinnere mich/})).toBeDisabled();
  });

  it('returns null when notification permission is denied', () => {
    MockNotification.permission = 'denied';
    const {container} = render(<ReminderTimer minutes={30} storageKey="test-timer" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('starting the timer persists endTime to localStorage', async () => {
    render(<ReminderTimer minutes={5} storageKey="test-timer" />);
    await startTimer();
    expect(window.localStorage.getItem('test-timer')).not.toBeNull();
  });

  it('starting the timer shows the countdown', async () => {
    render(<ReminderTimer minutes={5} storageKey="test-timer" />);
    await startTimer();
    expect(screen.getByText(/Noch/)).toBeInTheDocument();
  });

  it('requests notification permission on first start', async () => {
    render(<ReminderTimer minutes={5} storageKey="test-timer" />);
    await startTimer();
    expect(MockNotification.requestPermission).toHaveBeenCalled();
  });

  it('does not request permission when already granted', async () => {
    MockNotification.permission = 'granted';
    render(<ReminderTimer minutes={5} storageKey="test-timer" />);
    await startTimer();
    expect(MockNotification.requestPermission).not.toHaveBeenCalled();
  });

  it('cancel button removes timer and shows start button', async () => {
    render(<ReminderTimer minutes={5} storageKey="test-timer" />);
    await startTimer();
    fireEvent.click(screen.getByText('Abbrechen'));
    expect(window.localStorage.getItem('test-timer')).toBeNull();
    expect(screen.getByRole('button', {name: /Erinnere mich/})).toBeInTheDocument();
  });

  it('reads active endTime from localStorage on mount', async () => {
    const futureTime = Date.now() + 10 * 60 * 1000;
    window.localStorage.setItem('test-timer', String(futureTime));
    render(<ReminderTimer minutes={10} storageKey="test-timer" />);
    act(() => vi.advanceTimersByTime(0));
    expect(screen.getByText(/Noch/)).toBeInTheDocument();
  });

  it('fires onExpire and shows start button when timer expires', async () => {
    MockNotification.permission = 'granted';
    const onExpire = vi.fn();
    render(<ReminderTimer minutes={1} storageKey="test-timer" onExpire={onExpire} />);
    await startTimer(1);
    act(() => vi.advanceTimersByTime(60_000));
    expect(onExpire).toHaveBeenCalledOnce();
    expect(screen.getByRole('button', {name: /Erinnere mich/})).toBeInTheDocument();
  });

  it('disabling an active timer clears it after a tick', async () => {
    const {rerender} = render(<ReminderTimer minutes={5} storageKey="test-timer" />);
    await startTimer();
    expect(screen.getByText('Abbrechen')).toBeInTheDocument();
    act(() => rerender(<ReminderTimer minutes={5} storageKey="test-timer" disabled />));
    act(() => vi.advanceTimersByTime(0));
    expect(window.localStorage.getItem('test-timer')).toBeNull();
  });

  it('schedules a backend push notification on start', async () => {
    render(<ReminderTimer minutes={5} storageKey="test-timer" />);
    await startTimer();
    await act(async () => {});
    expect(vi.mocked(fetch)).toHaveBeenCalledWith(expect.stringContaining('/push/schedule'), expect.any(Object));
  });
});
