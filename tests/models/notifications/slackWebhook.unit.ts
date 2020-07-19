import { expect } from 'chai';
import { DateTime } from 'luxon';

import { SlackWebhookNotificationConfig } from '../../../src/models/notifications/slackWebhook';
import { ORIGIN_TYPE } from '../../../src/models/notifications';

describe('slackWebhook unit test', () => {
  it('create', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();

    const params = {
      routineId: 'routine-id',
      projectId: 'project-id',
      name: 'some-name',
      webhookUrl: 'https://hooks.slack.com/thing',
      origin: ORIGIN_TYPE.PUBLIC,
    };
    const slackWebhook = SlackWebhookNotificationConfig.create(params, curDate);

    const expected = {
      id: 'nt-sw-Z1huH3N',
      type: 'slackWebhook',
      name: 'some-name',
      verified: true,
      enabled: true,
      projectId: 'project-id',
      routineId: 'routine-id',
      createdAt: curDate,
      updatedAt: curDate,
      webhookUrl: 'https://hooks.slack.com/thing',
      origin: ORIGIN_TYPE.PUBLIC,
    };
    expect(slackWebhook).to.eql(expected);
  });

  it('fail with non-url', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();

    const params = {
      routineId: 'routine-id',
      projectId: 'project-id',
      name: 'some-name',
      webhookUrl: 'not-slack',
      origin: ORIGIN_TYPE.PUBLIC,
    };
    expect(() => SlackWebhookNotificationConfig.create(params, curDate)).to.throw('webhook URL must start with: https://hooks.slack.com');
  });

  it('fail with non-slackWebhook', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();

    const params = {
      routineId: 'routine-id',
      projectId: 'project-id',
      name: 'some-name',
      webhookUrl: 'https://hooks.slack.com=====',
      origin: ORIGIN_TYPE.PUBLIC,
    };
    expect(() => SlackWebhookNotificationConfig.create(params, curDate)).to.throw('webhookUrl must be an URL address');
  });

  it('allow discord slack webhook', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();

    const params = {
      routineId: 'routine-id',
      projectId: 'project-id',
      name: 'some-name',
      webhookUrl: 'https://discord.com/api/webhooks/webhookid/webhooktoken/slack',
      origin: ORIGIN_TYPE.PUBLIC,
    };
    const slackWebhook = SlackWebhookNotificationConfig.create(params, curDate);

    const expected = {
      id: 'nt-sw-Z1qJHRV',
      type: 'slackWebhook',
      name: 'some-name',
      verified: true,
      enabled: true,
      projectId: 'project-id',
      routineId: 'routine-id',
      createdAt: curDate,
      updatedAt: curDate,
      webhookUrl: 'https://discord.com/api/webhooks/webhookid/webhooktoken/slack',
      origin: ORIGIN_TYPE.PUBLIC,
    };
    expect(slackWebhook).to.eql(expected);
  });

  it('allow alternate discord slack webhook', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();

    const params = {
      routineId: 'routine-id',
      projectId: 'project-id',
      name: 'some-name',
      // eslint-disable-next-line no-secrets/no-secrets
      webhookUrl: 'https://discordapp.com/api/webhooks/734445338/0LszcWnJ5VLBxH2E5If8c21XHYQLdINUM6TpVAcV9qkCVN/slack',
      origin: ORIGIN_TYPE.PUBLIC,
    };
    const slackWebhook = SlackWebhookNotificationConfig.create(params, curDate);

    const expected = {
      id: 'nt-sw-WovjX',
      type: 'slackWebhook',
      name: 'some-name',
      verified: true,
      enabled: true,
      projectId: 'project-id',
      routineId: 'routine-id',
      createdAt: curDate,
      updatedAt: curDate,
      // eslint-disable-next-line no-secrets/no-secrets
      webhookUrl: 'https://discordapp.com/api/webhooks/734445338/0LszcWnJ5VLBxH2E5If8c21XHYQLdINUM6TpVAcV9qkCVN/slack',
      origin: ORIGIN_TYPE.PUBLIC,
    };
    expect(slackWebhook).to.eql(expected);
  });

  it('allow discord slack webhook with trailing slash', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();

    const params = {
      routineId: 'routine-id',
      projectId: 'project-id',
      name: 'some-name',
      webhookUrl: 'https://discord.com/api/webhooks/webhookid/webhooktoken/slack/',
      origin: ORIGIN_TYPE.PUBLIC,
    };
    const slackWebhook = SlackWebhookNotificationConfig.create(params, curDate);

    const expected = {
      id: 'nt-sw-1axYXd',
      type: 'slackWebhook',
      name: 'some-name',
      verified: true,
      enabled: true,
      projectId: 'project-id',
      routineId: 'routine-id',
      createdAt: curDate,
      updatedAt: curDate,
      webhookUrl: 'https://discord.com/api/webhooks/webhookid/webhooktoken/slack/',
      origin: ORIGIN_TYPE.PUBLIC,
    };
    expect(slackWebhook).to.eql(expected);
  });
});
