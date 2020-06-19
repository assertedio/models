import { expect } from 'chai';
import { DateTime } from 'luxon';

import { PHONE_NOTIFY_TYPE, PhoneNotificationConfig } from '../../../src/models/notifications/phone';
import { ORIGIN_TYPE } from '../../../src/models/notifications';

describe('phone unit test', () => {
  it('create', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();

    const params = {
      routineId: 'routine-id',
      projectId: 'project-id',
      name: 'some-name',
      number: '+7 800 555 35 35',
      notifyType: PHONE_NOTIFY_TYPE.SMS,
      origin: ORIGIN_TYPE.PUBLIC,
    };
    const phone = PhoneNotificationConfig.create(params, curDate);

    const expected = {
      id: 'nt-ph-28CeTL',
      type: 'phone',
      name: 'some-name',
      enabled: true,
      routineId: 'routine-id',
      projectId: 'project-id',
      createdAt: curDate,
      updatedAt: curDate,
      number: '+78005553535',
      notifyType: PHONE_NOTIFY_TYPE.SMS,
      verified: false,
      origin: ORIGIN_TYPE.PUBLIC,
    };
    expect(phone).to.eql(expected);
  });

  it('fail with non-phone', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();
    const params = {
      routineId: 'routine-id',
      projectId: 'project-id',
      name: 'some-name',
      number: 'not-a-number',
      notifyType: PHONE_NOTIFY_TYPE.SMS,
      origin: ORIGIN_TYPE.PUBLIC,
    };
    expect(() => PhoneNotificationConfig.create(params, curDate)).to.throw('number does not look like a phone number');
  });
});
