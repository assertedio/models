import { expect } from 'chai';

import { PHONE_NOTIFY_TYPE } from '../../../src/models/notifications';
import { CreatePhoneNotification } from '../../../src/requests/notifications';

describe('phone request unit tests', () => {
  it('invalid phone request', () => {
    const params = {
      code: 'foo-bar',
      number: '544-204-3498',
      notifyType: PHONE_NOTIFY_TYPE.SMS,
      name: 'some-name',
    };

    expect(() => new CreatePhoneNotification(params)).to.throw('Code must be 6 digits');
  });
});
