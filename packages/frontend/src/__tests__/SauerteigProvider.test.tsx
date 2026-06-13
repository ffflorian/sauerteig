import {render, screen, waitFor, act} from '@testing-library/react';
import {useContext} from 'react';
import {describe, expect, it, beforeEach, afterEach} from 'vitest';
import SauerteigProvider from '../SauerteigProvider';
import {SauerteigContext} from '../SauerteigContext';
import {stepsData} from '../data';

const Consumer = () => {
  const {currentStep, setCurrentStep} = useContext(SauerteigContext);
  return (
    <div>
      <span data-testid="step">{currentStep}</span>
      <button onClick={() => setCurrentStep(2)}>go to 2</button>
    </div>
  );
};

describe('SauerteigProvider', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.location.hash = '';
  });

  afterEach(() => {
    window.localStorage.clear();
    window.location.hash = '';
  });

  it('starts at step 0 with no stored state', () => {
    render(
      <SauerteigProvider>
        <Consumer />
      </SauerteigProvider>
    );
    expect(screen.getByTestId('step').textContent).toBe('0');
  });

  it('reads initial step from location hash', () => {
    window.location.hash = '#3';
    render(
      <SauerteigProvider>
        <Consumer />
      </SauerteigProvider>
    );
    expect(screen.getByTestId('step').textContent).toBe('3');
  });

  it('falls back to localStorage when hash is absent', () => {
    window.localStorage.setItem('SauerteigStep', '2');
    render(
      <SauerteigProvider>
        <Consumer />
      </SauerteigProvider>
    );
    expect(screen.getByTestId('step').textContent).toBe('2');
  });

  it('prefers hash over localStorage', () => {
    window.localStorage.setItem('SauerteigStep', '2');
    window.location.hash = '#4';
    render(
      <SauerteigProvider>
        <Consumer />
      </SauerteigProvider>
    );
    expect(screen.getByTestId('step').textContent).toBe('4');
  });

  it('ignores out-of-range hash values', () => {
    window.location.hash = '#99';
    render(
      <SauerteigProvider>
        <Consumer />
      </SauerteigProvider>
    );
    expect(screen.getByTestId('step').textContent).toBe('0');
  });

  it('persists step to localStorage on setCurrentStep', async () => {
    render(
      <SauerteigProvider>
        <Consumer />
      </SauerteigProvider>
    );
    screen.getByText('go to 2').click();
    await waitFor(() => expect(window.localStorage.getItem('SauerteigStep')).toBe('2'));
  });

  it('responds to hashchange events', async () => {
    render(
      <SauerteigProvider>
        <Consumer />
      </SauerteigProvider>
    );
    act(() => {
      window.location.hash = '#5';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    await waitFor(() => expect(screen.getByTestId('step').textContent).toBe('5'));
  });

  it('ignores hashchange with out-of-range step', async () => {
    render(
      <SauerteigProvider>
        <Consumer />
      </SauerteigProvider>
    );
    act(() => {
      window.location.hash = `#${stepsData.length + 5}`;
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    await waitFor(() => expect(screen.getByTestId('step').textContent).toBe('0'));
  });
});
