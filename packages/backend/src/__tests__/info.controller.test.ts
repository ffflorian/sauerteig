import 'reflect-metadata';
import {describe, expect, it} from 'vitest';

import {COMMIT, VERSION} from '../config/config.js';
import {InfoController} from '../info/info.controller.js';

describe('InfoController', () => {
  it('info() returns version and commit', () => {
    const controller = new InfoController();
    expect(controller.info()).toEqual({commit: COMMIT, version: VERSION});
  });
});
