import 'reflect-metadata';
import {beforeEach, describe, expect, it, vi} from 'vitest';

import {PushScheduler} from '../push/push.scheduler.js';
import {PushService} from '../push/push.service.js';

vi.mock('../push/push.service.js');
vi.mock('../config/config.js', () => ({
  VAPID_PRIVATE_KEY: '',
  VAPID_PUBLIC_KEY: '',
  VAPID_SUBJECT: 'mailto:test@example.com',
}));

describe('PushScheduler', () => {
  let scheduler: PushScheduler;
  let mockService: {sendDue: ReturnType<typeof vi.fn>};

  beforeEach(() => {
    mockService = {sendDue: vi.fn().mockResolvedValue(undefined)};
    scheduler = new PushScheduler(mockService as unknown as PushService);
  });

  it('sendDue delegates to push service', async () => {
    await scheduler.sendDue();
    expect(mockService.sendDue).toHaveBeenCalledOnce();
  });
});
