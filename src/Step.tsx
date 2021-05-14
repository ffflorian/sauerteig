import React from 'react';
import {StepProps} from './data';

export const Step: React.FC<StepProps> = ({ingredients, manualTime, steps, subtitle, title}) => {
  return (
    <div className="part">
      <h2>{title}</h2>
      <div className="subtitle">{subtitle}</div>
      <div className="time">
        <strong>Arbeitszeit: {manualTime} Minuten</strong>
      </div>
      {!!ingredients.length && (
        <>
          Man nehme:
          <ul>
            {ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </>
      )}
      <ol>
        {steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    </div>
  );
};
