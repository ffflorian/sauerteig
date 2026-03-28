import {useEffect, useContext, useState} from 'react';
import {useSwipeable} from 'react-swipeable';

import {Introduction} from './Introduction';
import {stepsData} from './data';
import {Step} from './Step';
import {SauerteigContext} from './SauerteigProvider';

type Theme = 'dark' | 'light';
const themeStorageKey = 'SauerteigTheme';

const getInitialTheme = (): Theme | null => {
  const stored = window.localStorage.getItem(themeStorageKey);
  if (stored === 'dark' || stored === 'light') {
    return stored;
  }
  return null;
};

export const Content = () => {
  const {currentStep, setCurrentStep} = useContext(SauerteigContext);
  const [theme, setTheme] = useState<Theme | null>(getInitialTheme);

  useEffect(() => {
    if (theme) {
      document.documentElement.dataset.theme = theme;
      window.localStorage.setItem(themeStorageKey, theme);
    } else {
      delete document.documentElement.dataset.theme;
      window.localStorage.removeItem(themeStorageKey);
    }
  }, [theme]);

  const goForward = () => canGoForward && setCurrentStep(currentStep + 1);
  const goBack = () => canGoBack && setCurrentStep(currentStep - 1);

  const canGoForward = currentStep < stepsData.length;
  const canGoBack = currentStep > 0;

  const handlers = useSwipeable({
    onSwipedLeft: () => goForward(),
    onSwipedRight: () => goBack(),
  });

  useEffect(() => {
    const upHandler = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowRight': {
          goForward();
          break;
        }
        case 'ArrowLeft': {
          goBack();
          break;
        }
      }
      return true;
    };

    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keyup', upHandler);
    };
  }, [currentStep]);

  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentIsDark = theme === 'dark' || (theme === null && systemPrefersDark);
  const toggleTheme = () => setTheme(currentIsDark ? 'light' : 'dark');

  return (
    <div className="main" {...handlers}>
      <div className="header">
        <div className="pageTitle" onClick={() => setCurrentStep(0)}>
          <img src="img/sauerteig_32.png" alt="A loaf of bread" /> <span>Sauerteig</span>
        </div>
        <button
          className="themeToggle"
          onClick={toggleTheme}
          title={currentIsDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {currentIsDark ? '☀️' : '🌙'}
        </button>
      </div>
      {currentStep === 0 ? <Introduction /> : <Step stepNumber={currentStep} />}
      <div className="navigation">
        {canGoBack && (
          <span className="previous" onClick={() => goBack()}>
            &larr;&nbsp;
            <span>Vorheriger Schritt</span>
          </span>
        )}
        {canGoForward && (
          <div className={`next${canGoBack ? ' float' : ''}`} onClick={() => goForward()}>
            <span>Nächster Schritt</span>
            &nbsp; &rarr;
          </div>
        )}
      </div>
      <div className="footer">
        Made with ❤️ in Berlin by <a href="https://github.com/ffflorian">Florian Imdahl</a>. Icon by{' '}
        <a href="https://freeicons.io/profile/6156">Reda</a> on <a href="https://freeicons.io">freeicons.io</a>. Source
        code on <a href="https://github.com/ffflorian/sauerteig">GitHub</a>.
      </div>
    </div>
  );
};
