import { expect } from 'chai';

import { Pagination } from '../../src/requests';

describe('pagination unit tests', () => {
  it('create with defaults', () => {
    const pagination = new Pagination({});
    const expected = {
      start: null,
      end: null,
      limit: 20,
    };
    expect(pagination).to.eql(expected);
  });

  it('create with start', () => {
    const pagination = new Pagination({
      start: '2018-01-01T00:00:00.000Z',
      limit: 90,
    });
    const expected = {
      start: new Date('2018-01-01T00:00:00.000Z'),
      end: null,
      limit: 90,
    };
    expect(pagination).to.eql(expected);
  });

  it('create with end', () => {
    const pagination = new Pagination({
      end: '2018-01-01T00:00:00.000Z',
      limit: 90,
    });
    const expected = {
      end: new Date('2018-01-01T00:00:00.000Z'),
      start: null,
      limit: 90,
    };
    expect(pagination).to.eql(expected);
  });

  it('exceed limits', () => {
    expect(() => new Pagination({ limit: 10000 })).to.throw('limit must not be greater than 100');
  });

  it('start and end', () => {
    expect(() => new Pagination({ start: '2018-01-01T00:00:00.000Z', end: '2018-01-01T00:00:00.000Z' })).to.throw(
      'do not provide both start and end for pagination'
    );
  });
});
