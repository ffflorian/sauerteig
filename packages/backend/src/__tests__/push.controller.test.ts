import 'reflect-metadata';
import {beforeEach, describe, expect, it, vi} from 'vitest';

import {PushController} from '../push/push.controller.js';
import {PushService} from '../push/push.service.js';

vi.mock('../push/push.service.js');
vi.mock('../config/config.js', () => ({
  VAPID_PRIVATE_KEY: 'test-private',
  VAPID_PUBLIC_KEY: 'test-public',
  VAPID_SUBJECT: 'mailto:test@example.com',
}));

describe('PushController', () => {
  let controller: PushController;
  let mockService: {cancel: ReturnType<typeof vi.fn>; schedule: ReturnType<typeof vi.fn>};

  beforeEach(() => {
    mockService = {
      cancel: vi.fn().mockResolvedValue(undefined),
      schedule: vi.fn().mockResolvedValue('new-timer-id'),
    };
    controller = new PushController(mockService as unknown as PushService);
  });

  it('cancel delegates to service', async () => {
    await controller.cancel('abc123');
    expect(mockService.cancel).toHaveBeenCalledWith('abc123');
  });

  it('schedule delegates to service and returns timerId', async () => {
    const dto = {
      expiresAt: Date.now() + 60_000,
      label: 'Test',
      subscription: {endpoint: 'https://push.example.com', keys: {auth: 'auth', p256dh: 'p256dh'}},
    };
    const result = await controller.schedule(dto);
    expect(mockService.schedule).toHaveBeenCalledWith(dto.subscription, expect.any(Date), dto.label);
    expect(result).toEqual({timerId: 'new-timer-id'});
  });
});
