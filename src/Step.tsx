import React from 'react';
import {stepsData} from './data';

export interface StepProps {
  index: number;
}

export const Step: React.FC<StepProps> = ({index}) => {
  const {ingredients, manualTime, steps, subtitle, title} = stepsData[index - 1];

  return (
    <div className="part">
      <h2>
        {index}. {title}
      </h2>
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
