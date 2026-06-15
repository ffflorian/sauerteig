import {render, screen, fireEvent} from '@testing-library/react';
import {describe, expect, it, vi, beforeEach} from 'vitest';
import {SauerteigContext} from '../SauerteigContext';
import {Content} from '../Content';
import {stepsData} from '../data';

vi.mock('react-swipeable', () => ({useSwipeable: () => ({})}));
vi.mock('../Introduction', () => ({Introduction: () => <div data-testid="introduction" />}));
vi.mock('../Step', () => ({Step: ({stepNumber}: {stepNumber: number}) => <div data-testid="step">{stepNumber}</div>}));

const renderContent = (currentStep: number, setCurrentStep = vi.fn()) =>
  render(
    <SauerteigContext.Provider value={{currentStep, setCurrentStep}}>
      <Content />
    </SauerteigContext.Provider>
  );

describe('Content', () => {
  beforeEach(() => window.localStorage.clear());

  it('renders Introduction at step 0', () => {
    renderContent(0);
    expect(screen.getByTestId('introduction')).toBeInTheDocument();
    expect(screen.queryByTestId('step')).not.toBeInTheDocument();
  });

  it('renders Step at step > 0', () => {
    renderContent(2);
    expect(screen.getByTestId('step')).toBeInTheDocument();
    expect(screen.queryByTestId('introduction')).not.toBeInTheDocument();
  });

  it('passes correct stepNumber to Step', () => {
    renderContent(3);
    expect(screen.getByTestId('step').textContent).toBe('3');
  });

  it('hides back button at step 0', () => {
    renderContent(0);
    expect(screen.queryByText('Vorheriger Schritt')).not.toBeInTheDocument();
  });

  it('shows back button at step > 0', () => {
    renderContent(1);
    expect(screen.getByText('Vorheriger Schritt')).toBeInTheDocument();
  });

  it('hides forward button at last step', () => {
    renderContent(stepsData.length);
    expect(screen.queryByText('Nächster Schritt')).not.toBeInTheDocument();
  });

  it('shows forward button before last step', () => {
    renderContent(0);
    expect(screen.getByText('Nächster Schritt')).toBeInTheDocument();
  });

  it('clicking next calls setCurrentStep with step+1', () => {
    const setCurrentStep = vi.fn();
    renderContent(1, setCurrentStep);
    fireEvent.click(screen.getByText('Nächster Schritt'));
    expect(setCurrentStep).toHaveBeenCalledWith(2);
  });

  it('clicking back calls setCurrentStep with step-1', () => {
    const setCurrentStep = vi.fn();
    renderContent(2, setCurrentStep);
    fireEvent.click(screen.getByText('Vorheriger Schritt'));
    expect(setCurrentStep).toHaveBeenCalledWith(1);
  });

  it('clicking the title resets to step 0', () => {
    const setCurrentStep = vi.fn();
    renderContent(3, setCurrentStep);
    fireEvent.click(screen.getByText('Sauerteig'));
    expect(setCurrentStep).toHaveBeenCalledWith(0);
  });

  it('ArrowRight fires setCurrentStep forward', () => {
    const setCurrentStep = vi.fn();
    renderContent(1, setCurrentStep);
    fireEvent.keyUp(window, {key: 'ArrowRight'});
    expect(setCurrentStep).toHaveBeenCalledWith(2);
  });

  it('ArrowLeft fires setCurrentStep back', () => {
    const setCurrentStep = vi.fn();
    renderContent(2, setCurrentStep);
    fireEvent.keyUp(window, {key: 'ArrowLeft'});
    expect(setCurrentStep).toHaveBeenCalledWith(1);
  });

  it('ArrowRight does nothing at last step', () => {
    const setCurrentStep = vi.fn();
    renderContent(stepsData.length, setCurrentStep);
    fireEvent.keyUp(window, {key: 'ArrowRight'});
    expect(setCurrentStep).not.toHaveBeenCalled();
  });

  it('shows cumulative progress across all steps from localStorage', () => {
    const allSteps = stepsData.flatMap(s => s.steps);
    window.localStorage.setItem(`SauerteigStep_${allSteps[0].id}`, 'true');
    window.localStorage.setItem(`SauerteigStep_${allSteps[1].id}`, 'true');
    renderContent(0);
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe(String(2 / allSteps.length));
  });

  it('theme toggle button is rendered', () => {
    renderContent(0);
    expect(screen.getByRole('button', {name: /mode/i})).toBeInTheDocument();
  });

  it('clicking theme toggle changes the button title', () => {
    renderContent(0);
    const btn = screen.getByRole('button', {name: /mode/i});
    const titleBefore = btn.getAttribute('title');
    fireEvent.click(btn);
    expect(btn.getAttribute('title')).not.toBe(titleBefore);
  });
});
