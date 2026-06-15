import {useEffect, useState, useContext} from 'react';
import {introductionData, stepsData} from './data';
import {SauerteigContext} from './SauerteigContext';

export interface IntroductionComponentProps {
  onProgress?: (value: number) => void;
}

export const Introduction = ({onProgress}: IntroductionComponentProps) => {
  const {setCurrentStep} = useContext(SauerteigContext);
  const {ingredients, title} = introductionData;
  const [checkedIngredients, setCheckedIngredients] = useState<boolean[]>(() => ingredients.map(() => false));

  const completedChecks = checkedIngredients.filter(Boolean).length;

  useEffect(() => {
    onProgress?.(ingredients.length === 0 ? 0 : completedChecks / ingredients.length);
  }, [completedChecks, ingredients.length, onProgress]);

  const toggleIngredient = (index: number) => setCheckedIngredients(prev => prev.map((v, i) => (i === index ? !v : v)));

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
    </div>
  );
};
