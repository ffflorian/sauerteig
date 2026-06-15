import {render, screen, fireEvent} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import {SauerteigContext} from '../SauerteigContext';
import {Introduction} from '../Introduction';
import {introductionData, stepsData} from '../data';

const renderWithContext = (setCurrentStep = vi.fn()) =>
  render(
    <SauerteigContext.Provider value={{currentStep: 0, setCurrentStep}}>
      <Introduction />
    </SauerteigContext.Provider>
  );

describe('Introduction', () => {
  it('renders all step titles as links', () => {
    renderWithContext();
    for (const step of stepsData) {
      expect(screen.getByRole('link', {name: step.title})).toBeInTheDocument();
    }
  });

  it('renders the ingredients section heading', () => {
    renderWithContext();
    expect(screen.getByText(introductionData.title)).toBeInTheDocument();
  });

  it('renders all ingredients', () => {
    renderWithContext();
    for (const ingredient of introductionData.ingredients) {
      expect(screen.getByText(ingredient)).toBeInTheDocument();
    }
  });

  it('all ingredient checkboxes start unchecked', () => {
    renderWithContext();
    const checkboxes = screen.getAllByRole('checkbox');
    for (const cb of checkboxes) {
      expect(cb).not.toBeChecked();
    }
  });

  it('toggling a checkbox checks it', () => {
    renderWithContext();
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();
  });

  it('allows checking ingredients in any order', () => {
    renderWithContext();
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[2]).toBeEnabled();
    fireEvent.click(checkboxes[2]);
    expect(checkboxes[2]).toBeChecked();
    expect(checkboxes[0]).not.toBeChecked();
  });

  it('toggling a checked checkbox unchecks it', () => {
    renderWithContext();
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).not.toBeChecked();
  });

  it('clicking a step link calls setCurrentStep', () => {
    const setCurrentStep = vi.fn();
    renderWithContext(setCurrentStep);
    fireEvent.click(screen.getByText(stepsData[0].title));
    expect(setCurrentStep).toHaveBeenCalledWith(1);
  });
});
