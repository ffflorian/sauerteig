import {useContext} from 'react';
import {introductionData, stepsData} from './data';
import {SauerteigContext} from './SauerteigProvider';

export const Introduction = () => {
  const {setCurrentStep} = useContext(SauerteigContext);
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
