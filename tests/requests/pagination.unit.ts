import { expect } from 'chai';

import { Pagination } from '../../src/requests';

describe('pagination unit tests', () => {
  it('create with defaults', () => {
    const pagination = new Pagination({});
    const expected = {
      before: null,
      after: null,
      limit: 20,
    };
    expect(pagination).to.eql(expected);
  });

  it('create with start', () => {
    const pagination = new Pagination({
      before: '2018-01-01T00:00:00.000Z',
      limit: 90,
    });
    const expected = {
      before: new Date('2018-01-01T00:00:00.000Z'),
      after: null,
      limit: 90,
    };
    expect(pagination).to.eql(expected);
  });

  it('create with end', () => {
    const pagination = new Pagination({
      after: '2018-01-01T00:00:00.000Z',
      limit: 90,
    });
    const expected = {
      after: new Date('2018-01-01T00:00:00.000Z'),
      before: null,
      limit: 90,
    };
    expect(pagination).to.eql(expected);
  });

  it('exceed limits', () => {
    expect(() => new Pagination({ limit: 10000 })).to.throw('limit must not be greater than 100');
  });

  it('start and end', () => {
    expect(() => new Pagination({ before: '2018-01-01T00:00:00.000Z', after: '2018-01-01T00:00:00.000Z' })).to.throw(
      'do not provide both before and after for pagination'
    );
  });
});
