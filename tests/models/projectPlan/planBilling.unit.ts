import { expect } from 'chai';
import { DateTime } from 'luxon';

import { PlanBilling } from '../../../src/models/projectPlan/planBilling';

const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();

describe('plan billing model unit', () => {
  it('create', () => {
    const params = {
      subscriptionId: 'sub-id',
      subscriptionItemId: 'sub-item-id',
      delinquent: false,
      priceCents: 0,
      nextBillDate: curDate,
      last4: '9023',
      email: 'goo@bar.com',
      expiry: '12/12',
      discount: {
        id: 'discount-id',
        name: 'discount-name',
        amountOff: 0.1,
        percentOff: 0.9,
        start: curDate,
        end: curDate,
      },
    };

    const planBilling = new PlanBilling(params);

    expect(planBilling).to.eql(params);
  });

  it('minimal create', () => {
    const params = {
      subscriptionId: 'sub-id',
      subscriptionItemId: 'sub-item-id',
      delinquent: false,
      priceCents: 0,
      nextBillDate: null,
      last4: null,
      email: null,
      expiry: null,
      discount: null,
    };

    const planBilling = new PlanBilling(params);

    expect(planBilling).to.eql(params);
  });

  it('to and from db', () => {
    const params = {
      subscriptionId: 'sub-id',
      subscriptionItemId: 'sub-item-id',
      delinquent: false,
      priceCents: 0,
      nextBillDate: null,
      last4: null,
      email: null,
      expiry: null,
      discount: null,
    };

    const planBilling = new PlanBilling(params);

    expect(PlanBilling.fromJson(JSON.parse(JSON.stringify(planBilling)))).to.eql(planBilling);
  });

  it('to and from cache', () => {
    const params = {
      subscriptionId: 'sub-id',
      subscriptionItemId: 'sub-item-id',
      delinquent: false,
      priceCents: 0,
      nextBillDate: null,
      last4: null,
      email: null,
      expiry: null,
      discount: null,
    };

    const planBilling = new PlanBilling(params);

    expect(PlanBilling.parseFromCache(PlanBilling.stringifyForCache(planBilling))).to.eql(planBilling);
  });
});
