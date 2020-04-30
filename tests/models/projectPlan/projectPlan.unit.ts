import { expect } from 'chai';
import { DateTime } from 'luxon';

import { PLAN_IDS, PLAN_STATUS, ProjectPlan } from '../../../src/models/projectPlan/projectPlan';

const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();

describe('project plan model unit', () => {
  it('minimal create', () => {
    const params = {
      id: 'pp-id',
      planId: PLAN_IDS.FREE_V1,
      status: PLAN_STATUS.ACTIVE,
      customerId: null,
      billing: null,
      limits: {
        smsCount: 10,
        cpuSeconds: 11,
      },
      limitsOverrides: null,
      projectId: 'project-id',
      createdAt: curDate,
      updatedAt: curDate,
    };

    const projectPlan = new ProjectPlan(params);

    expect(projectPlan).to.eql({ ...params, name: 'Free' });
  });

  it('full create', () => {
    const params = {
      id: 'pp-id',
      planId: PLAN_IDS.FREE_V1,
      status: PLAN_STATUS.ACTIVE,
      customerId: 'customer-id',
      billing: {
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
      },
      limits: {
        smsCount: 10,
        cpuSeconds: 11,
      },
      limitsOverrides: {
        smsCount: 32,
        cpuSeconds: 34,
      },
      projectId: 'project-id',
      createdAt: curDate,
      updatedAt: curDate,
    };

    const projectPlan = new ProjectPlan(params);

    expect(projectPlan).to.eql({ ...params, name: 'Free', limits: { smsCount: 32, cpuSeconds: 34 } });
  });
});
