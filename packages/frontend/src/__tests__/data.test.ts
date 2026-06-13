import {describe, expect, it} from 'vitest';

import {introductionData, stepsData} from '../data';

describe('stepsData', () => {
  it('has 6 steps', () => {
    // eslint-disable-next-line no-magic-numbers
    expect(stepsData).toHaveLength(6);
  });

  it('every step has required fields', () => {
    for (const step of stepsData) {
      expect(step.id).toBeTruthy();
      expect(step.title).toBeTruthy();
      expect(Array.isArray(step.ingredients)).toBe(true);
      expect(Array.isArray(step.steps)).toBe(true);
      expect(typeof step.manualTime).toBe('number');
      expect(typeof step.otherTime).toBe('number');
    }
  });

  it('every step item has id and text', () => {
    for (const step of stepsData) {
      for (const item of step.steps) {
        expect(item.id).toBeTruthy();
        expect(item.text).toBeTruthy();
      }
    }
  });

  it('step ids are unique', () => {
    const ids = stepsData.map(step => step.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('step item ids are unique across all steps', () => {
    const ids = stepsData.flatMap(step => step.steps.map(item => item.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('timerMinutes is positive when present', () => {
    for (const step of stepsData) {
      for (const item of step.steps) {
        if (item.timerMinutes !== undefined) {
          expect(item.timerMinutes).toBeGreaterThan(0);
        }
      }
    }
  });
});

describe('introductionData', () => {
  it('has a title', () => {
    expect(introductionData.title).toBeTruthy();
  });

  it('has ingredients', () => {
    expect(introductionData.ingredients.length).toBeGreaterThan(0);
  });
});
