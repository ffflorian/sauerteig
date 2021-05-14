import React from 'react';
import {BaseProps} from './data';

export const BasePart: React.FC<BaseProps> = ({ingredients, title}) => {
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
