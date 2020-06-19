import { expect } from 'chai';
import { DateTime } from 'luxon';

import { EmailNotificationConfig } from '../../../src/models/notifications/email';
import { ORIGIN_TYPE } from '../../../src/models/notifications';

describe('email unit test', () => {
  it('create', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();

    const params = {
      routineId: 'routine-id',
      projectId: 'project-id',
      name: 'some-name',
      email: 'some@bar.com',
      origin: ORIGIN_TYPE.MEMBER,
    };

    const email = EmailNotificationConfig.create(params, curDate);

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
      origin: ORIGIN_TYPE.MEMBER,
    };
    expect(email).to.eql(expected);
  });

  it('fail with non-email', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();

    const params = {
      routineId: 'routine-id',
      projectId: 'project-id',
      name: 'some-name',
      email: 'not-email',
      origin: ORIGIN_TYPE.MEMBER,
    };

    expect(() => EmailNotificationConfig.create(params, curDate)).to.throw('email must be an email');
  });
});
