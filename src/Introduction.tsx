import React from 'react';
import {IntroductionProps} from './data';

export const Introduction: React.FC<IntroductionProps> = ({ingredients, title}) => {
  return (
    <div className="part">
      <h1>{title}</h1>
      Benötigt werden:
      <ul>
        {ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
    </div>
  );
};
