import 'reflect-metadata';
import {beforeEach, describe, expect, it, vi} from 'vitest';

import {PushService} from '../push/push.service.js';

vi.mock('web-push', () => ({
  default: {
    sendNotification: vi.fn().mockResolvedValue({}),
    setVapidDetails: vi.fn(),
  },
}));

vi.mock('../config/config.js', () => ({
  VAPID_PRIVATE_KEY: 'test-private',
  VAPID_PUBLIC_KEY: 'test-public',
  VAPID_SUBJECT: 'mailto:test@example.com',
}));

import webpush from 'web-push';

const mockWebpush = vi.mocked(webpush);

const makeModel = () => ({
  create: vi.fn(),
  find: vi.fn().mockResolvedValue([]),
  findByIdAndDelete: vi.fn().mockResolvedValue(null),
});

const makeSub = () => ({endpoint: 'https://push.example.com', keys: {auth: 'auth', p256dh: 'p256dh'}});

describe('PushService', () => {
  let service: PushService;
  let model: ReturnType<typeof makeModel>;

  beforeEach(() => {
    model = makeModel();
    service = new PushService(model as never);
    vi.clearAllMocks();
  });

  describe('schedule', () => {
    it('creates a document and returns its id', async () => {
      const fakeId = {toString: () => 'abc123'};
      model.create.mockResolvedValue({_id: fakeId});

      const id = await service.schedule(makeSub(), new Date(), '5 Minuten');

      expect(id).toBe('abc123');
      expect(model.create).toHaveBeenCalledWith(
        expect.objectContaining({endpoint: 'https://push.example.com', label: '5 Minuten'})
      );
    });
  });

  describe('cancel', () => {
    it('deletes the document by id', async () => {
      await service.cancel('abc123');
      expect(model.findByIdAndDelete).toHaveBeenCalledWith('abc123');
    });
  });

  describe('sendDue', () => {
    it('does nothing when no notifications are due', async () => {
      await service.sendDue();
      expect(mockWebpush.sendNotification).not.toHaveBeenCalled();
    });

    it('sends a push and deletes the document for each due notification', async () => {
      const doc = {_id: 'doc1', auth: 'a', endpoint: 'https://push.example.com', label: '5 Minuten', p256dh: 'p'};
      model.find.mockResolvedValue([doc]);

      await service.sendDue();

      expect(mockWebpush.sendNotification).toHaveBeenCalledWith(
        {endpoint: doc.endpoint, keys: {auth: doc.auth, p256dh: doc.p256dh}},
        expect.stringContaining('5 Minuten')
      );
      expect(model.findByIdAndDelete).toHaveBeenCalledWith('doc1');
    });

    it('sends to multiple due documents', async () => {
      const docs = [
        {_id: 'doc1', auth: 'a', endpoint: 'https://push1.example.com', label: '5 Min', p256dh: 'p'},
        {_id: 'doc2', auth: 'b', endpoint: 'https://push2.example.com', label: '10 Min', p256dh: 'q'},
      ];
      model.find.mockResolvedValue(docs);

      await service.sendDue();

      expect(mockWebpush.sendNotification).toHaveBeenCalledTimes(2);
      expect(model.findByIdAndDelete).toHaveBeenCalledTimes(2);
    });

    it('deletes document on 410 error (subscription gone)', async () => {
      const doc = {_id: 'doc1', auth: 'a', endpoint: 'https://push.example.com', label: '5 Min', p256dh: 'p'};
      model.find.mockResolvedValue([doc]);
      mockWebpush.sendNotification.mockRejectedValueOnce({statusCode: 410});

      await service.sendDue();

      expect(model.findByIdAndDelete).toHaveBeenCalledWith('doc1');
    });

    it('deletes document on 404 error (not found)', async () => {
      const doc = {_id: 'doc1', auth: 'a', endpoint: 'https://push.example.com', label: '5 Min', p256dh: 'p'};
      model.find.mockResolvedValue([doc]);
      mockWebpush.sendNotification.mockRejectedValueOnce({statusCode: 404});

      await service.sendDue();

      expect(model.findByIdAndDelete).toHaveBeenCalledWith('doc1');
    });

    it('does not delete on other errors', async () => {
      const doc = {_id: 'doc1', auth: 'a', endpoint: 'https://push.example.com', label: '5 Min', p256dh: 'p'};
      model.find.mockResolvedValue([doc]);
      mockWebpush.sendNotification.mockRejectedValueOnce({statusCode: 500});

      await service.sendDue();

      expect(model.findByIdAndDelete).not.toHaveBeenCalled();
    });
  });
});
