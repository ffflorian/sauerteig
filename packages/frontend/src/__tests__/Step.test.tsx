import {render, screen, fireEvent} from '@testing-library/react';
import {describe, expect, it, vi, beforeEach} from 'vitest';
import {Step} from '../Step';
import {stepsData} from '../data';

vi.mock('../ReminderTimer', () => ({
  ReminderTimer: ({minutes, disabled}: {minutes: number; disabled: boolean}) => (
    <div data-testid="reminder-timer" data-disabled={String(disabled)}>
      {minutes}
    </div>
  ),
}));

describe('Step', () => {
  beforeEach(() => window.localStorage.clear());

  const stepWithIngredients = stepsData.findIndex(s => s.ingredients.length > 0) + 1;
  const stepWithTimer = stepsData.findIndex(s => s.steps.some(i => i.timerMinutes !== undefined)) + 1;
  const stepWithAdditional = stepsData.findIndex(s => s.additionalInfo !== undefined) + 1;
  const stepWithImportant = stepsData.findIndex(s => s.importantInfo !== undefined) + 1;

  it('renders the step title', () => {
    render(<Step stepNumber={1} />);
    expect(screen.getByRole('heading', {name: `1. ${stepsData[0].title}`})).toBeInTheDocument();
  });

  it('renders the countdown time', () => {
    render(<Step stepNumber={1} />);
    expect(screen.getByText(/Zeit bis das Brot fertig ist/)).toBeInTheDocument();
  });

  it('renders the manual work time', () => {
    render(<Step stepNumber={1} />);
    expect(screen.getByText(/Arbeitszeit/)).toBeInTheDocument();
  });

  it('renders the ingredients section when ingredients exist', () => {
    render(<Step stepNumber={stepWithIngredients} />);
    expect(screen.getByText('Zutaten')).toBeInTheDocument();
    for (const ingredient of stepsData[stepWithIngredients - 1].ingredients) {
      expect(screen.getByText(ingredient)).toBeInTheDocument();
    }
  });

  it('does not render ingredients section for step with no ingredients', () => {
    const emptyStep = stepsData.findIndex(s => s.ingredients.length === 0) + 1;
    render(<Step stepNumber={emptyStep} />);
    expect(screen.queryByText('Zutaten')).not.toBeInTheDocument();
  });

  it('renders all preparation steps', () => {
    render(<Step stepNumber={1} />);
    const uniqueTexts = new Set(stepsData[0].steps.map(i => i.text));
    for (const text of uniqueTexts) {
      expect(screen.getAllByText(text, {selector: 'span'})[0]).toBeInTheDocument();
    }
  });

  it('toggling a step checkbox checks it and persists to localStorage', () => {
    render(<Step stepNumber={1} />);
    const checkboxes = screen.getAllByRole('checkbox');
    const ingredientCount = stepsData[0].ingredients.length;
    fireEvent.click(checkboxes[ingredientCount]);
    expect(checkboxes[ingredientCount]).toBeChecked();
    expect(window.localStorage.getItem(`SauerteigStep_${stepsData[0].steps[0].id}`)).toBe('true');
  });

  it('toggling a checked step unchecks it', () => {
    render(<Step stepNumber={1} />);
    const checkboxes = screen.getAllByRole('checkbox');
    const ingredientCount = stepsData[0].ingredients.length;
    fireEvent.click(checkboxes[ingredientCount]);
    fireEvent.click(checkboxes[ingredientCount]);
    expect(checkboxes[ingredientCount]).not.toBeChecked();
    expect(window.localStorage.getItem(`SauerteigStep_${stepsData[0].steps[0].id}`)).toBe('false');
  });

  it('toggling an ingredient checkbox persists to localStorage', () => {
    render(<Step stepNumber={stepWithIngredients} />);
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();
    const stored = JSON.parse(
      window.localStorage.getItem(`SauerteigIngredients_${stepsData[stepWithIngredients - 1].id}`)!
    );
    expect(stored[0]).toBe(true);
  });

  it('restores step state from localStorage', () => {
    const step = stepsData[0];
    window.localStorage.setItem(`SauerteigStep_${step.steps[0].id}`, 'true');
    render(<Step stepNumber={1} />);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[step.ingredients.length]).toBeChecked();
  });

  it('restores ingredient state from localStorage', () => {
    const step = stepsData[stepWithIngredients - 1];
    const stored = step.ingredients.map((_, i) => i === 0);
    window.localStorage.setItem(`SauerteigIngredients_${step.id}`, JSON.stringify(stored));
    render(<Step stepNumber={stepWithIngredients} />);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it('ignores invalid JSON in ingredient localStorage', () => {
    const step = stepsData[stepWithIngredients - 1];
    window.localStorage.setItem(`SauerteigIngredients_${step.id}`, 'not-json');
    render(<Step stepNumber={stepWithIngredients} />);
    const checkboxes = screen.getAllByRole('checkbox');
    for (const cb of checkboxes) {
      expect(cb).not.toBeChecked();
    }
  });

  it('shows ReminderTimer for steps with timerMinutes', () => {
    render(<Step stepNumber={stepWithTimer} />);
    expect(screen.getAllByTestId('reminder-timer').length).toBeGreaterThan(0);
  });

  it('passes disabled=true to ReminderTimer when step is checked', () => {
    render(<Step stepNumber={stepWithTimer} />);
    const step = stepsData[stepWithTimer - 1];
    const timerStepIndex = step.steps.findIndex(i => i.timerMinutes !== undefined);
    const checkboxes = screen.getAllByRole('checkbox');
    // The checkboxes cover ingredients first, then steps — find the step checkbox
    const ingredientCount = step.ingredients.length;
    // Steps unlock sequentially, so check every step up to and including the timer's step.
    for (let i = 0; i <= timerStepIndex; i++) {
      fireEvent.click(checkboxes[ingredientCount + i]);
    }
    const timers = screen.getAllByTestId('reminder-timer');
    expect(timers[0].dataset.disabled).toBe('true');
  });

  it('notifies on preparation step changes but not ingredient changes', () => {
    const onStepsChange = vi.fn();
    render(<Step stepNumber={stepWithIngredients} onStepsChange={onStepsChange} />);
    const step = stepsData[stepWithIngredients - 1];
    const checkboxes = screen.getAllByRole('checkbox');

    onStepsChange.mockClear();
    // Toggling an ingredient must not affect progress.
    fireEvent.click(checkboxes[0]);
    expect(onStepsChange).not.toHaveBeenCalled();

    // Toggling a preparation step notifies the parent.
    fireEvent.click(checkboxes[step.ingredients.length]);
    expect(onStepsChange).toHaveBeenCalled();
  });

  it('disables a preparation step until the previous one is checked', () => {
    render(<Step stepNumber={1} />);
    const ingredientCount = stepsData[0].ingredients.length;
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[ingredientCount]).toBeEnabled();
    expect(checkboxes[ingredientCount + 1]).toBeDisabled();
    fireEvent.click(checkboxes[ingredientCount]);
    expect(checkboxes[ingredientCount + 1]).toBeEnabled();
  });

  it('unchecking a step also unchecks the steps below it', () => {
    render(<Step stepNumber={1} />);
    const ingredientCount = stepsData[0].ingredients.length;
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[ingredientCount]); // check step 1
    fireEvent.click(checkboxes[ingredientCount + 1]); // check step 2
    expect(checkboxes[ingredientCount + 1]).toBeChecked();
    fireEvent.click(checkboxes[ingredientCount]); // uncheck step 1
    expect(checkboxes[ingredientCount]).not.toBeChecked();
    expect(checkboxes[ingredientCount + 1]).not.toBeChecked();
    expect(window.localStorage.getItem(`SauerteigStep_${stepsData[0].steps[1].id}`)).toBe('false');
  });

  it('renders additionalInfo when present', () => {
    render(<Step stepNumber={stepWithAdditional} />);
    const step = stepsData[stepWithAdditional - 1];
    for (const info of step.additionalInfo!) {
      expect(screen.getByText(new RegExp(info.slice(0, 20)))).toBeInTheDocument();
    }
  });

  it('renders importantInfo when present', () => {
    render(<Step stepNumber={stepWithImportant} />);
    expect(screen.getByText('Wichtig:')).toBeInTheDocument();
  });
});
