import {useState, useEffect, ReactNode, ReactElement, createContext} from 'react';
import {stepsData} from './data';

interface ContextProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const localStorageKey = 'SauerteigStep';

const getInitialStep = (): number => {
  const hash = window.location.hash.slice(1);
  const hashStep = parseInt(hash, 10);
  if (!isNaN(hashStep) && hashStep >= 0 && hashStep <= stepsData.length) {
    return hashStep;
  }
  const storageItem = window.localStorage.getItem(localStorageKey);
  return Number(storageItem) || 0;
};

export const SauerteigContext = createContext<ContextProps>({
  currentStep: 0,
  setCurrentStep: () => {},
});

interface SauerteigProviderProps {
  children: ReactNode | ReactElement;
}

const SauerteigProvider = ({children}: SauerteigProviderProps) => {
  const [currentStep, setCurrentStep] = useState(getInitialStep);

  useEffect(() => {
    window.location.hash = currentStep.toString();
  }, [currentStep]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      const step = parseInt(hash, 10);
      if (!isNaN(step) && step >= 0 && step <= stepsData.length) {
        setCurrentStep(step);
        window.localStorage.setItem(localStorageKey, step.toString());
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const persistCurrentStep = (step: number): void => {
    setCurrentStep(step);
    window.localStorage.setItem(localStorageKey, step.toString());
  };

  return (
    <SauerteigContext.Provider value={{currentStep, setCurrentStep: persistCurrentStep}}>
      {children}
    </SauerteigContext.Provider>
  );
};

export default SauerteigProvider;
