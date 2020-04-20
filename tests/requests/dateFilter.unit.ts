import { expect } from 'chai';

import { DateFilter } from '../../src/requests/dateFilter';

describe('date filter unit tests', () => {
  it('minimal create', () => {
    const params = {};

    const filter = new DateFilter(params);

    expect(filter).to.eql({
      start: undefined,
      end: undefined,
      order: 'asc',
    });
  });

  it('full asc create', () => {
    const params = {
      start: '2018-01-01T00:00:00.000Z',
      end: '2018-01-01T01:00:00.000Z',
      order: 'asc' as any,
    };

    const filter = new DateFilter(params);

    expect(filter).to.eql({
      start: new Date('2018-01-01T00:00:00.000Z'),
      end: new Date('2018-01-01T01:00:00.000Z'),
      order: 'asc',
    });
  });

  it('throws if wrong order', () => {
    const params = {
      start: '2018-01-01T01:00:00.000Z',
      end: '2018-01-01T00:00:00.000Z',
      order: 'desc' as any,
    };

    expect(() => new DateFilter(params)).to.throw('if end and start, start must come before end');
  });
});
