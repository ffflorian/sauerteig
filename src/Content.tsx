import React, {useEffect, useState} from 'react';
import {useSwipeable} from 'react-swipeable';

import {Introduction} from './Introduction';
import {stepsData} from './data';
import {Step} from './Step';

export const Content = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const goForward = () => canGoForward && setCurrentStep(previousStep => previousStep + 1);
  const goBack = () => canGoBack && setCurrentStep(previousStep => previousStep - 1);

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

  return (
    <div className="main" {...handlers}>
      <div className="pageTitle" onClick={() => setCurrentStep(0)}>
        <img src="img/sauerteig_32.png" /> <span>Sauerteig</span>
      </div>
      {currentStep === 0 ? <Introduction setCurrentStep={setCurrentStep} /> : <Step stepNumber={currentStep} />}
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
