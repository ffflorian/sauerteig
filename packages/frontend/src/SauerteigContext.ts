import {createContext} from 'react';

interface ContextProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

export const SauerteigContext = createContext<ContextProps>({
  currentStep: 0,
  setCurrentStep: () => {},
});
