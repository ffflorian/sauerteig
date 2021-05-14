import React, {useEffect, useState} from 'react';
import {IconButton} from '@material-ui/core';
import {Github as GithubCircle} from 'mdi-material-ui';

import {Introduction} from './Introduction';
import {introductionData, stepsData} from './data';
import {Step} from './Step';

export const Content = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const goForward = () => canGoForward && setCurrentStep(currentStep + 1);
  const goBack = () => canGoBack && setCurrentStep(currentStep - 1);

  const canGoForward = currentStep < stepsData.length;
  const canGoBack = currentStep > 0;

  useEffect(() => {
    const upHandler = (event: KeyboardEvent) => {
      console.info({key: event.key});
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
  }, []);

  return (
    <>
      <div className="main">
        <h1>
          Sauerteig
          <IconButton className="icon" color="inherit" href="https://github.com/ffflorian/sauerteig">
            <GithubCircle />
          </IconButton>
        </h1>
        {currentStep === 0 ? <Introduction {...introductionData} /> : <Step index={currentStep} />}
        <div>
          {canGoBack && (
            <>
              &larr;&nbsp;
              <a href="#" onClick={() => goBack()}>
                Vorheriger Schritt
              </a>
            </>
          )}
          {canGoBack && canGoForward && <>&nbsp;|&nbsp;</>}
          {canGoForward && (
            <>
              <a href="#" onClick={() => goForward()}>
                Nächster Schritt
              </a>
              &nbsp; &rarr;
            </>
          )}
        </div>
      </div>
    </>
  );
};
