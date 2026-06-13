import 'reflect-metadata';
import {describe, expect, it} from 'vitest';

import {HealthController} from '../health/health.controller.js';

describe('HealthController', () => {
  it('check() returns undefined', () => {
    const controller = new HealthController();
    expect(controller.check()).toBeUndefined();
  });
});
