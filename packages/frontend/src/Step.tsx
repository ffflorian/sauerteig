import {useEffect, useState} from 'react';
import {formatDistance, addMinutes} from 'date-fns';
import {de as deLocale} from 'date-fns/locale/de';

import {stepsData} from './data';
import {ReminderTimer} from './ReminderTimer';

export interface StepProps {
  onStepsChange?: () => void;
  stepNumber: number;
}

// A preparation step can only be toggled once every step above it is checked.
const isUnlocked = (checked: boolean[], index: number) => checked.slice(0, index).every(Boolean);

export const Step = ({onStepsChange, stepNumber}: StepProps) => {
  const {
    id: stepId,
    ingredients,
    manualTime,
    steps,
    subtitle,
    title,
    additionalInfo,
    importantInfo,
  } = stepsData[stepNumber - 1];

  const [checkedSteps, setCheckedSteps] = useState<boolean[]>(() =>
    steps.map(step => window.localStorage.getItem(`SauerteigStep_${step.id}`) === 'true')
  );

  const [checkedIngredients, setCheckedIngredients] = useState<boolean[]>(() => {
    try {
      const raw = window.localStorage.getItem(`SauerteigIngredients_${stepId}`);
      const stored = JSON.parse(raw ?? 'null') as boolean[] | null;
      if (Array.isArray(stored) && stored.length === ingredients.length) {
        return stored;
      }
    } catch {
      /* invalid JSON or wrong shape - fall through to default */
    }
    return ingredients.map(() => false);
  });

  // Only the preparation steps drive progress; ingredient checkboxes do not.
  const completedSteps = checkedSteps.filter(Boolean).length;

  useEffect(() => {
    onStepsChange?.();
  }, [completedSteps, onStepsChange]);

  const accumulatedCountdownMinutes = stepsData
    .slice(stepNumber - 1)
    .reduce((result, step) => result + step.otherTime + step.manualTime, 0);
  const countdownText = formatDistance(new Date(), addMinutes(new Date(), accumulatedCountdownMinutes), {
    locale: deLocale,
  });

  const toggleStep = (index: number) => {
    setCheckedSteps(prev => {
      const willCheck = !prev[index];
      // Checking fills the prefix up to here; unchecking clears everything from here down.
      const next = prev.map((v, i) => (willCheck ? v || i <= index : v && i < index));
      next.forEach((v, i) => {
        if (v !== prev[i]) {
          window.localStorage.setItem(`SauerteigStep_${steps[i].id}`, String(v));
        }
      });
      return next;
    });
  };

  const toggleIngredient = (index: number) => {
    setCheckedIngredients(prev => {
      const next = prev.map((v, i) => (i === index ? !v : v));
      window.localStorage.setItem(`SauerteigIngredients_${stepId}`, JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="part">
      <h2>
        {stepNumber}. {title}
      </h2>
      <div className="subtitle">{subtitle}</div>
      <div className="countdown">
        <strong>Zeit bis das Brot fertig ist: {countdownText}</strong>
      </div>
      <div className="time">
        <strong>Arbeitszeit: {manualTime} Minuten</strong>
      </div>
      {!!ingredients.length && (
        <>
          <h3>Zutaten</h3>
          <ul className="checklist">
            {ingredients.map((ingredient, index) => (
              <li key={index} className={checkedIngredients[index] ? 'checked' : ''}>
                <label className="checklist-label">
                  <input type="checkbox" checked={checkedIngredients[index]} onChange={() => toggleIngredient(index)} />
                  <span>{ingredient}</span>
                </label>
              </li>
            ))}
          </ul>
        </>
      )}
      <h3>Zubereitung</h3>
      <ol className="checklist">
        {steps.map((step, index) => (
          <li key={step.id} className={checkedSteps[index] ? 'checked' : ''}>
            <label className="checklist-label">
              <input
                type="checkbox"
                checked={checkedSteps[index]}
                disabled={!isUnlocked(checkedSteps, index)}
                onChange={() => toggleStep(index)}
              />
              <span>{step.text}</span>
            </label>
            {step.timerMinutes !== undefined && (
              <div className="step-timer">
                <ReminderTimer
                  disabled={checkedSteps[index]}
                  minutes={step.timerMinutes}
                  onExpire={() => toggleStep(index)}
                  storageKey={`SauerteigTimer_${step.id}`}
                />
              </div>
            )}
          </li>
        ))}
      </ol>
      {additionalInfo && <div>{additionalInfo.join(' ')}</div>}
      {importantInfo && (
        <div>
          <strong>Wichtig:</strong> {importantInfo}
        </div>
      )}
    </div>
  );
};
