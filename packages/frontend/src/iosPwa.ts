export const isIos = (): boolean => {
  const ua = window.navigator.userAgent;
  const isIosDevice = /iphone|ipad|ipod/i.test(ua);
  // iPadOS 13+ reports a desktop user agent, so fall back to touch detection.
  const isIpadOs = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  return isIosDevice || isIpadOs;
};

export const isStandalone = (): boolean => {
  const standalone = (window.navigator as {standalone?: boolean} & Navigator).standalone;
  return standalone === true || window.matchMedia('(display-mode: standalone)').matches;
};

// iOS Safari outside the installed PWA has no Notification API, so suggest
// installing to the Home Screen where timer notifications do work (iOS 16.4+).
export const shouldSuggestInstall = (): boolean => typeof Notification === 'undefined' && isIos() && !isStandalone();
