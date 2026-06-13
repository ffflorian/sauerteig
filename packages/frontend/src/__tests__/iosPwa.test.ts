import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {isIos, isStandalone, shouldSuggestInstall} from '../iosPwa';

describe('isIos', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('returns true for iPhone user agent', () => {
    vi.stubGlobal('navigator', {
      maxTouchPoints: 0,
      platform: 'iPhone',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0)',
    });
    expect(isIos()).toBe(true);
  });

  it('returns true for iPad user agent', () => {
    vi.stubGlobal('navigator', {maxTouchPoints: 0, platform: 'iPad', userAgent: 'Mozilla/5.0 (iPad; CPU OS 16_0)'});
    expect(isIos()).toBe(true);
  });

  it('returns true for iPodTouch user agent', () => {
    vi.stubGlobal('navigator', {maxTouchPoints: 0, platform: 'iPod', userAgent: 'Mozilla/5.0 (iPod touch)'});
    expect(isIos()).toBe(true);
  });

  it('returns true for iPadOS 13+ (MacIntel + touch points)', () => {
    vi.stubGlobal('navigator', {
      maxTouchPoints: 5,
      platform: 'MacIntel',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)',
    });
    expect(isIos()).toBe(true);
  });

  it('returns false for desktop Windows', () => {
    vi.stubGlobal('navigator', {
      maxTouchPoints: 0,
      platform: 'Win32',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    });
    expect(isIos()).toBe(false);
  });

  it('returns false for desktop Mac without touch', () => {
    vi.stubGlobal('navigator', {
      maxTouchPoints: 0,
      platform: 'MacIntel',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)',
    });
    expect(isIos()).toBe(false);
  });
});

describe('isStandalone', () => {
  beforeEach(() => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({matches: false}));
  });
  afterEach(() => vi.unstubAllGlobals());

  it('returns true when navigator.standalone is true', () => {
    vi.stubGlobal('navigator', {maxTouchPoints: 0, platform: '', standalone: true, userAgent: ''});
    expect(isStandalone()).toBe(true);
  });

  it('returns true when display-mode media matches standalone', () => {
    vi.stubGlobal('navigator', {maxTouchPoints: 0, platform: '', standalone: undefined, userAgent: ''});
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({matches: true}));
    expect(isStandalone()).toBe(true);
  });

  it('returns false in a regular browser tab', () => {
    vi.stubGlobal('navigator', {maxTouchPoints: 0, platform: '', standalone: undefined, userAgent: ''});
    expect(isStandalone()).toBe(false);
  });
});

describe('shouldSuggestInstall', () => {
  beforeEach(() => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({matches: false}));
  });
  afterEach(() => vi.unstubAllGlobals());

  it('returns true on iOS Safari (no Notification API, not standalone)', () => {
    vi.stubGlobal('Notification', undefined);
    vi.stubGlobal('navigator', {
      maxTouchPoints: 0,
      platform: 'iPhone',
      standalone: undefined,
      userAgent: 'Mozilla/5.0 (iPhone)',
    });
    expect(shouldSuggestInstall()).toBe(true);
  });

  it('returns false when Notification API is present', () => {
    // Notification is defined by our test setup
    vi.stubGlobal('navigator', {
      maxTouchPoints: 0,
      platform: 'iPhone',
      standalone: undefined,
      userAgent: 'Mozilla/5.0 (iPhone)',
    });
    expect(shouldSuggestInstall()).toBe(false);
  });

  it('returns false when already installed (standalone)', () => {
    vi.stubGlobal('Notification', undefined);
    vi.stubGlobal('navigator', {
      maxTouchPoints: 0,
      platform: 'iPhone',
      standalone: true,
      userAgent: 'Mozilla/5.0 (iPhone)',
    });
    expect(shouldSuggestInstall()).toBe(false);
  });

  it('returns false on non-iOS even without Notification', () => {
    vi.stubGlobal('Notification', undefined);
    vi.stubGlobal('navigator', {
      maxTouchPoints: 0,
      platform: 'Win32',
      standalone: undefined,
      userAgent: 'Mozilla/5.0 (Windows)',
    });
    expect(shouldSuggestInstall()).toBe(false);
  });
});
