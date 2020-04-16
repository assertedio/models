import { expect } from 'chai';

import { DateFilter } from '../../src/requests/dateFilter';

describe('date filter unit tests', () => {
  it('create', () => {
    const params = {
      start: '2018-01-01T00:00:00.000Z',
    };

    const filter = new DateFilter(params);

    expect(filter).to.eql({
      start: new Date('2018-01-01T00:00:00.000Z'),
      end: undefined,
    });
  });
});
