import {formatDistance, addMinutes} from 'date-fns';
import {de as deLocale} from 'date-fns/locale/de';

import {stepsData} from './data';

export interface StepProps {
  stepNumber: number;
}

export const Step = ({stepNumber}: StepProps) => {
  const {ingredients, manualTime, steps, subtitle, title, additionalInfo} = stepsData[stepNumber - 1];
  const accumulatedCountdownMinutes = stepsData
    .slice(stepNumber - 1)
    .reduce((result, step) => result + step.otherTime + step.manualTime, 0);
  const countdownText = formatDistance(new Date(), addMinutes(new Date(), accumulatedCountdownMinutes), {
    locale: deLocale,
  });

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
          <ul>
            {ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </>
      )}
      <h3>Zubereitung</h3>
      <ol>
        {steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
      {additionalInfo && <div>{additionalInfo.join(' ')}</div>}
    </div>
  );
};
