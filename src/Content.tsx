import React, {useEffect, useState} from 'react';
import {Introduction} from './Introduction';
import {baseData, recipeSteps} from './data';
import {Step} from './Step';

export const Content = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const forward = () => setCurrentStep(currentStep + 1);
  const backward = () => setCurrentStep(currentStep - 1);
  const canGoBack = currentStep > 0;
  const canGoForward = currentStep < recipeSteps.length - 1;

  return (
    <>
      <div className="main">
        {currentStep === 0 ? <Introduction {...baseData} /> : <Step index={currentStep} />}
        <div>
          {canGoBack && (
            <>
              &larr;&nbsp;
              <a href="#" onClick={() => backward()}>
                Vorheriger Schritt
              </a>
            </>
          )}
          {canGoBack && canGoForward && <>&nbsp;|&nbsp;</>}
          {canGoForward && (
            <>
              <a href="#" onClick={() => forward()}>
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
