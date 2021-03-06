import { expect } from 'chai';
import { DateTime } from 'luxon';

import { Discount } from '../../../src/models/projectPlan/discount';

const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();

describe('plan discount model unit', () => {
  it('create', () => {
    const params = {
      id: 'discount-id',
      name: 'discount-name',
      amountOff: 0.1,
      percentOff: 0.9,
      start: curDate,
      end: curDate,
    };

    const planDiscount = new Discount(params);

    expect(planDiscount).to.eql(params);
  });
});
