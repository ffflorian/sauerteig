import React from 'react';
import {IntroductionProps} from './data';

export const Introduction: React.FC<IntroductionProps> = ({ingredients, title}) => {
  return (
    <div className="part">
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
