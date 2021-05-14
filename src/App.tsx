import React from 'react';
import {BasePart} from './BasePart';
import {recipeSteps, baseData} from './data';
import {Step} from './Step';

const App = () => (
  <div className="main">
    <BasePart {...baseData} />
    {recipeSteps.map((step, index) => (
      <Step key={index} {...step} />
    ))}
  </div>
);

export default App;
