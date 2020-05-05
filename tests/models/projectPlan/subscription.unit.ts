import { expect } from 'chai';
import { DateTime } from 'luxon';

import { Subscription, SubscriptionInterface } from '../../../src/models/projectPlan/subscription';

const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();

describe('subscription model unit', () => {
  it('create', () => {
    const params: SubscriptionInterface = {
      subscriptionId: 'sub-id',
      subscriptionItemId: 'sub-item-id',
      nextBillDate: curDate,
      discount: {
        id: 'discount-id',
        name: 'discount-name',
        amountOff: 0.1,
        percentOff: 0.9,
        start: curDate,
        end: curDate,
      },
      lastSyncAt: curDate,
    };

    const subscription = new Subscription(params);

    expect(subscription).to.eql(params);
  });

  it('minimal create', () => {
    const params: SubscriptionInterface = {
      subscriptionId: 'sub-id',
      subscriptionItemId: 'sub-item-id',
      nextBillDate: null,
      discount: null,
      lastSyncAt: curDate,
    };

    const subscription = new Subscription(params);

    expect(subscription).to.eql(params);
  });
});
