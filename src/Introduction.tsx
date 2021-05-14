import React from 'react';
import {introductionData, stepsData} from './data';

interface IntroductionProps {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

export const Introduction: React.FC<IntroductionProps> = ({setCurrentStep}) => {
  const {ingredients, title} = introductionData;

  return (
    <div className="part">
      <h2>Inhalt</h2>
      <div className="contents">
        <ol>
          {stepsData.map((stepData, index) => (
            <li key={index}>
              <a href="#" onClick={() => setCurrentStep(index + 1)}>
                {stepData.title}
              </a>{' '}
              {stepData.subtitle}
            </li>
          ))}
        </ol>
      </div>
      <h2>{title}</h2>
      Benötigt werden:
      <ul>
        {ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
    </div>
  );
};
