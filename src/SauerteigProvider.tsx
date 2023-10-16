import {useState, ReactNode, ReactElement, createContext} from 'react';

interface ContextProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const localStorageKey = 'SauerteigStep';
const storageItem = window.localStorage.getItem(localStorageKey);

export const SauerteigContext = createContext<ContextProps>({
  currentStep: Number(storageItem) || 0,
  setCurrentStep: () => {},
});

interface SauerteigProviderProps {
  children: ReactNode | ReactElement;
}

const SauerteigProvider = ({children}: SauerteigProviderProps) => {
  const [currentStep, setCurrentStep] = useState(Number(storageItem) || 0);

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
