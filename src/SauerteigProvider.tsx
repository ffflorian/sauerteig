import React, {useState} from 'react';

const storageItem = window.localStorage.getItem('SauerteigStep');

console.info(storageItem);

interface ContextProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

export const SauerteigContext = React.createContext<ContextProps>({
  currentStep: Number(storageItem) || 0,
  setCurrentStep: () => {},
});

const SauerteigProvider: React.FC<any> = ({children}) => {
  const [currentStep, setCurrentStep] = useState(Number(storageItem) || 0);

  const persistCurrentStep = (step: number) => {
    setCurrentStep(step);
    window.localStorage.setItem('SauerteigStep', step.toString());
  };

  return (
    <SauerteigContext.Provider value={{currentStep, setCurrentStep: persistCurrentStep}}>
      {children}
    </SauerteigContext.Provider>
  );
};

export default SauerteigProvider;
