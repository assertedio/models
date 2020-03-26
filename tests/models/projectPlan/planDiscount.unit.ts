import { expect } from 'chai';
import { DateTime } from 'luxon';

import { PlanDiscount } from '../../../src/models/projectPlan/planDiscount';

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

    const planDiscount = new PlanDiscount(params);

    expect(planDiscount).to.eql(params);
  });

  it('to and from db', () => {
    const params = {
      id: 'discount-id',
      name: 'discount-name',
      amountOff: 0.1,
      percentOff: 0.9,
      start: curDate,
      end: curDate,
    };

    const planDiscount = new PlanDiscount(params);

    expect(PlanDiscount.fromJson(JSON.parse(JSON.stringify(planDiscount)))).to.eql(planDiscount);
  });

  it('to and from cache', () => {
    const params = {
      id: 'discount-id',
      name: 'discount-name',
      amountOff: 0.1,
      percentOff: 0.9,
      start: curDate,
      end: curDate,
    };

    const planDiscount = new PlanDiscount(params);

    expect(PlanDiscount.parseFromCache(PlanDiscount.stringifyForCache(planDiscount))).to.eql(planDiscount);
  });
});
