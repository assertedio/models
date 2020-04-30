import { expect } from 'chai';
import { DateTime } from 'luxon';

import { Payment, PaymentInterface } from '../../../src/models/projectPlan/payment';

const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();

describe('plan billing model unit', () => {
  it('create', () => {
    const params: PaymentInterface = {
      customerId: 'customer-id',
      delinquent: false,
      last4: '9023',
      email: 'goo@bar.com',
      expiry: '12/12',
      lastSyncAt: curDate,
    };

    const payment = new Payment(params);

    expect(payment).to.eql(params);
  });

  it('minimal create', () => {
    const params: PaymentInterface = {
      customerId: 'customer-id',
      delinquent: false,
      last4: null,
      email: 'goo@bar.com',
      expiry: null,
      lastSyncAt: curDate,
    };

    const payment = new Payment(params);

    expect(payment).to.eql(params);
  });

  it('to and from db', () => {
    const params: PaymentInterface = {
      customerId: 'customer-id',
      delinquent: false,
      last4: null,
      email: 'goo@bar.com',
      expiry: null,
      lastSyncAt: curDate,
    };

    const payment = new Payment(params);

    expect(Payment.fromJson(JSON.parse(JSON.stringify(payment)))).to.eql(payment);
  });

  it('to and from cache', () => {
    const params: PaymentInterface = {
      customerId: 'customer-id',
      delinquent: false,
      last4: null,
      email: 'goo@bar.com',
      expiry: null,
      lastSyncAt: curDate,
    };

    const payment = new Payment(params);

    expect(Payment.parseFromCache(Payment.stringifyForCache(payment))).to.eql(payment);
  });
});
