import { expect } from 'chai';
import { DateTime } from 'luxon';

import { PHONE_NOTIFY_TYPE, PhoneNotificationConfig } from '../../../src/models/notifications/phone';

describe('phone unit test', () => {
  it('create', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();

    const phone = PhoneNotificationConfig.create('routine-id', 'some-name', '+7 800 555 35 35', PHONE_NOTIFY_TYPE.SMS, curDate);

    const expected = {
      id: 'nt-ph-28CeTL',
      type: 'phone',
      name: 'some-name',
      enabled: true,
      routineId: 'routine-id',
      createdAt: curDate,
      updatedAt: curDate,
      number: '+78005553535',
      notifyType: PHONE_NOTIFY_TYPE.SMS,
      verified: false,
    };
    expect(phone).to.eql(expected);
  });

  it('fail with non-phone', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();
    expect(() => PhoneNotificationConfig.create('routine-id', 'some-name', 'not-a-phone', PHONE_NOTIFY_TYPE.SMS, curDate)).to.throw(
      'number does not look like a phone number'
    );
  });
});
