import { expect } from 'chai';
import { DateTime } from 'luxon';

import { SlackWebhookNotificationConfig } from '../../../src/models/notifications/slackWebhook';

describe('slackWebhook unit test', () => {
  it('create', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();

    const slackWebhook = SlackWebhookNotificationConfig.create('routine-id', 'project-id', 'some-name', 'https://hooks.slack.com/thing', curDate);

    const expected = {
      id: 'nt-sw-Z1huH3N',
      type: 'slackWebhook',
      name: 'some-name',
      enabled: true,
      projectId: 'project-id',
      routineId: 'routine-id',
      createdAt: curDate,
      updatedAt: curDate,
      webhookUrl: 'https://hooks.slack.com/thing',
    };
    expect(slackWebhook).to.eql(expected);
  });

  it('fail with non-url', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();
    expect(() => SlackWebhookNotificationConfig.create('routine-id', 'project-id', 'some-name', 'not-url', curDate)).to.throw(
      'webhook URL must start with: https://hooks.slack.com'
    );
  });

  it('fail with non-slackWebhook', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();
    expect(() => SlackWebhookNotificationConfig.create('routine-id', 'project-id', 'some-name', 'https://hooks.slack.com=====', curDate)).to.throw(
      'webhookUrl must be an URL address'
    );
  });
});
