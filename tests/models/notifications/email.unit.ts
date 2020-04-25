import { expect } from 'chai';
import { DateTime } from 'luxon';

import { EmailNotificationConfig } from '../../../src/models/notifications/email';

describe('email unit test', () => {
  it('create', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();

    const email = EmailNotificationConfig.create('routine-id', 'project-id', 'some-name', 'some@bar.com', curDate);

    const expected = {
      id: 'nt-em-Z1ppjoI',
      type: 'email',
      name: 'some-name',
      enabled: true,
      routineId: 'routine-id',
      projectId: 'project-id',
      createdAt: curDate,
      updatedAt: curDate,
      email: 'some@bar.com',
      verified: false,
    };
    expect(email).to.eql(expected);
  });

  it('fail with non-email', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();
    expect(() => EmailNotificationConfig.create('routine-id', 'project-id', 'some-name', 'not-email', curDate)).to.throw('email must be an email');
  });
});
